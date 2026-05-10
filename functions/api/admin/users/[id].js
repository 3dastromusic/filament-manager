export async function onRequestDelete(context) {
  const db = context.env.FILAMENT_DB;
  if (!context.data.user.is_admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const id = Number(context.params.id);
  if (id === context.data.userId) {
    return Response.json({ error: "You can't delete your own account" }, { status: 400 });
  }

  const result = await db.prepare("DELETE FROM users WHERE id = ?").bind(id).run();
  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({ deleted: true });
}

export async function onRequestPatch(context) {
  const db = context.env.FILAMENT_DB;
  if (!context.data.user.is_admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const id = Number(context.params.id);
  let body;
  try { body = await context.request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  if (typeof body.is_admin !== "boolean" && body.is_admin !== 0 && body.is_admin !== 1) {
    return Response.json({ error: "is_admin (boolean) is required" }, { status: 400 });
  }
  const flag = body.is_admin ? 1 : 0;

  if (id === context.data.userId && flag === 0) {
    return Response.json({ error: "You can't remove your own admin access" }, { status: 400 });
  }

  const result = await db.prepare(
    "UPDATE users SET is_admin = ? WHERE id = ?"
  ).bind(flag, id).run();
  if (result.meta.changes === 0) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await db.prepare(
    "SELECT id, username, email, display_name, is_admin, created_at FROM users WHERE id = ?"
  ).bind(id).first();
  return Response.json(updated);
}
