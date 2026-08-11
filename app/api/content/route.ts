import { NextRequest, NextResponse } from "next/server";
import { loadAllContent } from "@/lib/content";
import { del, setJson } from "@/lib/store";
import { CONTENT_KEYS, type ContentKey } from "@/lib/types";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

export const runtime = "nodejs";

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
  await setJson(key, body.value);
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
  return NextResponse.json({ ok: true, key });
}
