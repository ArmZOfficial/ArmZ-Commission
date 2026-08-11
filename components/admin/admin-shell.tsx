"use client";

import {
  ExternalLink,
  Home,
  LayoutGrid,
  LogOut,
  MessageCircle,
  Monitor,
  Moon,
  RefreshCw,
  RotateCcw,
  Save,
  Settings,
  Smartphone,
  Sun,
  Tablet,
  Tag,
  User,
  Eye,
  EyeOff,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AboutForm,
  ContactForm,
  GlobalForm,
  HomeForm,
  PortfolioPageForm,
  PricingForm,
} from "@/components/admin/forms";
import { PortfolioManager } from "@/components/admin/portfolio-manager";
import { SectionPreview, type PreviewDevice, type PreviewSection } from "@/components/admin/preview";
import { DEFAULT_CONTENT } from "@/lib/defaults";
import type {
  AboutContent,
  ContactContent,
  ContentKey,
  HomeContent,
  NavItem,
  PortfolioItem,
  PortfolioPageContent,
  PricingContent,
  SeoContent,
} from "@/lib/types";
import { cn } from "@/lib/utils";

const SECTIONS: {
  id: PreviewSection;
  label: string;
  key: ContentKey | null;
  icon: typeof Home;
}[] = [
  { id: "home", label: "หน้าแรก", key: "site:home", icon: Home },
  { id: "about", label: "เกี่ยวกับฉัน", key: "site:about", icon: User },
  { id: "portfolio", label: "ผลงาน", key: "site:portfolio", icon: LayoutGrid },
  { id: "pricing", label: "ราคา", key: "site:pricing", icon: Tag },
  { id: "contact", label: "ติดต่อ", key: "site:contact", icon: MessageCircle },
  { id: "global", label: "Global (Nav / SEO)", key: null, icon: Settings },
];

