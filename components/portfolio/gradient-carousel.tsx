"use client";

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { ChevronLeft, ChevronRight, Play, Sparkles } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Reveal } from "@/components/reveal";
import type { PortfolioItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { resolveThumbnail, thumbnailOnError } from "@/lib/youtube";

const FALLBACK_GRADIENTS = [
  "linear-gradient(150deg, #1f1f1f 0%, #0a0a0a 100%)",
  "linear-gradient(150deg, #2a2a2a 0%, #0d0d0d 100%)",
  "linear-gradient(150deg, #262626 0%, #0a0a0a 100%)",
  "linear-gradient(150deg, #303030 0%, #111111 100%)",
  "linear-gradient(150deg, #242424 0%, #0a0a0a 100%)",
  "linear-gradient(150deg, #1c1c1c 0%, #080808 100%)",
];

/** ดึงสีเด่น 2 โทนจากภาพ เพื่อทำ gradient พื้นหลัง */
async function extractGradient(url: string): Promise<string> {
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = url;
  await img.decode();
  const c = document.createElement("canvas");
  c.width = 48;
  c.height = 48;
  const ctx = c.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("no canvas ctx");
  ctx.drawImage(img, 0, 0, 48, 48);
  const d = ctx.getImageData(0, 0, 48, 48).data;
  const avg = (x0: number, y0: number, x1: number, y1: number): string => {
    let r = 0;
    let g = 0;
    let b = 0;
    let n = 0;
    for (let y = y0; y < y1; y++) {
      for (let x = x0; x < x1; x++) {
        const i = (y * 48 + x) * 4;
        r += d[i];
        g += d[i + 1];
        b += d[i + 2];
        n++;
      }
    }
    return `rgb(${Math.round(r / n)}, ${Math.round(g / n)}, ${Math.round(b / n)})`;
  };
  const top = avg(0, 0, 48, 20);
  const bottom = avg(0, 28, 48, 48);
  return `linear-gradient(150deg, ${top} 0%, ${bottom} 100%)`;
}

/** Gradient Carousel (adapted) — 3D card carousel + gradient bg จากภาพผลงาน */
export function GradientCarousel({
  items,
  eyebrow,
  title,
}: {
  items: PortfolioItem[];
  eyebrow?: string;
  title?: string;
}) {
  const reduce = useReducedMotion();
  const list = useMemo(() => [...items].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)), [items]);
  const n = list.length;
  const [active, setActive] = useState(0);
  const [grads, setGrads] = useState<Record<string, string>>({});
  const dragX = useMotionValue(0);
  const dragXS = useSpring(dragX, { stiffness: 300, damping: 30 });
  const dragStart = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    list.forEach(async (item, i) => {
      const thumb = resolveThumbnail(item.thumbnail, item.youtubeUrl);
      if (!thumb) return;
      try {
        const g = await extractGradient(thumb);
        if (!cancelled) {
          setGrads((prev) => (prev[item.id] ? prev : { ...prev, [item.id]: g }));
        }
      } catch {
        // ใช้ fallback palette
      }
    });
    return () => {
      cancelled = true;
    };
  }, [list]);

  if (n === 0) return null;

  const go = (dir: number) => setActive((a) => (a + dir + n) % n);
  const activeGrad = grads[list[active]?.id] ?? FALLBACK_GRADIENTS[active % FALLBACK_GRADIENTS.length];

  return (
    <section className="mx-auto max-w-6xl px-6">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] text-accent">
              <Sparkles className="h-3.5 w-3.5" />
              {eyebrow || "Featured Works"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title || "ผลงานเด่น"}</h2>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="ผลงานก่อนหน้า"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-frame-border bg-card text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="ผลงานถัดไป"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-frame-border bg-card text-muted-foreground transition-colors hover:border-accent/60 hover:text-accent"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          className="relative mt-10 overflow-hidden rounded-[2rem] border border-frame-border"
          style={{ touchAction: "pan-y" }}
          onPointerDown={(e) => {
            dragStart.current = e.clientX;
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => {
            if (dragStart.current !== null) dragX.set(e.clientX - dragStart.current);
          }}
          onPointerUp={(e) => {
            if (dragStart.current === null) return;
            const dx = e.clientX - dragStart.current;
            if (Math.abs(dx) > 55) go(dx < 0 ? 1 : -1);
            dragStart.current = null;
            dragX.set(0);
          }}
          onPointerCancel={() => {
            dragStart.current = null;
            dragX.set(0);
          }}
        >
          {/* gradient พื้นหลังจากภาพผลงาน */}
          <AnimatePresence initial={false}>
            <motion.div
              key={list[active]?.id ?? "bg"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7 }}
              className="absolute inset-0"
              style={{ background: activeGrad }}
            />
          </AnimatePresence>
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/45 via-transparent to-black/60" />

          {/* deck 3D */}
          <motion.div style={{ x: reduce ? 0 : dragXS }} className="relative h-[400px] [perspective:1400px] sm:h-[440px]">
            {list.map((item, i) => {
              let off = (i - active) % n;
              if (off < 0) off += n;
              if (off > n / 2) off -= n;
              const abs = Math.abs(off);
              const isCenter = off === 0;
              return (
                <motion.div
                  key={item.id}
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ zIndex: isCenter ? 20 : 20 - abs, pointerEvents: isCenter ? "auto" : "none" }}
                  animate={
                    reduce
                      ? { opacity: isCenter ? 1 : 0 }
                      : {
                          x: `${off * 46}%`,
                          rotateY: off * -24,
                          scale: isCenter ? 1 : 0.78,
                          opacity: isCenter ? 1 : 0.4,
                        }
                  }
                  transition={{ type: "spring", stiffness: 250, damping: 30 }}
                >
                  <a
                    href={item.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${item.title} — เปิดชมบน YouTube`}
                    className={cn(
                      "group relative block w-[min(82vw,440px)] rounded-2xl",
                      isCenter ? "" : "cursor-default"
                    )}
                    tabIndex={isCenter ? 0 : -1}
                  >
                    <img
                      src={resolveThumbnail(item.thumbnail, item.youtubeUrl)}
                      alt=""
                      loading="lazy"
                      onError={thumbnailOnError}
                      className="aspect-video w-full rounded-2xl border border-white/20 object-cover shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]"
                    />
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/70 via-transparent to-transparent" />

                    <span className="absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur">
                      {item.category}
                    </span>

                    <span className="absolute bottom-4 right-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-xl transition-transform duration-300 group-hover:scale-110">
                      <Play className="ml-0.5 h-5 w-5" fill="currentColor" />
                    </span>

                    <div className="absolute inset-x-4 bottom-4 pr-16">
                      <h3 className="truncate font-display text-xl text-white">{item.title}</h3>
                      {item.description && (
                        <p className="mt-0.5 line-clamp-1 text-xs text-white/70">{item.description}</p>
                      )}
                    </div>
                  </a>
                </motion.div>
              );
            })}
          </motion.div>

          {/* dots */}
          <div className="relative z-30 flex justify-center gap-2 pb-5">
            {list.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`ไปที่ผลงาน ${item.title}`}
                className={cn(
                  "h-2 rounded-full transition-all",
                  i === active ? "w-7 bg-accent" : "w-2 bg-white/40 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
