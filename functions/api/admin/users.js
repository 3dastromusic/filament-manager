export async function onRequestGet(context) {
  const db = context.env.FILAMENT_DB;
  if (!context.data.user.is_admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { results } = await db.prepare(`
    SELECT
      users.id, users.username, users.email, users.display_name,
      users.is_admin, users.created_at,
      (SELECT COUNT(*) FROM filaments WHERE filaments.user_id = users.id) AS filament_count,
      (SELECT COUNT(*) FROM print_logs WHERE print_logs.user_id = users.id) AS print_count
    FROM users
    ORDER BY users.created_at ASC
  `).all();
  return Response.json(results);
}
