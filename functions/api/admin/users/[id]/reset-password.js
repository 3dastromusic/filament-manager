import { hashPassword, validatePassword } from "../../../../_lib/auth.js";

export async function onRequestPost(context) {
  const db = context.env.FILAMENT_DB;
  if (!context.data.user.is_admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const id = Number(context.params.id);
  let body;
  try { body = await context.request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const password = body.password || "";
  const passwordError = validatePassword(password);
  if (passwordError) return Response.json({ error: passwordError }, { status: 400 });

  const existing = await db.prepare("SELECT id FROM users WHERE id = ?").bind(id).first();
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const passwordHash = await hashPassword(password);
  await db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").bind(passwordHash, id).run();

  // Revoke all existing sessions for that user so they're forced to log in again
  await db.prepare("DELETE FROM sessions WHERE user_id = ?").bind(id).run();

  return Response.json({ reset: true });
}
