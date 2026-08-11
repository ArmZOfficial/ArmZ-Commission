"use client";

import { Reveal } from "@/components/reveal";

/** Stack — เครื่องมือ/โปรแกรมที่ใช้ประจำ */
export function Stack({ stack, eyebrow, title }: { stack: string[]; eyebrow?: string; title?: string }) {
  if (!stack.length) return null;

  return (
    <section className="mx-auto max-w-6xl px-6 pt-24">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">{eyebrow || "Stack"}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title || "เครื่องมือที่ใช้"}</h2>
      </Reveal>

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-wrap gap-3">
          {stack.map((s) => (
            <span
              key={s}
              className="rounded-full border border-frame-border bg-card px-5 py-2.5 text-sm font-medium transition-colors hover:border-accent/60 hover:text-accent"
            >
              {s}
            </span>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
