"use client";

/* Global page entrance animation (ADR-0002 A5).
 * Next.js App Router treats `template.tsx` as a per-navigation remount, so the
 * `page-fade-up` keyframe runs on every route change. Reduced-motion users get
 * the static fallback automatically because the keyframe is gated in globals.css. */
export default function RootTemplate({ children }: { children: React.ReactNode }) {
  return <div className="page-fade-up">{children}</div>;
}
