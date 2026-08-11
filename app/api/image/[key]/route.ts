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
  try {
    // สร้าง Uint8Array ใหม่ที่ผูกกับ ArrayBuffer (type ตรงกับ BodyInit ของ NextResponse)
    const bin = atob(record.base64);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new NextResponse(bytes, {
      headers: {
        "Content-Type": record.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Corrupt image", { status: 500 });
  }
}
