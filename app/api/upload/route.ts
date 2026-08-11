import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";
import { setJson } from "@/lib/store";
import { uid } from "@/lib/utils";

export const runtime = "edge";

/** ขีดจำกัดขนาดรูปหลังถอด base64 (ฝั่ง client บีบอัดให้แล้ว — กัน abuse) */
const MAX_DECODED_BYTES = 2_000_000; // ~2MB

/** POST /api/upload { data: "data:image/webp;base64,…" } → { url: "/api/image/<uid>" } */
export async function POST(req: NextRequest) {
  if (!(await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { data?: string };
  try {
    body = (await req.json()) as { data?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const data = body.data ?? "";
  const comma = data.indexOf(",");
  if (comma < 0) {
    return NextResponse.json({ error: "ต้องส่งรูปเป็น data URI" }, { status: 400 });
  }
  const head = data.slice(0, comma);
  const mime = /^data:(image\/(?:png|jpeg|webp|gif|avif));base64$/i.exec(head)?.[1];
  if (!mime) {
    return NextResponse.json({ error: "รองรับเฉพาะไฟล์รูปภาพ (PNG/JPEG/WebP/GIF/AVIF)" }, { status: 400 });
  }
  const base64 = data.slice(comma + 1);

  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  } catch {
    return NextResponse.json({ error: "base64 ไม่ถูกต้อง" }, { status: 400 });
  }
  if (bytes.byteLength > MAX_DECODED_BYTES) {
    return NextResponse.json({ error: "รูปใหญ่เกินไป (สูงสุด ~2MB)" }, { status: 413 });
  }

  const id = uid("img");
  await setJson(`img:${id}`, { mime, base64 });
  return NextResponse.json({ url: `/api/image/${id}` });
}
