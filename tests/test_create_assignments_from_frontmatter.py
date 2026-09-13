import json
import tempfile
import unittest
from pathlib import Path

from scripts.create_assignments_from_frontmatter import (
    AssignmentFrontmatterError,
    create_assignment,
    read_creator_uids,
    read_frontmatter,
)


class RecordingSession:
    def __init__(self):
        self.request = None

    def post(self, url, data, timeout):
        self.request = {"url": url, "data": data, "timeout": timeout}
        return object()


class AssignmentCreatorFrontmatterTests(unittest.TestCase):
    def test_creator_uids_are_trimmed_and_deduplicated(self):
        frontmatter = {
            "assignment_creator_uids": [
                " AdityaS-2010 ",
                "second-creator",
                "AdityaS-2010",
            ]
        }

        self.assertEqual(
            ["AdityaS-2010", "second-creator"],
            read_creator_uids(frontmatter),
        )

    def test_legacy_assignment_without_creators_remains_valid(self):
        self.assertEqual([], read_creator_uids({"assignment": True}))

    def test_creator_uids_must_be_a_nonempty_list(self):
        with self.assertRaisesRegex(AssignmentFrontmatterError, "non-empty YAML list"):
            read_creator_uids({"assignment_creator_uids": "AdityaS-2010"})

    def test_creator_uids_must_contain_nonempty_strings(self):
        with self.assertRaisesRegex(AssignmentFrontmatterError, "non-empty strings"):
            read_creator_uids({"assignment_creator_uids": ["AdityaS-2010", " "]})

    def test_sync_payload_includes_creator_uids(self):
        session = RecordingSession()

        create_assignment(
            session,
            "https://spring.example.test",
            "Creator Permissions Pilot",
            "csa/creator-permissions-pilot/",
            creator_uids=["AdityaS-2010", "second-creator"],
        )

        self.assertEqual(
            ["AdityaS-2010", "second-creator"],
            session.request["data"]["creatorUids"],
        )

    def test_notebook_frontmatter_uses_the_same_creator_contract(self):
        notebook = {
            "cells": [
                {
                    "cell_type": "markdown",
                    "source": [
                        "---",
                        "assignment: true",
                        "assignment_creator_uids:",
                        "  - AdityaS-2010",
                        "---",
                    ],
                }
            ]
        }

        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / "assignment.ipynb"
            path.write_text(json.dumps(notebook), encoding="utf-8")
            frontmatter = read_frontmatter(path)

        self.assertEqual(["AdityaS-2010"], read_creator_uids(frontmatter))


if __name__ == "__main__":
    unittest.main()
