"use client";

import { Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";
import { inputCls } from "./ui";

/** บีบอัดรูปฝั่ง client: resize + WebP (หรือ JPEG) → data URI ก่อนส่งอัปโหลด */
function compressImage(file: File, maxSize: number, quality = 0.82): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("เบราว์เซอร์ไม่รองรับ canvas"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);
      const probe = document.createElement("canvas");
      probe.width = probe.height = 1;
      const mime = probe.toDataURL("image/webp").startsWith("data:image/webp")
        ? "image/webp"
        : "image/jpeg";
      resolve(canvas.toDataURL(mime, quality));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("อ่านไฟล์รูปไม่สำเร็จ — ลองไฟล์อื่น"));
    };
    img.src = url;
  });
}

/**
 * ช่องรูปใน Admin: วาง URL ได้เหมือนเดิม หรือกด "อัปโหลด" เลือกไฟล์
 * → บีบอัดบนเครื่อง → POST /api/upload → เก็บ URL /api/image/... ลงฟิลด์
 */
export function ImageInput({
  value,
  onChange,
  hint,
  maxSize = 1280,
}: {
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  maxSize?: number;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const pick = async (file: File | undefined) => {
    if (!file) return;
    setBusy(true);
    try {
      const dataUri = await compressImage(file, maxSize);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: dataUri }),
      });
      if (!res.ok) {
        const err = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(err?.error ?? "อัปโหลดไม่สำเร็จ");
      }
      const out = (await res.json()) as { url: string };
      onChange(out.url);
    } catch (e) {
      window.alert(e instanceof Error ? e.message : "อัปโหลดรูปไม่สำเร็จ");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text"
          value={value ?? ""}
          placeholder="วาง URL หรือกดปุ่มอัปโหลด"
          onChange={(e) => onChange(e.target.value)}
          className={inputCls}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-white/15 bg-white/[0.05] px-3 py-2 text-xs font-semibold text-white/70 transition-colors hover:border-accent hover:text-white disabled:opacity-50"
        >
          {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {busy ? "กำลังอัปโหลด…" : "อัปโหลด"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void pick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {(value || hint) && (
        <div className="flex items-start gap-2">
          {value && (
            <img
              src={value}
              alt=""
              className="max-h-24 rounded-lg border border-white/10 object-contain"
            />
          )}
          {value && (
            <button
              type="button"
              onClick={() => onChange("")}
              title="ลบรูปนี้"
              className="rounded-md p-1 text-white/40 transition-colors hover:bg-white/10 hover:text-red-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {hint && <span className="text-[11px] leading-relaxed text-white/35">{hint}</span>}
        </div>
      )}
    </div>
  );
}
