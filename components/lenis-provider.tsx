"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";

/** Lenis smooth scroll + anchor-link integration (guard ด้วย prefers-reduced-motion) */
export function LenisProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return; // ผู้ใช้ปิด motion → ใช้ scroll ธรรมดา

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
    lenisRef.current = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement | null)?.closest?.(
        'a[href^="#"]'
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const el = document.querySelector(hash);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -90 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      cancelAnimationFrame(raf);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

  // เปลี่ยนหน้า → รีเซ็ตตำแหน่ง Lenis ทันที (ก่อน paint) ไม่ให้ค้างค่าของหน้าเก่า
  // ป้องกันอาการ "ตกร่องแล้วค่อยกลับมา" ตอน navigate
  useLayoutEffect(() => {
    lenisRef.current?.scrollTo(0, { immediate: true });
    lenisRef.current?.resize();
  }, [pathname]);

  return <>{children}</>;
}
