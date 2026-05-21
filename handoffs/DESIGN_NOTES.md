# Nextport AI — Design Notes

Source of truth for visual design decisions. Read before touching styles.

---

## Design personality

"Control tower + audit workspace." More operational tool than consumer app. Think Bloomberg Terminal meets Notion — dark, precise, information-dense but not cluttered. Avoid neon gradients or gaming aesthetics.

---

## Color system

All colors are CSS custom properties on `:root` in `src/app/globals.css`. Never hardcode hex values in components — use `var(--*)` instead.

### Core palette

| Variable | Value | Use |
|----------|-------|-----|
| `--bg` | `#0A0D12` | Page/canvas background |
| `--bg-2` | `#0F1318` | Sidebar, elevated surfaces |
| `--ink` | `#ffffff` | Primary text |
| `--ink-2` | `rgba(255,255,255,0.72)` | Secondary text |
| `--ink-3` | `rgba(255,255,255,0.48)` | Tertiary text, labels |
| `--ink-4` | `rgba(255,255,255,0.30)` | Disabled, placeholders |
| `--hair` | `rgba(255,255,255,0.08)` | Borders, dividers |
| `--hair-2` | `rgba(255,255,255,0.14)` | Slightly stronger borders |

### Semantic colors

| Variable | Value | Use |
|----------|-------|-----|
| `--brand` | `oklch(0.78 0.09 235)` | Steel blue — primary, brand |
| `--brand-soft` | `oklch(0.78 0.09 235 / 0.14)` | Brand chip backgrounds |
| `--risk` | `oklch(0.70 0.16 25)` | Alert red — risk/error |
| `--risk-soft` | `oklch(0.70 0.16 25 / 0.14)` | Risk chip backgrounds |
| `--warn` | `oklch(0.82 0.14 78)` | Amber — warning/review |
| `--warn-soft` | `oklch(0.82 0.14 78 / 0.14)` | Warn chip backgrounds |
| `--ok` | `oklch(0.78 0.13 155)` | Green — success/ready |
| `--ok-soft` | `oklch(0.78 0.13 155 / 0.14)` | Ok chip backgrounds |

**Why oklch?** Better perceptual uniformity than hex. Amber at `0.82 0.14 78` and green at `0.78 0.13 155` have the same perceived lightness — they read equally "light" in a dark UI.

---

## Typography

```
font-family: 'Geist'            → All UI text, labels, buttons
font-family: 'Instrument Serif' → Page headings, hero text only
font-family: 'JetBrains Mono'   → IDs, codes, numeric data, pedimento numbers
```

Loaded via Google Fonts in `globals.css`. Tailwind aliases: `font-sans`, `font-display`, `font-mono`.

**Scale in use:**
- `text-xs` (12px) — labels, secondary info, table metadata
- `text-sm` (14px) — table body, sidebar nav, card content
- `text-base` (16px) — subheadings, card titles
- `text-xl` / `text-2xl` — section headings
- `text-5xl` / `text-6xl` — landing hero only

---

## Glass system

Three glass levels defined in `globals.css`:

### `.glass-panel` (medium glass — main cards)
```css
background: rgba(255, 255, 255, 0.025);
backdrop-filter: blur(14px) saturate(140%);
border: 1px solid var(--hair);
border-radius: 14px;
box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 30px 60px -30px rgba(0,0,0,0.5);
```
**Use for:** Operations table container, operation detail panels, stat cards.

### `.glass-panel-tight` (tight glass — compact cards)
```css
background: rgba(255,255,255,0.03);
border: 1px solid var(--hair);
border-radius: 12px;
```
**Use for:** Filter bars, small info cards, integration status rows.

### `.liquid-glass` (true liquid glass — nav, hero)
Adds a gradient border via `::before` pseudo-element that creates the Apple-style liquid glass look. More expensive — only use in the landing page nav.

---

## Layout

Console shell is a CSS grid:
```
sidebar (240px fixed) | content area (flex-1)
```

Top bar is 56px, part of the content column, not the sidebar. Content area scrolls independently.

**Don't change the sidebar width** — it's referenced directly in `Sidebar.tsx` and `ConsoleShell.tsx`.

---

## Component patterns

### RiskChip
`src/components/ui/RiskChip.tsx`
Rounded pill with a colored dot. Accepts `kind: "risk" | "warn" | "ok" | "brand" | "neutral"` and an optional `pulse` boolean for the pulsing ring animation on risk operations.

### GlassPanel
`src/components/ui/GlassPanel.tsx`
Thin wrapper that applies `.glass-panel` and accepts `tight` prop for `.glass-panel-tight`. Use it instead of writing glass styles inline.

### Avatar
`src/components/ui/Avatar.tsx`
Circular avatar with initials. Accepts `size: "sm" | "md" | "lg"`. Color is derived from initials using a fixed palette of dark background colors.

### BrandMark
`src/components/ui/BrandMark.tsx`
The Nextport AI logo mark — radial gradient square with nested inner mark. Do not change this without updating the brand.

---

## Status color rules

| Status | Left border | Chip | Dot |
|--------|------------|------|-----|
| At risk | `var(--risk)` 3px inset | `chip-risk` | pulsing red dot |
| Needs review | `var(--warn)` 3px inset | `chip-warn` | amber dot |
| Ready | `var(--ok)` 3px inset | `chip-ok` | green dot |

Table rows have a 3px left border rule as a quick visual status scan. Do not remove this pattern.

---

## Interaction patterns

- **Hover state:** `rgba(255,255,255,0.02)` background lift
- **Active state:** `rgba(255,255,255,0.06)` + inset border
- **Focus ring:** Brand blue, `outline: 2px solid var(--brand)`
- **Transitions:** `150ms ease` for color/background, no transform on most elements
- **Animations:**
  - `.fade-up` — 350ms, used on cards appearing
  - `.shimmer` — loading skeleton
  - `.pulse-risk` — attention indicator for at-risk items

---

## Background treatment

Page background is never plain `#0A0D12`. Always has a radial gradient overlay:
```css
background:
  radial-gradient(ellipse 80% 60% at 50% -10%, oklch(0.78 0.09 235 / 0.12) 0%, transparent 60%),
  radial-gradient(ellipse 40% 40% at 80% 80%, oklch(0.70 0.16 25 / 0.06) 0%, transparent 60%),
  var(--bg);
```

The console `app-main` area also has a subtle grid overlay (`grid-bg` class) for the "control tower" feel.

---

## Known design tradeoffs

1. **No dark mode toggle** — the entire app is dark-only. Adding light mode would require duplicating all CSS variables.
2. **Fixed sidebar width** — works well at 1280px+. Below 1024px needs a hamburger toggle (see TASK-09).
3. **oklch requires modern browsers** — Safari 16+, Chrome 111+, Firefox 113+. This is acceptable for an enterprise B2B product.
4. **Instrument Serif from Google Fonts** — network dependency. Consider self-hosting for production.
5. **No CSS modules** — everything is Tailwind + global CSS. This works at this scale but could become harder to maintain with many more components.
