# WorkMate — Multilingual Workforce Management Platform

> **WorkMate** is a web-based application designed to help companies, recruitment agencies, and operational teams manage employee information, work assignments, and document expiration dates in one centralized platform. The system is designed to support cross-language communication, particularly between Chinese and Indonesian speakers.

---

## 1. Project Overview

In workplaces involving employees from different countries, administrative processes and communication are often handled manually. Important information is scattered across multiple platforms, such as LINE, WhatsApp, spreadsheets, paper documents, and personal notes.

This situation can lead to several problems:

- Important information is difficult to retrieve because it is stored across different conversations and platforms.
- Employment contracts and other important documents may expire without proper follow-up.
- Task progress and responsibilities are difficult to monitor.
- Administrative staff repeatedly write similar messages in different languages.
- There is no centralized system for monitoring employee information, tasks, and documents.
- Managers have difficulty obtaining an overall view of administrative activities.

**WorkMate** was developed to address these problems through a centralized web-based management platform.

Users can manage employee information, create and monitor tasks, record important documents and their expiration dates, and use bilingual communication templates within a single system.

### Project Objectives

1. Reduce the risk of missing important document deadlines.
2. Simplify employee information management.
3. Improve administrative work efficiency.
4. Facilitate communication between staff and employees from different countries.
5. Provide centralized monitoring of tasks and document expiration dates.
6. Establish a foundation for developing a commercial Software as a Service (SaaS) product.

### Value Proposition

| Value Category | Benefits |
|---|---|
| Practical Value | Makes daily administrative work more organized. |
| Operational Value | Simplifies task and document monitoring. |
| Communication Value | Provides Mandarin–Indonesian message templates. |
| Efficiency Value | Reduces repetitive data entry and message writing. |
| Business Value | Has the potential to become a subscription-based service for companies. |

---

## 2. Background and Problem Statement

WorkMate was inspired by practical administrative challenges in managing foreign employees and handling cross-language communication.

For example, a company employing a large number of foreign workers needs to manage various types of information, including employee records, employment contracts, administrative documents, processing schedules, and communication between the company and its employees.

When all these processes rely solely on spreadsheets and messaging applications, important information can easily be overlooked or become difficult to track.

### Identified Problems

**2.1 Fragmented Information Management**

Employee records, work information, and administrative documents are often stored separately. This makes it difficult for administrative staff to retrieve specific information efficiently.

**2.2 Lack of Document Expiration Reminders**

Documents such as employment contracts and administrative permits have expiration dates that require regular monitoring. Without a reminder system, staff must manually check each document.

**2.3 Multilingual Communication Challenges**

Language differences can slow down information exchange. Administrative staff often need to prepare the same message in both Chinese and Indonesian.

**2.4 Difficulty Tracking Work Progress**

Tasks communicated through personal messaging applications do not always have clearly defined completion statuses. As a result, follow-up activities can become disorganized.

### Proposed Solution

WorkMate integrates employee management, task tracking, document monitoring, and bilingual message templates into one centralized dashboard, making administrative activities easier to manage and monitor.

---

## 3. Target Users

WorkMate is designed for organizations that manage employees and handle multilingual administrative communication.

| Target Users | Main Needs |
|---|---|
| Recruitment Agencies | Manage employee information and administrative documents. |
| Companies and Factories | Monitor employee records and operational tasks. |
| Human Resources Departments | Manage employment contracts and document expiration dates. |
| Administrative Staff | Organize tasks and follow-up activities. |
| Translators and Coordinators | Prepare bilingual communications. |
| Managers | Monitor administrative activities through a dashboard. |

In the current MVP version, the application operates within a single local workspace and does not yet support data separation between multiple companies.

---

## 4. Main System Features

### 4.1 Dashboard

The dashboard serves as the main page of the application and provides an overview of administrative activities.

The dashboard displays:

- Total number of employees.
- Number of incomplete tasks.
- Number of documents expiring within the next 30 days.
- Number of overdue documents.
- Recent work tasks.
- Documents requiring attention.

