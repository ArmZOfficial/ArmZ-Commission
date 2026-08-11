/** แถบ marquee แนวเพลง (CSS animation + motion-reduce guard) — แก้ผ่าน Admin ได้ */
export function GenreMarquee({ genres }: { genres: string[] }) {
  const list = (genres ?? []).filter((g) => g.trim());
  if (list.length === 0) return null;

  return (
    <div aria-hidden className="relative mt-24 overflow-hidden border-y border-frame-border bg-card/40 py-5 backdrop-blur-sm">
      <div className="marquee-track flex w-max items-center gap-10 whitespace-nowrap">
        {[...list, ...list].map((g, i) => (
          <span
            key={i}
            className="flex items-center gap-10 font-display text-sm uppercase tracking-[0.3em] text-muted-foreground"
          >
            {g}
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
