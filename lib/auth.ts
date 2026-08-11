/* ── Admin session: password-based login + HMAC-signed cookie (Edge compatible) ──
 * ใช้ Web Crypto (crypto.subtle) เท่านั้น — รันบน Edge Runtime ได้
 */
export const SESSION_COOKIE = "commission_admin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 วัน

function secret(): string {
  return process.env.AUTH_SECRET || process.env.ADMIN_PASSWORD || "dev-only-secret-change-me";
}

export function adminPassword(): string {
  const pass = process.env.ADMIN_PASSWORD;
  if (pass) return pass;
  // ถ้าไม่ตั้ง ADMIN_PASSWORD: อนุญาตเฉพาะ dev ด้วยรหัส default
  if (process.env.NODE_ENV !== "production") return "armzlnwza007";
  return "";
}

async function hmac(data: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(now = Date.now()): Promise<string> {
  const exp = now + SESSION_TTL_MS;
  const sig = await hmac(`${exp}`);
  return `${exp}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await hmac(`${expStr}`);
  return sig === expected;
}
