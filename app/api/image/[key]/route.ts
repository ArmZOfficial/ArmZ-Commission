import { NextResponse } from "next/server";
import { getJson } from "@/lib/store";

export const runtime = "nodejs";

/** GET /api/image/<id> — เสิร์ฟรูปที่อัปโหลดไว้ (cache ยาว เพราะ id ไม่ซ้ำเมื่ออัปโหลดใหม่) */
export async function GET(
  _req: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;
  const record = await getJson<{ mime: string; base64: string }>(`img:${key}`);
  if (!record) {
    return new NextResponse("Not found", { status: 404 });
  }
  let bytes: Uint8Array;
  try {
    bytes = Uint8Array.from(atob(record.base64), (c) => c.charCodeAt(0));
  } catch {
    return new NextResponse("Corrupt image", { status: 500 });
  }
  return new NextResponse(bytes, {
    headers: {
      "Content-Type": record.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
