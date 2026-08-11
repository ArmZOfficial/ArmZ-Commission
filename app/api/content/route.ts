import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { loadAllContent } from "@/lib/content";
import { del, isRedisConnected, setJson } from "@/lib/store";
import { CONTENT_KEYS, type ContentKey } from "@/lib/types";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

async function isAuthed(req: NextRequest): Promise<boolean> {
  return verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value);
}

/** GET /api/content — ดึง content ทั้งหมด (สำหรับ admin shell) */
export async function GET(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const data = await loadAllContent();
  return NextResponse.json(data);
}

/** PUT /api/content { key, value } — บันทึก section หนึ่งลง Redis */
export async function PUT(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  let body: { key?: string; value?: unknown };
  try {
    body = (await req.json()) as { key?: string; value?: unknown };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (!body.key || !(CONTENT_KEYS as string[]).includes(body.key)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
  const key = body.key as ContentKey;

  // production ที่ยังไม่เชื่อม Upstash → บันทึกลง memory ของ instance เดียว = หน้าเว็บไม่เห็นผล
  if (process.env.NODE_ENV === "production" && !isRedisConnected()) {
    return NextResponse.json(
      {
        error:
          "ยังไม่ได้เชื่อม Upstash Redis — ไปที่ Vercel → Settings → Storage → เชื่อม Upstash Redis (หรือตั้ง UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN) ก่อน แล้วค่อยบันทึก",
      },
      { status: 500 }
    );
  }

  const ok = await setJson(key, body.value);
  if (!ok) {
    return NextResponse.json(
      { error: "บันทึกไม่สำเร็จ — เช็คการเชื่อมต่อ Upstash Redis (URL/Token ถูกต้องไหม) แล้วลองอีกครั้ง" },
      { status: 500 }
    );
  }
  
  // รีเฟรชแคชหน้าเว็บเพื่อให้แสดงผลทันทีบน Vercel
  revalidatePath("/", "layout");
  
  return NextResponse.json({ ok: true, key });
}

/** DELETE /api/content?key=… — ลบ key กลับเป็นค่า default */
export async function DELETE(req: NextRequest) {
  if (!(await isAuthed(req))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const key = req.nextUrl.searchParams.get("key");
  if (!key || !(CONTENT_KEYS as string[]).includes(key)) {
    return NextResponse.json({ error: "Invalid key" }, { status: 400 });
  }
  await del(key);
  
  // รีเฟรชแคชหน้าเว็บเพื่อให้แสดงผลทันทีบน Vercel
  revalidatePath("/", "layout");
  
  return NextResponse.json({ ok: true, key });
}
