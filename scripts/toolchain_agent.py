#!/usr/bin/env python3
"""
toolchain_agent
---------------
Local agent for Toolchain Trail. Works on macOS, Windows, Linux and WSL, using
only the Python standard library (nothing to pip install).

How it fits together (one-time device pairing):
  1. In the game, a signed-in student starts a station. The Spring backend
     returns a pairing code that works once and expires in 5 minutes.
  2. The student runs this agent and pastes the code. The code is read
     without echoing, like a password.
  3. The agent exchanges the code for an agent token that only works for that
     one station session. The token is kept in memory, never written to disk.
  4. The agent runs the station's real commands and sends the results with
     "Authorization: Bearer <agent-token>". The backend decides pass/fail.
  5. The game polls the backend and updates the quest when the station is verified.

Usage (run it from inside your cloned pages repository):
    macOS / Linux / WSL:  python3 scripts/toolchain_agent.py
    Windows (PowerShell): py scripts\\toolchain_agent.py
    Local backend:        python3 scripts/toolchain_agent.py --server http://localhost:8585

The check ids below must match ToolchainStations.java in blueprint-spring.
"""

import argparse
import getpass
import json
import os
import platform
import shutil
import ssl
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Callable, Dict, List, Optional, Tuple
from urllib.parse import urlparse

DEFAULT_SERVER = "https://spring.opencodingsociety.com"
COMMAND_TIMEOUT_SECONDS = 30
MAX_OUTPUT_LENGTH = 4000  # the backend keeps at most this much per check
REQUEST_TIMEOUT_SECONDS = 20

# (exit code, combined stdout + stderr)
CommandResult = Tuple[int, str]


def detect_os() -> str:
    """macos, windows, linux, or wsl (Linux running inside Windows)."""
    system = platform.system()
    if system == "Darwin":
        return "macos"
    if system == "Windows":
        return "windows"
    if os.environ.get("WSL_DISTRO_NAME") or os.environ.get("WSL_INTEROP"):
        return "wsl"
    try:
        if "microsoft" in Path("/proc/version").read_text(errors="replace").lower():
            return "wsl"
    except OSError:
        pass
    return "linux"


def run_command(command: List[str], cwd: Optional[Path] = None) -> CommandResult:
    """Run one read-only command; a missing tool or a hang is a failed check, not a crash."""
    # shutil.which finds code.cmd, gem.bat, etc. on Windows (it applies PATHEXT).
    executable = shutil.which(command[0])
    if executable is None:
        return 127, f"command not found: {command[0]}"
    env = dict(os.environ, GIT_TERMINAL_PROMPT="0")  # never hang on a git password prompt
    try:
        completed = subprocess.run(
            [executable] + command[1:],
            cwd=str(cwd) if cwd else None,
            capture_output=True,
            text=True,
            encoding="utf-8",
            errors="replace",
            timeout=COMMAND_TIMEOUT_SECONDS,
            env=env,
            stdin=subprocess.DEVNULL,
        )
    except subprocess.TimeoutExpired:
        return 124, f"timed out after {COMMAND_TIMEOUT_SECONDS}s"
    except OSError as error:
        return 126, f"could not run {command[0]}: {error}"
    return completed.returncode, (completed.stdout or "") + (completed.stderr or "")


def first_success(*results: CommandResult) -> CommandResult:
    for result in results:
        if result[0] == 0:
            return result
    return results[0]


def redact_email(output: str) -> str:
    """Send only enough to show an email is set: 'ada@example.org' -> 'a***@example.org'."""
    value = output.strip()
    if "@" not in value:
        return value
    local, _, domain = value.partition("@")
    return f"{local[:1]}***@{domain}"


def find_trail_folder(cwd: Path, home: Path) -> Optional[Path]:
    for base in (cwd, home, cwd.parent):
        candidate = base / "toolchain-trail"
        if candidate.is_dir():
            return candidate
    return None


Runner = Callable[[List[str], Optional[Path]], CommandResult]


