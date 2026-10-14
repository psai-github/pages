#!/usr/bin/env python3
"""Local server that /notebook-tester/ calls to compile one notebook on demand."""

import argparse
import json
import subprocess
import sys
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

if __name__ == "__main__":
    from required_test_notebooks import read_notebook_front_matter
else:
    from scripts.required_test_notebooks import read_notebook_front_matter

REPO_ROOT = Path(__file__).resolve().parent.parent
LOG_TAIL_CHARS = 6000
STEP_TIMEOUT_SECONDS = 900


class NotebookPathError(ValueError):
    """Raised when a requested notebook path is unsafe or does not exist."""


def resolve_notebook_path(raw_path, repo_root=REPO_ROOT):
    """Return the notebook path relative to the repo root, or raise NotebookPathError."""
    # Path comes from a browser, so block anything escaping _notebooks/.
    if not isinstance(raw_path, str) or not raw_path.strip():
        raise NotebookPathError("Notebook path is empty.")

    cleaned = raw_path.strip().lstrip("/").replace("\\", "/")
    if not cleaned.endswith(".ipynb"):
        raise NotebookPathError(f"Not a notebook (must end in .ipynb): {cleaned}")
    if not cleaned.startswith("_notebooks/"):
        cleaned = f"_notebooks/{cleaned}"

    repo_root = Path(repo_root).resolve()
    notebook_root = (repo_root / "_notebooks").resolve()
    candidate = (repo_root / cleaned).resolve()

    if notebook_root not in candidate.parents:
        raise NotebookPathError(f"Path must stay inside _notebooks/: {raw_path}")
    if not candidate.is_file():
        raise NotebookPathError(f"Notebook not found: {cleaned}")

    return candidate.relative_to(repo_root).as_posix()


def read_notebook_permalink(notebook_file):
    """Return the `permalink` from a notebook's front matter cell, or None."""
    permalink = read_notebook_front_matter(notebook_file).get("permalink")
    return permalink if isinstance(permalink, str) else None


def list_notebooks(repo_root=REPO_ROOT):
    """Return every notebook path under _notebooks/, relative to the repo root."""
    repo_root = Path(repo_root)
    return sorted(
        path.relative_to(repo_root).as_posix()
        for path in (repo_root / "_notebooks").rglob("*.ipynb")
        if ".ipynb_checkpoints" not in path.parts
    )


def run_step(label, command):
    """Run one pipeline step from the repo root; return (succeeded, log_text)."""
    try:
        result = subprocess.run(
            command,
            cwd=REPO_ROOT,
            capture_output=True,
            text=True,
            timeout=STEP_TIMEOUT_SECONDS,
        )
    except subprocess.TimeoutExpired:
        return False, f"$ {label}\nTimed out after {STEP_TIMEOUT_SECONDS}s\n"
    except FileNotFoundError as error:
        return False, f"$ {label}\nCommand not found: {error}\n"

    log = f"$ {label}\n{result.stdout}{result.stderr}"
    return result.returncode == 0, log


def compile_notebook(relative_path):
    """Convert one notebook and rebuild Jekyll so the running server serves it."""
    # Same order as the main Makefile: convert -> split courses -> jekyll.
    steps = [
        ("convert notebook", [sys.executable, "scripts/convert_notebooks.py", relative_path]),
        ("split multi-course files", [sys.executable, "scripts/split_multi_course_files.py"]),
        ("jekyll build --incremental", ["bundle", "exec", "jekyll", "build", "--incremental"]),
    ]
    logs = []
    for label, command in steps:
        succeeded, log = run_step(label, command)
        logs.append(log)
        if not succeeded:
            return False, label, "".join(logs)
    return True, None, "".join(logs)


class NotebookTestHandler(BaseHTTPRequestHandler):
    # Jekyll rebuilds share _site, so only one compile may run at a time.
    compile_lock = threading.Lock()
    allowed_origins = set()

    def _send_json(self, status, payload):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        origin = self.headers.get("Origin")
        if origin in self.allowed_origins:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_OPTIONS(self):
        self.send_response(204)
        origin = self.headers.get("Origin")
        if origin in self.allowed_origins:
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type")
            self.send_header("Vary", "Origin")
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/health":
            self._send_json(200, {"ok": True})
        elif self.path == "/api/notebooks":
            self._send_json(200, {"notebooks": list_notebooks()})
        else:
            self._send_json(404, {"ok": False, "error": f"Unknown endpoint: {self.path}"})

    def do_POST(self):
        if self.path != "/api/compile":
            self._send_json(404, {"ok": False, "error": f"Unknown endpoint: {self.path}"})
            return

        try:
            length = int(self.headers.get("Content-Length", "0"))
            payload = json.loads(self.rfile.read(length) or b"{}")
            relative_path = resolve_notebook_path(payload.get("path"))
        except (ValueError, AttributeError) as error:
            # NotebookPathError and JSONDecodeError are both ValueErrors.
            self._send_json(400, {"ok": False, "error": str(error)})
            return

        if not self.compile_lock.acquire(blocking=False):
            self._send_json(409, {"ok": False, "error": "Another notebook is compiling. Try again shortly."})
            return
        try:
            print(f"Compiling {relative_path}", flush=True)
            succeeded, failed_step, log = compile_notebook(relative_path)
        finally:
            self.compile_lock.release()

        permalink = read_notebook_permalink(REPO_ROOT / relative_path)
        if succeeded:
            print(f"Compiled {relative_path} -> {permalink or '(no permalink)'}", flush=True)
            self._send_json(200, {"ok": True, "path": relative_path, "permalink": permalink,
                                  "log": log[-LOG_TAIL_CHARS:]})
        else:
            print(f"Failed at '{failed_step}' for {relative_path}", flush=True)
            self._send_json(500, {"ok": False, "path": relative_path, "permalink": permalink,
                                  "error": f"Failed during: {failed_step}", "log": log[-LOG_TAIL_CHARS:]})


def main():
    parser = argparse.ArgumentParser(description="On-demand notebook compiler for make_test.")
    parser.add_argument("--port", type=int, default=4600, help="Port for this compile server.")
    parser.add_argument("--site-port", type=int, default=4500, help="Port Jekyll serves on (CORS origin).")
    args = parser.parse_args()

    NotebookTestHandler.allowed_origins = {
        f"http://localhost:{args.site_port}",
        f"http://127.0.0.1:{args.site_port}",
    }
    server = ThreadingHTTPServer(("127.0.0.1", args.port), NotebookTestHandler)
    print(f"Notebook test server on http://127.0.0.1:{args.port} (site port {args.site_port})", flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
