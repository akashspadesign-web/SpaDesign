/**
 * Tiny session layer for the admin panel — one credential pair from env vars,
 * stored as an HMAC-signed HTTP-only cookie. Web Crypto only, so the same
 * verify() runs in Edge middleware and Node route handlers.
 *
 * Token shape:  base64url(JSON payload) + "." + base64url(HMAC-SHA256(payload))
 * Payload:      { sub: string; iat: number; exp: number }
 */

export const SESSION_COOKIE = "spa_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 8; // 8 hours

type Payload = { sub: string; iat: number; exp: number };

function b64urlEncode(bytes: Uint8Array): string {
  let str = "";
  for (let i = 0; i < bytes.length; i++) str += String.fromCharCode(bytes[i]);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(s: string): Uint8Array {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const base64 = (s + pad).replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(base64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

function constantTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
  return diff === 0;
}

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "SESSION_SECRET is missing or too short (need 32+ chars). See .env.example.",
    );
  }
  return secret;
}

export async function signSession(sub: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: Payload = { sub, iat: now, exp: now + SESSION_TTL_SECONDS };
  const payloadStr = JSON.stringify(payload);
  const payloadB64 = b64urlEncode(new TextEncoder().encode(payloadStr));
  const key = await hmacKey(getSecret());
  const sig = new Uint8Array(
    await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64)),
  );
  return `${payloadB64}.${b64urlEncode(sig)}`;
}

export async function verifySession(token: string | undefined | null): Promise<Payload | null> {
  if (!token || typeof token !== "string") return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payloadB64, sigB64] = parts;
  try {
    const key = await hmacKey(getSecret());
    const expected = new Uint8Array(
      await crypto.subtle.sign(
        "HMAC",
        key,
        new TextEncoder().encode(payloadB64),
      ),
    );
    const got = b64urlDecode(sigB64);
    if (!constantTimeEqual(expected, got)) return null;
    const payloadStr = new TextDecoder().decode(b64urlDecode(payloadB64));
    const payload = JSON.parse(payloadStr) as Payload;
    if (
      typeof payload?.exp !== "number" ||
      payload.exp < Math.floor(Date.now() / 1000)
    ) {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}

export function getAdminCredentials(): { email: string; password: string } {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    throw new Error(
      "ADMIN_EMAIL / ADMIN_PASSWORD must be set. See .env.example.",
    );
  }
  return { email: email.toLowerCase(), password };
}

export function checkAdminCredentials(email: string, password: string): boolean {
  const { email: expectedEmail, password: expectedPassword } =
    getAdminCredentials();
  const a = new TextEncoder().encode(`${email.toLowerCase()}\x00${password}`);
  const b = new TextEncoder().encode(`${expectedEmail}\x00${expectedPassword}`);
  return constantTimeEqual(a, b);
}

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_TTL_SECONDS,
};
