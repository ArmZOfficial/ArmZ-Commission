"use client";

import { ArrowUpRight, Youtube } from "lucide-react";
import type { PortfolioItem } from "@/lib/types";
import { resolveThumbnail, thumbnailOnError } from "@/lib/youtube";

/** Project Card — สไตล์ dribbble: hover lift + image zoom, ลิงก์ไป YouTube */
export function ProjectCard({ item }: { item: PortfolioItem }) {
  return (
    <a
      href={item.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.title} — เปิดชมบน YouTube`}
      className="group block h-full overflow-hidden rounded-2xl border border-frame-border bg-card transition-colors hover:border-accent/50"
    >
      <div className="relative aspect-video overflow-hidden bg-muted">
        <img
          src={resolveThumbnail(item.thumbnail, item.youtubeUrl)}
          alt=""
          loading="lazy"
          onError={thumbnailOnError}
          className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur">
          {item.category}
        </span>

        <span className="absolute bottom-3 right-3 flex h-11 w-11 translate-y-2 items-center justify-center rounded-full bg-accent text-accent-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Youtube className="h-5 w-5" />
        </span>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug">{item.title}</h3>
          <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />
        </div>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
        {item.tags.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-frame-border bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </a>
  );
}
