import {
  hashPassword, validateUsername, validatePassword,
  createSession, buildSessionCookie
} from "../../_lib/auth.js";

export async function onRequestPost(context) {
  const db = context.env.FILAMENT_DB;
  let body;
  try { body = await context.request.json(); }
  catch { return Response.json({ error: "Invalid JSON" }, { status: 400 }); }

  const username = (body.username || "").trim();
  const password = body.password || "";
  const email = (body.email || "").trim() || null;
  const displayName = (body.display_name || "").trim() || username;

  // Validate
  const usernameError = validateUsername(username);
  if (usernameError) return Response.json({ error: usernameError }, { status: 400 });

  const passwordError = validatePassword(password);
  if (passwordError) return Response.json({ error: passwordError }, { status: 400 });

  // Check uniqueness
  const existing = await db.prepare(
    "SELECT id FROM users WHERE username = ?"
  ).bind(username).first();
  if (existing) return Response.json({ error: "Username already taken" }, { status: 409 });

  if (email) {
    const existingEmail = await db.prepare(
      "SELECT id FROM users WHERE email = ?"
    ).bind(email).first();
    if (existingEmail) return Response.json({ error: "Email already in use" }, { status: 409 });
  }

  // Create user
  const passwordHash = await hashPassword(password);
  const result = await db.prepare(`
    INSERT INTO users (username, email, password_hash, display_name)
    VALUES (?, ?, ?, ?)
  `).bind(username, email, passwordHash, displayName).run();

  const userId = result.meta.last_row_id;
  const token = await createSession(db, userId);

  return new Response(
    JSON.stringify({
      user: { id: userId, username, email, display_name: displayName, is_admin: 0 }
    }),
    {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": buildSessionCookie(token),
      },
    }
  );
}
