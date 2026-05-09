// GET /api/logs - list all print logs
// POST /api/logs - create a new print log
export async function onRequestGet(context) {
  const db = context.env.FILAMENT_DB;
  const { results } = await db.prepare(
    "SELECT * FROM print_logs ORDER BY date DESC, created_at DESC"
  ).all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const db = context.env.FILAMENT_DB;
  const body = await context.request.json();

  const stmt = db.prepare(`
    INSERT INTO print_logs (date, project, material, filament_id, weight_used, print_time, success, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const filamentId = body.filament_id ? parseInt(body.filament_id) : null;

  const result = await stmt.bind(
    body.date,
    body.project,
    body.material || "PLA",
    filamentId,
    body.weight_used || null,
    body.print_time || null,
    body.success || "Yes",
    body.notes || null
  ).run();

  // If a filament was selected and weight was used, auto-deduct from remaining
  if (filamentId && body.weight_used) {
    await db.prepare(`
      UPDATE filaments
      SET remaining = MAX(0, remaining - ?), updated_at = datetime('now')
      WHERE id = ?
    `).bind(body.weight_used, filamentId).run();
  }

  const inserted = await db.prepare(
    "SELECT * FROM print_logs WHERE id = ?"
  ).bind(result.meta.last_row_id).first();

  return Response.json(inserted, { status: 201 });
}
