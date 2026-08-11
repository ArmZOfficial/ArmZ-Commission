"use client";

import { AnimatePresence, motion } from "motion/react";
import { Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import type { NavItem } from "@/lib/types";

/** Navigation 8 — Top nav แบบ blurred background พร้อม image preview */
export function Navigation8({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);

  useEffect(() => setMounted(true), []);

  return (
    <nav
      aria-label="เมนูหลัก"
      className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center px-2 pt-3"
    >
      <div className="pointer-events-auto relative flex max-w-full items-center gap-0 overflow-x-auto rounded-full border border-frame-border bg-background/75 p-1.5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.45)] backdrop-blur-xl will-change-transform sm:gap-1">
        {items.map((item) => {
          const isActivePath = item.href === pathname;
          const isActive = mounted && isActivePath;
          return (
            <div
              key={item.id}
              className="relative"
              onMouseEnter={() => setHovered(item.id)}
              onMouseLeave={() => setHovered((h) => (h === item.id ? null : h))}
            >
              {isActive && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="glow-accent absolute inset-0 rounded-full bg-accent"
                  transition={{ type: "tween", duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
                />
              )}
              <Link
                href={item.href}
                aria-current={isActivePath ? "page" : undefined}
                className={cn(
                  "relative z-10 flex items-center whitespace-nowrap rounded-full px-2 py-1.5 text-[11px] font-medium transition-colors sm:px-4 sm:py-2 sm:text-sm",
                  isActivePath ? "text-accent-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {item.label}
              </Link>

              {/* image preview บน hover (desktop) */}
              <AnimatePresence>
                {mounted && item.image && hovered === item.id && (
                  <motion.span
                    key={`preview-${item.id}`}
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="pointer-events-none absolute left-1/2 top-[calc(100%+12px)] hidden w-40 -translate-x-1/2 overflow-hidden rounded-xl border border-frame-border bg-card shadow-2xl md:block"
                  >
                    <img src={item.image} alt="" className="aspect-video w-full object-cover" loading="lazy" />
                    <span className="block truncate px-3 py-1.5 text-xs text-muted-foreground">
                      {item.label}
                    </span>
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        <div aria-hidden className="mx-0.5 h-5 w-px shrink-0 bg-border sm:mx-1" />
        <ThemeToggle />
        <Link
          href="/admin"
          aria-label="เข้าสู่ระบบ Admin"
          title="Admin"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:h-9 sm:w-9"
        >
          <Settings className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />
        </Link>
      </div>
    </nav>
  );
}
