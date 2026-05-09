// Middleware that runs for every /api/* request
// Checks session cookie, attaches user info to context.data
// Allows /api/auth/* routes through unauthenticated

import { getSessionCookie, getUserFromToken } from "../_lib/auth.js";

export async function onRequest(context) {
  const url = new URL(context.request.url);

  // Auth endpoints don't require an existing session
  if (url.pathname.startsWith("/api/auth/")) {
    return context.next();
  }

  const token = getSessionCookie(context.request);
  const user = await getUserFromToken(context.env.FILAMENT_DB, token);

  if (!user) {
    return Response.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
  }

  // Attach user info to context for downstream handlers
  context.data = context.data || {};
  context.data.user = user;
  context.data.userId = user.id;

  return context.next();
}
