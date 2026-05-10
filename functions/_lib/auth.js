// Auth utilities - password hashing, session tokens, cookies
// Uses Web Crypto API (built into Cloudflare Workers)

const SESSION_DAYS = 30;
const COOKIE_NAME = "fm_session";

// PBKDF2 password hashing
export async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial, 256
  );
  return `${b64(salt)}.${b64(new Uint8Array(bits))}`;
}

export async function verifyPassword(password, stored) {
  if (!stored || !stored.includes(".")) return false;
  const [saltB64, hashB64] = stored.split(".");
  const salt = unB64(saltB64);
  const expected = unB64(hashB64);
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw", enc.encode(password), "PBKDF2", false, ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
    keyMaterial, 256
  );
  const actual = new Uint8Array(bits);
  if (actual.length !== expected.length) return false;
  // constant-time compare
  let mismatch = 0;
  for (let i = 0; i < actual.length; i++) mismatch |= actual[i] ^ expected[i];
  return mismatch === 0;
}

// Session token: random 256 bits, base64url
export function generateSessionToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  return b64url(bytes);
}

// Create a session row in the DB and return the token
export async function createSession(db, userId) {
  const token = generateSessionToken();
  const expires = new Date(Date.now() + SESSION_DAYS * 24 * 3600 * 1000).toISOString();
  await db.prepare(
    "INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)"
  ).bind(token, userId, expires).run();
  return token;
}

export async function deleteSession(db, token) {
  await db.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
}

// Look up the user for a given session token; returns null if invalid/expired
export async function getUserFromToken(db, token) {
  if (!token) return null;
  const row = await db.prepare(`
    SELECT users.id as id, users.username, users.email, users.display_name, users.is_admin
    FROM sessions
    JOIN users ON users.id = sessions.user_id
    WHERE sessions.token = ? AND sessions.expires_at > datetime('now')
  `).bind(token).first();
  return row || null;
}

// Cookie helpers
export function getSessionCookie(request) {
  const cookieHeader = request.headers.get("Cookie") || "";
  const parts = cookieHeader.split(";").map(s => s.trim());
  for (const p of parts) {
    if (p.startsWith(COOKIE_NAME + "=")) {
      return p.substring(COOKIE_NAME.length + 1);
    }
  }
  return null;
}

export function buildSessionCookie(token, days = SESSION_DAYS) {
  const maxAge = days * 24 * 3600;
  return `${COOKIE_NAME}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

export function buildClearCookie() {
  return `${COOKIE_NAME}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax`;
}

// Validation helpers
export function validateUsername(u) {
  if (!u || typeof u !== "string") return "Username is required";
  if (u.length < 3) return "Username must be at least 3 characters";
  if (u.length > 32) return "Username must be 32 characters or less";
  if (!/^[a-zA-Z0-9_-]+$/.test(u)) return "Username can only contain letters, numbers, _ and -";
  return null;
}

export function validatePassword(p) {
  if (!p || typeof p !== "string") return "Password is required";
  if (p.length < 8) return "Password must be at least 8 characters";
  if (p.length > 200) return "Password is too long";
  return null;
}

// Base64 helpers
function b64(bytes) {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}
function unB64(s) {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}
function b64url(bytes) {
  return b64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
