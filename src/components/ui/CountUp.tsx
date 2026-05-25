"use client";

import { useEffect, useRef, useState } from "react";

/* CountUp (ADR-0002 A3).
 * Animates a number from 0 (or `from`) to `to` in `duration` ms with ease-out cubic.
 * Used in KPI cards/chips so the value lands with momentum instead of appearing flat.
 * Respects prefers-reduced-motion: that user gets the final value instantly. */

interface CountUpProps {
  to: number;
  from?: number;
  duration?: number; // ms, default 700
  decimals?: number; // default 0
  suffix?: string;
  prefix?: string;
  className?: string;
}

export function CountUp({
  to,
  from = 0,
  duration = 700,
  decimals = 0,
  suffix = "",
  prefix = "",
  className,
}: CountUpProps) {
  const [value, setValue] = useState(from);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(from);
  const toRef = useRef(to);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const reduced = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(to);
      return;
    }
    // Reset on prop change so a 5 → 10 transition restarts cleanly.
    startRef.current = null;
    fromRef.current = value; // animate from current displayed value, not always from 0
    toRef.current = to;
    function tick(now: number) {
      if (startRef.current === null) startRef.current = now;
      const elapsed = now - startRef.current;
      const t = Math.min(1, elapsed / duration);
      // ease-out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      const v = fromRef.current + (toRef.current - fromRef.current) * eased;
      setValue(v);
      if (t < 1) rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to, duration]);

  return (
    <span className={className}>
      {prefix}
      {value.toFixed(decimals)}
      {suffix}
    </span>
  );
}
