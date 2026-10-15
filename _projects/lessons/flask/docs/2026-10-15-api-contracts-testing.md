---
layout: post
title: Flask API Interfaces and Testing
description: Agree on request and response contracts, test Flask endpoints independently,
  and verify frontend integration.
permalink: "/python/flask/api/contracts-testing"
categories:
- flask
- Python
- APIs
- Testing
courses:
  csp:
    week: 10
toc: true
menu: nav/flask.html
lesson_group: Flask
---

## Define the Interface Before Integration

An API contract is the agreement between the frontend that sends a request and
the Flask backend that handles it. Teams can build and test separately when
they agree on the method, URL, inputs, outputs, and failure behavior first.

Use an endpoint from your current project. Document its actual behavior rather
than assuming every endpoint uses the same fields or status codes.

| Contract Detail | Questions to Resolve Together |
| --- | --- |
| Method and path | Is this GET, POST, PUT, PATCH, or DELETE? What is the exact route? |
| Inputs | Which path parameters, query parameters, or JSON fields are required? What types and limits apply? |
| Authentication | Does it require a session cookie or token? Who may access it? |
| Success | What status code, content type, and response fields are returned? |
| Errors | What happens for missing fields, invalid values, missing records, or unauthorized access? |
| Side effects | Does the request create, change, or delete data? How will test data be cleaned up? |

## Three Interfaces to Trace

| Example | HTTP Handler | Data Layer | Start Here |
| --- | --- | --- | --- |
| Jokes | `hacks/joke.py` | `hacks/jokes.py`, JSON file storage | `GET /api/jokes/count` returns an object with `count`; `GET /api/jokes` returns a list. |
| Users | `api/user.py` | `model/user.py`, SQLAlchemy | Authenticate with `POST /api/authenticate`, then inspect `GET /api/id`. |
| Microblog | `api/microblog_api.py` | `model/microblog.py`, `MicroBlog` and `Topic` | After authentication, `GET /api/microblog?limit=5` returns an object with `microblogs` and `count`. |

Find each blueprint's prefix and resource registration, then follow the handler
to its data function or model. Jokes use file-backed data, not a SQLAlchemy
model. The jokes create handler is unfinished: a registered URL is not proof
that every CRUD operation is implemented.

## Test the Backend Without the Frontend

Use the **REST Client** extension by Huachao Mao in VS Code with a local or
authorized test backend, not production records.

1. Open the **Flask backend repository** in VS Code and install REST Client.
2. Use **REST Client: Switch Environment** to select `local`. The backend's
  `.vscode/settings.json` supplies the shared `baseUrl`, normally
  `http://127.0.0.1:8587`. Match it to your configured backend port.
3. Open `api/user_auth.http`. Its `# @prompt` declarations ask for your user ID
  and password when you choose **Send Request**. Never commit real credentials.
4. Keep the same host when testing protected endpoints: REST Client remembers
  response cookies by default. Authenticate again after switching environments.
5. Put the following requests in a new `.http` file under that backend's `api/`
  directory. Do not add a file-level `@baseUrl`: it would override the selected
  environment. Separate requests with `###` and send each independently.

These are manual checks, not automatically executed assertions. REST Client
does not run the whole sequence as an automated test suite; inspect each
response before sending the next request.

{% raw %}
```http
### Jokes count - expect 200 and a JSON object with count
GET {{baseUrl}}/api/jokes/count
Accept: application/json

### Jokes list - expect 200 and a JSON array
GET {{baseUrl}}/api/jokes
Accept: application/json

### Current user - authenticate in user_auth.http first
GET {{baseUrl}}/api/id
Accept: application/json

### Microblog list - authenticate first; expect microblogs and count
GET {{baseUrl}}/api/microblog?limit=5
Accept: application/json

### Microblog validation - authenticate first; expect 400, no new post
POST {{baseUrl}}/api/microblog
Content-Type: application/json
Accept: application/json

{
  "content": ""
}
```
{% endraw %}

The empty-content request should return `Content is required` after successful
authentication. If authentication fails first, you have tested that boundary,
not content validation. Inspect the actual status and message before continuing.

For user CRUD, read the existing `api/user_crud.http` and its expected responses
with your teacher. It requires an Admin account for the full sequence. Use a
disposable UID, and set `kasm_server_needed` to `false` unless you deliberately
intend to request server provisioning. Stop if Create fails; do not continue
to Update or Delete an existing account.

### Inspect Each Response

1. Start the Flask backend and send a known-good request directly to its route.
2. Set the method, URL, headers, authentication, and body from the contract.
3. Inspect the HTTP status and content type before reading the response body.
4. Check the response field names and types, not just whether data is present.
5. Repeat with invalid inputs and unauthorized access where applicable.
6. Confirm intended database changes and remove test records when finished.

| Test Case | Evidence to Check |
| --- | --- |
| Valid request | Agreed success status, response structure, and data values |
| Missing required input | Agreed client-error response, no unintended write |
| Invalid input type | Validation response rather than an unhandled server error |
| Unknown record | Agreed missing-record response |
| Missing or invalid authentication | Agreed authentication or authorization response |
| Repeat request | Behavior matches the contract; duplicate writes are not assumed safe |

A `204 No Content` response has no JSON body: do not call `response.json()`
for that response. A successful connection alone is not proof that the API
returns the right data.

## Verify Frontend Integration

Once direct API tests pass, send the same request from the frontend and compare
it in the browser's Network panel. Check the request method, exact URL, JSON
body, status, and response against the working REST Client request.

REST Client does not enforce browser CORS rules. If REST Client succeeds but the browser
fails, inspect the browser console, preflight request, allowed origin, and
credential settings. Do not bypass authentication or disable security to hide
an integration failure.

Trace one request through frontend input, Flask route, model/database, API
response, and the rendered UI. The frontend should handle loading, empty
results, and errors as well as successful data.

## Week 10 Readings

- [Planning Workspaces and APIs]({{ site.baseurl }}/flask--api): frontend/backend boundaries and REST Client planning.
- [Flask Debug Walk-Through]({{ site.baseurl }}/flask-debug-walk): trace a request through the browser and backend debugger.
- [Flask API map]({{ site.baseurl }}/python/flask/api): supporting API fundamentals.
- [All Flask references]({{ site.baseurl }}/topics/?category=flask).

Use your existing project review to explain the agreed interface, show a
successful test and an expected failure, and identify any mismatch found during
integration. This reading does not introduce a separate submission.
