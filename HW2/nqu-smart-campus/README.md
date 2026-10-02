# NQU Smart Campus System

A university student information system inspired by the academic affairs system of National Quemoy University (NQU). This project combines traditional campus services with an AI-style assistant that allows students to query personal academic information and campus knowledge using natural language.

> This is an independent educational demo project. It is **not** an official National Quemoy University system and does not use real university student records.

## Project Idea

Traditional student information systems usually require users to navigate through different pages to find courses, grades, attendance records, or announcements.

NQU Smart Campus provides those standard functions while adding an **AI Assistant** interface. Students can ask questions such as:

- What classes do I have?
- Show my grades.
- How many credits am I taking?
- Show my attendance.
- What are the latest announcements?
- How can I borrow books?

The assistant combines student records stored in SQLite with a small local campus knowledge base.

## Features

### Student System
- Student login
- Dashboard
- Student profile
- Course schedule
- Grade inquiry
- Attendance inquiry
- Campus announcements

### AI Assistant
- Natural-language campus questions
- Personal course queries
- Grade queries
- Attendance queries
- Credit queries
- Announcement retrieval
- Local knowledge retrieval
- Simple RAG-like keyword matching

### Web Application
- Responsive user interface
- Flask backend
- SQLite database
- REST-style `/api/chat` endpoint
- HTML, CSS, and JavaScript frontend

## Technology Stack

| Layer | Technology |
| --- | --- |
| Backend | Python / Flask |
| Frontend | HTML, CSS, JavaScript |
| Database | SQLite |
| AI Module | Rule-based intent detection + local knowledge retrieval |
| API | JSON REST endpoint |

The current version does not require a paid LLM API. The assistant is implemented locally so the project can run immediately after installation.

## Project Structure

```text
nqu-smart-campus/
├── app.py
├── requirements.txt
├── README.md
├── .gitignore
├── templates/
│   ├── base.html
│   ├── login.html
│   ├── dashboard.html
│   ├── profile.html
│   ├── courses.html
│   ├── grades.html
│   ├── attendance.html
│   ├── announcements.html
│   └── assistant.html
└── static/
    ├── css/
    │   └── style.css
    └── js/
        └── assistant.js
```

The SQLite database `nqu_campus.db` is generated automatically when the application is started for the first time.

## Installation

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd nqu-smart-campus
```

Or download the project ZIP and extract it.

### 2. Create a virtual environment

Windows:

```bash
python -m venv .venv
.venv\Scripts\activate
```

macOS / Linux:

```bash
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Run the application

```bash
python app.py
```

Open the local address displayed by Flask, normally:

```text
http://127.0.0.1:5000
```

## Demo Account

Use the following account to test the system:

```text
Student ID: 111210501
Password:   nqu1234
```

All student data included in this repository is fictional demo data.

## Main Pages

### Dashboard

The dashboard summarizes the student's current academic information, including:

- current credits
- average score
- number of courses
- recent announcements

### Courses

Displays the student's current course schedule, including course code, teacher, credits, weekday, time, and classroom.

### Grades

Displays the student's score and letter grade for each course.

### Attendance

Displays attendance records and calculates the attendance percentage for each course.

### Announcements

Provides a simplified campus announcement center.

### AI Assistant

The AI Assistant allows students to retrieve information conversationally.

Example:

```text
Student:
Show my grades.

Assistant:
Your grades:
• Artificial Intelligence: 92 (A+)
• Data Mining: 88 (A)
...
```

Another example:

```text
Student:
How many credits am I taking?

Assistant:
You are currently enrolled in 14 credits in this demo semester.
```

## System Architecture

```text
                    ┌──────────────────────┐
                    │      Web Browser     │
                    │ HTML / CSS / JS      │
                    └──────────┬───────────┘
                               │
                               │ HTTP
                               ▼
                    ┌──────────────────────┐
                    │    Flask Backend     │
                    │      app.py          │
                    └───────┬──────┬───────┘
                            │      │
                  SQL Query │      │ AI Query
                            ▼      ▼
                   ┌───────────┐  ┌───────────────┐
                   │  SQLite   │  │ AI Assistant  │
                   │ Database  │  │ Retrieval     │
                   └───────────┘  └───────┬───────┘
                                          │
                                          ▼
                                  ┌───────────────┐
                                  │ Campus Local  │
                                  │ Knowledge     │
                                  └───────────────┘
```

## Database Design

The project contains the following main tables:

```text
students
courses
enrollments
grades
attendance
announcements
knowledge
```

Relationships:

```text
Student
   │
   ├── Enrollments ── Courses
   │
   ├── Grades ─────── Courses
   │
   └── Attendance ─── Courses
```

## AI Assistant Design

The assistant uses three basic stages.

### 1. User Question

```text
"What classes do I have?"
```

### 2. Intent Detection

The backend detects whether the question is related to:

```text
courses
grades
attendance
credits
announcements
campus knowledge
```

### 3. Information Retrieval

For personal academic questions, the system retrieves records from SQLite.

For general campus questions, it searches the local `knowledge` table using keyword overlap.

This creates a simplified **retrieval-augmented assistant** without requiring an external LLM.

## API

The AI Assistant frontend communicates with:

```text
POST /api/chat
```

Example request:

```json
{
  "message": "Show my grades"
}
```

Example response:

```json
{
  "answer": "Your grades:\n• Artificial Intelligence: 92 (A+)..."
}
```

## Learning Objectives

This project demonstrates:

- Full-stack web development
- Flask routing
- HTML template rendering
- Session-based login
- SQLite database design
- SQL relationships and queries
- REST API development
- JavaScript `fetch()`
- JSON communication
- Natural-language query processing
- Information retrieval
- Basic AI assistant architecture

## Relationship to an AI Campus Assistant

The project can be extended into a more advanced campus AI assistant by connecting a real Large Language Model and a vector database.

A future architecture could be:

```text
Student Question
      │
      ▼
Intent / Query Analysis
      │
      ├───────────────┐
      ▼               ▼
Student Database   Vector Database
      │               │
      └───────┬───────┘
              ▼
             LLM
              │
              ▼
       Generated Answer
```

This would allow the system to perform semantic retrieval over university regulations, announcements, FAQs, and other campus documents.

## Future Improvements

Possible future extensions include:

- Real LLM integration
- RAG with embeddings
- Vector database integration
- Speech-to-text
- Text-to-speech
- Course registration
- Academic calendar
- Tuition information
- Student document requests
- Teacher portal
- Administrator dashboard
- Password hashing
- Role-based access control
- Real-time university API integration
- Mobile application

## Security Notice

This project is intended for coursework and demonstration purposes.

The demo authentication system intentionally remains simple. A production system should use:

- hashed passwords
- CSRF protection
- secure environment variables
- stronger session configuration
- role-based authorization
- HTTPS
- input validation
- database migration tools

Never store real student passwords or confidential academic records using the demo configuration.

## Disclaimer

This project is inspired by common university academic information systems and campus assistant concepts.

It is not affiliated with, endorsed by, or connected to the official National Quemoy University academic affairs system. Names and records included in the application are demonstration data only.

## License

This project is provided for educational and coursework purposes.
