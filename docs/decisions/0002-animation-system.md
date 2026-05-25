# ADR 0002 · Animation system

**Date:** 2026-05-23
**Status:** Accepted (in progress)
**Scope:** App-wide motion, microinteractions, SVG illustrations, optional Lottie/Spline assets.

## Context

The app feels static. Cards do not lift on hover consistently, loading states use generic shimmer, KPIs appear instantly with no entrance, filtering snaps without transitions, risk flags do not draw the eye, the AI moments (scan/extract/validate) have no visual storytelling. Compliance apps benefit from restraint, but zero motion reads as "static page" not "live workspace."

## Decision

Ship motion in three waves, prioritizing what comes 100% from code over external assets:

- **Wave 1 — Microinteractions** (code only, no external assets). High-impact, brand-coherent, theme-aware.
- **Wave 2 — SVG illustrations + CSS backgrounds** (code only). Hand-built scan lines, pipeline glow, cross-validation animations, aurora mesh.
- **Wave 3 — External assets via Chrome plugin** (Lottie + optional Spline/Pexels). Reserved for 1-2 cinematic AI moments where hand-made falls short.

## Principles

1. **Animation must have a job.** Decoration is rejected. Every motion either:
   - communicates state change (skeleton → loaded, idle → syncing)
   - draws attention to risk (pulse on risk flags)
   - explains the AI pipeline (scan line, extraction lines)
   - confirms action (toast, button press, check stamp)
2. **No animation on the high-cognition surfaces.** Operations table rows do not loop. KPIs do not pulse. Approval rail does not flash. The reviewer's focus matters more than the app's vanity.
3. **Theme-aware.** All custom animations work in dark and light mode without separate variants.
4. **Reduced motion respected.** Wrap heavy animations in `@media (prefers-reduced-motion: no-preference)`.
5. **Performance budget:** total animation JS overhead ≤ 35 KB. Spline/Lottie lazy-loaded only.

## Execution log

Filled in as waves ship. See bottom of file for "Wave X" sections.

## Behavior contract for future agents

1. Reuse the `<Toast>`, `<Skeleton>`, `<CountUp>` primitives from `src/components/ui/`. Do not roll your own.
2. CSS keyframes live in `src/app/globals.css` under `/* ============ Motion ============ */`. Add new ones there, do not inline.
3. If you need a Lottie, put it under `public/lotties/` with a short comment explaining the source license. Use `<LottiePlayer>` wrapper.
4. Risk pulse is reserved for `chip-risk` and risk dots only. Do not apply to warn/ok.
5. Page transitions are global via `app/template.tsx`. Do not add per-page transitions.

---

## Waves

### Wave 1 — Microinteractions (shipped)

Shipped in commit `7a7e6b7`:
- A1 Toast system global
- A2 Skeleton loaders by component type
- A3 Number count-up in KPIs
- A4 Row stagger on filter change
- A5 Page fade-up transitions
- A6 Pulse on risk dots
- A7 Hover lift on cards
- A8 Sync spinners on Integrations
- A9 Assistant typing indicator
- A10 Drawer/modal scale-fade

### Wave 2 — SVG illustrations + background motion (shipped)

Shipped by Codex on top of `7a7e6b7`:
- B1 Document scan visual in UploadModal, plus active scan beam during processing
- B2 Pipeline 6-step sequential glow visual and step-card glow
- B3 Cross-validation animation in the Documents EvidenceViewer
- B4 Shield check verification in Operation Detail human-review rails
- B5 AI sparkle burst on classified document chips
- E1 Aurora mesh on landing, inherited from Wave 1 landing update
- E2 Grid pulse on `/console/pipeline`
- E3 Noise layer drift on the global app background

Implementation note: Wave 2 lives in `src/components/motion/ProductMotion.tsx` with CSS in `src/app/globals.css`. Keep future product motion there unless a motion is truly one-off.

### Wave 3 — Chrome-sourced assets (pending)

Items planned:
- C1 Lottie: document scan / file processing for UploadModal
- C2 Lottie: field extraction for EvidenceViewer
- D1 Optional: Spline community scene for /console/intelligence
- F1 Optional: Pexels container/port video for marketing pages

---

## Handoff notes

If Claude session ends mid-wave, Codex/next agent should:
1. Read the latest "Wave X" section in this file
2. Check `git log --oneline` for "anim:" prefixed commits
3. Pick up at the next unchecked item
4. Update this file as items ship
