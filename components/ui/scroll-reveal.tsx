"use client";

import { useEffect, useRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  /** Delay in ms before the animation plays once in view (stagger support) */
  delay?: number;
}

/**
 * ScrollReveal
 * ─────────────────────────────────────────────────────────────────────────────
 * Lightweight IntersectionObserver wrapper.
 * Adds the 'in-view' class when the element scrolls into the viewport,
 * triggering the .animate-fade-up CSS transition defined in globals.css.
 *
 * No Framer Motion dependency — pure CSS + vanilla JS.
 */
export function ScrollReveal({ children, className, delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.classList.add("in-view");
          }, delay);
          observer.unobserve(el);          // fire once only
        }
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={cn("animate-fade-up", className)}>
      {children}
    </div>
  );
}
