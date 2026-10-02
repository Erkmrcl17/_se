from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import sqlite3
from pathlib import Path
from datetime import datetime

app = Flask(__name__)
app.secret_key = "change-this-secret-key"
DB_PATH = Path(__file__).with_name("nqu_campus.db")


def db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    conn = db()
    conn.executescript("""
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        department TEXT NOT NULL,
        grade INTEGER NOT NULL,
        email TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS courses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        code TEXT NOT NULL,
        name TEXT NOT NULL,
        teacher TEXT NOT NULL,
        credits INTEGER NOT NULL,
        weekday INTEGER NOT NULL,
        start_time TEXT NOT NULL,
        end_time TEXT NOT NULL,
        classroom TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS enrollments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        semester TEXT NOT NULL,
        FOREIGN KEY(student_id) REFERENCES students(id),
        FOREIGN KEY(course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS grades (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        score REAL NOT NULL,
        letter_grade TEXT NOT NULL,
        FOREIGN KEY(student_id) REFERENCES students(id),
        FOREIGN KEY(course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS attendance (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        course_id INTEGER NOT NULL,
        attended INTEGER NOT NULL,
        total INTEGER NOT NULL,
        FOREIGN KEY(student_id) REFERENCES students(id),
        FOREIGN KEY(course_id) REFERENCES courses(id)
    );

    CREATE TABLE IF NOT EXISTS announcements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL,
        published_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS knowledge (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        keywords TEXT NOT NULL,
        question TEXT NOT NULL,
        answer TEXT NOT NULL
    );
    """)

    count = conn.execute("SELECT COUNT(*) AS n FROM students").fetchone()["n"]
    if count == 0:
        conn.execute(
            "INSERT INTO students(student_id,password,name,department,grade,email) VALUES(?,?,?,?,?,?)",
            ("111210501", "nqu1234", "Erika Lie", "Computer Science and Information Engineering", 4, "erika@example.edu.tw")
        )
        student_pk = conn.execute("SELECT id FROM students WHERE student_id=?", ("111210501",)).fetchone()["id"]

        courses = [
            ("CS401", "Artificial Intelligence", "Prof. Lee", 3, 1, "09:10", "12:00", "E301"),
            ("CS402", "Data Mining", "Prof. Wang", 3, 2, "13:30", "16:20", "E205"),
            ("CS403", "Cloud Computing", "Prof. Chen", 3, 3, "10:10", "12:00", "E302"),
            ("CS404", "Information Security", "Prof. Lin", 3, 4, "14:20", "17:10", "E201"),
            ("CS405", "Project Seminar", "Prof. Lee", 2, 5, "09:10", "11:00", "E105"),
        ]
        for c in courses:
            conn.execute(
                "INSERT INTO courses(code,name,teacher,credits,weekday,start_time,end_time,classroom) VALUES(?,?,?,?,?,?,?,?)",
                c
            )

        course_rows = conn.execute("SELECT * FROM courses ORDER BY id").fetchall()
        grades = [(92, "A+"), (88, "A"), (90, "A+"), (86, "A"), (94, "A+")]
        attendance = [(15, 16), (14, 15), (15, 15), (13, 14), (10, 10)]

        for idx, course in enumerate(course_rows):
            conn.execute(
                "INSERT INTO enrollments(student_id,course_id,semester) VALUES(?,?,?)",
                (student_pk, course["id"], "115-1")
            )
            conn.execute(
                "INSERT INTO grades(student_id,course_id,score,letter_grade) VALUES(?,?,?,?)",
                (student_pk, course["id"], grades[idx][0], grades[idx][1])
            )
            conn.execute(
                "INSERT INTO attendance(student_id,course_id,attended,total) VALUES(?,?,?,?)",
                (student_pk, course["id"], attendance[idx][0], attendance[idx][1])
            )

        announcements = [
            ("Course Withdrawal Notice", "The course withdrawal application period will be announced by the Academic Affairs Office.", "2026-10-01"),
            ("Library Service", "Students can use their student ID card to access library services and borrowing functions.", "2026-09-28"),
            ("Campus Information", "Please check official university announcements for the latest academic and administrative information.", "2026-09-25"),
        ]
        conn.executemany(
            "INSERT INTO announcements(title,content,published_at) VALUES(?,?,?)",
            announcements
        )

        knowledge = [
            ("library borrow book", "How can I borrow books?", "You can use your student ID card for library borrowing services. Please check the library's official rules for current loan limits and opening hours."),
            ("academic affairs course withdrawal", "Where can I handle course withdrawal?", "Course-related administrative procedures are generally handled through Academic Affairs. Please verify the current application period in official university announcements."),
            ("computer science csie department office", "Where is the CSIE department office?", "Please refer to the latest National Quemoy University campus information or the CSIE department website for the current office location."),
            ("announcement notice latest", "Where can I find school announcements?", "You can check the Announcements page in this demo system. For official and current information, always confirm with the university's official channels."),
        ]
        conn.executemany(
            "INSERT INTO knowledge(keywords,question,answer) VALUES(?,?,?)",
            knowledge
        )

    conn.commit()
    conn.close()


