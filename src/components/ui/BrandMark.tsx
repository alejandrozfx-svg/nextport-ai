import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  className?: string;
  /** When true, renders the small accent dot in the top-right corner. */
  withAccent?: boolean;
  /** Renders just the SVG glyph without the wrapping div. Use for tight inline placements. */
  glyphOnly?: boolean;
}

/**
 * Nextport AI brand mark.
 * A geometric "N" formed by two vertical bars + a diagonal bridge, sitting inside
 * a rounded square with a subtle deep-blue gradient. A small electric-teal accent
 * dot in the top-right corner represents the "AI" signal point.
 *
 * Scales cleanly from 16px (favicon) up to 96px (marketing hero).
 */
export function BrandMark({
  size = 28,
  className,
  withAccent = true,
  glyphOnly = false,
}: BrandMarkProps) {
  // Unique gradient IDs so multiple marks on the same page don't collide.
  const id = (suffix: string) => `bm-${suffix}-${size}`;

  const svg = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Nextport AI"
      role="img"
      style={{ display: "block", flexShrink: 0 }}
    >
      <defs>
        <linearGradient id={id("base")} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="oklch(0.42 0.07 235)" />
          <stop offset="0.55" stopColor="oklch(0.22 0.04 235)" />
          <stop offset="1" stopColor="oklch(0.10 0.02 235)" />
        </linearGradient>
        <linearGradient id={id("glyph")} x1="0" y1="6" x2="0" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.78" />
        </linearGradient>
        <radialGradient id={id("accent")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="oklch(0.92 0.13 195)" />
          <stop offset="1" stopColor="oklch(0.70 0.13 195)" />
        </radialGradient>
        <linearGradient id={id("highlight")} x1="0" y1="0" x2="0" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.22" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Rounded square background */}
      <rect x="0" y="0" width="32" height="32" rx="8" fill={`url(#${id("base")})`} />
      {/* Subtle inner highlight along the top edge for depth */}
      <rect x="0" y="0" width="32" height="14" rx="8" fill={`url(#${id("highlight")})`} />

      {/* Geometric N — left bar */}
      <rect x="8" y="8" width="3" height="16" rx="1.2" fill={`url(#${id("glyph")})`} />
      {/* Right bar */}
      <rect x="21" y="8" width="3" height="16" rx="1.2" fill={`url(#${id("glyph")})`} />
      {/* Diagonal bridge */}
      <path
        d="M11 9 L21 23"
        stroke={`url(#${id("glyph")})`}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* AI accent dot (top-right) */}
      {withAccent && (
        <>
          <circle cx="24" cy="8" r="3" fill={`url(#${id("accent")})`} />
          <circle cx="24" cy="8" r="3" fill="none" stroke="oklch(0.90 0.13 195 / 0.55)" strokeWidth="0.6" />
        </>
      )}

      {/* 1px inner hairline for crispness on the rounded corners */}
      <rect
        x="0.5"
        y="0.5"
        width="31"
        height="31"
        rx="7.5"
        fill="none"
        stroke="oklch(0.55 0.10 235 / 0.35)"
        strokeWidth="1"
      />
    </svg>
  );

  if (glyphOnly) return svg;

  return <div className={cn("inline-flex items-center justify-center", className)}>{svg}</div>;
}
