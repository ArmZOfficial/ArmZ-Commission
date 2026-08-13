"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/portfolio/projects-grid";
import { Reveal } from "@/components/reveal";
import type { PortfolioItem, PortfolioPageContent } from "@/lib/types";
import { PORTFOLIO_CATEGORIES } from "@/lib/defaults";
import { cn } from "@/lib/utils";

/** Showcase 4 (adapted) — filterable grid + category pills + animated layout transition */
export function Showcase4({ items, content }: { items: PortfolioItem[]; content?: PortfolioPageContent }) {
  const reduce = useReducedMotion();
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => {
    const existing = new Set(items.map((i) => i.category).filter(Boolean));
    const ordered = PORTFOLIO_CATEGORIES.filter((c) => existing.has(c));
    return ["All", ...ordered];
  }, [items]);

  const filtered = useMemo(() => {
    const list = category === "All" ? items : items.filter((i) => i.category === category);
    return [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [items, category]);

  return (
    <section className="mx-auto max-w-6xl px-6">
      <Reveal>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
          {content?.gridEyebrow || "Portfolio"}
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          {content?.gridTitle || "ผลงานทั้งหมด"}
        </h2>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
          {content?.gridIntro || "กดที่การ์ดเพื่อเปิดชมผลงานบน YouTube — ทุกเพลงผ่านการ Mix & Master จากห้องของผม"}
        </p>
      </Reveal>

      {/* category pills */}
      <Reveal delay={0.08}>
        <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="กรองหมวดหมู่ผลงาน">
          {categories.map((c) => {
            const active = category === c;
            return (
              <button
                key={c}
                role="tab"
                aria-selected={active}
                onClick={() => setCategory(c)}
                className={cn(
                  "relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                  active ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {active && (
                  <motion.span
                    layoutId="showcase-cat-pill"
                    className="absolute inset-0 rounded-full bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{c}</span>
              </button>
            );
          })}
        </div>
      </Reveal>

      {/* grid */}
      <motion.div layout className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filtered.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={reduce ? false : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? undefined : { opacity: 0, scale: 0.94 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              whileHover={reduce ? undefined : { y: -8 }}
              className="h-full"
            >
              <ProjectCard item={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filtered.length === 0 && (
        <p className="mt-12 text-center text-sm text-muted-foreground">ยังไม่มีผลงานในหมวดนี้</p>
      )}
    </section>
  );
}
