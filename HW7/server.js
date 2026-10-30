const express = require("express");
const Database = require("better-sqlite3");
const path = require("path");
const app = express();
const db = new Database(path.join(__dirname, "workmate.db"));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

db.exec(`
CREATE TABLE IF NOT EXISTS employees (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, language TEXT DEFAULT '印尼文',
 department TEXT DEFAULT '', phone TEXT DEFAULT ''
);
CREATE TABLE IF NOT EXISTS tasks (
 id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, employee_id INTEGER,
 due_date TEXT, status TEXT DEFAULT '待處理', notes TEXT DEFAULT '',
 FOREIGN KEY(employee_id) REFERENCES employees(id)
);
CREATE TABLE IF NOT EXISTS documents (
 id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL, employee_id INTEGER,
 expiry_date TEXT NOT NULL, status TEXT DEFAULT '有效',
 FOREIGN KEY(employee_id) REFERENCES employees(id)
);
`);
const count = db.prepare("SELECT COUNT(*) n FROM employees").get().n;
if (!count) {
 const e = db.prepare("INSERT INTO employees(name,language,department,phone) VALUES(?,?,?,?)");
 e.run("Andi Pratama","印尼文","組裝部","0912-000-001");
 e.run("Siti Rahma","印尼文","品管部","0912-000-002");
 const t = db.prepare("INSERT INTO tasks(title,employee_id,due_date,status,notes) VALUES(?,?,?,?,?)");
 t.run("確認互貿文件","1",new Date(Date.now()+3*86400000).toISOString().slice(0,10),"待處理","請確認簽名文件是否已寄出");
 t.run("更新員工資料","2",new Date(Date.now()+7*86400000).toISOString().slice(0,10),"進行中","");
 const d = db.prepare("INSERT INTO documents(name,employee_id,expiry_date) VALUES(?,?,?)");
 d.run("工作合約",1,new Date(Date.now()+20*86400000).toISOString().slice(0,10));
 d.run("居留相關文件",2,new Date(Date.now()+60*86400000).toISOString().slice(0,10));
}
const all = table => db.prepare(`SELECT * FROM ${table} ORDER BY id DESC`).all();
app.get("/api/employees",(_,res)=>res.json(all("employees")));
app.post("/api/employees",(req,res)=>{
 const {name,language="印尼文",department="",phone=""}=req.body;
 if(!name?.trim()) return res.status(400).json({error:"請輸入姓名"});
 const info=db.prepare("INSERT INTO employees(name,language,department,phone) VALUES(?,?,?,?)").run(name,language,department,phone);
 res.json(db.prepare("SELECT * FROM employees WHERE id=?").get(info.lastInsertRowid));
});
app.delete("/api/employees/:id",(req,res)=>{
 db.prepare("DELETE FROM employees WHERE id=?").run(req.params.id);
 db.prepare("DELETE FROM tasks WHERE employee_id=?").run(req.params.id);
 db.prepare("DELETE FROM documents WHERE employee_id=?").run(req.params.id);
 res.json({ok:true});
});
app.get("/api/tasks",(_,res)=>res.json(db.prepare(`SELECT tasks.*, employees.name employee_name FROM tasks LEFT JOIN employees ON employees.id=tasks.employee_id ORDER BY due_date`).all()));
app.post("/api/tasks",(req,res)=>{
 const {title,employee_id=null,due_date="",status="待處理",notes=""}=req.body;
 if(!title?.trim()) return res.status(400).json({error:"請輸入任務名稱"});
 const r=db.prepare("INSERT INTO tasks(title,employee_id,due_date,status,notes) VALUES(?,?,?,?,?)").run(title,employee_id||null,due_date,status,notes);
 res.json(db.prepare("SELECT * FROM tasks WHERE id=?").get(r.lastInsertRowid));
});
app.patch("/api/tasks/:id",(req,res)=>{
 db.prepare("UPDATE tasks SET status=? WHERE id=?").run(req.body.status,req.params.id); res.json({ok:true});
});
app.delete("/api/tasks/:id",(req,res)=>{db.prepare("DELETE FROM tasks WHERE id=?").run(req.params.id);res.json({ok:true});});
app.get("/api/documents",(_,res)=>res.json(db.prepare(`SELECT documents.*, employees.name employee_name FROM documents LEFT JOIN employees ON employees.id=documents.employee_id ORDER BY expiry_date`).all()));
app.post("/api/documents",(req,res)=>{
 const {name,employee_id=null,expiry_date}=req.body;
 if(!name?.trim()||!expiry_date) return res.status(400).json({error:"文件名稱及到期日為必填"});
 const r=db.prepare("INSERT INTO documents(name,employee_id,expiry_date) VALUES(?,?,?)").run(name,employee_id||null,expiry_date);
 res.json(db.prepare("SELECT * FROM documents WHERE id=?").get(r.lastInsertRowid));
});
app.delete("/api/documents/:id",(req,res)=>{db.prepare("DELETE FROM documents WHERE id=?").run(req.params.id);res.json({ok:true});});
app.get("/api/summary",(_,res)=>{
 const employees=db.prepare("SELECT COUNT(*) n FROM employees").get().n;
 const tasks=db.prepare("SELECT COUNT(*) n FROM tasks WHERE status!='已完成'").get().n;
 const docs=db.prepare("SELECT COUNT(*) n FROM documents WHERE expiry_date<=date('now','+30 day')").get().n;
 const overdue=db.prepare("SELECT COUNT(*) n FROM documents WHERE expiry_date<date('now')").get().n;
 res.json({employees,tasks,docs,overdue});
});
const port=process.env.PORT||3000;
app.listen(port,()=>console.log(`WorkMate running at http://localhost:${port}`));
