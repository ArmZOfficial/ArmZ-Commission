/* ── Content store: Upstash Redis REST (edge compatible) พร้อม in-memory fallback ──
 * ถ้าไม่ตั้ง UPSTASH_REDIS_REST_URL / TOKEN จะใช้ Map ในหน่วยความจำ (เหมาะกับ dev)
 * ทุกฟังก์ชันเป็น async และใช้ได้ทั้ง Edge Runtime และ Node runtime
 *
 * หมายเหตุการทำงานใน dev (ไม่มี Redis):
 * - Map เก็บไว้บน globalThis → route handler (หน้า Admin) และ server component
 *   (หน้าเว็บ) แชร์ข้อมูลชุดเดียวกัน แก้ที่ Admin แล้วหน้าเว็บเห็นผลทันที
 * - เก็บสำรองลงไฟล์ .data/store.json (dev เท่านั้น) → ข้อมูลไม่หายแม้รีสตาร์ทเซิร์ฟเวอร์
 */
import { promises as fs } from "node:fs";
import path from "node:path";
import { Redis } from "@upstash/redis";

let client: Redis | null | undefined;

function redis(): Redis | null {
  if (client !== undefined) return client;
  // รองรับทั้ง Upstash Redis และ Vercel KV (เป็น Upstash เหมือนกัน)
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  client = url && token ? new Redis({ url, token }) : null;
  if (!client) {
    console.warn(
      "[content-store] ไม่พบ UPSTASH_REDIS_REST_URL/TOKEN (หรือ KV_REST_API_URL/TOKEN) — ใช้ in-memory fallback " +
        "(production: แต่ละ serverless instance มีหน่วยความจำแยกกัน → Admin บันทึกแล้วหน้าเว็บอาจไม่เห็นผลทันที " +
        "ให้เชื่อม Upstash Redis ในการตั้งค่า Vercel)"
    );
  }
  return client;
}

/* ── in-memory fallback ────────────────────────────────────────────────
 * ใช้ globalThis แทน module-level Map เพราะ Next.js (โดยเฉพาะ dev) bundle
 * route handler กับ server component แยกกัน → module state ไม่แชร์กัน
 * globalThis เป็นของ process เดียวกัน จึงแชร์ได้จริง และยังรอด HMR/recompile
 */
const GLOBAL_KEY = "__freebuff_content_store_v1__";

function memoryStore(): Map<string, string> {
  const g = globalThis as unknown as Record<string, Map<string, string> | undefined>;
  let m = g[GLOBAL_KEY];
  if (!m) {
    m = new Map<string, string>();
    g[GLOBAL_KEY] = m;
  }
  return m;
}

/* ไฟล์สำรองเฉพาะ dev — กันข้อมูลหายเมื่อรีสตาร์ท dev server
 * (production ไม่มี fs ถาวร แต่ก็ไม่ถูกใช้เพราะ production บังคับ Redis)
 */
const DEV_FILE = path.join(process.cwd(), ".data", "store.json");

async function loadDevFile(): Promise<void> {
  if (redis()) return; // มี Redis จริง → ไม่ใช้ไฟล์
  if (memoryStore().size > 0) return; // โหลดแล้ว
  try {
    const raw = await fs.readFile(DEV_FILE, "utf8");
    const parsed = JSON.parse(raw) as Record<string, string>;
    for (const [k, v] of Object.entries(parsed)) {
      memoryStore().set(k, v);
    }
  } catch {
    // ยังไม่มีไฟล์ → เริ่มต้นว่าง (ครั้งแรกจะค่อยๆ seed)
  }
}

async function persistDevFile(): Promise<void> {
  if (redis()) return; // มี Redis จริง → ไม่ต้องเขียนไฟล์
  try {
    await fs.mkdir(path.dirname(DEV_FILE), { recursive: true });
    await fs.writeFile(DEV_FILE, JSON.stringify(Object.fromEntries(memoryStore())), "utf8");
  } catch (e) {
    console.error("[content-store] เขียนไฟล์สำรอง .data/store.json ล้มเหลว:", e);
  }
}

export async function getRaw(key: string): Promise<string | null> {
  const r = redis();
  if (r) {
    try {
      const v = await r.get<unknown>(key);
      if (v === null || v === undefined) return null;
      // สำคัญ: @upstash/redis auto-deserialize ค่า JSON ที่อ่านกลับมา
      // (ถ้าเก็บ string ที่เป็น JSON ไว้ จะได้ object/array คืนมา ไม่ใช่ string)
      // ถ้าส่ง object นั้นต่อไป JSON.parse ใน getJson จะ throw → ข้อมูลที่บันทึกถูกมองว่า "ไม่มี"
      // → หน้าเว็บแสดงค่า default เสมอ (บั๊กที่ทำให้ "แก้แล้วไม่ขึ้น")
      if (typeof v === "string") return v;
      return JSON.stringify(v);
    } catch (e) {
      console.error(`[content-store] Redis GET ${key} ล้มเหลว:`, e);
      return null;
    }
  }
  await loadDevFile();
  return memoryStore().get(key) ?? null;
}

/** บันทึกสำเร็จจริงไหม (false = Redis เขียนไม่ได้) — ใช้กับ API ที่ต้องรู้ผลเพื่อแจ้งผู้ใช้ */
export async function setRaw(key: string, value: string): Promise<boolean> {
  const r = redis();
  if (r) {
    try {
      await r.set(key, value);
      return true;
    } catch (e) {
      console.error(`[content-store] Redis SET ${key} ล้มเหลว:`, e);
      return false;
    }
  }
  memoryStore().set(key, value);
  await persistDevFile();
  return true;
}

/** ตรวจว่ามี Redis จริง (ไม่ใช่ in-memory fallback) — production ที่ไม่เชื่อม Upstash จะใช้กันแก้ไม่เห็นผล */
export function isRedisConnected(): boolean {
  return redis() !== null;
}

export async function del(key: string): Promise<void> {
  const r = redis();
  if (r) {
    try {
      await r.del(key);
      return;
    } catch (e) {
      console.error(`[content-store] Redis DEL ${key} ล้มเหลว:`, e);
      return;
    }
  }
  memoryStore().delete(key);
  await persistDevFile();
}

export async function getJson<T>(key: string): Promise<T | null> {
  const raw = await getRaw(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJson(key: string, value: unknown): Promise<boolean> {
  return setRaw(key, JSON.stringify(value));
}