The dashboard is designed to help users quickly understand the current administrative situation without opening each individual menu.

### 4.2 Employee Management

This feature allows users to store and manage basic employee information.

The available information includes:

| Field | Description |
|---|---|
| Name | Employee's full name. |
| Language | Employee's primary language. |
| Department | Employee's department or work division. |
| Phone Number | Employee's contact information. |

Available operations:

- Add new employee records.
- Display employee lists.
- Delete employee records.
- Associate employees with tasks and documents.

When an employee record is deleted, its associated tasks and documents are also deleted in the current MVP version.

### 4.3 Task Management

This feature allows users to record administrative activities and monitor their progress.

Examples of tasks include:

- Checking document completeness.
- Contacting employees.
- Updating administrative information.
- Confirming document signatures.
- Following up on employment contract procedures.

Each task contains the following information:

| Field | Description |
|---|---|
| Task Title | Description of the task. |
| Employee | Employee associated with the task. |
| Due Date | Target completion date. |
| Status | Current task progress. |
| Notes | Additional information. |

The available task statuses are:

- `待處理` — Pending.
- `進行中` — In Progress.
- `已完成` — Completed.

Users can create tasks, update task statuses, and delete unnecessary tasks.

### 4.4 Document Management

This feature allows users to record important documents that have expiration dates.

Examples include:

- Employment contracts.
- Residence permits.
- Employee administrative documents.
- Other documents with expiration dates.

Each document contains:

- Document name.
- Associated employee.
- Expiration date.

The system determines document status based on its expiration date.

| Condition | Status |
|---|---|
| Expiration date has passed | 已逾期 — Overdue |
| Today through the next 30 days | 即將到期 — Expiring Soon |
| More than 30 days remaining | 有效 — Valid |

This feature helps users identify documents that require immediate attention.

**Note:** Document status is calculated based only on the expiration date entered by the user. The system does not independently verify the legal validity of any document.

### 4.5 Bilingual Message Templates

This feature helps users prepare routine communications in Mandarin and Indonesian.

The available templates include:

1. Document expiration reminders.
2. Requests for document signatures.
3. Task completion confirmations.
4. Employee information update notifications.

Each template provides two language versions:

- Traditional Chinese.
- Indonesian.

Users can copy both versions using the bilingual message copy button and paste them into their preferred communication platform.

The current implementation uses predefined message templates. It does not yet support AI-powered translation or automatic translation of custom messages.

---

## 5. Technology Stack

WorkMate uses a lightweight web development architecture consisting of frontend, backend, and database components.

| Technology | Purpose |
|---|---|
| HTML5 | Defines the structure of web pages. |
| CSS3 | Handles visual design, layouts, and responsive styling. |
| JavaScript | Manages frontend interactions and API communication. |
| Node.js | JavaScript runtime environment for the backend. |
| Express.js | Handles HTTP requests and provides REST API endpoints. |
| SQLite | Stores employee, task, and document records. |
| better-sqlite3 | Connects the Node.js application to the SQLite database. |

### Reasons for Choosing These Technologies

**HTML, CSS, and JavaScript**

These technologies provide a lightweight foundation for developing interactive web applications without requiring an additional frontend framework.

**Node.js and Express.js**

Node.js allows JavaScript to be used on the server side, while Express simplifies API development and request handling.

**SQLite**

SQLite is suitable for an MVP because it is lightweight, easy to configure, and does not require a separate database server.

**REST API**

The REST API architecture separates frontend presentation from backend data processing, making the system easier to maintain and extend.

For future deployment involving multiple companies and concurrent users, the database can be migrated to PostgreSQL.

---

## 6. System Architecture

The application follows a client-server architecture.

```text
             User
               |
               v
       Web Browser
    (HTML + CSS + JavaScript)
               |
               | HTTP Request / JSON
               v
        Express.js Server
            (Node.js)
               |
               | SQL Queries
               v
        SQLite Database
          (workmate.db)
               |
               v
         JSON Response
               |
               v
       Browser Updates UI
```

