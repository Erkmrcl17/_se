# HW6 – Todo List Web Application and Software Testing

## 1. Project Overview

This project implements a Todo List web application using Node.js and Express.js. It allows users to manage daily tasks through a simple web interface.

The main objective of this assignment is to develop a working web application and demonstrate three types of software testing:

1. **Unit Testing** – Verifies individual functions.
2. **System/API Testing** – Verifies the behavior of the application's API endpoints.
3. **End-to-End (E2E) Testing** – Verifies user interactions through a real browser using Playwright.

The application and its tests are organized into separate folders to improve code readability, maintainability, and test organization.

## 2. Project Objectives

The objectives of this project are:

- To develop a functional web application using Node.js and Express.js.
- To implement REST API endpoints for managing tasks.
- To separate application logic, server startup, and utility functions.
- To implement unit tests for input validation.
- To test API requests and responses using Jest and Supertest.
- To automate browser interactions using Playwright.
- To verify application functionality through automated testing.

## 3. Technologies and Tools

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime environment |
| Express.js | Handles HTTP requests and serves the web application |
| HTML | Defines the web page structure |
| CSS | Styles the user interface |
| JavaScript | Implements client-side interactions |
| Jest | Runs automated unit and API tests |
| Supertest | Sends HTTP requests to test the Express application |
| Playwright | Automates end-to-end browser testing |
| npm | Installs dependencies and runs project scripts |

## 4. Project Structure

```text
HW6/
├── src/
│   ├── app.js
│   ├── server.js
│   └── todoUtils.js
├── public/
│   └── index.html
├── tests/
│   ├── unit.test.js
│   └── api.test.js
├── e2e/
│   └── todo.spec.js
├── playwright.config.js
├── package.json
├── package-lock.json
└── README.md
```

### File Descriptions

**`src/app.js`**

Defines the Express application, serves static files, and implements the Todo API endpoints. It supports retrieving, creating, completing, and deleting tasks.

**`src/server.js`**

Starts the web server on port 3000 by default and displays the server URL in the terminal.

**`src/todoUtils.js`**

Contains the `validateTodo()` utility function, which checks whether a task title is a non-empty string.

**`public/index.html`**

Contains the user interface, styling, and client-side JavaScript for interacting with the Todo API.

**`tests/unit.test.js`**

Tests the input-validation function using Jest.

**`tests/api.test.js`**

Tests the API endpoints using Jest and Supertest.

**`e2e/todo.spec.js`**

Contains Playwright tests that simulate user interactions in a browser.

**`playwright.config.js`**

Configures the E2E test directory, browser mode, base URL, and web server startup behavior.

**`package.json`**

Defines the project metadata, dependencies, and commands used to start the application and execute tests.

**`package-lock.json`**

Records the dependency versions resolved during installation.

## 5. Development Process

### Step 1: Initialize the Node.js Project

The project was created in the `HW6` directory. Node.js and npm were used to manage the project configuration and dependencies.

The `package.json` file was configured with the project name, entry point, scripts, and dependencies.

### Step 2: Install the Required Dependencies

The project uses Express.js to build the web application and Jest, Supertest, and Playwright to implement the three testing approaches.

The dependencies can be installed using:

```bash
npm install
```

The main dependencies are:

- `express` – Web application framework.
- `jest` – Automated testing framework.
- `supertest` – HTTP testing library.
- `@playwright/test` – Browser automation and E2E testing framework.

If the required Playwright browser has not been installed, Chromium can be installed with:

```bash
npx playwright install chromium
```

### Step 3: Implement the Input Validation Function

The `src/todoUtils.js` file was created to separate input-validation logic from the main application.

The `validateTodo()` function checks that a task title is a string and contains at least one non-whitespace character.

This prevents users from creating tasks with empty or whitespace-only titles.

### Step 4: Develop the Express Application and REST API

The `src/app.js` file was implemented to handle application logic and HTTP requests.

The application uses Express JSON middleware to process JSON request bodies and static middleware to serve the files in the `public` directory.

The following API endpoints were implemented:

| HTTP Method | Endpoint | Function |
|---|---|---|
| GET | `/api/todos` | Retrieves all tasks |
| POST | `/api/todos` | Creates a new task |
| PATCH | `/api/todos/:id` | Updates a task's completion status |
| DELETE | `/api/todos/:id` | Deletes a task |

Each task contains an ID, a title, and a completion status.

The application returns appropriate HTTP status codes, including `201` for successful creation, `400` for invalid task titles, and `404` when a requested task does not exist.

**Note:** Task data is stored in memory. Tasks are not permanently saved when the server restarts.

### Step 5: Create the Server Entry Point

The `src/server.js` file was created to start the Express application.

The server uses port `3000` by default, unless a different port is specified through the `PORT` environment variable.

