"use client";

import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BorderGlow } from "@/components/border-glow";
import { DiscordIcon, XIcon } from "@/components/brand-icons";
import { Magnetic } from "@/components/magnetic";
import { Reveal } from "@/components/reveal";
import { FlowShader } from "@/components/flow-shader";
import type { ContactContent } from "@/lib/types";

/** Channel card — hover swap content + embedded shader + click action (open / copy) */
function ChannelCard({
  label,
  value,
  hint,
  copy = false,
  href,
  icon,
}: {
  label: string;
  value: string;
  hint: string;
  copy?: boolean;
  href?: string;
  icon: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);
  const [hovering, setHovering] = useState(false);

  const action = async () => {
    if (copy) {
      try {
        await navigator.clipboard.writeText(value.replace(/^@/, ""));
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      } catch {
        /* ignore */
      }
    } else if (href) {
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <button
      type="button"
      onClick={action}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      className="group relative block w-full overflow-hidden rounded-2xl border border-frame-border bg-card p-6 text-left transition-colors hover:border-accent/50"
    >
      {/* embedded shader — fade เรียบ ๆ ตอน hover (ไม่กระโดด opacity ทันที) */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{ opacity: hovering ? 1 : 0.35 }}
      >
        <FlowShader fixed={false} opacity={0.4} />
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-accent">
            {icon}
          </span>
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
            <p className="mt-0.5 truncate font-display text-lg" aria-live="polite">
              {copied ? "คัดลอกแล้ว! ✓" : value}
            </p>
            <p className="text-xs text-muted-foreground transition-colors group-hover:text-accent">{hint}</p>
          </div>
        </div>
      </div>

      <span className="absolute right-5 top-5 text-muted-foreground transition-colors group-hover:text-accent">
        {copied ? <Check className="h-5 w-5 text-emerald-500" /> : copy ? <Copy className="h-5 w-5" /> : <ArrowUpRight className="h-5 w-5" />}
      </span>
    </button>
  );
}

/** Contact 6 (adapted) — centered contact card + circular logo badge + dark CTA */
export function Contact6({ content }: { content: ContactContent }) {
  return (
    <section className="relative">
      <div className="mx-auto max-w-3xl px-6 pt-20 text-center lg:pt-28">
        {/* circular logo badge */}
        <Reveal>
          <div className="relative mx-auto h-28 w-28 text-center">
            <div
              aria-hidden
              className="absolute inset-0 rounded-full opacity-70 blur-[2px]"
              style={{
                background:
                  "conic-gradient(from 0deg, var(--accent), transparent 40%, var(--accent))",
              }}
            />
            <Magnetic className="relative z-10">
              <div
                className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border border-frame-border bg-card"
                style={{ boxShadow: "0 0 90px -16px var(--accent), 0 0 170px -40px var(--accent)" }}
              >
                {content.logoImage ? (
                  <img
                    src={content.logoImage}
                    alt="โลโก้"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="font-display text-3xl font-semibold text-accent">AZ</span>
                )}
              </div>
            </Magnetic>
          </div>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="mt-6 text-xs font-bold uppercase tracking-[0.25em] text-accent">{content.eyebrow}</p>
          <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight sm:text-5xl">
            {content.headline}
          </h1>
          <p className="mt-4 text-sm text-muted-foreground sm:text-base">{content.subheadline}</p>
        </Reveal>

        {/* 2 ช่องทางติดต่อ */}
        <div className="mt-12 grid gap-4 sm:grid-cols-2">
          <Reveal delay={0.15}>
            <ChannelCard
              label={content.x.label}
              value={content.x.username}
              hint={content.x.url.replace(/^https?:\/\//, "")}
              href={content.x.url}
              icon={<XIcon className="h-5 w-5" />}
            />
          </Reveal>
          <Reveal delay={0.22}>
            <ChannelCard
              label={content.discord.label}
              value={content.discord.username}
              hint={content.discord.copyLabel}
              copy
              icon={<DiscordIcon className="h-5 w-5" />}
            />
          </Reveal>
        </div>

        {/* dark CTA — BorderGlow: ขอบเรืองแสงไล่ตามเมาส์ */}
        <Reveal delay={0.3}>
          <BorderGlow
            className="mt-14"
            backgroundColor="#0a0a0a"
            borderRadius={32}
            glowColor="0 0 96"
            glowIntensity={1.0}
            edgeSensitivity={25}
            coneSpread={22}
            glowRadius={36}
            colors={["#ffffff", "#e5e5e5", "#a3a3a3"]}
            bloom={false}
            animated
          >
            <div className="relative p-8 text-center sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(420px circle at 50% 0%, rgba(255,255,255,0.12), transparent 70%)",
                }}
              />
              <div className="relative">
                <h2 className="font-display text-2xl font-semibold text-white sm:text-3xl">{content.ctaLabel}</h2>
                <p className="mt-3 text-sm text-white/60">{content.ctaSub}</p>
                <Link
                  href="/pricing"
                  className="glow-accent group mt-7 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#0a0a0a] transition-all hover:brightness-110 active:scale-[0.98]"
                >
                {content.ctaButtonLabel || "ดูแพ็กเกจราคา"}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>
          </BorderGlow>
        </Reveal>
      </div>
    </section>
  );
}
