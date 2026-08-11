"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useRef, useState } from "react";

/** Portrait Morph — hover สลับรูปแบบ magnetic cursor follow (clip-path circle) */
export function PortraitMorph({
  src,
  hoverSrc,
  alt,
}: {
  src: string;
  hoverSrc: string;
  alt: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const sx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 260, damping: 28, mass: 0.4 });
  const clipPath = useMotionTemplate`circle(${reduce ? 0 : 34}% at ${sx}% ${sy}%)`;

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/5] w-full overflow-hidden rounded-[1.75rem] border border-frame-border bg-muted"
      onPointerMove={(e) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set(((e.clientX - rect.left) / rect.width) * 100);
        y.set(((e.clientY - rect.top) / rect.height) * 100);
      }}
      onPointerEnter={() => setHovering(true)}
      onPointerLeave={() => {
        setHovering(false);
        x.set(50);
        y.set(50);
      }}
    >
      {/* base image */}
      <img
        src={src}
        alt={alt}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
        loading="lazy"
      />

      {/* hover image — reveal ตามตำแหน่งเมาส์ (หรือ crossfade ถ้า reduced motion) */}
      {hoverSrc ? (
        reduce ? (
          <motion.img
            src={hoverSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: hovering ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
        ) : (
          <motion.img
            src={hoverSrc}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ clipPath }}
          />
        )
      ) : null}

      {/* กรอบ + แต้มมุม */}
      <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
      <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-black/40 px-3 py-1 text-xs font-medium text-white backdrop-blur">
        hover to morph
      </div>
      <div className="pointer-events-none absolute bottom-3 right-3 h-10 w-10 rounded-full border border-white/25 bg-black/20 backdrop-blur" />
    </div>
  );
}
