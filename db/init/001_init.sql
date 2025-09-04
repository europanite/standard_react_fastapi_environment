-- initial table
CREATE TABLE IF NOT EXISTS ping (
  id SERIAL PRIMARY KEY,
  message TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
INSERT INTO ping (message) VALUES ('hello from postgres');
