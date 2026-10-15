# Flask Lessons

This registered lesson project owns the Flask notebooks and authored Markdown
previously scattered through `_notebooks/CSP/flask`, `_posts/CSP/flask`, and
the Foundation tools references. Notebook sources are flat in `notebooks/`;
authored Markdown and historical Markdown-only exports are in `docs/`.
Edit these sources, not the published `_posts/projects/flask/` copies.

The existing map remains at `/python/flask/csp/`; its unsplit source is
`docs/2025-11-08-flask-infograph.md`. Preserve its CSP/CSA split and permalink.
Every lesson carries the `flask` category, so the shared collection is
`/topics/?category=flask`. `/navigation/flask/` hosts the same Topics browser.
The shared `nav/flask.html` points at the current map and core routes.

## Week 10

Only these Flask readings are assigned to CSP Week 10:

- `/python/flask/api/contracts-testing`: interface agreements and API test cases.
- `/flask--api`: existing workspace, interface, and Postman planning reference.
- `/flask-debug-walk`: existing request tracing and debugging reference.

Intro, ideation, login, and AWS deployment remain browseable references rather
than Week 10 assignments. Existing Week 7 foundations and the Week 8 map retain
their schedules. Lesson bodies, including historical examples, are preserved;
moving a reference is not certification that every old setup command is current.

## Route Collisions Resolved

The Anatomy notebook formerly duplicated `/python/flask/crash-course`. It now
uses `/python/flask/server-anatomy`; the existing authored file-structure guide
retains `/python/flask/anatomy`, the route used by the map. The API hacks notebook
formerly duplicated `/api-basics/lesson/handling-data`; it now uses
`/api-basics/lesson/hacks`, while the data-handling lesson keeps its original URL.

## Build and Check

Use the shared generated Makefile, not a project-specific override:

```sh
source venv/bin/activate
make dev
bundle exec ruby scripts/test_flask_project.rb
```

The Flask project is tagged `:dev`. The normal workflow publishes notebooks,
Markdown, and multi-course map pages before Jekyll renders the Topics index.
`distribution.json` publishes Markdown during the assets phase, before course
splitting, at the same paths used by the shared `docs` target. Add a matching
mapping when adding an authored document; the project test checks coverage.
