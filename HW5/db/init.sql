
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO messages (message)
VALUES
    ('Docker container is running'),
    ('Node.js API is ready'),
    ('PostgreSQL database is connected');
