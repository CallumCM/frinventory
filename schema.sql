-- Users table since we don't need super secure authentication
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  created_at TEXT DEFAULT (datetime('now'))
);

-- THE frinventory
DROP TABLE IF EXISTS inventory;
CREATE TABLE inventory (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  quantity TEXT NOT NULL,
  location TEXT NOT NULL CHECK(location IN ('fridge', 'freezer', 'pantry')),
  expiry TEXT NOT NULL,
  added_at TEXT DEFAULT (datetime('now')),
  emoji TEXT,
  theme_color TEXT
);

-- Us
INSERT OR IGNORE INTO users (name) VALUES ('Callum');
INSERT OR IGNORE INTO users (name) VALUES ('Raja');
INSERT OR IGNORE INTO users (name) VALUES ('Jack');