export function AdminShell() {
  const router = useRouter();
  const [draft, setDraft] = useState<Record<ContentKey, unknown> | null>(null);
  const [dirty, setDirty] = useState<Set<ContentKey>>(new Set());
  const [section, setSection] = useState<PreviewSection>("home");
  const [device, setDevice] = useState<PreviewDevice>("desktop");
  const [previewTheme, setPreviewTheme] = useState<"dark" | "light">("dark");
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [storeStatus, setStoreStatus] = useState<{
    redisConnected: boolean;
    production: boolean;
  } | null>(null);

  // ดึงข้อมูลจริงจากเซิร์ฟเวอร์ (บังคับไม่ cache) → คืน content + อัปเดตสถานะการเชื่อมต่อ
  const fetchContent = async (): Promise<Record<ContentKey, unknown>> => {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin/login");
      throw new Error("unauthorized");
    }
    const payload = (await res.json()) as
      | { content?: Record<ContentKey, unknown>; redisConnected?: boolean; production?: boolean }
      | Record<ContentKey, unknown>;
    if (
      payload &&
      typeof payload === "object" &&
      "content" in payload &&
      (payload as { content?: unknown }).content
    ) {
      const p = payload as {
        content: Record<ContentKey, unknown>;
        redisConnected?: boolean;
        production?: boolean;
      };
      setStoreStatus({ redisConnected: !!p.redisConnected, production: !!p.production });
      return p.content;
    }
    // backward compat: response เดิมที่คืน content ตรงๆ
    setStoreStatus(null);
    return payload as Record<ContentKey, unknown>;
  };

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const content = await fetchContent();
        if (!cancelled) setDraft(content);
      } catch {
        if (!cancelled) setStatus("โหลดข้อมูลไม่สำเร็จ");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [router]);

  // ปุ่ม "โหลดใหม่" — ดึงค่าที่เก็บจริงในเซิร์ฟเวอร์มาแสดง (ใช้เช็คว่าบันทึกแล้วติดจริงไหม)
  const reload = async () => {
    if (dirty.size > 0 && !window.confirm("โหลดใหม่จะทิ้งการแก้ไขที่ยังไม่บันทึก — ดำเนินต่อ?")) return;
    setStatus("กำลังโหลดข้อมูลจากเซิร์ฟเวอร์…");
    try {
      const content = await fetchContent();
      setDraft(content);
      setDirty(new Set());
      setStatus("โหลดข้อมูลล่าสุดจากเซิร์ฟเวอร์แล้ว");
    } catch {
      setStatus("โหลดข้อมูลไม่สำเร็จ");
    }
    setTimeout(() => setStatus(""), 2500);
  };

  const patch = (key: ContentKey, value: unknown) => {
    setDraft((d) => (d ? { ...d, [key]: value } : d));
    setDirty((s) => new Set(s).add(key));
  };

  const save = async () => {
    if (!draft || dirty.size === 0) return;
    setSaving(true);
    try {
      for (const key of dirty) {
        const res = await fetch("/api/content", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value: draft[key] }),
        });
        if (!res.ok) {
          const err = (await res.json().catch(() => null)) as { error?: string } | null;
          throw new Error(err?.error ?? `save ${key} failed`);
        }
      }
      setDirty(new Set());
      setStatus("บันทึกแล้ว ✓ หน้าเว็บอัปเดตทันที");
    } catch (e) {
      setStatus(e instanceof Error && e.message ? e.message : "บันทึกไม่สำเร็จ — ลองอีกครั้ง");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(""), 3500);
    }
  };

  const resetSection = async (key: ContentKey) => {
    if (!window.confirm("รีเซ็ตส่วนนี้กลับเป็นค่า default? (ข้อมูลที่แก้ไว้จะหาย)")) return;
    try {
      await fetch(`/api/content?key=${key}`, { method: "DELETE" });
    } catch {
      /* ignore */
    }
    setDraft((d) => (d ? { ...d, [key]: DEFAULT_CONTENT[key] } : d));
    setDirty((s) => {
      const next = new Set(s);
      next.delete(key);
      return next;
    });
    setStatus("รีเซ็ตแล้ว");
    setTimeout(() => setStatus(""), 2500);
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  };

  const active = SECTIONS.find((s) => s.id === section) ?? SECTIONS[0];
  const dirtyCount = dirty.size;

  const renderForm = () => {
    if (!draft) return null;
    switch (section) {
      case "home":
        return (
          <HomeForm
            value={draft["site:home"] as HomeContent}
            onChange={(v) => patch("site:home", v)}
          />
        );
      case "about":
        return (
          <AboutForm
            value={draft["site:about"] as AboutContent}
            onChange={(v) => patch("site:about", v)}
          />
        );
      case "portfolio":
        return (
          <div className="space-y-6">
            <PortfolioManager
              items={(draft["site:portfolio"] as PortfolioItem[]) ?? []}
              onChange={(v) => patch("site:portfolio", v)}
            />
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <h3 className="mb-4 text-sm font-bold text-white/80">หัวข้อหน้า Portfolio</h3>
              <PortfolioPageForm
                value={(draft["site:portfolioPage"] as PortfolioPageContent) ?? ({} as PortfolioPageContent)}
                onChange={(v) => patch("site:portfolioPage", v)}
              />
            </div>
          </div>
        );
      case "pricing":
        return (
          <PricingForm
            value={draft["site:pricing"] as PricingContent}
            onChange={(v) => patch("site:pricing", v)}
          />
        );
      case "contact":
        return (
          <ContactForm
            value={draft["site:contact"] as ContactContent}
            onChange={(v) => patch("site:contact", v)}
          />
        );
      case "global":
        return (
          <GlobalForm
            nav={(draft["site:nav"] as NavItem[]) ?? []}
            seo={draft["site:seo"] as SeoContent}
            onNavChange={(v) => patch("site:nav", v)}
            onSeoChange={(v) => patch("site:seo", v)}
          />
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a] text-[#f5f5f5]">
      {/* ── sidebar ── */}
      <aside className="flex w-60 shrink-0 flex-col border-r border-white/10 bg-[#0d0d0d]">
        <div className="border-b border-white/10 px-5 py-5">
          <p className="font-display text-lg font-semibold text-white">
            Studio <span className="italic text-accent">CMS</span>
          </p>
          <p className="mt-0.5 text-[11px] text-white/40">แก้ไขเนื้อหาเว็บได้ทุกส่วน</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" aria-label="หมวดเนื้อหา">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            const isActive = section === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setSection(s.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent/15 text-white"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4", isActive && "text-accent")} />
                {s.label}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-white/10 p-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ExternalLink className="h-4 w-4" />
            เปิดหน้าเว็บ
          </a>
          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm text-white/50 transition-colors hover:bg-white/5 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* ── main ── */}
      <div className="flex min-w-0 flex-1">
        {/* forms */}
        <div className="min-w-0 flex-1 overflow-y-auto p-6">
          {storeStatus?.production && !storeStatus.redisConnected && (
            <div className="mb-4 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm leading-relaxed text-red-100">
              <strong>⚠ ยังไม่ได้เชื่อม Upstash Redis</strong> — การบันทึกบน Vercel จะไม่ถาวร (ข้อมูลอาจไม่ขึ้น / กลับเป็น
              ของเดิม) ให้ไปที่{" "}
              <span className="font-mono text-white/90">Vercel → Settings → Storage → Connect Upstash Redis</span> หรือตั้ง
              env <span className="font-mono text-white/90">UPSTASH_REDIS_REST_URL</span> +{" "}
              <span className="font-mono text-white/90">UPSTASH_REDIS_REST_TOKEN</span> แล้วกลับมาบันทึกใหม่
            </div>
          )}
          {storeStatus?.production && storeStatus.redisConnected && (
            <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
              ✓ เชื่อมต่อ Upstash Redis แล้ว — ข้อมูลทั้งหมดอ่าน/เขียนจาก Redis โดยตรง บันทึกแล้วหน้าเว็บอัปเดตทันที
            </div>
          )}
          {storeStatus && !storeStatus.production && (
            <div className="mb-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/50">
              โหมดพัฒนา: ข้อมูลเก็บในเครื่อง (ไฟล์ <span className="font-mono">.data/store.json</span>) — บน Vercel ต้องเชื่อม
              Upstash Redis ถึงจะบันทึกถาวร
            </div>
          )}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold text-white">{active.label}</h1>
              <p className="mt-0.5 text-xs text-white/40">
                {dirtyCount > 0
                  ? `มีการเปลี่ยนแปลง ${dirtyCount} ส่วนที่ยังไม่บันทึก`
                  : "ไม่มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {active.key && (
                <button
                  type="button"
                  onClick={() => resetSection(active.key as ContentKey)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/5"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  รีเซ็ต
                </button>
              )}
              <button
                type="button"
                onClick={reload}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/5"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                โหลดใหม่
              </button>
              <button
                type="button"
                onClick={() => setShowPreview((v) => !v)}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm text-white/60 transition-colors hover:bg-white/5 lg:hidden"
              >
                {showPreview ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                Preview
              </button>
              <button
                type="button"
                onClick={save}
                disabled={dirtyCount === 0 || saving}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-40"
              >
                <Save className="h-4 w-4" />
                {saving ? "กำลังบันทึก…" : dirtyCount > 0 ? `บันทึก (${dirtyCount})` : "บันทึก"}
              </button>
            </div>
          </div>

          {status && (
            <div className="mb-4 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-white/90">
              {status}
            </div>
          )}

          {draft ? renderForm() : (
            <div className="py-20 text-center text-sm text-white/40">กำลังโหลดข้อมูล…</div>
          )}
        </div>

        {/* live preview */}
        {showPreview && (
          <div className="hidden w-[46%] min-w-[380px] flex-col border-l border-white/10 bg-[#0d0d0d] lg:flex">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 px-4 py-3">
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                {(
                  [
                    { id: "desktop", icon: Monitor, label: "เดสก์ท็อป" },
                    { id: "tablet", icon: Tablet, label: "แท็บเล็ต" },
                    { id: "mobile", icon: Smartphone, label: "มือถือ" },
                  ] as const
                ).map((d) => (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDevice(d.id)}
                    aria-label={d.label}
                    className={cn(
                      "rounded-full p-2 transition-colors",
                      device === d.id ? "bg-accent text-accent-foreground" : "text-white/50 hover:text-white"
                    )}
                  >
                    <d.icon className="h-4 w-4" />
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
                <button
                  type="button"
                  onClick={() => setPreviewTheme("dark")}
                  aria-label="พรีวิวธีมมืด"
                  className={cn(
                    "rounded-full p-2 transition-colors",
                    previewTheme === "dark" ? "bg-white/15 text-white" : "text-white/40"
                  )}
                >
                  <Moon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewTheme("light")}
                  aria-label="พรีวิวธีมสว่าง"
                  className={cn(
                    "rounded-full p-2 transition-colors",
                    previewTheme === "light" ? "bg-white/15 text-white" : "text-white/40"
                  )}
                >
                  <Sun className="h-4 w-4" />
                </button>
              </div>
              <span className="truncate text-xs text-white/40">Preview — {device}</span>
            </div>

            <div className="flex-1 overflow-y-auto">
              {draft ? (
                <SectionPreview section={section} draft={draft} theme={previewTheme} device={device} />
              ) : (
                <div className="py-20 text-center text-sm text-white/40">กำลังโหลด preview…</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
