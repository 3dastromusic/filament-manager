import { getSessionCookie, deleteSession, buildClearCookie } from "../../_lib/auth.js";

export async function onRequestPost(context) {
  const token = getSessionCookie(context.request);
  if (token) {
    await deleteSession(context.env.FILAMENT_DB, token);
  }
  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": buildClearCookie(),
    },
  });
}
