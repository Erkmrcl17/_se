const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });

const validPriorities = ["Low", "Medium", "High"];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname.startsWith("/api/")) {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET, POST, PATCH, DELETE, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
          }
        });
      }

      try {
        if (!env.DB) return json({ error: "Database binding DB is missing." }, 500);

        if (url.pathname === "/api/tasks" && request.method === "GET") {
          const { results } = await env.DB.prepare(
            "SELECT * FROM tasks ORDER BY completed ASC, due_date IS NULL, due_date ASC, id DESC"
          ).all();
          return json(results);
        }

        if (url.pathname === "/api/tasks" && request.method === "POST") {
          const body = await request.json();
          const title = String(body.title || "").trim();
          if (!title) return json({ error: "Task title is required." }, 400);

          const priority = validPriorities.includes(body.priority) ? body.priority : "Medium";
          const result = await env.DB.prepare(
            `INSERT INTO tasks (title, description, category, priority, due_date)
             VALUES (?, ?, ?, ?, ?)`
          ).bind(
            title,
            String(body.description || "").trim(),
            String(body.category || "Other"),
            priority,
            body.due_date || null
          ).run();

          const task = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?")
            .bind(result.meta.last_row_id).first();
          return json(task, 201);
        }

        const match = url.pathname.match(/^\/api\/tasks\/(\d+)$/);
        if (match) {
          const id = Number(match[1]);
          if (request.method === "PATCH") {
            const body = await request.json();
            const current = await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
            if (!current) return json({ error: "Task not found." }, 404);

            const title = body.title === undefined ? current.title : String(body.title).trim();
            if (!title) return json({ error: "Task title is required." }, 400);
            const description = body.description === undefined ? current.description : String(body.description);
            const category = body.category === undefined ? current.category : String(body.category);
            const priority = body.priority === undefined ? current.priority :
              (validPriorities.includes(body.priority) ? body.priority : current.priority);
            const dueDate = body.due_date === undefined ? current.due_date : (body.due_date || null);
            const completed = body.completed === undefined ? current.completed : (body.completed ? 1 : 0);

            await env.DB.prepare(
              `UPDATE tasks SET title = ?, description = ?, category = ?, priority = ?,
               due_date = ?, completed = ? WHERE id = ?`
            ).bind(title, description, category, priority, dueDate, completed, id).run();

            return json(await env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first());
          }

          if (request.method === "DELETE") {
            const result = await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
            if (!result.meta.changes) return json({ error: "Task not found." }, 404);
            return json({ success: true });
          }
        }

        return json({ error: "API route not found." }, 404);
      } catch (error) {
        return json({ error: "Server error.", detail: error.message }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  }
};
