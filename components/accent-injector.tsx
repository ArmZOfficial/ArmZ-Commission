"use client";

import { useEffect } from "react";

/** ฉีด accent color (จาก Admin → site:seo) เข้า CSS variable --accent */
export function AccentInjector({ accent }: { accent: string }) {
  useEffect(() => {
    if (!accent) return;
    // ตรวจสอบว่าเป็น hex ที่ใช้ได้
    if (!/^#[0-9a-fA-F]{6}$/.test(accent)) return;
    document.documentElement.style.setProperty("--accent", accent);
  }, [accent]);
  return null;
}
