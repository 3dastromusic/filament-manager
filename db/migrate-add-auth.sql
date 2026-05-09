-- Migration: Add auth/multi-user support to an existing database
-- Run this ONLY if you already had data from the pre-auth version
-- For fresh installs, use schema.sql instead

-- Step 1: Create new auth tables
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Step 2: Add user_id column to existing tables
ALTER TABLE filaments ADD COLUMN user_id INTEGER;
ALTER TABLE print_logs ADD COLUMN user_id INTEGER;

-- Step 3: Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_filaments_user ON filaments(user_id);
CREATE INDEX IF NOT EXISTS idx_print_logs_user ON print_logs(user_id);

-- Step 4: After running this, sign up your first user through the app,
-- then run a final claim query to assign all existing data to that user.
-- Replace 1 below with your actual user_id (check the users table).
-- Example: UPDATE filaments SET user_id = 1 WHERE user_id IS NULL;
--          UPDATE print_logs SET user_id = 1 WHERE user_id IS NULL;
