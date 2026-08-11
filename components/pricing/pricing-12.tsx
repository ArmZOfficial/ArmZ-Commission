"use client";

import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, Check, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/reveal";
import type { PricingContent } from "@/lib/types";
import { cn } from "@/lib/utils";

/** Pricing 12 (adapted) — dark inset panels, grid 4 แพ็กเกจ, เงื่อนไข rush/commercial */
export function Pricing12({ content }: { content: PricingContent }) {
  const reduce = useReducedMotion();

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
        <Reveal className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-frame-border bg-card px-4 py-1.5 text-xs font-bold uppercase tracking-[0.25em] text-accent">
            {content.eyebrow}
          </span>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            {content.headline}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-sm text-muted-foreground sm:text-base">
            {content.subheadline}
          </p>
        </Reveal>

        {/* grid 4 แพ็กเกจ */}
        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {content.packages.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.07} className="h-full">
              <div
                className={cn(
                  "relative flex h-full flex-col rounded-[1.75rem] border bg-card p-6",
                  p.popular ? "border-accent" : "border-frame-border"
                )}
                style={
                  p.popular
                    ? {
                      boxShadow:
                        "0 0 0 1px var(--accent), 0 30px 70px -30px color-mix(in oklab, var(--accent) 45%, transparent)",
                    }
                    : { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)" }
                }
              >
                {p.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-accent px-3 py-1 text-xs font-bold text-accent-foreground">
                    {content.popularLabel || "ยอดนิยม"}
                  </span>
                )}

                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                <p className="mt-2 min-h-[40px] text-sm text-muted-foreground">{p.requirements}</p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="text-xs font-medium text-muted-foreground">{p.priceLabel}</span>
                  <motion.span
                    initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="font-display text-5xl font-semibold tracking-tight"
                  >
                    {p.price.toLocaleString("th-TH")}
                  </motion.span>
                  <span className="text-sm text-muted-foreground">{content.priceUnit || "บาท"}</span>
                </div>

                <ul className="mt-7 space-y-2.5 text-sm">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-accent/15">
                        <Check className="h-3 w-3 text-accent" />
                      </span>
                      <span className="text-muted-foreground">{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto pt-8">
                  <Link
                    href={content.ctaHref}
                    target={content.ctaHref.startsWith("http") ? "_blank" : undefined}
                    rel={content.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
                    className={cn(
                      "group flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-bold transition-all active:scale-[0.98]",
                      p.popular
                        ? "bg-accent text-accent-foreground hover:brightness-110"
                        : "border border-frame-border bg-muted text-foreground hover:border-accent/60"
                    )}
                  >
                    {content.ctaLabel}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* เงื่อนไขเพิ่มเติม */}
        <Reveal delay={0.15}>
          <div className="mt-8 flex flex-col items-stretch gap-5 rounded-[1.75rem] border border-frame-border bg-card p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-4">
              {content.notes.map((note, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-2xl border border-frame-border bg-muted px-5 py-4"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
                    {i === 0 ? <Zap className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{note.title}</p>
                    <p className="text-xs text-muted-foreground">{note.detail}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href={content.ctaHref}
              target={content.ctaHref.startsWith("http") ? "_blank" : undefined}
              rel={content.ctaHref.startsWith("http") ? "noopener noreferrer" : undefined}
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-foreground px-7 py-3.5 text-sm font-bold text-background transition-all hover:opacity-90 active:scale-[0.98]"
            >
              {content.ctaLabel}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </Reveal>

        {content.footerNote && (
          <Reveal delay={0.2}>
            <p className="mt-8 text-center text-xs text-muted-foreground">{content.footerNote}</p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
