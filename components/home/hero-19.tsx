"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";
import type { HighlightCard, HomeContent } from "@/lib/types";
import { cn } from "@/lib/utils";

const ease: [number, number, number, number] = [0.21, 0.47, 0.32, 0.98];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease } },
};

const lineReveal = {
  hidden: { y: "115%" },
  show: { y: "0%", transition: { duration: 0.85, ease } },
};

/** Parallax card พร้อม hover lift + mouse spring */
function ParallaxCard({ card, index }: { card: HighlightCard; index: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 130, damping: 18, mass: 0.15 });
  const sy = useSpring(my, { stiffness: 130, damping: 18, mass: 0.15 });

  return (
    <motion.div
      variants={fadeUp}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        mx.set(((e.clientX - rect.left) / rect.width - 0.5) * 16);
        my.set(((e.clientY - rect.top) / rect.height - 0.5) * 16);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <motion.div
        ref={ref}
        whileHover={reduce ? undefined : { y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        style={{ x: reduce ? 0 : sx, y: reduce ? 0 : sy }}
        className="group relative h-full overflow-hidden rounded-2xl border border-frame-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
      >
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-accent/15 blur-2xl transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-frame-border bg-muted px-3 py-1 text-xs font-semibold uppercase tracking-widest text-accent">
            {card.tag}
          </span>
          <h3 className="mt-4 font-display text-xl leading-snug">{card.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{card.body}</p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** Hero 19 (adapted) — split billing hero สำหรับ Mixing & Mastering */
export function Hero19({ content }: { content: HomeContent }) {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const panelY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -70]);
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -110]);

  const lines = content.headline.split("\n").filter(Boolean);

  return (
    <section ref={sectionRef} className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.12fr_0.88fr]">
          {/* ── ซ้าย: editorial headline ── */}
          <motion.div variants={container} initial={reduce ? false : "hidden"} animate="show">
            <motion.span
              variants={fadeUp}
              className="inline-flex items-center gap-2 rounded-full border border-frame-border bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground"
            >
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              {content.eyebrow}
            </motion.span>

            <h1 className="mt-6 font-display text-[2.7rem] font-semibold leading-[1.25] tracking-tight sm:text-6xl lg:text-[4.2rem]">
              {lines.map((line, i) => {
                const isLast = i === lines.length - 1;
                return (
                  <span key={i} className="block overflow-hidden py-1 -my-1">
                    <motion.span
                      variants={lineReveal}
                      className={cn("block", isLast && "text-glow italic text-accent")}
                    >
                      {line}
                    </motion.span>
                  </span>
                );
              })}
            </h1>

            <motion.p variants={fadeUp} className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
              {content.subheadline}
            </motion.p>

            <motion.div variants={fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href={content.ctaHref}
                className="glow-accent group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-sm font-semibold text-accent-foreground transition-all hover:brightness-110 active:scale-[0.98]"
              >
                {content.ctaLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={content.secondaryHref}
                className="inline-flex items-center gap-2 rounded-full border border-frame-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-colors hover:border-accent/50"
              >
                {content.secondaryLabel}
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </motion.div>

          {/* ── ขวา: staggered price preview panel ──
              แยก layer: วงนอก = scroll parallax, วงใน = entrance animation
              (ไม่ให้ transform ขัดกันจนกระตุก) */}
          <motion.div style={{ y: reduce ? 0 : panelY }}>
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 40, rotate: 2 }}
              animate={{ opacity: 1, y: 0, rotate: reduce ? 0 : 1.2 }}
              transition={{ duration: 0.9, delay: 0.25, ease }}
            >
            <div className="relative mx-auto max-w-md rounded-[1.75rem] border border-frame-border bg-card p-6 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-muted-foreground">
                    {content.invoiceEyebrow || "Package Full Mixing"}
                  </p>
                  <p className="mt-1 font-display text-lg">{content.invoiceNote || "เริ่มต้นที่ ฿1,500"}</p>
                </div>
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/12 text-accent">
                  <Sparkles className="h-4 w-4" />
                </span>
              </div>

              <motion.ul
                initial={reduce ? false : "hidden"}
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
                className="mt-2"
              >
                {content.packages.map((p) => (
                  <motion.li
                    key={p.name}
                    variants={{
                      hidden: { opacity: 0, x: 18 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.5, ease } },
                    }}
                    className="group flex items-center justify-between gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-muted"
                  >
                    <div>
                      <p className="text-sm font-semibold">{p.name}</p>
                      <p className="text-xs text-muted-foreground">{p.note}</p>
                    </div>
                    <p className="font-display text-xl">
                      <span className="text-xs text-muted-foreground">฿</span>
                      {p.price}
                    </p>
                  </motion.li>
                ))}
              </motion.ul>

              <Link
                href="/pricing"
                className="mt-3 flex items-center justify-between rounded-xl border border-frame-border bg-muted px-4 py-3 text-sm font-semibold transition-colors hover:border-accent/60 hover:bg-card"
              >
                {content.invoiceCtaLabel || "ดูแพ็กเกจทั้งหมด"}
                <ArrowRight className="h-4 w-4 text-accent" />
              </Link>
            </div>
            </motion.div>
          </motion.div>
        </div>

        {/* ── Parallax highlight cards ── */}
        <motion.div
          style={{ y: reduce ? 0 : cardsY }}
          className="mt-20 grid gap-5 md:grid-cols-3"
        >
          {content.highlights.map((card, i) => (
            <ParallaxCard key={card.tag} card={card} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
