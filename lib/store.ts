/* ── Content store: Upstash Redis REST (edge compatible) พร้อม in-memory fallback ──
 * ถ้าไม่ตั้ง UPSTASH_REDIS_REST_URL / TOKEN จะใช้ Map ในหน่วยความจำ (เหมาะกับ dev)
 * ทุกฟังก์ชันเป็น async และใช้ได้ทั้ง Edge Runtime และ Node runtime
 */
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

const memory = new Map<string, string>();

export async function getRaw(key: string): Promise<string | null> {
  const r = redis();
  if (r) {
    try {
      return await r.get<string>(key);
    } catch (e) {
      console.error(`[content-store] Redis GET ${key} ล้มเหลว:`, e);
      return null;
    }
  }
  return memory.get(key) ?? null;
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
  memory.set(key, value);
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
  memory.delete(key);
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
