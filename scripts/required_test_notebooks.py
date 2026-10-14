#!/usr/bin/env python3
"""Print the notebooks make_test must convert so `lesson_category` pages don't crash Jekyll."""

import json
import re
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parent.parent
LESSON_CATEGORY_PATTERN = re.compile(r"^lesson_category:\s*(.+?)\s*$", re.MULTILINE)


def parse_front_matter_text(text):
    """Parse a `---` delimited YAML block at the start of text; return a dict."""
    text = text.lstrip()
    if not text.startswith("---"):
        return {}
    parts = text.split("---", 2)
    if len(parts) < 3:
        return {}
    try:
        front_matter = yaml.safe_load(parts[1])
    except yaml.YAMLError:
        return {}
    return front_matter if isinstance(front_matter, dict) else {}


def read_notebook_front_matter(notebook_file):
    """Return the front matter dict from a notebook's first cell (empty if none)."""
    try:
        with open(notebook_file, "r", encoding="utf-8") as handle:
            notebook = json.load(handle)
    except (OSError, json.JSONDecodeError):
        return {}

    cells = notebook.get("cells") or []
    if not cells:
        return {}
    source = cells[0].get("source", "")
    if isinstance(source, list):
        source = "".join(source)
    return parse_front_matter_text(source)


def notebook_categories(front_matter):
    """Normalize Jekyll `categories` (list or space separated string) to a set."""
    categories = front_matter.get("categories") or []
    if isinstance(categories, str):
        categories = categories.split()
    return {str(category) for category in categories}


def find_required_categories(repo_root=REPO_ROOT):
    """Return categories that site pages list via `lesson_category`."""
    categories = set()
    for page in Path(repo_root, "_posts").rglob("*.md"):
        match = LESSON_CATEGORY_PATTERN.search(page.read_text(encoding="utf-8", errors="ignore"))
        if match:
            categories.add(match.group(1).strip("'\""))
    return categories


def find_required_notebooks(repo_root=REPO_ROOT):
    """Pick the first notebook (sorted by path) for each required category."""
    repo_root = Path(repo_root)
    remaining = find_required_categories(repo_root)
    selected = []
    for notebook in sorted((repo_root / "_notebooks").rglob("*.ipynb")):
        if not remaining:
            break
        provided = notebook_categories(read_notebook_front_matter(notebook)) & remaining
        if provided:
            selected.append(notebook.relative_to(repo_root).as_posix())
            remaining -= provided
    return selected


if __name__ == "__main__":
    for path in find_required_notebooks():
        print(path)