def collect_evidence(station_id: str, repo: Path, runner: Optional[Runner] = None) -> List[Dict]:
    """Run the commands for one station and return [{id, exitCode, output}]."""
    runner = runner or run_command
    python = [sys.executable]  # the Python 3 running this agent; python3 is not on PATH on Windows
    checks: List[Tuple[str, CommandResult]] = []

    if station_id == "terminal-town-gate":
        cwd = Path.cwd()
        folder = find_trail_folder(cwd, Path.home())
        checks = [
            ("working-folder", (0, str(cwd))),
            ("trail-folder", (0, str(folder)) if folder else (1, "toolchain-trail folder not found")),
        ]
    elif station_id == "compiler-canyon-forge":
        checks = [
            ("python", runner(python + ["--version"], None)),
            ("pip", runner(python + ["-m", "pip", "--version"], None)),
            ("ruby", runner(["ruby", "-v"], None)),
            ("bundler", runner(["bundle", "-v"], None)),
            ("rubygems", runner(["gem", "--version"], None)),
        ]
    elif station_id == "editor-isle-tower":
        checks = [("editor", first_success(runner(["code", "--version"], None), runner(["cursor", "--version"], None)))]
    elif station_id == "git-village-hall":
        code, email = runner(["git", "config", "--global", "user.email"], None)
        checks = [
            ("git", runner(["git", "--version"], None)),
            ("git-name", runner(["git", "config", "--global", "user.name"], None)),
            ("git-email", (code, redact_email(email))),
        ]
    elif station_id == "github-gateway-arch":
        checks = [
            ("github-remote", runner(["git", "remote", "-v"], repo)),
            ("remote-branch", runner(["git", "ls-remote", "--heads", "origin"], repo)),
        ]
    elif station_id == "build-bridge":
        checks = [("bundle-check", runner(["bundle", "check"], repo))]
    elif station_id == "integration-summit":
        checks = [
            ("recent-commit", runner(["git", "log", "-1", "--oneline"], repo)),
            ("push-dry-run", runner(["git", "push", "--dry-run"], repo)),
        ]
    else:
        raise ValueError(f"This agent does not know the station '{station_id}'. Update your pages repository.")

    return [{"id": check_id, "exitCode": code, "output": output[:MAX_OUTPUT_LENGTH]}
            for check_id, (code, output) in checks]


class AgentError(Exception):
    """A problem to show the student in one line, without a traceback."""


def require_safe_server(server: str) -> str:
    """Evidence goes over HTTPS; plain http is only allowed to a backend on this computer."""
    parsed = urlparse(server)
    local = parsed.hostname in ("localhost", "127.0.0.1", "::1")
    if parsed.scheme == "https" or (parsed.scheme == "http" and local):
        return server.rstrip("/")
    raise AgentError("The server must use https:// (http:// is only allowed for localhost).")


def post_json(url: str, body: Dict, token: Optional[str] = None) -> Dict:
    headers = {"Content-Type": "application/json", "Accept": "application/json", "User-Agent": "toolchain-trail-agent/1"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    request = urllib.request.Request(url, data=json.dumps(body).encode("utf-8"), headers=headers, method="POST")
    try:
        with urllib.request.urlopen(request, timeout=REQUEST_TIMEOUT_SECONDS) as response:
            return json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as error:
        try:
            message = json.loads(error.read().decode("utf-8")).get("error")
        except (ValueError, AttributeError):
            message = None
        raise AgentError(message or f"The server answered HTTP {error.code}.") from None
    except urllib.error.URLError as error:
        if isinstance(error.reason, ssl.SSLCertVerificationError):
            hint = ""
            if detect_os() == "macos":
                hint = " On macOS with Python from python.org, run 'Install Certificates.command' in your Python folder."
            raise AgentError("Python could not verify the server's HTTPS certificate." + hint) from None
        raise AgentError(f"Could not reach {url}: {error.reason}") from None


def print_results(view: Dict) -> None:
    for check in view.get("checks") or []:
        mark = "PASS" if check.get("passed") else "FAIL"
        print(f"  {mark}  {check.get('label')}")
        if not check.get("passed") and check.get("detail"):
            print(f"        {check.get('detail')}")


def main(argv: Optional[List[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Pair with Toolchain Trail and verify a station.")
    parser.add_argument("--server", default=os.environ.get("TOOLCHAIN_SERVER", DEFAULT_SERVER),
                        help=f"backend URL (default {DEFAULT_SERVER})")
    parser.add_argument("--repo", default=".", help="repository the git and build checks run in (default: current folder)")
    args = parser.parse_args(argv)

    os_name = detect_os()
    try:
        server = require_safe_server(args.server)
        print(f"Toolchain Trail agent ({os_name}). Paste the pairing code from the game.")
        code = getpass.getpass("Pairing code (hidden): ").strip()
        if not code:
            raise AgentError("No pairing code entered.")

        paired = post_json(f"{server}/api/toolchain/pair", {"pairingCode": code})
        session_id, station_id, token = paired["sessionId"], paired["stationId"], paired["agentToken"]
        print(f"Paired for station: {station_id}")

        repo = Path(args.repo).resolve()
        while True:
            print("Running checks...")
            evidence = collect_evidence(station_id, repo)
            view = post_json(f"{server}/api/toolchain/sessions/{session_id}/results",
                             {"os": os_name, "checks": evidence}, token=token)
            print_results(view)
            if view.get("status") == "VERIFIED":
                print("Station verified! Go back to the game.")
                return 0
            print("Some checks failed. Fix them, then press Enter to check again (or type q to quit).")
            if input().strip().lower() in ("q", "quit", "exit"):
                return 1
    except AgentError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 2
    except ValueError as error:
        print(f"Error: {error}", file=sys.stderr)
        return 2
    except (KeyboardInterrupt, EOFError):
        print()
        return 130


if __name__ == "__main__":
    sys.exit(main())
