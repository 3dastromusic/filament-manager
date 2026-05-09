export async function onRequestGet(context) {
  const db = context.env.FILAMENT_DB;
  const userId = context.data.userId;
  const { results } = await db.prepare(
    "SELECT * FROM print_logs WHERE user_id = ? ORDER BY date DESC, created_at DESC"
  ).bind(userId).all();
  return Response.json(results);
}

export async function onRequestPost(context) {
  const db = context.env.FILAMENT_DB;
  const userId = context.data.userId;
  const body = await context.request.json();

  let filamentId = body.filament_id ? parseInt(body.filament_id) : null;
  // Verify the filament belongs to this user, otherwise null it out
  if (filamentId) {
    const owned = await db.prepare(
      "SELECT id FROM filaments WHERE id = ? AND user_id = ?"
    ).bind(filamentId, userId).first();
    if (!owned) filamentId = null;
  }

  const result = await db.prepare(`
    INSERT INTO print_logs (user_id, date, project, material, filament_id, weight_used, print_time, success, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    userId, body.date, body.project, body.material || "PLA",
    filamentId, body.weight_used || null, body.print_time || null,
    body.success || "Yes", body.notes || null
  ).run();

  // Auto-deduct weight if applicable
  if (filamentId && body.weight_used) {
    await db.prepare(`
      UPDATE filaments
      SET remaining = MAX(0, remaining - ?), updated_at = datetime('now')
      WHERE id = ? AND user_id = ?
    `).bind(body.weight_used, filamentId, userId).run();
  }

  const inserted = await db.prepare(
    "SELECT * FROM print_logs WHERE id = ? AND user_id = ?"
  ).bind(result.meta.last_row_id, userId).first();
  return Response.json(inserted, { status: 201 });
}
