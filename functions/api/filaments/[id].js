// PUT /api/filaments/:id - update a filament
// DELETE /api/filaments/:id - delete a filament
export async function onRequestPut(context) {
  const db = context.env.FILAMENT_DB;
  const id = context.params.id;
  const body = await context.request.json();

  await db.prepare(`
    UPDATE filaments SET
      brand = ?, material = ?, color = ?, diameter = ?,
      spool_weight = ?, remaining = ?, cost = ?,
      purchase_date = ?, opened_date = ?, storage = ?,
      temp_bed = ?, temp_nozzle = ?, notes = ?, status = ?,
      updated_at = datetime('now')
    WHERE id = ?
  `).bind(
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
    body.status || "Unopened",
    id
  ).run();

  const updated = await db.prepare(
    "SELECT * FROM filaments WHERE id = ?"
  ).bind(id).first();

  if (!updated) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json(updated);
}

export async function onRequestDelete(context) {
  const db = context.env.FILAMENT_DB;
  const id = context.params.id;

  await db.prepare("DELETE FROM filaments WHERE id = ?").bind(id).run();
  return Response.json({ deleted: true });
}
