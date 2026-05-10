-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE,
  password_hash TEXT NOT NULL,
  display_name TEXT,
  is_admin INTEGER NOT NULL DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now'))
);

-- Sessions table for login tokens
CREATE TABLE IF NOT EXISTS sessions (
  token TEXT PRIMARY KEY,
  user_id INTEGER NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  expires_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Filament Inventory Table (now per-user)
CREATE TABLE IF NOT EXISTS filaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  brand TEXT NOT NULL,
  material TEXT NOT NULL DEFAULT 'PLA',
  color TEXT NOT NULL,
  diameter REAL NOT NULL DEFAULT 1.75,
  spool_weight REAL NOT NULL DEFAULT 1000,
  remaining REAL NOT NULL DEFAULT 1000,
  cost REAL,
  purchase_date TEXT,
  opened_date TEXT,
  storage TEXT,
  temp_bed REAL,
  temp_nozzle REAL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Unopened',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Print Log Table (now per-user)
CREATE TABLE IF NOT EXISTS print_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  date TEXT NOT NULL,
  project TEXT NOT NULL,
  material TEXT NOT NULL DEFAULT 'PLA',
  filament_id INTEGER,
  weight_used REAL,
  print_time REAL,
  success TEXT NOT NULL DEFAULT 'Yes',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (filament_id) REFERENCES filaments(id) ON DELETE SET NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_filaments_user ON filaments(user_id);
CREATE INDEX IF NOT EXISTS idx_filaments_status ON filaments(status);
CREATE INDEX IF NOT EXISTS idx_filaments_material ON filaments(material);
CREATE INDEX IF NOT EXISTS idx_print_logs_user ON print_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_print_logs_date ON print_logs(date);
CREATE INDEX IF NOT EXISTS idx_print_logs_filament ON print_logs(filament_id);
