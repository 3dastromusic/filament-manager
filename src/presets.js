// Bambu Lab filament catalog with mid-range printing parameters
// Temps are sensible defaults from Bambu Lab's official specs (mid-range of recommended)
// Prices are approximate USD retail (single 1kg spool, before bulk discount)
// Verify current prices at https://us.store.bambulab.com

export const BAMBU_PRESETS = [
  // PLA Series
  { name: "PLA Basic",         material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 22.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Matte",         material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 55, temp_nozzle: 220 },
  { name: "PLA Silk+",         material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 35, temp_nozzle: 230 },
  { name: "PLA Silk Multi-Color", material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 39.99, temp_bed: 35, temp_nozzle: 230 },
  { name: "PLA Translucent",   material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Tough",         material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Tough+",        material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 27.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Aero",          material: "PLA",      diameter: "1.75", spool_weight: 500,  cost: 34.99, temp_bed: 35, temp_nozzle: 220 },
  { name: "PLA Glow",          material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Sparkle",       material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Marble",        material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Wood",          material: "Wood PLA", diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Metal",         material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Galaxy",        material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA Dynamic",       material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "PLA-CF",            material: "CF-PLA",   diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 60, temp_nozzle: 230 },
  { name: "PLA-GF",            material: "CF-PLA",   diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 60, temp_nozzle: 230 },

  // PETG Series
  { name: "PETG Basic",        material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 70, temp_nozzle: 250 },
  { name: "PETG HF",           material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 70, temp_nozzle: 245 },
  { name: "PETG Translucent",  material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 70, temp_nozzle: 250 },
  { name: "PETG-CF",           material: "CF-PETG",  diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 70, temp_nozzle: 270 },

  // ABS / ASA
  { name: "ABS",               material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 90,  temp_nozzle: 260 },
  { name: "ABS-GF",            material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 31.99, temp_bed: 100, temp_nozzle: 270 },
  { name: "ASA",               material: "ASA",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 90,  temp_nozzle: 260 },
  { name: "ASA-CF",            material: "ASA",      diameter: "1.75", spool_weight: 1000, cost: 31.99, temp_bed: 100, temp_nozzle: 270 },
  { name: "ASA Aero",          material: "ASA",      diameter: "1.75", spool_weight: 500,  cost: 34.99, temp_bed: 90,  temp_nozzle: 260 },

  // TPU
  { name: "TPU 95A",           material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "TPU 95A HF",        material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 230 },
  { name: "TPU 85A",           material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 39.99, temp_bed: 45, temp_nozzle: 220 },
  { name: "TPU for AMS",       material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },

  // PC
  { name: "PC",                material: "PC",       diameter: "1.75", spool_weight: 1000, cost: 39.99, temp_bed: 100, temp_nozzle: 270 },
  { name: "PC FR",             material: "PC",       diameter: "1.75", spool_weight: 1000, cost: 49.99, temp_bed: 100, temp_nozzle: 270 },

  // PA (Nylon)
  { name: "PA-CF",             material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  { name: "PA6-CF",            material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  { name: "PA6-GF",            material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  { name: "PAHT-CF",           material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  { name: "PAHT-GF",           material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },

  // PET
  { name: "PET-CF",            material: "Other",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 290 },
  { name: "PET-GF",            material: "Other",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 290 },

  // Support
  { name: "Support for PLA",   material: "Other",    diameter: "1.75", spool_weight: 500,  cost: 24.99, temp_bed: 35, temp_nozzle: 215 },
  { name: "Support for PA/PET",material: "Other",    diameter: "1.75", spool_weight: 500,  cost: 34.99, temp_bed: 80, temp_nozzle: 270 },
  { name: "PVA",               material: "PVA",      diameter: "1.75", spool_weight: 500,  cost: 39.99, temp_bed: 45, temp_nozzle: 215 },
];

// Common Bambu Lab official colors for quick selection
export const BAMBU_COLORS = [
  "Jade White", "Beige", "Cocoa Brown", "Bronze", "Gold", "Yellow", "Sunflower Yellow",
  "Pumpkin Orange", "Orange", "Red", "Magenta", "Hot Pink", "Pink", "Maroon Red",
  "Bambu Green", "Mistletoe Green", "Pine Green", "Mint", "Dark Green",
  "Cyan", "Sky Blue", "Blue", "Cobalt Blue", "Indigo Purple", "Purple",
  "Black", "Dark Gray", "Gray", "Silver", "White", "Matte Black", "Matte White",
  "Gradient", "Galaxy Black", "Galaxy Purple", "Glow Green", "Glow Blue",
];
