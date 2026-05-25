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
 * A premium graphite mark inspired by customs seals and control-tower consoles:
 * deep black surface, crisp white N, and a small electric-teal AI signal.
 *
 * Scales cleanly from 16px (favicon) up to 96px (marketing hero).
 */
export function BrandMark({
  size = 28,
  className,
  withAccent = true,
  glyphOnly = false,
}: BrandMarkProps) {
  // Unique gradient IDs so multiple marks on the same page do not collide.
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
          <stop offset="0" stopColor="oklch(0.18 0.01 250)" />
          <stop offset="0.55" stopColor="oklch(0.095 0.012 250)" />
          <stop offset="1" stopColor="oklch(0.035 0.004 250)" />
        </linearGradient>
        <radialGradient id={id("halo")} cx="0.68" cy="0.22" r="0.72">
          <stop offset="0" stopColor="oklch(0.78 0.14 195 / 0.32)" />
          <stop offset="0.28" stopColor="oklch(0.62 0.12 215 / 0.14)" />
          <stop offset="1" stopColor="oklch(0.08 0.01 250 / 0)" />
        </radialGradient>
        <linearGradient id={id("glyph")} x1="9" y1="7" x2="22" y2="25" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="0.58" stopColor="#ffffff" stopOpacity="0.94" />
          <stop offset="1" stopColor="oklch(0.82 0.05 230)" stopOpacity="0.82" />
        </linearGradient>
        <radialGradient id={id("accent")} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="oklch(0.98 0.12 185)" />
          <stop offset="0.46" stopColor="oklch(0.86 0.15 190)" />
          <stop offset="1" stopColor="oklch(0.64 0.14 205)" />
        </radialGradient>
        <linearGradient id={id("highlight")} x1="0" y1="0" x2="0" y2="14" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="32" height="32" rx="10" fill={`url(#${id("base")})`} />
      <rect x="0" y="0" width="32" height="32" rx="10" fill={`url(#${id("halo")})`} />
      <rect x="1" y="1" width="30" height="13" rx="9" fill={`url(#${id("highlight")})`} />

      <path
        d="M10 23V9L22 23V9"
        stroke={`url(#${id("glyph")})`}
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M24 9V23" stroke="oklch(0.92 0.04 230 / 0.42)" strokeWidth="1.2" strokeLinecap="round" />

      {withAccent && (
        <>
          <circle cx="24.2" cy="7.6" r="4.1" fill="oklch(0.72 0.14 195 / 0.16)" />
          <circle cx="24.2" cy="7.6" r="2.7" fill={`url(#${id("accent")})`} />
          <circle cx="24.2" cy="7.6" r="2.7" fill="none" stroke="oklch(0.96 0.11 190 / 0.72)" strokeWidth="0.55" />
        </>
      )}

      <rect
        x="0.7"
        y="0.7"
        width="30.6"
        height="30.6"
        rx="9.3"
        fill="none"
        stroke="oklch(0.92 0.03 240 / 0.30)"
        strokeWidth="1"
      />
      <rect
        x="1.6"
        y="1.6"
        width="28.8"
        height="28.8"
        rx="8.4"
        fill="none"
        stroke="oklch(0.10 0.01 250 / 0.68)"
        strokeWidth="0.9"
      />
    </svg>
  );

  if (glyphOnly) return svg;

  return <div className={cn("inline-flex items-center justify-center", className)}>{svg}</div>;
}
