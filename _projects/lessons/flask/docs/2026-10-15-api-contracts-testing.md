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

For example, a **proposed** reading-list interface might accept
`POST /api/books` with `{"title": "A Book"}` and return `201` with an object
containing `id` and `title`. A blank title might return `400` with an error
message. This is a design example, not an endpoint supplied by this site.
Compare the proposed contract with your Flask route and agree on any changes.

## Test the Backend Without the Frontend

Use Postman with a local or authorized test backend, not production records.
Keep the backend URL in a Postman environment variable such as `baseUrl`.
Do not put real passwords, cookies, or tokens into a committed collection.

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
body, status, and response against the working Postman request.

Postman does not enforce browser CORS rules. If Postman succeeds but the browser
fails, inspect the browser console, preflight request, allowed origin, and
credential settings. Do not bypass authentication or disable security to hide
an integration failure.

Trace one request through frontend input, Flask route, model/database, API
response, and the rendered UI. The frontend should handle loading, empty
results, and errors as well as successful data.

## Week 10 Readings

- [Planning Workspaces and APIs]({{ site.baseurl }}/flask--api): frontend/backend boundaries and Postman planning.
- [Flask Debug Walk-Through]({{ site.baseurl }}/flask-debug-walk): trace a request through the browser and backend debugger.
- [Flask API map]({{ site.baseurl }}/python/flask/api): supporting API fundamentals.
- [All Flask references]({{ site.baseurl }}/topics/?category=flask).

Use your existing project review to explain the agreed interface, show a
successful test and an expected failure, and identify any mismatch found during
integration. This reading does not introduce a separate submission.
