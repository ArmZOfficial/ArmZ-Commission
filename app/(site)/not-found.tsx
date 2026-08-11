import Link from "next/link";

export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="site-pad flex min-h-screen items-center justify-center outline-none">
      <div className="text-center">
        <p className="font-display text-7xl font-semibold text-accent">404</p>
        <h1 className="mt-4 font-display text-2xl font-semibold">ไม่พบหน้านี้</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          หน้าที่คุณตามหาอาจถูกย้ายหรือไม่มีอยู่จริง — กลับหน้าแรกกันดีกว่า
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
        >
          กลับหน้าแรก
        </Link>
      </div>
    </main>
  );
}
