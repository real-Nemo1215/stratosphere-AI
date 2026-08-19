"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

/* ─────────────────────────────────────────────────────────────────────────────
 * Type Definitions
 * ─────────────────────────────────────────────────────────────────────────── */
export interface StickyCardProps {
  /** 0-indexed position in the stack (used for z-index, offset, and scroll range) */
  index: number;
  /** Total count of items in the stack */
  total: number;
  /** Shared scroll progress (0 to 1) from the parent container */
  progress: MotionValue<number>;
  /** Optional sticky top offset in pixels (defaults to 100px / ~6.25rem) */
  topOffset?: number;
  /** Asymmetric or custom border radius (defaults to Ventriloc 6px 0px 0px 0px) */
  className?: string;
  children: React.ReactNode;
}

export interface StickyStackProps {
  children: (progress: MotionValue<number>) => React.ReactNode;
  className?: string;
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 1. StickyStack Container
 * ─────────────────────────────────────────────────────────────────────────────
 * The parent wrapper tracks overall scroll progress of the stacked sections.
 * Framer Motion's useScroll is targeted to this container from "start start"
 * (when the top of the container hits top of viewport) to "end end".
 */
export function StickyStack({ children, className }: StickyStackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      {children(scrollYProgress)}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
 * 2. StickyStackCard
 * ─────────────────────────────────────────────────────────────────────────────
 * Visual & Motion Behavior:
 * 1. Native CSS Stacking:
 *    - Uses `md:sticky` so the browser's compositor handles the physical pinning
 *      without layout thrashing.
 *    - `top` offset stacks each card cleanly (with slight stagger so headers peek).
 *    - `z-index` increases per card (`index + 1`) ensuring later cards slide OVER
 *      earlier cards.
 * 2. 3D Depth Transforms (Framer Motion):
 *    - As subsequent cards scroll into view, earlier cards scale down (1.0 -> 0.94).
 *    - A semi-transparent Graphite overlay fades in (0% -> 25% opacity) to
 *      mimic realistic atmospheric occlusion.
 *    - The last card (index === total - 1) does not scale down since nothing overlaps it.
 * 3. Mobile Responsiveness:
 *    - On mobile (< 768px), sticky and transforms are disabled; cards stack naturally.
 */
export function StickyStackCard({
  index,
  total,
  progress,
  topOffset = 110,
  className,
  children,
}: StickyCardProps) {
  const isLast = index === total - 1;

  // Calculate the scroll window during which THIS card is overlapped by subsequent cards
  // Card i starts scaling down once progress passes its threshold
  const startRange = index / total;
  const endRange = Math.min((index + 1.2) / total, 1);

  // Scale: 1 down to 0.94 as user scrolls past (disabled for the last card)
  const targetScale = 1 - (total - 1 - index) * 0.03;
  const scale = useTransform(
    progress,
    [startRange, endRange],
    isLast ? [1, 1] : [1, Math.max(targetScale, 0.92)]
  );

  // Graphite Dimming Overlay: 0 -> 0.25 opacity
  const overlayOpacity = useTransform(
    progress,
    [startRange, endRange],
    isLast ? [0, 0] : [0, 0.28]
  );

  // Progressive sticky top offset (each card rests slightly below or aligned)
  // Desktop: sticky with offset; Mobile: relative static layout
  const stickyTop = topOffset + index * 16;

  return (
    <div
      className="relative md:sticky w-full mb-8 md:mb-20 last:mb-0"
      style={{
        top: `${stickyTop}px`,
        zIndex: index + 1,
      }}
    >
      <motion.div
        style={{
          scale,
          transformOrigin: "top center",
        }}
        className={cn(
          // Ventriloc signature asymmetric radius: 6px 0px 0px 0px
          "relative overflow-hidden [border-radius:6px_0px_0px_0px] border border-border transition-colors duration-300",
          className
        )}
      >
        {/* Main Card Content */}
        {children}

        {/* 3D Depth Dimming Overlay */}
        <motion.div
          aria-hidden="true"
          style={{ opacity: overlayOpacity }}
          className="pointer-events-none absolute inset-0 bg-foreground/10 dark:bg-black/40 z-20 transition-opacity"
        />
      </motion.div>
    </div>
  );
}