def current_student():
    if "student_db_id" not in session:
        return None
    conn = db()
    student = conn.execute("SELECT * FROM students WHERE id=?", (session["student_db_id"],)).fetchone()
    conn.close()
    return student


def require_login():
    return "student_db_id" in session


def student_courses(student_id):
    conn = db()
    rows = conn.execute("""
        SELECT c.*, e.semester
        FROM enrollments e
        JOIN courses c ON c.id=e.course_id
        WHERE e.student_id=?
        ORDER BY c.weekday, c.start_time
    """, (student_id,)).fetchall()
    conn.close()
    return rows


@app.route("/", methods=["GET", "POST"])
def login():
    if require_login():
        return redirect(url_for("dashboard"))
    error = None
    if request.method == "POST":
        sid = request.form.get("student_id", "").strip()
        password = request.form.get("password", "")
        conn = db()
        student = conn.execute(
            "SELECT * FROM students WHERE student_id=? AND password=?",
            (sid, password)
        ).fetchone()
        conn.close()
        if student:
            session["student_db_id"] = student["id"]
            return redirect(url_for("dashboard"))
        error = "Invalid student ID or password."
    return render_template("login.html", error=error)


@app.route("/logout")
def logout():
    session.clear()
    return redirect(url_for("login"))


@app.route("/dashboard")
def dashboard():
    student = current_student()
    if not student:
        return redirect(url_for("login"))
    conn = db()
    grade_rows = conn.execute("""
        SELECT g.score, c.credits
        FROM grades g JOIN courses c ON c.id=g.course_id
        WHERE g.student_id=?
    """, (student["id"],)).fetchall()
    announcements = conn.execute(
        "SELECT * FROM announcements ORDER BY published_at DESC LIMIT 3"
    ).fetchall()
    conn.close()

    total_credits = sum(r["credits"] for r in grade_rows)
    average = round(sum(r["score"] for r in grade_rows) / len(grade_rows), 1) if grade_rows else 0
    courses = student_courses(student["id"])
    return render_template(
        "dashboard.html",
        student=student,
        total_credits=total_credits,
        average=average,
        course_count=len(courses),
        announcements=announcements,
    )


@app.route("/profile")
def profile():
    student = current_student()
    if not student:
        return redirect(url_for("login"))
    return render_template("profile.html", student=student)


@app.route("/courses")
def courses():
    student = current_student()
    if not student:
        return redirect(url_for("login"))
    return render_template("courses.html", student=student, courses=student_courses(student["id"]))


@app.route("/grades")
def grades():
    student = current_student()
    if not student:
        return redirect(url_for("login"))
    conn = db()
    rows = conn.execute("""
        SELECT c.code, c.name, c.credits, g.score, g.letter_grade
        FROM grades g JOIN courses c ON c.id=g.course_id
        WHERE g.student_id=?
        ORDER BY c.code
    """, (student["id"],)).fetchall()
    conn.close()
    average = round(sum(r["score"] for r in rows) / len(rows), 1) if rows else 0
    return render_template("grades.html", student=student, grades=rows, average=average)


@app.route("/attendance")
def attendance():
    student = current_student()
    if not student:
        return redirect(url_for("login"))
    conn = db()
    rows = conn.execute("""
        SELECT c.code, c.name, a.attended, a.total
        FROM attendance a JOIN courses c ON c.id=a.course_id
        WHERE a.student_id=?
        ORDER BY c.code
    """, (student["id"],)).fetchall()
    conn.close()
    return render_template("attendance.html", student=student, attendance=rows)


@app.route("/announcements")
def announcements():
    student = current_student()
    if not student:
        return redirect(url_for("login"))
    conn = db()
    rows = conn.execute("SELECT * FROM announcements ORDER BY published_at DESC").fetchall()
    conn.close()
    return render_template("announcements.html", student=student, announcements=rows)


