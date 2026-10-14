"""Behavior tests for the make_test notebook compile server's pure helpers."""

import json
import tempfile
import unittest
from pathlib import Path

from scripts.notebook_test_server import (
    NotebookPathError,
    list_notebooks,
    read_notebook_permalink,
    resolve_notebook_path,
)


def write_notebook(path, first_cell_source):
    path.parent.mkdir(parents=True, exist_ok=True)
    notebook = {"cells": [{"cell_type": "raw", "metadata": {}, "source": first_cell_source}]}
    path.write_text(json.dumps(notebook), encoding="utf-8")


class NotebookTestServerTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.repo = Path(self.temp_dir.name)
        write_notebook(self.repo / "_notebooks/CSA/lesson.ipynb",
                       "---\ntitle: Lesson\npermalink: /csa/lesson\n---")
        (self.repo / "secret.ipynb").write_text("{}", encoding="utf-8")

    def tearDown(self):
        self.temp_dir.cleanup()

    def test_accepts_path_with_notebooks_prefix(self):
        self.assertEqual(resolve_notebook_path("_notebooks/CSA/lesson.ipynb", self.repo),
                         "_notebooks/CSA/lesson.ipynb")

    def test_accepts_path_without_notebooks_prefix(self):
        self.assertEqual(resolve_notebook_path("CSA/lesson.ipynb", self.repo),
                         "_notebooks/CSA/lesson.ipynb")

    def test_rejects_traversal_outside_notebooks(self):
        with self.assertRaisesRegex(NotebookPathError, "inside _notebooks"):
            resolve_notebook_path("_notebooks/../secret.ipynb", self.repo)

    def test_rejects_non_notebook_files(self):
        with self.assertRaisesRegex(NotebookPathError, "must end in .ipynb"):
            resolve_notebook_path("_notebooks/CSA/lesson.md", self.repo)

    def test_rejects_missing_or_empty_paths(self):
        with self.assertRaisesRegex(NotebookPathError, "not found"):
            resolve_notebook_path("CSA/missing.ipynb", self.repo)
        with self.assertRaisesRegex(NotebookPathError, "empty"):
            resolve_notebook_path("   ", self.repo)

    def test_reads_permalink_from_front_matter(self):
        self.assertEqual(read_notebook_permalink(self.repo / "_notebooks/CSA/lesson.ipynb"), "/csa/lesson")

    def test_permalink_is_none_without_front_matter(self):
        notebook = self.repo / "plain.ipynb"
        write_notebook(notebook, "just text")
        self.assertIsNone(read_notebook_permalink(notebook))

    def test_lists_only_notebooks_under_notebooks_dir(self):
        self.assertEqual(list_notebooks(self.repo), ["_notebooks/CSA/lesson.ipynb"])


if __name__ == "__main__":
    unittest.main()
