import { NextRequest, NextResponse } from "next/server";

/**
 * ป้องกัน CDN / เบราว์เซอร์ cache หน้าเว็บสาธารณะ
 * — หน้าเว็บอ่านข้อมูลจาก Redis ทุก request (force-dynamic) จึงต้องไม่ถูก cache
 * เพื่อให้ Admin บันทึกเนื้อหาแล้วเห็นผลทันทีบน Vercel
 */
export function proxy(req: NextRequest) {
  const res = NextResponse.next();
  res.headers.set("Cache-Control", "no-store, max-age=0");
  return res;
}

// ครอบเฉพาะหน้าเว็บ (ไม่แตะ /api /admin ไฟล์สถิต _next)
export const config = {
  matcher: ["/((?!api|admin|_next|.*\\..*).*)"],
};
