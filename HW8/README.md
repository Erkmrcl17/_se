# StudyFlow – Student Task Manager

A lightweight, responsive, and cloud-based task management web application designed to help students organize their academic responsibilities, track assignments, and manage their daily activities efficiently.

StudyFlow provides a centralized dashboard where students can create, update, delete, search, and filter tasks. The application uses **Cloudflare Workers** for server-side logic and **Cloudflare D1** as its database, making it accessible online without requiring a traditional dedicated server.

## 1. Project Overview

Students often need to manage multiple assignments, projects, examinations, and deadlines simultaneously. Keeping track of these responsibilities using scattered notes or different applications can become inconvenient and inefficient.

StudyFlow aims to solve this problem by providing a simple and centralized platform for academic task management.

The application allows users to:

- Organize academic tasks in one place.
- Set task priorities and due dates.
- Categorize tasks based on their type.
- Monitor task progress through a dashboard.
- Search and filter tasks easily.
- Access the application through a web browser.

The main objective of this project is to demonstrate how a full-stack web application can be developed and deployed using Cloudflare's serverless infrastructure.

## 2. Live Demo

**Deployed Application:**

https://studyflow-cloudflare.studyflow-hw8.workers.dev

The application is hosted on Cloudflare Workers and uses a remote Cloudflare D1 database for persistent data storage.

## 3. Features

### 3.1 Dashboard Overview

StudyFlow provides a dashboard that summarizes the user's tasks and overall progress.

The dashboard displays:

- Total number of tasks.
- Pending tasks.
- Completed tasks.
- Overdue tasks.
- Task progress overview.

These statistics help users understand their current workload at a glance.

### 3.2 Task Management (CRUD)

The application supports complete CRUD operations:

| Operation | Description |
|---|---|
| Create | Add new tasks with relevant information. |
| Read | Display existing tasks from the database. |
| Update | Edit task details and update their status. |
| Delete | Remove tasks that are no longer needed. |

### 3.3 Task Categories

Users can organize tasks into different categories to make task management easier.

Examples include:

- Assignments
- Projects
- Examinations
- Personal Tasks
- Other Activities

### 3.4 Priority Management

Each task can be assigned a priority level to help users identify important responsibilities.

Available priority levels:

- High
- Medium
- Low

### 3.5 Due Date Management

Users can assign deadlines to tasks to keep track of upcoming responsibilities.

The dashboard also helps identify overdue tasks so users can pay attention to unfinished work.

### 3.6 Search and Filtering

StudyFlow provides search and filtering capabilities to make it easier to locate specific tasks.

Users can search for tasks using keywords and filter tasks according to their status or category.

### 3.7 Responsive Interface

The application uses a responsive layout designed to provide a consistent experience across different screen sizes, including desktop and mobile devices.

## 4. Technologies Used

This project uses a combination of frontend technologies and Cloudflare serverless services.

### Frontend

| Technology | Purpose |
|---|---|
| HTML5 | Defines the structure of the web application. |
| CSS3 | Handles styling, layout, and responsive design. |
| JavaScript | Implements frontend interactions and API communication. |

### Backend and Database

| Technology | Purpose |
|---|---|
| Cloudflare Workers | Runs the backend API and server-side application logic. |
| Cloudflare D1 | Stores and manages application data using SQLite. |
| Wrangler CLI | Configures, develops, and deploys the application to Cloudflare. |

### Development Tools

- Visual Studio Code
- Node.js
- npm
- Git
- GitHub
- Cloudflare Dashboard

## 5. System Architecture

StudyFlow follows a serverless web application architecture.

The frontend is delivered through Cloudflare Workers Static Assets, while Cloudflare Workers handles API requests and communicates with the D1 database.

### Architecture Diagram

```text
                User
                  |
                  v
             Web Browser
                  |
                  v
        Cloudflare Workers
                  |
          +-------+-------+
          |               |
          v               v
    Static Assets      Backend API
    (HTML/CSS/JS)          |
                          v
                   Cloudflare D1
                     Database
```

### Application Workflow

1. A user opens the StudyFlow website through a web browser.
2. Cloudflare Workers serves the frontend static assets.
3. The frontend sends HTTP requests to the backend API.
4. Cloudflare Workers processes the incoming requests.
5. The backend communicates with Cloudflare D1 to retrieve or modify task records.
6. The API returns the results to the frontend.
7. The interface updates to display the latest information.

## 6. Project Structure

The project is organized as follows:

```text
HW8/
│
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
│
├── src/
│   └── index.js
│
├── schema.sql
├── wrangler.jsonc
├── package.json
└── README.md
```

### Directory and File Descriptions

| File / Directory | Description |
|---|---|
| `public/` | Contains frontend static assets. |
| `public/index.html` | Main HTML page of the application. |
| `public/style.css` | Application styling and responsive layout. |
| `public/app.js` | Frontend JavaScript and API communication. |
| `src/index.js` | Cloudflare Worker backend implementation. |
| `schema.sql` | SQL statements used to initialize the database schema. |
| `wrangler.jsonc` | Cloudflare Workers configuration file. |
| `package.json` | Project metadata, dependencies, and npm scripts. |
| `README.md` | Project documentation. |

## 7. Database Configuration

StudyFlow uses Cloudflare D1, a serverless SQL database based on SQLite.

