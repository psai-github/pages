---
layout: post
title: Flask Debug Walk-Through
description: Trace Flask APIs with the frontend debugger and VS Code REST Client requests.
permalink: "/flask-debug-walk"
toc: true
type: ccc
courses:
  csp:
    week: 10
categories:
- flask
- Python
lesson_group: Flask
---

## Run Frontend (pages or flocker_frontend)

To set up the workspace for your frontend project, follow these steps:

1. **Setup Virtual Environment**:
   - Create a virtual environment to manage your project's dependencies:
     ```bash
     python -m venv venv
     ```

2. **Activate Virtual Environment**:
   - Activate the virtual environment to use the isolated Python environment:
     ```bash
     source venv/bin/activate
     ```

3. **Install Required Packages**:
   - Install the necessary packages listed in the `requirements.txt`
     ```bash
     pip install -r requirements.txt
     ```

4. **Start Visual Studio Code**:
   - Open Visual Studio Code in the current directory:
     ```bash
     code .
     ```

5. **Run Make Command**:
   - Use the make build and run the frontend project:
     ```bash
     make
     ```

6. **Access the Web Server**:
   - Click the loopback address (e.g., `http://127.0.0.1:4100`) displayed in the terminal to load the web server in your browser.

## Setup Backend (flask_2025 or flocker_backend)

1. **Ensure .env Setup**:
   - Create a `.env` file in the root directory of your project with the following content:
     ```plaintext
     ADMIN_USER='toby'
     ADMIN_PASSWORD='123Toby!'
     DEFAULT_USER='hop'
     DEFAULT_PASSWORD='123Hop!'
     ```
   - This file contains environment variables for admin and default user credentials.

2. **Setup Virtual Environment**:
   - Create a virtual environment to manage your project's dependencies:
     ```bash
     python -m venv venv
     ```

3. **Activate Virtual Environment**:
   - Activate the virtual environment to use the isolated Python environment:
     ```bash
     source venv/bin/activate
     ```

4. **Install Required Packages**:
   - Install the necessary packages listed in the `requirements.txt`
     ```bash
     pip install -r requirements.txt
     ```

5. **Initialize the Database**:
   - Run the database initialization script to set up the database:
     ```bash
     scripts/db_init.py
     ```

## Emphasize Backend Server

1. **Show Activity Monitor or Task Manager Instances of Python**:
   - Before starting the backend server, open Activity Monitor (on macOS) or Task Manager (on Windows) to show the current instances of Python running. This helps to visualize the impact of starting the server.

2. **Run the Backend with Debug (main.py)**:
   - Start the backend Flask server in debug mode by opening the `main.py` file.
   - In VSCode, use the dropdown arrow next to the Play button and select "Debug" to run the server in debug mode.
   - This command starts the Python server, which will handle API backend requests.

3. **Show Activity Monitor or Task Manager Change**:
   - After starting the server, revisit Activity Monitor or Task Manager to see the new Python processes. This demonstrates that the server is actively running.

4. **Port**:
   - The backend server typically runs on a different port than the frontend. For example, the backend might run on port `8087` while the frontend runs on port `4100`.
   - This distinction is crucial to avoid conflicts and ensure that requests are routed correctly between the frontend and backend.

5. **Set Breakpoints in _Security**:
   - Open the `api/user.py` file and look for the `class _Security` class in your code editor.
   - Set breakpoints in the `def post(self):` methodto as we will use this  to debug the backend server when performing login. This is useful for inspecting the flow of data and handling of requests.

## Emphasize Frontend Server

1. **Show Process for `jekyll serve -H 127.0.0.1 -P 4100`**:
   - Open a terminal and navigate to the root directory of your frontend project.
   - Find the follow command process in terminal:
     ```bash
     pgrep -fl jekyll
     ```
   - This command show: jekyll serve -H 127.0.0.1 -P 4100

2. **Run Login in Browser**:
   - Open your web browser and navigate to the following URL to access the login page:
     ```plaintext
     http://127.0.0.1:4100/pages/login
     ```
   - This URL points to the login page of your frontend application.

