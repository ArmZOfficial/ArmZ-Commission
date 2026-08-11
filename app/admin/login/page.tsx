"use client";

import { Lock, LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      setError(data?.error ?? "เข้าสู่ระบบไม่สำเร็จ");
    } catch {
      setError("เกิดข้อผิดพลาด — ลองอีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent/15">
            <Lock className="h-6 w-6 text-accent" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-semibold text-white">เข้าสู่ระบบ Admin</h1>
          <p className="mt-1 text-sm text-white/40">Studio CMS — แก้ไขเนื้อหาเว็บ</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/55">
              รหัสผ่าน
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoFocus
              className="w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2.5 text-sm text-white placeholder:text-white/25 transition-colors focus:border-accent focus:outline-none"
            />
          </label>

          {error && (
            <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-40"
          >
            <LogIn className="h-4 w-4" />
            {loading ? "กำลังตรวจสอบ…" : "เข้าสู่ระบบ"}
          </button>
        </form>

        <p className="mt-4 text-center text-[11px] text-white/30">
          ตั้งรหัสผ่านผ่าน environment variable <code className="text-white/50">ADMIN_PASSWORD</code>
        </p>
      </div>
    </main>
  );
}
