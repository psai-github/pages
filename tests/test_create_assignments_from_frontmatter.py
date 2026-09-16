import json
import tempfile
import unittest
from pathlib import Path

from scripts.create_assignments_from_frontmatter import (
    AssignmentFrontmatterError,
    canonicalize_content_url,
    create_assignment,
    determine_content_url,
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


class ContentUrlDerivationTests(unittest.TestCase):
    """The contentUrl this script sends must equal the `{{ page.url }}` the browser sends.

    Spring dedups assignments on that string, so any disagreement creates a second
    assignment row: submissions land on the browser's row and frontmatter-declared
    creators land on this script's row.
    """

    ROOT = Path("/repo")

    def content_url(self, relative_path, frontmatter=None):
        return determine_content_url(self.ROOT, self.ROOT / relative_path, frontmatter or {})

    def test_an_explicit_permalink_is_used_verbatim(self):
        self.assertEqual(
            "csa/home-page-game-feedback",
            self.content_url(
                "_posts/CSA/2026-08-14-home-page-game-feedback.md",
                {"permalink": "/csa/home-page-game-feedback"},
            ),
        )

    def test_a_trailing_slash_permalink_is_canonicalized(self):
        self.assertEqual(
            "java/spring/hacks",
            self.content_url(
                "_posts/CSA/spring_boot/2026-08-31-java-spring-hacks.md",
                {"permalink": "/java/spring/hacks/"},
            ),
        )

    def test_a_post_without_a_permalink_uses_jekylls_default_style(self):
        # /:categories/:year/:month/:day/:title.html. Verified against a real Jekyll build:
        # a post in _posts/CSH has NO category, so CSH does not appear in the URL.
        self.assertEqual(
            "2026/07/27/csh-team-formation.html",
            self.content_url("_posts/CSH/2026-07-27-csh-team-formation.md"),
        )

    def test_directories_nested_under_posts_are_not_categories(self):
        self.assertEqual(
            "2025/12/03/javascript_oop_coder.html",
            self.content_url(
                "_posts/Foundation/B-tools/2025-12-03-javascript_oop_coder.md"
            ),
        )

    def test_a_directory_above_posts_is_a_category_and_is_lowercased(self):
        self.assertEqual(
            "catabove/2026/01/02/above-post.html",
            self.content_url("CatAbove/_posts/2026-01-02-above-post.md"),
        )

    def test_frontmatter_categories_override_the_directory(self):
        self.assertEqual(
            "csa/lessons/2026/07/27/csh-team-formation.html",
            self.content_url(
                "_posts/CSH/2026-07-27-csh-team-formation.md",
                {"categories": ["csa", "lessons"]},
            ),
        )

    def test_a_space_separated_categories_string_is_accepted(self):
        self.assertEqual(
            "csa/lessons/2026/07/27/csh-team-formation.html",
            self.content_url(
                "_posts/CSH/2026-07-27-csh-team-formation.md",
                {"categories": "csa lessons"},
            ),
        )

    def test_an_ordinary_page_keeps_its_path_with_an_html_extension(self):
        self.assertEqual(
            "navigation/csa-assignment-creator-permissions-pilot.html",
            self.content_url("navigation/csa-assignment-creator-permissions-pilot.md"),
        )

    def test_an_index_page_resolves_to_its_directory(self):
        self.assertEqual("navigation/csa", self.content_url("navigation/csa/index.md"))

    def test_a_declared_category_is_lowercased_and_url_encoded(self):
        # Jekyll lowercases and URL-encodes, it does not slugify: underscores survive.
        self.assertEqual(
            "b-tools_and_equipment/foo%20bar/2026/04/01/slugtest.html",
            self.content_url(
                "_posts/CSH/2026-04-01-slugtest.md",
                {"categories": ["B-tools_and_equipment", "Foo Bar"]},
            ),
        )

    def test_the_script_and_the_browser_agree_on_one_key(self):
        # These are the exact page.url values a real Jekyll build emitted for these files;
        # the browser posts them verbatim from _layouts/post.html.
        for page_url, source in [
            ("/2026/07/27/csh-team-formation.html", "_posts/CSH/2026-07-27-csh-team-formation.md"),
            ("/2025/12/03/javascript_oop_coder.html",
             "_posts/Foundation/B-tools_and_equipment/2025-12-03-javascript_oop_coder.md"),
        ]:
            with self.subTest(source=source):
                self.assertEqual(
                    canonicalize_content_url(page_url), self.content_url(source)
                )

    def test_a_permalink_page_agrees_with_its_jekyll_url(self):
        # Jekyll reports page.url as the permalink itself, without the .html it writes to disk.
        self.assertEqual(
            canonicalize_content_url("/csa/home-page-game-feedback"),
            self.content_url(
                "_posts/CSA/2026-08-14-home-page-game-feedback.md",
                {"permalink": "/csa/home-page-game-feedback"},
            ),
        )

    def test_canonicalization_strips_slashes_and_keeps_the_extension(self):
        self.assertEqual("csa/lesson", canonicalize_content_url("//csa//lesson//"))
        self.assertEqual("CSH/2026/07/27/x.html", canonicalize_content_url("/CSH/2026/07/27/x.html"))
        self.assertIsNone(canonicalize_content_url("/"))
        self.assertIsNone(canonicalize_content_url(""))
        self.assertIsNone(canonicalize_content_url(None))


if __name__ == "__main__":
    unittest.main()
