export async function onRequestPut(context) {
  const db = context.env.FILAMENT_DB;
  const userId = context.data.userId;
  const id = context.params.id;
  const body = await context.request.json();

  // Verify ownership before update
  const existing = await db.prepare(
    "SELECT id FROM filaments WHERE id = ? AND user_id = ?"
  ).bind(id, userId).first();
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  await db.prepare(`
    UPDATE filaments SET
      brand = ?, material = ?, color = ?, diameter = ?,
      spool_weight = ?, remaining = ?, cost = ?,
      purchase_date = ?, opened_date = ?, storage = ?,
      temp_bed = ?, temp_nozzle = ?, notes = ?, status = ?,
      updated_at = datetime('now')
    WHERE id = ? AND user_id = ?
  `).bind(
    body.brand, body.material || "PLA", body.color, body.diameter || 1.75,
    body.spool_weight || 1000, body.remaining || 1000, body.cost || null,
    body.purchase_date || null, body.opened_date || null, body.storage || null,
    body.temp_bed || null, body.temp_nozzle || null, body.notes || null,
    body.status || "Unopened", id, userId
  ).run();

  const updated = await db.prepare(
    "SELECT * FROM filaments WHERE id = ? AND user_id = ?"
  ).bind(id, userId).first();
  return Response.json(updated);
}

export async function onRequestDelete(context) {
  const db = context.env.FILAMENT_DB;
  const userId = context.data.userId;
  const id = context.params.id;

  const result = await db.prepare(
    "DELETE FROM filaments WHERE id = ? AND user_id = ?"
  ).bind(id, userId).run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ deleted: true });
}
