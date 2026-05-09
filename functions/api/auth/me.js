import { getSessionCookie, getUserFromToken } from "../../_lib/auth.js";

export async function onRequestGet(context) {
  const token = getSessionCookie(context.request);
  const user = await getUserFromToken(context.env.FILAMENT_DB, token);
  if (!user) {
    return Response.json({ user: null }, { status: 200 });
  }
  return Response.json({ user });
}
