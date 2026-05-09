-- Filament Inventory Table
CREATE TABLE IF NOT EXISTS filaments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
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
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Print Log Table
CREATE TABLE IF NOT EXISTS print_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  project TEXT NOT NULL,
  material TEXT NOT NULL DEFAULT 'PLA',
  filament_id INTEGER,
  weight_used REAL,
  print_time REAL,
  success TEXT NOT NULL DEFAULT 'Yes',
  notes TEXT,
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (filament_id) REFERENCES filaments(id) ON DELETE SET NULL
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_filaments_status ON filaments(status);
CREATE INDEX IF NOT EXISTS idx_filaments_material ON filaments(material);
CREATE INDEX IF NOT EXISTS idx_print_logs_date ON print_logs(date);
CREATE INDEX IF NOT EXISTS idx_print_logs_filament ON print_logs(filament_id);
