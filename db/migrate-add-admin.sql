-- Adds is_admin flag to users. Safe to run on an existing database.
ALTER TABLE users ADD COLUMN is_admin INTEGER NOT NULL DEFAULT 0;
