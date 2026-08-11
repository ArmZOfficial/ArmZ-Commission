/** ข้ามไปยังเนื้อหาหลัก (accessibility) */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-[100] rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      ข้ามไปยังเนื้อหา
    </a>
  );
}
