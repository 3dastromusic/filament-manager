// GET /api/filaments - list all filaments
// POST /api/filaments - create a new filament
export async function onRequestGet(context) {
  const db = context.env.FILAMENT_DB;
  const { results } = await db.prepare(
    "SELECT * FROM filaments ORDER BY created_at DESC"
  ).all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const db = context.env.FILAMENT_DB;
  const body = await context.request.json();

  const stmt = db.prepare(`
    INSERT INTO filaments (brand, material, color, diameter, spool_weight, remaining, cost, purchase_date, opened_date, storage, temp_bed, temp_nozzle, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = await stmt.bind(
    body.brand,
    body.material || "PLA",
    body.color,
    body.diameter || 1.75,
    body.spool_weight || 1000,
    body.remaining || 1000,
    body.cost || null,
    body.purchase_date || null,
    body.opened_date || null,
    body.storage || null,
    body.temp_bed || null,
    body.temp_nozzle || null,
    body.notes || null,
    body.status || "Unopened"
  ).run();

  const inserted = await db.prepare(
    "SELECT * FROM filaments WHERE id = ?"
  ).bind(result.meta.last_row_id).first();

  return Response.json(inserted, { status: 201 });
}
