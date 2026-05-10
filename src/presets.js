// Multi-brand filament catalog with mid-range printing parameters.
// Temps are sensible defaults from each vendor's official specs (mid-range of recommended).
// Prices are approximate USD retail (single 1kg spool unless noted, before bulk discount).
// Verify current pricing on each vendor's site before relying on it for cost tracking.

export const BRANDS = [
  "Bambu Lab", "SUNLU", "Polymaker", "eSun", "Overture", "MatterHackers", "Hatchbox",
];

export const PRESETS = [
  // ====== Bambu Lab ======
  // PLA Series
  { brand: "Bambu Lab", name: "PLA Basic",         material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 22.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Matte",         material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 55, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Silk+",         material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 35, temp_nozzle: 230 },
  { brand: "Bambu Lab", name: "PLA Silk Multi-Color", material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 39.99, temp_bed: 35, temp_nozzle: 230 },
  { brand: "Bambu Lab", name: "PLA Translucent",   material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Tough",         material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Tough+",        material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 27.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Aero",          material: "PLA",      diameter: "1.75", spool_weight: 500,  cost: 34.99, temp_bed: 35, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Glow",          material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Sparkle",       material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Marble",        material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Wood",          material: "Wood PLA", diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Metal",         material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Galaxy",        material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA Dynamic",       material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "PLA-CF",            material: "CF-PLA",   diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 60, temp_nozzle: 230 },
  { brand: "Bambu Lab", name: "PLA-GF",            material: "CF-PLA",   diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 60, temp_nozzle: 230 },
  // PETG
  { brand: "Bambu Lab", name: "PETG Basic",        material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 70, temp_nozzle: 250 },
  { brand: "Bambu Lab", name: "PETG HF",           material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 70, temp_nozzle: 245 },
  { brand: "Bambu Lab", name: "PETG Translucent",  material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 70, temp_nozzle: 250 },
  { brand: "Bambu Lab", name: "PETG-CF",           material: "CF-PETG",  diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 70, temp_nozzle: 270 },
  // ABS / ASA
  { brand: "Bambu Lab", name: "ABS",               material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 90,  temp_nozzle: 260 },
  { brand: "Bambu Lab", name: "ABS-GF",            material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 31.99, temp_bed: 100, temp_nozzle: 270 },
  { brand: "Bambu Lab", name: "ASA",               material: "ASA",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 90,  temp_nozzle: 260 },
  { brand: "Bambu Lab", name: "ASA-CF",            material: "ASA",      diameter: "1.75", spool_weight: 1000, cost: 31.99, temp_bed: 100, temp_nozzle: 270 },
  { brand: "Bambu Lab", name: "ASA Aero",          material: "ASA",      diameter: "1.75", spool_weight: 500,  cost: 34.99, temp_bed: 90,  temp_nozzle: 260 },
  // TPU
  { brand: "Bambu Lab", name: "TPU 95A",           material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "TPU 95A HF",        material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 230 },
  { brand: "Bambu Lab", name: "TPU 85A",           material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 39.99, temp_bed: 45, temp_nozzle: 220 },
  { brand: "Bambu Lab", name: "TPU for AMS",       material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 34.99, temp_bed: 45, temp_nozzle: 220 },
  // PC
  { brand: "Bambu Lab", name: "PC",                material: "PC",       diameter: "1.75", spool_weight: 1000, cost: 39.99, temp_bed: 100, temp_nozzle: 270 },
  { brand: "Bambu Lab", name: "PC FR",             material: "PC",       diameter: "1.75", spool_weight: 1000, cost: 49.99, temp_bed: 100, temp_nozzle: 270 },
  // Nylon
  { brand: "Bambu Lab", name: "PA-CF",             material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  { brand: "Bambu Lab", name: "PA6-CF",            material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  { brand: "Bambu Lab", name: "PA6-GF",            material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  { brand: "Bambu Lab", name: "PAHT-CF",           material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  { brand: "Bambu Lab", name: "PAHT-GF",           material: "Nylon",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 280 },
  // PET
  { brand: "Bambu Lab", name: "PET-CF",            material: "Other",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 290 },
  { brand: "Bambu Lab", name: "PET-GF",            material: "Other",    diameter: "1.75", spool_weight: 1000, cost: 65.99, temp_bed: 90, temp_nozzle: 290 },
  // Support
  { brand: "Bambu Lab", name: "Support for PLA",   material: "Other",    diameter: "1.75", spool_weight: 500,  cost: 24.99, temp_bed: 35, temp_nozzle: 215 },
  { brand: "Bambu Lab", name: "Support for PA/PET",material: "Other",    diameter: "1.75", spool_weight: 500,  cost: 34.99, temp_bed: 80, temp_nozzle: 270 },
  { brand: "Bambu Lab", name: "PVA",               material: "PVA",      diameter: "1.75", spool_weight: 500,  cost: 39.99, temp_bed: 45, temp_nozzle: 215 },

  // ====== SUNLU ======
  { brand: "SUNLU", name: "PLA",               material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 14.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "SUNLU", name: "PLA+",              material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 17.99, temp_bed: 50, temp_nozzle: 220 },
  { brand: "SUNLU", name: "PLA Meta",          material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 215 },
  { brand: "SUNLU", name: "PLA Matte",         material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "SUNLU", name: "PLA Silk",          material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 215 },
  { brand: "SUNLU", name: "PLA Marble",        material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "SUNLU", name: "PLA Wood",          material: "Wood PLA", diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "SUNLU", name: "PLA Glow",          material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "SUNLU", name: "PLA Rainbow",       material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "SUNLU", name: "PLA-CF",            material: "CF-PLA",   diameter: "1.75", spool_weight: 1000, cost: 25.99, temp_bed: 55, temp_nozzle: 220 },
  { brand: "SUNLU", name: "PETG",              material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 17.99, temp_bed: 80, temp_nozzle: 235 },
  { brand: "SUNLU", name: "PETG Silk",         material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 80, temp_nozzle: 235 },
  { brand: "SUNLU", name: "ABS",               material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 19.99, temp_bed: 100, temp_nozzle: 240 },
  { brand: "SUNLU", name: "TPU 95A",           material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 19.99, temp_bed: 50, temp_nozzle: 220 },

  // ====== Polymaker ======
  { brand: "Polymaker", name: "PolyTerra PLA",       material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 22.99, temp_bed: 55, temp_nozzle: 210 },
  { brand: "Polymaker", name: "PolyTerra Matte PLA", material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 22.99, temp_bed: 55, temp_nozzle: 210 },
  { brand: "Polymaker", name: "PolyLite PLA",        material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 22.99, temp_bed: 60, temp_nozzle: 210 },
  { brand: "Polymaker", name: "PolyLite PLA PRO",    material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 29.99, temp_bed: 60, temp_nozzle: 220 },
  { brand: "Polymaker", name: "PolyLite Silk PLA",   material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 27.99, temp_bed: 60, temp_nozzle: 215 },
  { brand: "Polymaker", name: "PolyLite PETG",       material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 23.99, temp_bed: 80, temp_nozzle: 240 },
  { brand: "Polymaker", name: "PolyLite ABS",        material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 29.99, temp_bed: 90, temp_nozzle: 250 },
  { brand: "Polymaker", name: "PolyLite ASA",        material: "ASA",      diameter: "1.75", spool_weight: 1000, cost: 29.99, temp_bed: 90, temp_nozzle: 240 },
  { brand: "Polymaker", name: "PolyMax PLA",         material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 31.99, temp_bed: 60, temp_nozzle: 220 },
  { brand: "Polymaker", name: "PolyMax PC",          material: "PC",       diameter: "1.75", spool_weight: 1000, cost: 49.99, temp_bed: 100, temp_nozzle: 270 },
  { brand: "Polymaker", name: "PolyFlex TPU 95A",    material: "TPU",      diameter: "1.75", spool_weight: 750,  cost: 34.99, temp_bed: 50, temp_nozzle: 225 },
  { brand: "Polymaker", name: "PolyFlex TPU 90A",    material: "TPU",      diameter: "1.75", spool_weight: 750,  cost: 39.99, temp_bed: 50, temp_nozzle: 220 },
  { brand: "Polymaker", name: "PolyMide CoPA",       material: "Nylon",    diameter: "1.75", spool_weight: 750,  cost: 59.99, temp_bed: 100, temp_nozzle: 255 },
  { brand: "Polymaker", name: "PolyMide PA6-CF",     material: "Nylon",    diameter: "1.75", spool_weight: 500,  cost: 69.99, temp_bed: 90, temp_nozzle: 280 },

  // ====== eSun ======
  { brand: "eSun", name: "PLA",          material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 14.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "eSun", name: "PLA+",         material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 17.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "eSun", name: "ePLA-Matte",   material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "eSun", name: "ePLA-Silk",    material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 215 },
  { brand: "eSun", name: "eSilk PLA",    material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 220 },
  { brand: "eSun", name: "ePLA-Wood",    material: "Wood PLA", diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 210 },
  { brand: "eSun", name: "PETG",         material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 17.99, temp_bed: 80, temp_nozzle: 240 },
  { brand: "eSun", name: "ABS+",         material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 19.99, temp_bed: 100, temp_nozzle: 250 },
  { brand: "eSun", name: "TPU 95A",      material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 50, temp_nozzle: 220 },

  // ====== Overture ======
  { brand: "Overture", name: "PLA",       material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 17.99, temp_bed: 60, temp_nozzle: 210 },
  { brand: "Overture", name: "PLA+",      material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 60, temp_nozzle: 220 },
  { brand: "Overture", name: "Matte PLA", material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 22.99, temp_bed: 60, temp_nozzle: 210 },
  { brand: "Overture", name: "Silk PLA",  material: "Silk PLA", diameter: "1.75", spool_weight: 1000, cost: 22.99, temp_bed: 60, temp_nozzle: 220 },
  { brand: "Overture", name: "PETG",      material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 19.99, temp_bed: 80, temp_nozzle: 240 },
  { brand: "Overture", name: "ABS",       material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 100, temp_nozzle: 240 },
  { brand: "Overture", name: "TPU",       material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 50, temp_nozzle: 220 },

  // ====== MatterHackers ======
  { brand: "MatterHackers", name: "Build Series PLA",        material: "PLA",   diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 60, temp_nozzle: 210 },
  { brand: "MatterHackers", name: "Build Series PETG",       material: "PETG",  diameter: "1.75", spool_weight: 1000, cost: 27.99, temp_bed: 80, temp_nozzle: 240 },
  { brand: "MatterHackers", name: "Build Series ABS",        material: "ABS",   diameter: "1.75", spool_weight: 1000, cost: 27.99, temp_bed: 110, temp_nozzle: 240 },
  { brand: "MatterHackers", name: "PRO Series PLA",          material: "PLA",   diameter: "1.75", spool_weight: 1000, cost: 49.99, temp_bed: 60, temp_nozzle: 210 },
  { brand: "MatterHackers", name: "PRO Series Tough PLA",    material: "PLA+",  diameter: "1.75", spool_weight: 1000, cost: 54.99, temp_bed: 60, temp_nozzle: 220 },
  { brand: "MatterHackers", name: "PRO Series PETG",         material: "PETG",  diameter: "1.75", spool_weight: 1000, cost: 44.99, temp_bed: 80, temp_nozzle: 240 },
  { brand: "MatterHackers", name: "PRO Series ABS",          material: "ABS",   diameter: "1.75", spool_weight: 1000, cost: 44.99, temp_bed: 110, temp_nozzle: 240 },
  { brand: "MatterHackers", name: "PRO Series Nylon",        material: "Nylon", diameter: "1.75", spool_weight: 1000, cost: 94.99, temp_bed: 75, temp_nozzle: 240 },
  { brand: "MatterHackers", name: "PRO Series TPU",          material: "TPU",   diameter: "1.75", spool_weight: 1000, cost: 59.99, temp_bed: 50, temp_nozzle: 235 },
  { brand: "MatterHackers", name: "NylonX",                  material: "Nylon", diameter: "1.75", spool_weight: 500,  cost: 94.99, temp_bed: 90, temp_nozzle: 250 },
  { brand: "MatterHackers", name: "NylonG",                  material: "Nylon", diameter: "1.75", spool_weight: 500,  cost: 69.99, temp_bed: 90, temp_nozzle: 250 },

  // ====== Hatchbox ======
  { brand: "Hatchbox", name: "PLA",      material: "PLA",      diameter: "1.75", spool_weight: 1000, cost: 21.99, temp_bed: 60, temp_nozzle: 210 },
  { brand: "Hatchbox", name: "PLA+",     material: "PLA+",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 60, temp_nozzle: 220 },
  { brand: "Hatchbox", name: "Wood PLA", material: "Wood PLA", diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 60, temp_nozzle: 210 },
  { brand: "Hatchbox", name: "PETG",     material: "PETG",     diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 80, temp_nozzle: 240 },
  { brand: "Hatchbox", name: "ABS",      material: "ABS",      diameter: "1.75", spool_weight: 1000, cost: 24.99, temp_bed: 100, temp_nozzle: 240 },
  { brand: "Hatchbox", name: "TPU",      material: "TPU",      diameter: "1.75", spool_weight: 1000, cost: 27.99, temp_bed: 50, temp_nozzle: 220 },
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

// Backward-compat alias for any importer still using the old name
export const BAMBU_PRESETS = PRESETS.filter(p => p.brand === "Bambu Lab");
