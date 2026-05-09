export async function onRequestGet(context) {
  const db = context.env.FILAMENT_DB;
  const userId = context.data.userId;
  const { results } = await db.prepare(
    "SELECT * FROM filaments WHERE user_id = ? ORDER BY created_at DESC"
  ).bind(userId).all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const db = context.env.FILAMENT_DB;
  const userId = context.data.userId;
  const body = await context.request.json();

  const result = await db.prepare(`
    INSERT INTO filaments (user_id, brand, material, color, diameter, spool_weight, remaining, cost, purchase_date, opened_date, storage, temp_bed, temp_nozzle, notes, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    userId,
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
    "SELECT * FROM filaments WHERE id = ? AND user_id = ?"
  ).bind(result.meta.last_row_id, userId).first();

  return Response.json(inserted, { status: 201 });
}
