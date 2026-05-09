import { verifyPassword, createSession, buildSessionCookie } from "../../_lib/auth.js";

export async function onRequestPost(context) {
  const db = context.env.FILAMENT_DB;
  let body;
  try { body = await context.request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const username = (body.username || "").trim();
  const password = body.password || "";

  if (!username || !password) {
    return Response.json({ error: "Username and password are required" }, { status: 400 });
  }

  const user = await db.prepare(
    "SELECT id, username, email, display_name, password_hash FROM users WHERE username = ?"
  ).bind(username).first();

  // Same response for missing user vs wrong password to avoid user enumeration
  if (!user) {
    return Response.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const ok = await verifyPassword(password, user.password_hash);
  if (!ok) {
    return Response.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = await createSession(db, user.id);

  return new Response(
    JSON.stringify({
      user: {
        id: user.id, username: user.username,
        email: user.email, display_name: user.display_name
      }
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSessionCookie(token),
      },
    }
  );
}
