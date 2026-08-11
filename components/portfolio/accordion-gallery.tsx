"use client";

import { Play } from "lucide-react";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import type { PortfolioItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { resolveThumbnail, thumbnailOnError } from "@/lib/youtube";

/** Accordion Gallery — hover expand gallery (Curated Picks) */
export function AccordionGallery({
  items,
  defaultIndex = 2,
  eyebrow,
  title,
}: {
  items: PortfolioItem[];
  defaultIndex?: number;
  eyebrow?: string;
  title?: string;
}) {
  const [active, setActive] = useState(Math.min(defaultIndex, Math.max(items.length - 1, 0)));
  const [hovered, setHovered] = useState<number | null>(null);
  const current = hovered ?? active;

  if (items.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-6">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">{eyebrow || "Curated Picks"}</p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">{title || "คัดมาให้ชม"}</h2>
      </Reveal>

      <Reveal delay={0.08}>
        <div
          className="mt-10 flex h-[420px] gap-2 sm:h-[460px]"
          onMouseLeave={() => setHovered(null)}
          onPointerDown={() => undefined}
        >
          {items.map((item, i) => {
            const expanded = current === i;
            return (
              <a
                key={item.id}
                href={item.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${item.title} — เปิดชมบน YouTube`}
                onMouseEnter={() => setHovered(i)}
                onFocus={() => setHovered(i)}
                onClick={() => setActive(i)}
                className="group relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-frame-border bg-muted transition-[flex-grow] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ flexGrow: expanded ? 6 : 1, flexBasis: 0 }}
              >
                <img
                  src={resolveThumbnail(item.thumbnail, item.youtubeUrl)}
                  alt=""
                  loading="lazy"
                  onError={thumbnailOnError}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />

                <span
                  className={cn(
                    "absolute left-4 top-4 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur transition-opacity",
                    expanded ? "opacity-100" : "opacity-0"
                  )}
                >
                  {item.category}
                </span>

                <span
                  className={cn(
                    "absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-all duration-500",
                    expanded ? "opacity-100" : "scale-75 opacity-0"
                  )}
                >
                  <Play className="ml-0.5 h-4 w-4" fill="currentColor" />
                </span>

                <div
                  className={cn(
                    "absolute inset-x-4 bottom-4 transition-all duration-500",
                    expanded ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                  )}
                >
                  <h3 className="truncate font-display text-lg text-white sm:text-2xl">{item.title}</h3>
                  <p className="mt-1 line-clamp-2 max-w-md text-xs text-white/70">{item.description}</p>
                </div>
              </a>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
