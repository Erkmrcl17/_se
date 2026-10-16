# HW5 - Dockerized Web Application

## 1. Project Overview

This project demonstrates how to deploy a web application using Docker Compose. It consists of three services: a frontend web server, a backend REST API, and a PostgreSQL database.

The application provides a dashboard that displays service statuses and retrieves messages stored in the database through the backend API.

## 2. Technologies Used

- **Docker:** Containerization platform.
- **Docker Compose:** Service orchestration.
- **Nginx:** Frontend web server and reverse proxy.
- **Node.js:** Backend runtime environment.
- **Express.js:** REST API framework.
- **PostgreSQL:** Relational database.

## 3. Project Structure

```text
HW5/
├── Dockerfile
├── docker-compose.yml
├── README.md
├── app/
│   ├── package.json
│   ├── server.js
│   └── public/
│       ├── index.html
│       ├── style.css
│       └── app.js
├── db/
│   └── init.sql
└── nginx/
    └── default.conf
```

## 4. System Architecture

The application consists of three Docker services:

1. **Frontend (Nginx):** Serves the dashboard and forwards API requests to the backend.
2. **Backend (Node.js + Express):** Provides REST API endpoints and communicates with PostgreSQL.
3. **Database (PostgreSQL):** Stores application messages.

### Request Flow

```text
User's Browser
      |
      v
Nginx (Port 8080)
      |
      v
Node.js API (Port 3000)
      |
      v
PostgreSQL (Port 5432)
```

The services communicate through the Docker Compose network. Only the frontend port is published to the host machine.

## 5. How to Run the Application

### Prerequisites

- Docker Desktop installed and running.
- Docker Compose available through the Docker CLI.

### Start the Application

Open a terminal in the project directory and run:

```bash
docker compose up --build -d
```

This command builds the backend image and starts the frontend, backend, and database services.

### Check Container Status

```bash
docker compose ps
```

The database should report a healthy status after its health check succeeds. The frontend and backend containers should also be running.

### Access the Dashboard

Open the following URL in a web browser:

http://localhost:8080

## 6. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Checks backend availability and database connectivity. |
| GET | `/api/messages` | Retrieves messages stored in PostgreSQL. |

### Test the Health Endpoint

```powershell
Invoke-RestMethod http://localhost:8080/api/health
```

Expected response:

```json
{
  "status": "ok",
  "service": "Node.js API",
  "database": "connected"
}
```

### Test the Messages Endpoint

```powershell
Invoke-RestMethod http://localhost:8080/api/messages
```

The endpoint returns the message records stored in the PostgreSQL database.

## 7. Database Initialization

The `db/init.sql` file creates the `messages` table and inserts three initial records when PostgreSQL initializes a new database.

The database uses a named Docker volume, `postgres_data`, to persist data across container restarts and recreation.

Initialization scripts are executed automatically by the PostgreSQL image when the data directory is first initialized.

## 8. Nginx Configuration

Nginx serves the static frontend files from `app/public`.

Requests to `/api/` are forwarded to the backend service at `http://backend:3000`. This allows the frontend to communicate with the API through the same origin.

## 9. Useful Docker Commands

Check running services:

```bash
docker compose ps
```

View service logs:

```bash
docker compose logs
```

View backend logs:

```bash
docker compose logs backend
```

Stop the services:

```bash
docker compose down
```

Stop the services and remove the database volume:

```bash
docker compose down -v
```

**Warning:** The last command deletes the PostgreSQL volume and its stored data. Use it only when you intentionally want to reset the database.

## 10. Conclusion

This project demonstrates a multi-container web application using Docker Compose. Nginx serves the frontend, Node.js and Express provide the REST API, and PostgreSQL stores the application data. The services communicate through an internal Docker network, while the dashboard is accessible through port 8080.