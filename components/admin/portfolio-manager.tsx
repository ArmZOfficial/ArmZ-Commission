"use client";

import { ArrowDown, ArrowUp, GripVertical, ListVideo, Loader2, Pencil, Plus, Star, Trash2, X } from "lucide-react";
import { useRef, useState, type ReactNode } from "react";
import { ImageInput } from "@/components/admin/image-input";
import { Field, TagInput, TextArea, TextInput, Toggle, inputCls } from "@/components/admin/ui";
import { cn, uid } from "@/lib/utils";
import type { PortfolioItem } from "@/lib/types";
import { PORTFOLIO_CATEGORIES } from "@/lib/defaults";
import { extractYouTubeId, resolveThumbnail, thumbnailFromUrl, thumbnailOnError } from "@/lib/youtube";
import type { PlaylistResult, PlaylistVideo } from "@/lib/youtube-playlist";

function blankItem(order: number): PortfolioItem {
  return {
    id: uid("p"),
    title: "",
    category: "",
    youtubeUrl: "",
    thumbnail: "",
    description: "",
    tags: [],
    featured: false,
    order,
  };
}

export function PortfolioManager({
  items,
  onChange,
}: {
  items: PortfolioItem[];
  onChange: (items: PortfolioItem[]) => void;
}) {
  const [editing, setEditing] = useState<PortfolioItem | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [autoFill, setAutoFill] = useState(false);
  const [tab, setTab] = useState<"list" | "import">("list");
  const dragIndex = useRef<number | null>(null);

  const sorted = [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= sorted.length) return;
    const next = [...sorted];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next.map((item, idx) => ({ ...item, order: idx })));
  };

  const toggleFeatured = (id: string) =>
    onChange(items.map((i) => (i.id === id ? { ...i, featured: !i.featured } : i)));

  const remove = (id: string) => onChange(items.filter((i) => i.id !== id));

  const saveItem = (item: PortfolioItem) => {
    if (editing && items.some((i) => i.id === item.id)) {
      onChange(items.map((i) => (i.id === item.id ? item : i)));
    } else {
      onChange([...items, { ...item, order: items.length }]);
    }
    setEditing(null);
  };

  /** นำเข้าจาก Playlist — เพิ่มคลิปที่เลือกเป็นผลงานใหม่ (ข้ามรายการที่ซ้ำ) */
  const importFromPlaylist = (videos: PlaylistVideo[]): number => {
    const existingIds = new Set<string>();
    for (const i of items) {
      existingIds.add(extractYouTubeId(i.youtubeUrl) ?? i.youtubeUrl);
    }
    const next = [...items];
    let order = items.length;
    let added = 0;
    for (const v of videos) {
      if (existingIds.has(v.videoId)) continue;
      existingIds.add(v.videoId);
      next.push({
        id: uid("p"),
        title: v.title,
        category: "",
        youtubeUrl: v.url,
        thumbnail: v.thumbnail,
        description: "",
        tags: [],
        featured: false,
        order: order++,
      });
      added++;
    }
    if (added > 0) onChange(next);
    return added;
  };

  /** วางลิงก์ YouTube → ดึง title/thumbnail อัตโนมัติ */
  const fetchYouTube = async (url: string) => {
    if (!editing) return;
    setAutoFill(true);
    try {
      const res = await fetch(`/api/youtube?url=${encodeURIComponent(url)}`);
      if (res.ok) {
        const meta = (await res.json()) as { title?: string; thumbnailUrl?: string };
        setEditing((prev) => {
          if (!prev) return prev;
          return {
            ...prev,
            title: prev.title || meta.title || "",
            thumbnail: prev.thumbnail || meta.thumbnailUrl || thumbnailFromUrl(url) || "",
          };
        });
      } else {
        // fallback: ใช้ thumbnail จาก video id อย่างเดียว
        const thumb = thumbnailFromUrl(url);
        if (thumb) setEditing((prev) => (prev ? { ...prev, thumbnail: prev.thumbnail || thumb } : prev));
      }
    } finally {
      setAutoFill(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* tabs: รายการผลงาน / นำเข้าจาก Playlist */}
      <div className="flex w-fit items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1">
        {(
          [
            { id: "list", label: `รายการผลงาน (${items.length})` },
            { id: "import", label: "นำเข้าจาก Playlist" },
          ] as const
        ).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              tab === t.id ? "bg-accent text-accent-foreground" : "text-white/55 hover:text-white"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "import" ? (
        <PlaylistImportPanel onImport={importFromPlaylist} />
      ) : (
        <>
      {/* toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-white/50">
          ทั้งหมด {items.length} ชิ้น — {items.filter((i) => i.featured).length} ชิ้นปักหมุด
        </p>
        <button
          type="button"
          onClick={() => setEditing(blankItem(items.length))}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110"
        >
          <Plus className="h-4 w-4" />
          เพิ่มผลงาน
        </button>
      </div>

      {/* list */}
      <div className="space-y-2">
        {sorted.map((item, i) => (
          <div
            key={item.id}
            draggable
            onDragStart={() => (dragIndex.current = i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              const from = dragIndex.current;
              dragIndex.current = null;
              if (from === null || from === i) return;
              const next = [...sorted];
              const [moved] = next.splice(from, 1);
              next.splice(i, 0, moved);
              onChange(next.map((it, idx) => ({ ...it, order: idx })));
            }}
            className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 transition-colors hover:border-white/20"
          >
            <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-white/30" />
            {resolveThumbnail(item.thumbnail, item.youtubeUrl) ? (
              <img
                src={resolveThumbnail(item.thumbnail, item.youtubeUrl)}
                alt=""
                className="h-12 w-20 shrink-0 rounded-md object-cover"
                loading="lazy"
              />
            ) : (
              <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-md bg-white/5 text-[10px] text-white/30">
                ไม่มีรูป
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">{item.title || "(ไม่มีชื่อ)"}</p>
              <p className="truncate text-xs text-white/40">{item.category}</p>
            </div>
            <button
              type="button"
              onClick={() => toggleFeatured(item.id)}
              title={item.featured ? "เลิกปักหมุด" : "ปักหมุด featured"}
              aria-label={item.featured ? "เลิกปักหมุด" : "ปักหมุด"}
              className={
                item.featured
                  ? "text-accent"
                  : "text-white/30 transition-colors hover:text-white/70"
              }
            >
              <Star className={`h-4 w-4 ${item.featured ? "fill-accent" : ""}`} />
            </button>
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="เลื่อนขึ้น"
                className="rounded-md p-1.5 text-white/50 hover:bg-white/10 disabled:opacity-25"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === sorted.length - 1}
                aria-label="เลื่อนลง"
                className="rounded-md p-1.5 text-white/50 hover:bg-white/10 disabled:opacity-25"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setEditing(item)}
                aria-label="แก้ไข"
                className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
              >
                <Pencil className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setConfirmId(item.id)}
                aria-label="ลบ"
                className="rounded-md p-1.5 text-white/50 hover:bg-red-500/20 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}

        {items.length === 0 && (
          <p className="rounded-xl border border-dashed border-white/15 py-10 text-center text-sm text-white/40">
            ยังไม่มีผลงาน — กด “เพิ่มผลงาน” เพื่อเริ่ม
          </p>
        )}
      </div>

        </>
      )}

      {/* confirm delete */}
      {confirmId && (
        <Modal onClose={() => setConfirmId(null)}>
          <h3 className="font-display text-lg font-semibold text-white">ลบผลงานนี้?</h3>
          <p className="mt-2 text-sm text-white/50">การลบไม่สามารถย้อนกลับได้ และจะบันทึกเมื่อกด “บันทึกการเปลี่ยนแปลง”</p>
          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setConfirmId(null)}
              className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 hover:bg-white/5"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              onClick={() => {
                remove(confirmId);
                setConfirmId(null);
              }}
              className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:brightness-110"
            >
              ลบ
            </button>
          </div>
        </Modal>
      )}

      {/* add/edit form */}
      {editing && (
        <Modal onClose={() => setEditing(null)} wide>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-semibold text-white">
              {items.some((i) => i.id === editing.id) ? "แก้ไขผลงาน" : "เพิ่มผลงาน"}
            </h3>
            <button
              type="button"
              onClick={() => setEditing(null)}
              aria-label="ปิด"
              className="rounded-md p-1.5 text-white/50 hover:bg-white/10 hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div
              onBlur={() => {
                if (editing.youtubeUrl) void fetchYouTube(editing.youtubeUrl);
              }}
            >
              <Field label="ลิงก์ YouTube" hint="วางลิงก์แล้วกด Tab/คลิกออก — ระบบดึงชื่อและรูปย่อให้อัตโนมัติ">
                <TextInput
                  value={editing.youtubeUrl}
                  placeholder="https://www.youtube.com/watch?v=…"
                  onChange={(v) => setEditing({ ...editing, youtubeUrl: v })}
                />
                {autoFill && <span className="mt-1 block text-[11px] text-accent">กำลังดึงข้อมูลจาก YouTube…</span>}
              </Field>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Field label="ชื่อผลงาน">
                <TextInput value={editing.title} onChange={(v) => setEditing({ ...editing, title: v })} />
              </Field>
              <Field label="หมวดหมู่">
                <select
                  value={editing.category}
                  onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                  className={inputCls}
                  style={{ colorScheme: "dark" }}
                >
                  <option value="" style={{ background: "#1a1a2e", color: "#fff" }}>-- เลือกหมวดหมู่ --</option>
                  {PORTFOLIO_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat} style={{ background: "#1a1a2e", color: "#fff" }}>{cat}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="รูปย่อ (thumbnail)" hint="อัปโหลดรูปเอง หรือปล่อยว่างให้ดึงจาก YouTube อัตโนมัติ">
              <ImageInput value={editing.thumbnail} onChange={(v) => setEditing({ ...editing, thumbnail: v })} />
            </Field>

            <Field label="คำอธิบายสั้น (บทบาทที่ทำ เช่น Mix only / Mix & Master)">
              <TextArea
                value={editing.description}
                onChange={(v) => setEditing({ ...editing, description: v })}
                rows={2}
              />
            </Field>

            <Field label="แท็ก">
              <TagInput value={editing.tags} onChange={(v) => setEditing({ ...editing, tags: v })} />
            </Field>

            <Toggle
              checked={editing.featured}
              onChange={(v) => setEditing({ ...editing, featured: v })}
              label="ปักหมุดขึ้น Gradient Carousel (ผลงานเด่น)"
            />

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-full border border-white/15 px-5 py-2 text-sm text-white/70 hover:bg-white/5"
              >
                ยกเลิก
              </button>
              <button
                type="button"
                onClick={() => saveItem(editing)}
                disabled={!editing.title.trim()}
                className="rounded-full bg-accent px-6 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-40"
              >
                บันทึกผลงาน
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

/** แท็บนำเข้าจาก Playlist — วางลิงก์ → ดึงทุกคลิป → เลือก → เพิ่มเข้ารายการ */
function PlaylistImportPanel({ onImport }: { onImport: (videos: PlaylistVideo[]) => number }) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PlaylistResult | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [importedCount, setImportedCount] = useState<number | null>(null);

  const fetchList = async () => {
    if (!url.trim()) return;
    setError("");
    setImportedCount(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/youtube/playlist?url=${encodeURIComponent(url.trim())}`);
      const data = (await res.json().catch(() => null)) as (PlaylistResult & { error?: string }) | null;
      if (!res.ok || !data || !data.videos) {
        setError(data?.error || "ดึงข้อมูล Playlist ไม่สำเร็จ");
        setResult(null);
        return;
      }
      setResult(data);
      setSelected(new Set(data.videos.map((v) => v.videoId)));
    } catch {
      setError("ดึงข้อมูล Playlist ไม่สำเร็จ — เช็คการเชื่อมต่อแล้วลองใหม่");
    } finally {
      setLoading(false);
    }
  };

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allSelected = !!result && result.videos.length > 0 && selected.size === result.videos.length;

  const toggleAll = () =>
    setSelected(
      allSelected ? new Set() : new Set(result?.videos.map((v) => v.videoId) ?? [])
    );

  const doImport = () => {
    if (!result) return;
    const count = onImport(result.videos.filter((v) => selected.has(v.videoId)));
    setImportedCount(count);
    if (count > 0) setSelected(new Set());
  };

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div>
        <p className="text-sm font-semibold text-white/80">นำเข้าผลงานจาก Playlist YouTube</p>
        <p className="mt-1 text-xs leading-relaxed text-white/40">
          วางลิงก์ Playlist (เช่น{" "}
          <span className="font-mono">youtube.com/playlist?list=PL…</span>) แล้วกด “ดึงข้อมูล” — ระบบจะดึงชื่อ +
          รูปย่อของทุกคลิปใน Playlist มาให้เลือกเพิ่มเข้ารายการผลงาน
        </p>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchList()}
          placeholder="https://www.youtube.com/playlist?list=…"
          className={inputCls}
        />
        <button
          type="button"
          onClick={fetchList}
          disabled={loading || !url.trim()}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-40"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              กำลังดึง…
            </>
          ) : (
            <>
              <ListVideo className="h-4 w-4" />
              ดึงข้อมูล
            </>
          )}
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs leading-relaxed text-red-200">
          {error}
        </p>
      )}

      {importedCount !== null && (
        <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs leading-relaxed text-emerald-200">
          {importedCount > 0
            ? `เพิ่ม ${importedCount} รายการลงในรายการผลงานแล้ว — อย่าลืมกด “บันทึก” เพื่ออัปเดตหน้าเว็บ`
            : "ไม่มีรายการใหม่ — คลิปเหล่านี้อยู่ในรายการผลงานอยู่แล้ว"}
        </p>
      )}

      {result && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-sm text-white/70">
              <span className="font-semibold text-white">{result.playlistTitle}</span>
              <span className="text-white/40"> — พบ {result.videos.length} คลิป</span>
            </p>
            <label className="flex cursor-pointer select-none items-center gap-2 text-xs text-white/60">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
                className="h-3.5 w-3.5"
                style={{ accentColor: "var(--accent)" }}
              />
              เลือกทั้งหมด
            </label>
          </div>

          <div className="max-h-72 space-y-1.5 overflow-y-auto pr-1">
            {result.videos.map((v) => (
              <label
                key={v.videoId}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-2.5 transition-colors hover:border-white/25"
              >
                <input
                  type="checkbox"
                  checked={selected.has(v.videoId)}
                  onChange={() => toggle(v.videoId)}
                  className="h-3.5 w-3.5 shrink-0"
                  style={{ accentColor: "var(--accent)" }}
                />
                <img
                  src={v.thumbnail}
                  alt=""
                  loading="lazy"
                  onError={thumbnailOnError}
                  className="h-10 w-16 shrink-0 rounded-md object-cover"
                />
                <span className="min-w-0 flex-1 truncate text-sm text-white/80">{v.title}</span>
              </label>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 border-t border-white/10 pt-3">
            <p className="text-xs text-white/35">เลือกแล้ว {selected.size} รายการ</p>
            <button
              type="button"
              onClick={doImport}
              disabled={selected.size === 0}
              className="inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 disabled:opacity-40"
            >
              <Plus className="h-4 w-4" />
              เพิ่ม {selected.size} รายการ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Modal({
  children,
  onClose,
  wide,
}: {
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`max-h-[85vh] w-full ${wide ? "max-w-lg" : "max-w-sm"} overflow-y-auto rounded-2xl border border-white/10 bg-[#0f0f0f] p-6 shadow-2xl`}
      >
        {children}
      </div>
    </div>
  );
}
