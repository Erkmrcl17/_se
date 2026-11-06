CREATE TABLE IF NOT EXISTS tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Other',
  priority TEXT NOT NULL DEFAULT 'Medium'
    CHECK (priority IN ('Low', 'Medium', 'High')),
  due_date TEXT,
  completed INTEGER NOT NULL DEFAULT 0
    CHECK (completed IN (0, 1)),
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);

INSERT INTO tasks (title, description, category, priority, due_date, completed)
SELECT 'Finish database assignment', 'Complete the SQL exercises and submit the report.', 'Assignment', 'High', date('now', '+2 days'), 0
WHERE NOT EXISTS (SELECT 1 FROM tasks);

INSERT INTO tasks (title, description, category, priority, due_date, completed)
SELECT 'Review lecture notes', 'Review this week''s lecture materials.', 'Study', 'Medium', date('now', '+4 days'), 0
WHERE (SELECT COUNT(*) FROM tasks) = 1;

INSERT INTO tasks (title, description, category, priority, due_date, completed)
SELECT 'Prepare presentation', 'Organize slides for the group presentation.', 'Project', 'Low', date('now', '+6 days'), 1
WHERE (SELECT COUNT(*) FROM tasks) = 2;
