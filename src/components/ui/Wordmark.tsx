import { cn } from "@/lib/utils";

interface WordmarkProps {
  /** Size variant — controls the size of "Nextport". The AI mark scales relatively. */
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
  /** Override the default color (var(--ink)) — used in light hero backgrounds etc. */
  color?: string;
}

const SIZE_MAP = {
  xs: { word: "text-[13px]",   ai: "text-[8.5px]",  gap: "ml-1",   lift: "mt-[1px]" },
  sm: { word: "text-[15px]",   ai: "text-[9.5px]",  gap: "ml-1.5", lift: "mt-[2px]" },
  md: { word: "text-[18px]",   ai: "text-[10.5px]", gap: "ml-1.5", lift: "mt-[3px]" },
  lg: { word: "text-[24px]",   ai: "text-[12px]",   gap: "ml-2",   lift: "mt-[4px]" },
};

/**
 * Nextport AI wordmark with intentional typographic hierarchy:
 * - "Nextport" in Instrument Serif italic — the brand voice
 * - "AI" in JetBrains Mono small-caps with letter-spacing — the product/tech signal
 *
 * Pairs with <BrandMark /> in the header lockup.
 */
export function Wordmark({ size = "sm", className, color }: WordmarkProps) {
  const cfg = SIZE_MAP[size];

  return (
    <span
      className={cn("inline-flex items-baseline leading-none", className)}
      style={{ color: color ?? "var(--ink)" }}
    >
      <span
        className={cn("font-display italic tracking-tight", cfg.word)}
        style={{ letterSpacing: "-0.01em" }}
      >
        Nextport
      </span>
      <span
        className={cn("font-mono font-semibold uppercase", cfg.ai, cfg.gap, cfg.lift)}
        style={{
          letterSpacing: "0.16em",
          color: "var(--accent)",
        }}
      >
        AI
      </span>
    </span>
  );
}
