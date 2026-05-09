// DELETE /api/logs/:id - delete a print log
export async function onRequestDelete(context) {
  const db = context.env.FILAMENT_DB;
  const id = context.params.id;

  await db.prepare("DELETE FROM print_logs WHERE id = ?").bind(id).run();
  return Response.json({ deleted: true });
}
