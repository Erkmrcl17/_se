
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const pool = new Pool({
  host: process.env.DB_HOST || "db",
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_NAME || "se_project",
  user: process.env.DB_USER || "se_user",
  password: process.env.DB_PASSWORD || "se_password"
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({
      status: "ok",
      service: "Node.js API",
      database: "connected"
    });
  } catch (error) {
    res.status(503).json({
      status: "error",
      service: "Node.js API",
      database: "disconnected"
    });
  }
});

app.get("/api/messages", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, message, created_at FROM messages ORDER BY id"
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Failed to fetch messages:", error.message);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

app.listen(port, "0.0.0.0", () => {
  console.log(`API server running on port ${port}`);
});