### System Workflow

1. The user accesses WorkMate through a web browser.
2. Frontend JavaScript sends requests to the backend through API endpoints.
3. Express receives the requests and executes the corresponding operations.
4. The backend retrieves or modifies information in the SQLite database.
5. The backend returns the results in JSON format.
6. The frontend updates the interface and displays the latest information.

### Project Directory Structure

```text
workmate/
│
├── public/
│   ├── index.html
│   │   └── Application page structure and navigation
│   │
│   ├── style.css
│   │   └── Visual design and responsive layout
│   │
│   └── app.js
│       └── Frontend interactions and API integration
│
├── server.js
│   └── Express server, API endpoints, and database operations
│
├── package.json
│   └── Project configuration and dependencies
│
├── README.md
│   └── Project documentation
│
└── workmate.db
    └── SQLite database generated automatically
```

---

## 7. Database Design

The application uses SQLite with three primary tables.

### 7.1 Employees Table

Stores basic employee information.

| Column | Data Type | Description |
|---|---|---|
| `id` | INTEGER | Primary key, automatically generated. |
| `name` | TEXT | Employee name. |
| `language` | TEXT | Employee's primary language. |
| `department` | TEXT | Department or work division. |
| `phone` | TEXT | Contact number. |

### 7.2 Tasks Table

Stores work assignments and their progress.

| Column | Data Type | Description |
|---|---|---|
| `id` | INTEGER | Primary key. |
| `title` | TEXT | Task title. |
| `employee_id` | INTEGER | Associated employee ID; optional. |
| `due_date` | TEXT | Task deadline in `YYYY-MM-DD` format. |
| `status` | TEXT | Current task status. |
| `notes` | TEXT | Additional notes. |

### 7.3 Documents Table

Stores documents and their expiration dates.

| Column | Data Type | Description |
|---|---|---|
| `id` | INTEGER | Primary key. |
| `name` | TEXT | Document name. |
| `employee_id` | INTEGER | Associated employee ID; optional. |
| `expiry_date` | TEXT | Expiration date in `YYYY-MM-DD` format. |
| `status` | TEXT | Document status, default value `有效`. |

### Database Relationships

```text
             EMPLOYEES
                 |
        +--------+--------+
        |                 |
        v                 v
       TASKS           DOCUMENTS

One employee can have multiple tasks
and multiple associated documents.
```

The relationship between tables is established through the `employee_id` field.

---

## 8. REST API Documentation

The backend provides REST API endpoints for managing application data.

### Employee Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/employees` | Retrieve all employee records. |
| POST | `/api/employees` | Create a new employee. |
| DELETE | `/api/employees/:id` | Delete an employee and associated tasks and documents. |

Example request:

```json
{
  "name": "Budi Santoso",
  "language": "印尼文",
  "department": "Production",
  "phone": "0912-123-456"
}
```

### Task Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/tasks` | Retrieve tasks with associated employee names. |
| POST | `/api/tasks` | Create a new task. |
| PATCH | `/api/tasks/:id` | Update a task status. |
| DELETE | `/api/tasks/:id` | Delete a task. |

Example request for updating a task:

```json
{
  "status": "已完成"
}
```

### Document Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/documents` | Retrieve documents with associated employee names. |
| POST | `/api/documents` | Create a new document record. |
| DELETE | `/api/documents/:id` | Delete a document record. |

Example request:

```json
{
  "name": "Employment Contract",
  "employee_id": 1,
  "expiry_date": "2027-03-31"
}
```