The server is started with:

```bash
npm start
```

When the server starts successfully, the terminal displays:

```text
Server running at http://localhost:3000
```

The application can then be accessed at:

http://localhost:3000

### Step 6: Build the Web Interface

The `public/index.html` file was created to provide a simple interface for managing tasks.

The interface allows users to:

- Enter a task title.
- Add a new task.
- Mark a task as completed.
- Undo task completion.
- Delete a task.

Client-side JavaScript uses the Fetch API to communicate with the Express API. This connects the user interface to the server-side functionality.

### Step 7: Implement Unit Testing

The `tests/unit.test.js` file was created to test the `validateTodo()` function independently.

Four test cases were implemented:

1. A valid task title is accepted.
2. An empty string is rejected.
3. A whitespace-only string is rejected.
4. A non-string value is rejected.

These tests verify the behavior of the validation function without requiring browser interaction.

### Step 8: Implement System/API Testing

The `tests/api.test.js` file was created to test the Express API using Jest and Supertest.

Six test cases were implemented:

1. Retrieving the task list when it is empty.
2. Creating a new task successfully.
3. Rejecting a task with an invalid title.
4. Updating a task's completion status.
5. Deleting a task successfully.
6. Returning a not-found response when attempting to update a nonexistent task.

These tests verify API responses, HTTP status codes, and the behavior of the application endpoints.

### Step 9: Configure End-to-End Testing

The `playwright.config.js` file was configured to run tests from the `e2e` directory.

The configuration specifies the base URL as `http://127.0.0.1:3000` and enables headless browser testing.

Playwright also starts the application through the `npm start` command when necessary.

The E2E tests are defined in `e2e/todo.spec.js`.

Three user workflows are tested:

1. Adding a task through the web interface.
2. Completing a task through the web interface.
3. Deleting a task through the web interface.

These tests verify the application's behavior from the user's perspective rather than testing individual functions or API endpoints in isolation.

## 6. How to Run the Application

### Step 1: Open the Project Directory

Open PowerShell and navigate to the project directory:

```powershell
cd C:\111110507\erika\SE\HW6
```

Make sure you are in the root `HW6` directory, where `package.json` is located.

### Step 2: Install Dependencies

```bash
npm install
```

This installs the packages required by the project.

### Step 3: Start the Server

```bash
npm start
```

Wait until the terminal displays:

```text
Server running at http://localhost:3000
```

Keep the terminal open while using the application.

### Step 4: Open the Application

Open a browser and visit:

http://localhost:3000

The Todo List interface should appear.

## 7. How to Run the Tests

### A. Unit Test and System/API Test

From the root `HW6` directory, run:

```bash
npm test
```

This command runs Jest while excluding the E2E test directory.

The expected result from the completed test run is:

- Unit test suite: passed.
- API test suite: passed.
- Total: 10 tests passed.

### B. End-to-End Test

Run:

```bash
npm run test:e2e
```

Playwright executes the browser tests in headless mode.

The completed test run produced:

- Add Todo test: passed.
- Complete Todo test: passed.
- Delete Todo test: passed.
- Total: 3 tests passed.

## 8. Test Results Summary

The project was tested using all three required testing approaches.

| Testing Type | Tool | Number of Tests | Result |
|---|---|---:|---|
| Unit Testing | Jest | 4 | Passed |
| System/API Testing | Jest + Supertest | 6 | Passed |
| E2E Testing | Playwright | 3 | Passed |
| **Total** | | **13** | **All Passed** |

The test results confirm that the validation function, API endpoints, and three main user workflows passed their implemented automated tests.

## 9. Testing Approach Comparison

### Unit Testing

Unit testing focuses on a small, isolated part of the application. In this project, it verifies the input-validation function.

### System/API Testing

System/API testing checks the application's HTTP endpoints, including request handling, responses, and error cases.

### End-to-End Testing

E2E testing simulates user actions in a browser to verify that the web interface works with the backend.

Using all three approaches provides different levels of testing coverage and helps identify problems at different stages of application development.

## 10. Limitations and Future Improvements

The current project is a basic Todo List application. Potential improvements include:

- Storing tasks in a database for persistent data storage.
- Adding more validation and error-handling cases.
- Testing additional API error scenarios.
- Adding E2E tests for invalid input and the undo-completion workflow.
- Improving the user interface and accessibility.

These improvements could make the application more robust and suitable for more extensive use.

## 11. Conclusion

This project demonstrates the development and automated testing of a Todo List web application using Node.js and Express.js.

It implements unit testing with Jest, API testing with Jest and Supertest, and end-to-end testing with Playwright.

All 13 implemented tests passed in the recorded test runs. The project demonstrates how different testing levels can be combined to verify application logic, API behavior, and user-facing functionality.
