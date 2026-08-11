"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, Radio } from "lucide-react";
import { useState } from "react";
import { BorderGlow } from "@/components/border-glow";
import { Magnetic } from "@/components/magnetic";
import { Reveal } from "@/components/reveal";
import { PortraitMorph } from "@/components/about/portrait-morph";
import type { AboutContent, SocialLink } from "@/lib/types";
import { cn } from "@/lib/utils";

function SocialButton({ social }: { social: SocialLink }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(social.username.replace(/^@/, ""));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  if (social.copy) {
    return (
      <Magnetic>
        <button
          type="button"
          onClick={copy}
          className="inline-flex items-center gap-2 rounded-full border border-frame-border bg-muted px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent/60 hover:bg-card"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-accent" />}
          {copied ? "คัดลอกแล้ว!" : social.username}
        </button>
      </Magnetic>
    );
  }
  return (
    <Magnetic>
      <a
        href={social.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-full border border-frame-border bg-muted px-5 py-2.5 text-sm font-semibold transition-colors hover:border-accent/60 hover:bg-card"
      >
        <ArrowUpRight className="h-4 w-4 text-accent" />
        {social.username || social.label}
      </a>
    </Magnetic>
  );
}

/** Profile 5 (adapted) — creator card + stats + tabbed link rows + social actions */
export function Profile5({ content }: { content: AboutContent }) {
  const reduce = useReducedMotion();
  const [tab, setTab] = useState(content.tabs[0]?.id ?? "");

  const activeTab = content.tabs.find((t) => t.id === tab) ?? content.tabs[0];

  return (
    <section className="relative">
      <div className="mx-auto max-w-6xl px-6 pt-16 lg:pt-24">
        <Reveal>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-accent">
            {content.section?.eyebrow || "About Me"}
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {content.section?.titlePrefix || "วิศวกรเสียงที่"}{" "}
            <span className="text-glow italic text-accent">{content.section?.titleHighlight || "ฟังเพลงของคุณ"}</span>{" "}
            {content.section?.titleSuffix || "ก่อนปรับ EQ"}
          </h2>
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <BorderGlow
            backgroundColor="var(--card)"
            borderRadius={32}
            glowColor="0 0 96"
            glowIntensity={0.9}
            edgeSensitivity={28}
            coneSpread={24}
            glowRadius={34}
            colors={["#ffffff", "#e5e5e5", "#a3a3a3"]}
          >
          <div className="relative p-6 lg:p-10">
            <div className="grid gap-10 lg:grid-cols-[minmax(0,360px)_1fr]">
              {/* portrait */}
              <div className="mx-auto w-full max-w-[360px]">
                <PortraitMorph src={content.portrait} hoverSrc={content.portraitHover} alt={`รูปของ ${content.name}`} />
              </div>

              {/* info */}
              <div>
                <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{content.name}</h1>
                <p className="mt-2 text-lg text-accent">{content.role}</p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1 text-xs font-semibold text-accent">
                    <Radio className="h-3.5 w-3.5" />
                    {content.availability}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  {content.bio.map((p, i) => (
                    <p key={i} className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                      {p}
                    </p>
                  ))}
                </div>

                {/* stats */}
                <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {content.stats.map((s, i) => (
                    <motion.div
                      key={s.label}
                      initial={reduce ? false : { opacity: 0, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.06 }}
                      className="rounded-2xl border border-frame-border bg-muted/60 p-4 text-center"
                    >
                      <p className="font-display text-2xl font-semibold text-accent">{s.value}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
                    </motion.div>
                  ))}
                </div>

                {/* tabbed link rows */}
                <div className="mt-8">
                  <div className="flex flex-wrap gap-2" role="tablist" aria-label="อุปกรณ์ / โปรแกรม / ปลั๊กอิน">
                    {content.tabs.map((t) => (
                      <button
                        key={t.id}
                        role="tab"
                        aria-selected={activeTab?.id === t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                          "relative rounded-full px-4 py-1.5 text-sm font-semibold transition-colors",
                          activeTab?.id === t.id
                            ? "text-accent-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        {activeTab?.id === t.id && (
                          <motion.span
                            layoutId="about-tab-pill"
                            className="absolute inset-0 rounded-full bg-accent"
                            transition={{ type: "spring", stiffness: 380, damping: 30 }}
                          />
                        )}
                        <span className="relative z-10">{t.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-4 min-h-[180px]">
                    <AnimatePresence mode="wait">
                      <motion.ul
                        key={activeTab?.id}
                        initial={reduce ? false : { opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={reduce ? undefined : { opacity: 0, y: -8 }}
                        transition={{ duration: 0.3 }}
                      >
                        {(activeTab?.items ?? []).map((row) => (
                          <li
                            key={row.label}
                            className="group flex items-center justify-between gap-4 border-b border-border py-3"
                          >
                            <div>
                              <p className="text-sm font-semibold">{row.label}</p>
                              {row.detail && <p className="text-xs text-muted-foreground">{row.detail}</p>}
                            </div>
                            {row.href ? (
                              <a
                                href={row.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-accent"
                                aria-label={row.label}
                              >
                                <ArrowUpRight className="h-4 w-4" />
                              </a>
                            ) : (
                              <span className="h-1.5 w-1.5 rounded-full bg-accent/70" />
                            )}
                          </li>
                        ))}
                      </motion.ul>
                    </AnimatePresence>
                  </div>
                </div>

                {/* social actions */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  {content.socials.map((s) => (
                    <SocialButton key={s.id} social={s} />
                  ))}
                </div>
              </div>
            </div>
          </div>
          </BorderGlow>
        </Reveal>
      </div>
    </section>
  );
}