The database is connected to the Cloudflare Worker through a D1 binding named `DB`.

The binding allows the backend to access the database through:

```javascript
env.DB
```

The database schema is defined in `schema.sql`.

To initialize the database, execute:

```bash
npx wrangler d1 execute studyflow-db --remote --file=./schema.sql
```

This command executes the SQL schema against the remote Cloudflare D1 database.

**Note:** The actual database ID is configured in `wrangler.jsonc`. Do not expose private credentials or API tokens in the public repository.

## 8. Installation and Local Development

Follow these steps to run StudyFlow locally.

### Prerequisites

Make sure the following tools are installed:

- Node.js
- npm
- Git
- A Cloudflare account

### Step 1: Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate to the project directory:

```bash
cd HW8
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Configure Cloudflare

Make sure `wrangler.jsonc` contains the correct Cloudflare D1 database configuration.

Example:

```jsonc
{
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "studyflow-db",
      "database_id": "YOUR_D1_DATABASE_ID",
      "remote": true
    }
  ]
}
```

Replace `YOUR_D1_DATABASE_ID` with your actual Cloudflare D1 database ID.

### Step 4: Initialize the Database

```bash
npx wrangler d1 execute studyflow-db --remote --file=./schema.sql
```

### Step 5: Start Local Development

```bash
npm run dev
```

Wrangler starts a local development server so the application can be tested before deployment.

## 9. Deployment to Cloudflare

StudyFlow is deployed using Cloudflare Workers.

### Step 1: Authenticate with Cloudflare

```bash
npx wrangler login
```

Follow the browser instructions to authorize Wrangler.

### Step 2: Create a D1 Database

```bash
npx wrangler d1 create studyflow-db
```

Copy the database ID returned by Cloudflare and configure it in `wrangler.jsonc`.

If the database has already been created, this step can be skipped.

### Step 3: Initialize the Remote Database

```bash
npx wrangler d1 execute studyflow-db --remote --file=./schema.sql
```

### Step 4: Deploy the Application

```bash
npm run deploy
```

Wrangler uploads the application assets and deploys the Worker to Cloudflare.

### Step 5: Access the Deployed Website

After successful deployment, Wrangler provides a public URL.

The deployed StudyFlow application can be accessed at:

https://studyflow-cloudflare.studyflow-hw8.workers.dev

## 10. Testing Checklist

The following test cases can be used to verify the application's main functionality.

| Test Case | Expected Result |
|---|---|
| Open the website | The dashboard loads successfully. |
| Create a task | A new task is saved and displayed. |
| View tasks | Existing tasks are displayed correctly. |
| Update a task | Changes are reflected in the task list. |
| Delete a task | The selected task is removed. |
| Search tasks | Matching tasks are displayed. |
| Filter tasks | Tasks are filtered according to the selected criteria. |
| Refresh the page | Previously saved tasks remain available. |
| Access from another browser | The application loads using the deployed URL. |

## 11. Advantages of Using Cloudflare

Cloudflare provides several advantages for this project:

- **Serverless Infrastructure:** No need to maintain a traditional web server.
- **Global Availability:** The application is served through Cloudflare's global network.
- **Persistent Database:** Cloudflare D1 stores task information beyond individual browser sessions.
- **Simplified Deployment:** Wrangler CLI makes it easy to deploy updates.
- **Scalability:** The architecture can support future improvements and additional features.

## 12. Limitations and Future Improvements

Although StudyFlow provides the core functionality of a task management application, several improvements can be considered for future development.

Potential enhancements include:

1. **User Authentication:** Add registration and login functionality so each student can manage private tasks.
2. **Multi-user Support:** Separate task records for different users.
3. **Task Notifications:** Add reminders for approaching deadlines.
4. **Calendar Integration:** Provide a calendar view for academic schedules.
5. **Task Collaboration:** Allow students to share tasks and collaborate on group projects.
6. **Data Visualization:** Add charts to provide more detailed insights into productivity.
7. **Improved Security:** Implement stronger authentication, authorization, and input validation.

## 13. Project Objectives and Learning Outcomes

Through the development of StudyFlow, this project demonstrates practical knowledge of:

- Frontend web development using HTML, CSS, and JavaScript.
- Backend API development using Cloudflare Workers.
- Relational database management using Cloudflare D1 and SQL.
- Communication between frontend and backend services.
- Cloud-based application architecture.
- Serverless application deployment.
- Configuration and deployment using Wrangler CLI.

The project also provides practical experience in integrating multiple Cloudflare services into a working web application.

## 14. Conclusion

StudyFlow demonstrates how a functional web application can be developed and deployed using modern web technologies and serverless cloud infrastructure.

By combining HTML, CSS, JavaScript, Cloudflare Workers, and Cloudflare D1, the project provides a practical solution for managing academic tasks while demonstrating the fundamental concepts of full-stack web development and cloud deployment.

The project can serve as a foundation for more advanced student productivity applications with additional features such as authentication, notifications, and collaborative task management.

---

**Project Name:** StudyFlow – Student Task Manager  
**Deployment Platform:** Cloudflare Workers  
**Database:** Cloudflare D1  
**Frontend:** HTML, CSS, JavaScript  
**Backend:** Cloudflare Workers  
**Status:** Successfully Deployed