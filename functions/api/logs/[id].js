export async function onRequestDelete(context) {
  const db = context.env.FILAMENT_DB;
  const userId = context.data.userId;
  const id = context.params.id;

  const result = await db.prepare(
    "DELETE FROM print_logs WHERE id = ? AND user_id = ?"
  ).bind(id, userId).run();

  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ deleted: true });
}
