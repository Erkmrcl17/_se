from flask import Flask, render_template, request, redirect, url_for, session, jsonify
import sqlite3, os

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "nqu-smart-campus-coursework")
DB = "nqu_campus.db"

def init_db():
    con=sqlite3.connect(DB); c=con.cursor()
    c.executescript("""
    CREATE TABLE IF NOT EXISTS students(id INTEGER PRIMARY KEY, student_id TEXT UNIQUE, password TEXT, name TEXT, department TEXT, year INTEGER, email TEXT);
    CREATE TABLE IF NOT EXISTS courses(id INTEGER PRIMARY KEY, code TEXT, name TEXT, teacher TEXT, credits INTEGER, weekday TEXT, time TEXT, classroom TEXT);
    CREATE TABLE IF NOT EXISTS enrollments(student_id INTEGER, course_id INTEGER);
    CREATE TABLE IF NOT EXISTS grades(student_id INTEGER, course_id INTEGER, score INTEGER, letter TEXT);
    CREATE TABLE IF NOT EXISTS attendance(student_id INTEGER, course_id INTEGER, attended INTEGER, total INTEGER);
    CREATE TABLE IF NOT EXISTS announcements(id INTEGER PRIMARY KEY, title TEXT, content TEXT, published TEXT);
    """)
    if not c.execute("SELECT 1 FROM students").fetchone():
        c.execute("INSERT INTO students VALUES(NULL,?,?,?,?,?,?)",("111210501","nqu1234","Erika Lie","Computer Science and Information Engineering",4,"demo@nqu.edu.tw"))
        courses=[("CS401","Artificial Intelligence","Prof. Lee",3,"Monday","09:10-12:00","E301"),("CS402","Data Mining","Prof. Chen",3,"Tuesday","13:30-16:20","E205"),("CS403","Cloud Computing","Prof. Wang",3,"Wednesday","09:10-12:00","E303")]
        c.executemany("INSERT INTO courses VALUES(NULL,?,?,?,?,?,?,?)",courses)
        for i,score in enumerate([92,88,90],1):
            c.execute("INSERT INTO enrollments VALUES(1,?)",(i,))
            c.execute("INSERT INTO grades VALUES(1,?,?,?)",(i,score,"A+" if score>=90 else "A"))
            c.execute("INSERT INTO attendance VALUES(1,?,?,?)",(i,15,16))
        c.execute("INSERT INTO announcements VALUES(NULL,?,?,?)",("Course Registration Notice","Please confirm your course registration before the deadline.","2026-10-01"))
    con.commit(); con.close()

def q(sql,args=()):
    con=sqlite3.connect(DB); con.row_factory=sqlite3.Row
    rows=con.execute(sql,args).fetchall(); con.close(); return rows

@app.route("/",methods=["GET","POST"])
def login():
    if request.method=="POST":
        r=q("SELECT * FROM students WHERE student_id=? AND password=?",(request.form["student_id"],request.form["password"]))
        if r: session["sid"]=r[0]["id"]; return redirect(url_for("dashboard"))
        return render_template("login.html",error="Invalid student ID or password.")
    return render_template("login.html")

@app.route("/dashboard")
def dashboard():
    if "sid" not in session:return redirect(url_for("login"))
    s=q("SELECT * FROM students WHERE id=?",(session["sid"],))[0]
    courses=q("SELECT c.* FROM courses c JOIN enrollments e ON c.id=e.course_id WHERE e.student_id=?",(session["sid"],))
    grades=q("SELECT g.*,c.name FROM grades g JOIN courses c ON c.id=g.course_id WHERE g.student_id=?",(session["sid"],))
    return render_template("dashboard.html",student=s,courses=courses,grades=grades)

@app.route("/assistant")
def assistant():
    if "sid" not in session:return redirect(url_for("login"))
    return render_template("assistant.html")

@app.post("/api/chat")
def chat():
    if "sid" not in session:return jsonify(answer="Please login first."),401
    m=request.json.get("message","").lower()
    if "grade" in m or "score" in m:
        rows=q("SELECT c.name,g.score,g.letter FROM grades g JOIN courses c ON c.id=g.course_id WHERE g.student_id=?",(session["sid"],))
        ans="Your grades:\n" + "\n".join(f"• {r['name']}: {r['score']} ({r['letter']})" for r in rows)
    elif "class" in m or "course" in m or "schedule" in m:
        rows=q("SELECT c.* FROM courses c JOIN enrollments e ON c.id=e.course_id WHERE e.student_id=?",(session["sid"],))
        ans="Your courses:\n" + "\n".join(f"• {r['name']} — {r['weekday']} {r['time']}, {r['classroom']}" for r in rows)
    elif "credit" in m:
        total=q("SELECT SUM(c.credits) t FROM courses c JOIN enrollments e ON c.id=e.course_id WHERE e.student_id=?",(session["sid"],))[0]["t"]
        ans=f"You are taking {total} credits."
    elif "attendance" in m:
        rows=q("SELECT c.name,a.attended,a.total FROM attendance a JOIN courses c ON c.id=a.course_id WHERE a.student_id=?",(session["sid"],))
        ans="Attendance:\n" + "\n".join(f"• {r['name']}: {r['attended']}/{r['total']}" for r in rows)
    else:
        ans="I can help with courses, grades, credits, and attendance."
    return jsonify(answer=ans)

@app.route("/logout")
def logout():
    session.clear(); return redirect(url_for("login"))

if __name__=="__main__":
    init_db()
    app.run(debug=False)