@app.route("/assistant")
def assistant():
    student = current_student()
    if not student:
        return redirect(url_for("login"))
    return render_template("assistant.html", student=student)


def ai_answer(student_id, question):
    q = question.lower().strip()
    conn = db()

    # Personal course schedule
    if any(word in q for word in ["class", "course", "schedule", "課", "課表"]):
        weekdays = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        courses = conn.execute("""
            SELECT c.* FROM enrollments e
            JOIN courses c ON c.id=e.course_id
            WHERE e.student_id=?
            ORDER BY c.weekday,c.start_time
        """, (student_id,)).fetchall()
        if "today" in q:
            today = datetime.now().isoweekday()
            courses = [c for c in courses if c["weekday"] == today]
            if not courses:
                conn.close()
                return "You do not have any courses scheduled today in the demo database."
        result = []
        for c in courses:
            result.append(
                f'{c["name"]} ({c["code"]}) — {weekdays[c["weekday"]]} '
                f'{c["start_time"]}-{c["end_time"]}, Room {c["classroom"]}'
            )
        conn.close()
        return "Your course information:\n" + "\n".join("• " + x for x in result)

    # Grades
    if any(word in q for word in ["grade", "score", "成績"]):
        rows = conn.execute("""
            SELECT c.name,c.code,g.score,g.letter_grade
            FROM grades g JOIN courses c ON c.id=g.course_id
            WHERE g.student_id=?
        """, (student_id,)).fetchall()
        for r in rows:
            if r["name"].lower() in q or r["code"].lower() in q:
                conn.close()
                return f'Your {r["name"]} grade is {r["score"]} ({r["letter_grade"]}).'
        avg = round(sum(r["score"] for r in rows) / len(rows), 1) if rows else 0
        answer = "Your grades:\n" + "\n".join(
            f'• {r["name"]}: {r["score"]} ({r["letter_grade"]})' for r in rows
        )
        conn.close()
        return answer + f"\nAverage score: {avg}"

    # Attendance
    if any(word in q for word in ["attendance", "absence", "出席", "缺席"]):
        rows = conn.execute("""
            SELECT c.name,a.attended,a.total
            FROM attendance a JOIN courses c ON c.id=a.course_id
            WHERE a.student_id=?
        """, (student_id,)).fetchall()
        answer = "Your attendance:\n" + "\n".join(
            f'• {r["name"]}: {r["attended"]}/{r["total"]} '
            f'({round(r["attended"]/r["total"]*100,1)}%)' for r in rows
        )
        conn.close()
        return answer

    # Credits
    if "credit" in q or "學分" in q:
        row = conn.execute("""
            SELECT COALESCE(SUM(c.credits),0) AS credits
            FROM enrollments e JOIN courses c ON c.id=e.course_id
            WHERE e.student_id=?
        """, (student_id,)).fetchone()
        conn.close()
        return f'You are currently enrolled in {row["credits"]} credits in this demo semester.'

    # Announcements
    if "announcement" in q or "notice" in q or "公告" in q:
        rows = conn.execute(
            "SELECT * FROM announcements ORDER BY published_at DESC LIMIT 3"
        ).fetchall()
        answer = "Recent announcements:\n" + "\n".join(
            f'• {r["published_at"]} — {r["title"]}: {r["content"]}' for r in rows
        )
        conn.close()
        return answer

    # Simple local retrieval / RAG-like keyword matching
    knowledge = conn.execute("SELECT * FROM knowledge").fetchall()
    tokens = set(q.replace("?", "").replace(",", " ").split())
    best = None
    best_score = 0
    for item in knowledge:
        keywords = set(item["keywords"].lower().split())
        score = len(tokens & keywords)
        if score > best_score:
            best_score = score
            best = item
    conn.close()

    if best and best_score > 0:
        return best["answer"]

    return (
        "I could not find a confident answer in the local campus knowledge base. "
        "Try asking about your courses, grades, attendance, credits, announcements, "
        "library services, or academic affairs."
    )


@app.post("/api/chat")
def chat():
    student = current_student()
    if not student:
        return jsonify({"error": "Unauthorized"}), 401
    data = request.get_json(silent=True) or {}
    question = str(data.get("message", "")).strip()
    if not question:
        return jsonify({"error": "Message is required."}), 400
    return jsonify({"answer": ai_answer(student["id"], question)})


if __name__ == "__main__":
    init_db()
    app.run(debug=True)