3. **Open Inspect Tool**:
   - Right-click on the login page in your browser and select "Inspect" to open the browser's developer tools.
   - This tool allows you to inspect the HTML, CSS, and JavaScript of the page.

4. **Set Breakpoint in `login.js` for `login(options);`**:
   - Review Input code
   - In the "Sources" tab of the developer tools, navigate to the `login.js` file.
   - Set a breakpoint at the line where `login(options);` is called.
   - This breakpoint will pause the execution when the `login` function REQUEST is invoked.

5. **Set Breakpoint in `profile.js` at `options.callback();`**:
   - In the "Sources" tab of the developer tools, navigate to the `profile.js` file.
   - Set a breakpoint at the line where `options.callback();` is called.
   - This breakpoint will pause the execution when the callback function is invoked.

6. **Try to Login from UI**:
   - Attempt to log in from the UI by entering your credentials and submitting the form.
   - The execution should stop at the `login(options);` breakpoint in `login.js`.
   - After handling the login in the backend, the execution should return and stop at the `options.callback();` breakpoint in `profile.js`.

## Visual Recap

```plaintext
    +---------------+
    | GitHub Pages  |
    | Design, Layout|
    |   Frontend    |
    +---------------+
          |
          | User presentation, style 
          | 
          v
    +--------------+
    |  JavaScript  |
    | Logic/Events |
    +--------------+
          |
          | JS Functionality, interactivity
          | Sends API request
          v
    +----------------+
    | Python / Flask |
    |     Backend    |
    +----------------+
          |
          | Python Server-Side API Processing
          | Communicate with Data Services
          | Replies with Response
          v
    +----------------+
    |  SQL Alchemy   |
    |   Store Data   |
    +----------------+
```

### Text Representation Walk-through

1. **GitHub Pages (Frontend)**:
   - **Design, Layout**: The frontend is hosted on GitHub Pages, where the design and layout are defined.
   - **User Presentation, Style**: This layer is responsible for presenting the user interface and applying styles.

2. **JavaScript (Logic/Events)**:
   - **JS Functionality, Interactivity**: JavaScript adds functionality and interactivity to the frontend.
   - **Sends API Request**: When a user interacts with the frontend, JavaScript sends an API request to the backend.

3. **Python / Flask (Backend)**:
   - **Python Server-Side API Processing**: The Flask backend processes the API requests sent from the frontend.
   - **Communicate with Data Services**: The backend communicates with data services to fetch or store data.
   - **Replies with Response**: After processing the request, the backend sends a response back to the frontend.

4. **SQL Alchemy (Store Data)**:
   - **Store Data**: SQL Alchemy is used to interact with the database, storing and retrieving data as needed.


## Debug Requests with REST Client

1. Install **REST Client** by Huachao Mao in VS Code and open the Flask backend.
2. Start `main.py` with the Python debugger and select the `local` REST Client
   environment. Check that its shared `baseUrl` matches the backend's port.
3. Place a breakpoint in the handler you are studying: user `_Security.post`,
   jokes `_ReadCount.get`, or microblog `_CRUD.get`.
4. Open `api/user_auth.http` and choose **Send Request** to authenticate when
   required. Supply credentials through its prompts. For the public jokes
   count request, authentication is not required.
5. Send the matching `.http` request from
   [API Interfaces and Testing]({{ site.baseurl }}/python/flask/api/contracts-testing).
   Step into the data function or model; compare the inputs with the contract.
6. Continue execution before expecting a response in REST Client. Inspect the
   HTTP status, headers, and body, not just whether the request connected.
7. Repeat from the frontend and compare the Network-panel request. Direct
   REST Client checks do not verify browser CORS behavior.

Trace the three paths separately:

- `hacks/joke.py` -> `hacks/jokes.py`: file-backed jokes data.
- `api/user.py` -> `model/user.py`: authentication and user persistence.
- `api/microblog_api.py` -> `model/microblog.py`: authenticated posts and topics.

REST Client remembers response cookies by default. Keep the host consistent
and authenticate again after switching environments. Use disposable local
records for writes; the request files are manual checks, not an automated suite.

