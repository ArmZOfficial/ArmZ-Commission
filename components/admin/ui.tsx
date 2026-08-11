"use client";

import { ArrowDown, ArrowUp, Plus, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white placeholder:text-white/25 transition-colors focus:border-accent focus:outline-none";

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-white/55">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] leading-relaxed text-white/35">{hint}</span>}
    </label>
  );
}

export function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value ?? ""}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputCls}
    />
  );
}

export function NumberInput({
  value,
  onChange,
  placeholder,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? value : 0}
      placeholder={placeholder}
      onChange={(e) => onChange(Number(e.target.value) || 0)}
      className={inputCls}
    />
  );
}

export function TextArea({
  value,
  onChange,
  rows = 3,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value ?? ""}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={cn(inputCls, "resize-y leading-relaxed")}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-center gap-2.5"
    >
      <span
        className="relative h-5 w-9 shrink-0 rounded-full"
        style={{
          backgroundColor: checked ? "var(--accent)" : "rgba(255,255,255,0.18)",
          transition: "background-color 0.2s ease",
        }}
      >
        <span
          className="absolute top-0.5 h-4 w-4 rounded-full shadow-sm"
          style={{
            left: 2,
            translate: checked ? "16px" : "0px",
            backgroundColor: checked ? "var(--accent-foreground)" : "#ffffff",
            transition: "translate 0.2s ease",
          }}
        />
      </span>
      {label && <span className="text-sm text-white/70">{label}</span>}
    </button>
  );
}

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const add = (text: string) => {
    const t = text.trim();
    if (!t || value.includes(t)) return;
    onChange([...value, t]);
  };
  return (
    <div className={cn(inputCls, "flex flex-wrap items-center gap-1.5 py-1.5")}>
      {value.map((t, i) => (
        <span
          key={`${t}-${i}`}
          className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-white/80"
        >
          {t}
          <button
            type="button"
            aria-label={`ลบ ${t}`}
            onClick={() => onChange(value.filter((_, j) => j !== i))}
            className="text-white/40 hover:text-red-400"
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}
      <input
        placeholder={placeholder ?? "พิมพ์แล้วกด Enter"}
        className="min-w-[120px] flex-1 bg-transparent text-sm text-white placeholder:text-white/25 focus:outline-none"
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add((e.target as HTMLInputElement).value);
            (e.target as HTMLInputElement).value = "";
          } else if (e.key === "Backspace" && !(e.target as HTMLInputElement).value && value.length) {
            onChange(value.slice(0, -1));
          }
        }}
        onBlur={(e) => {
          add(e.target.value);
          e.target.value = "";
        }}
      />
    </div>
  );
}

export function ArrayEditor({
  items,
  onChange,
  makeNew,
  addLabel,
  renderItem,
}: {
  items: unknown[];
  onChange: (items: unknown[]) => void;
  makeNew: () => unknown;
  addLabel: string;
  renderItem: (item: unknown, update: (patch: unknown) => void, remove: () => void) => ReactNode;
}) {
  const updateAt = (i: number, patch: unknown) => {
    const next = [...items];
    const cur = items[i];
    if (typeof cur === "string") {
      next[i] = patch as string;
    } else {
      next[i] = { ...(cur as Record<string, unknown>), ...(patch as Record<string, unknown>) };
    }
    onChange(next);
  };
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= items.length) return;
    const next = [...items];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-white/40">
              รายการ {i + 1}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="เลื่อนขึ้น"
                className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25"
              >
                <ArrowUp className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => move(i, 1)}
                disabled={i === items.length - 1}
                aria-label="เลื่อนลง"
                className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white disabled:opacity-25"
              >
                <ArrowDown className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => onChange(items.filter((_, j) => j !== i))}
                aria-label="ลบรายการ"
                className="rounded-md p-1.5 text-white/50 transition-colors hover:bg-red-500/20 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          {renderItem(item, (patch) => updateAt(i, patch), () => onChange(items.filter((_, j) => j !== i)))}
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...items, makeNew()])}
        className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 px-4 py-3 text-sm font-semibold text-white/60 transition-colors hover:border-accent hover:text-white"
      >
        <Plus className="h-4 w-4" />
        {addLabel}
      </button>
    </div>
  );
}
