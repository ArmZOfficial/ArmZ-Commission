"use client";

import { motion, useReducedMotion, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

/** Magnetic hover — ดึงองค์ประกอบตามเมาส์ด้วย spring */
export function Magnetic({
  children,
  strength = 0.32,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 160, damping: 15, mass: 0.1 });
  const y = useSpring(0, { stiffness: 160, damping: 15, mass: 0.1 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y, display: "inline-block", willChange: "transform" }}
      onPointerMove={(e) => {
        if (reduce || !ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        x.set((e.clientX - rect.left - rect.width / 2) * strength);
        y.set((e.clientY - rect.top - rect.height / 2) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}