### Dashboard Endpoint

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/summary` | Retrieve employee, task, and document statistics. |

---

## 9. Installation and Setup

### System Requirements

- Node.js version 18 or later.
- npm.
- Visual Studio Code (recommended).
- A modern web browser such as Chrome, Edge, or Firefox.

### Installation Steps

**Step 1 — Extract the Project**

Extract the project ZIP file and open the `workmate` folder using Visual Studio Code.

**Step 2 — Open the VS Code Terminal**

Select:

`Terminal` → `New Terminal`

**Step 3 — Install Dependencies**

Run:

```bash
npm install
```

This command installs all dependencies specified in `package.json`, including Express and better-sqlite3.

**Step 4 — Start the Application**

Run:

```bash
npm start
```

If the server starts successfully, the terminal will display:

```text
WorkMate running at http://localhost:3000
```

**Step 5 — Open the Application**

Open the following address in your browser:

```text
http://localhost:3000
```

On the first startup, the application automatically creates the `workmate.db` database and inserts sample records for testing the dashboard and other features.

### Stopping the Server

Return to the terminal where the server is running and press:

`Ctrl + C`

### Restarting the Application

Run `npm start` again from the project directory. Previously saved data remains stored in `workmate.db`.

---

## 10. Application Usage Guide

### Scenario A — Adding an Employee

1. Open the **員工管理 (Employee Management)** menu.
2. Click **新增員工 (Add Employee)**.
3. Enter the employee's name, language, department, and phone number.
4. Click the save button.
5. The new employee will appear in the employee table.

### Scenario B — Creating a Task

1. Open the **工作任務 (Task Management)** menu.
2. Click **新增任務 (Add Task)**.
3. Enter the task title.
4. Select the associated employee, if applicable.
5. Set the due date and task status.
6. Save the task.
7. Update its status through the dropdown menu when work progresses or is completed.

### Scenario C — Registering a Document

1. Open the **文件期限 (Document Management)** menu.
2. Click **新增文件 (Add Document)**.
3. Enter the document name.
4. Select the associated employee.
5. Enter the expiration date.
6. Save the record and check the displayed document status.

### Scenario D — Sending a Bilingual Message

1. Open the **雙語訊息範本 (Bilingual Message Templates)** menu.
2. Select the appropriate template.
3. Review the Mandarin and Indonesian versions.
4. Click the copy button.
5. Paste the message into your preferred communication application.

---

## 11. Business Value and Monetization Strategy

WorkMate has the potential to become a subscription-based Software as a Service (SaaS) product.

Instead of installing the application on every computer, companies could access the platform through a web browser and manage their administrative activities online.

### Potential Customers

- Recruitment agencies managing foreign employees.
- Factories employing workers from different countries.
- Companies with multilingual administrative requirements.
- HR departments responsible for employee documents and contracts.
- Administrative service providers.

### Proposed Revenue Models

| Subscription Plan | Illustrative Price | Potential Features |
|---|---:|---|
| Starter | Free | Limited employees and basic management features. |
| Business | NT$299/month | Employee, task, and document management. |
| Professional | NT$799/month | Automated reminders and additional templates. |
| Enterprise | Custom Pricing | Multi-branch management, integrations, and customized features. |

These prices are initial business hypotheses, not validated market prices or confirmed customer willingness to pay.

### Market Validation Strategy

To determine whether customers are willing to pay for WorkMate, the following steps are recommended:

1. Interview 5–10 administrative staff, HR professionals, or recruitment agencies.
2. Understand how they currently manage employee documents and work assignments.
3. Allow potential users to test the MVP using sample data.
4. Observe which features are used most frequently.
5. Ask whether automated reminders and multi-user access would provide meaningful value.
6. Test interest in paid subscription plans before developing the full commercial version.

---

## 12. Current MVP Limitations

The current version is designed for demonstration and early-stage testing. Several features have not yet been implemented:

- User registration, login, and authentication.
- Role-based access control for administrators, HR staff, and employees.
- Multi-company data separation.
- Automated notifications through Email, LINE, or SMS.
- AI-powered free-text translation.
- Document scanning and file uploads.
- Data modification history and audit logs.
- Automated database backup and recovery.
- Production deployment with HTTPS.

**Important:** Do not enter real personal information or identity documents into this demonstration version. The current server does not yet include the authentication and security protections required for handling sensitive information.

---

## 13. Future Development Roadmap

### Phase 1 — MVP Improvements

- More comprehensive input validation.
- Employee search and filtering.
- Task filtering by status and date.
- Document filtering by expiration status.
- Confirmation dialogs before deletion.
- Improved error handling.

### Phase 2 — Security and Collaboration

- User login and logout.
- Role-based access control.
- User-to-company relationships.
- Company-level data isolation.
- Secure password hashing.
- HTTPS implementation.
- Audit logs.

### Phase 3 — Workflow Automation

- Automatic document expiration reminders at 30, 14, and 7 days before expiration.
- Email and LINE notifications.
- Configurable reminder schedules.
- Notification history and delivery status tracking.

### Phase 4 — AI and Multilingual Expansion

- AI-powered Mandarin–Indonesian translation.
- Automatic message generation based on work context.
- AI-generated summaries of incomplete tasks.
- Additional language support.
- Integration with HR and administrative systems.

### Phase 5 — SaaS Product Development

- Database migration to PostgreSQL.
- Cloud server deployment.
- Subscription plans and payment integration.
- Super administrator dashboard.
- System monitoring and automated backups.
- Production documentation and maintenance procedures.

---

## 14. Security Considerations for Production

Since WorkMate may eventually store employee names, phone numbers, and document information, additional security measures are necessary before commercial deployment.

Recommended security improvements include:

1. Secure user authentication and password hashing.
2. Authorization checks on every protected API endpoint.
3. Company-level data isolation to prevent unauthorized cross-company access.
4. HTTPS encryption for browser-server communication.
5. Input validation and sanitization.
6. Login rate limiting and API protection.
7. Scheduled database backups and recovery procedures.
8. Data retention and deletion policies.
9. Restricted access to employee documents and personal information.
10. Compliance with applicable data protection regulations in the operating regions.

Security should be treated as a core requirement rather than an optional feature.

---

## 15. Project Evaluation and Success Metrics

The success of WorkMate should not be measured only by the number of implemented features. More importantly, the system should demonstrate measurable improvements in administrative workflows.

Potential evaluation metrics include:

| Metric | Evaluation Purpose |
|---|---|
| Document tracking accuracy | Determine whether important expiration dates are monitored correctly. |
| Administrative processing time | Measure whether the system reduces manual work. |
| Task completion rate | Evaluate whether task tracking improves follow-up activities. |
| User adoption | Measure how frequently staff use the platform. |
| Communication efficiency | Determine whether bilingual templates reduce repetitive writing. |
| Customer willingness to pay | Evaluate the commercial potential of the product. |

These metrics can be evaluated through user testing, interviews, and comparisons between existing workflows and the WorkMate workflow.

---

## 16. Conclusion

WorkMate is more than a basic employee record management application. It is a proposed solution to practical administrative challenges involving document tracking, task management, and multilingual communication.

By integrating these functions into one centralized platform, WorkMate aims to reduce repetitive administrative work, improve document monitoring, and make communication between companies and foreign employees more efficient.

The current MVP establishes the technical foundation through a web-based frontend, a Node.js and Express backend, REST API endpoints, and an SQLite database.

Future development will focus on improving security, introducing automated notifications, integrating AI-powered translation, and expanding the application into a multi-company SaaS platform.

Ultimately, the project's success should be determined by its ability to solve real user problems, reduce administrative workload, and provide sufficient value for organizations to adopt and pay for the service.

---

## 17. Project Information

| Category | Details |
|---|---|
| Project Name | WorkMate |
| Project Type | Web Application / Workforce Management System |
| Version | 1.0.0 — MVP |
| Interface Language | Traditional Chinese |
| Communication Templates | Mandarin and Indonesian |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | SQLite |
| Architecture | Client-Server / REST API |
| Development Status | Local MVP Prototype |
| Future Direction | Multilingual Workforce Management SaaS |

---

**WorkMate — Work Smarter, Communicate Better, Manage Together.**