"use client";

import { useEffect, useRef, useState } from "react";

interface SplineBackgroundProps {
  /** Spline scene URL (.splinecode) */
  scene: string;
  /** 0-1 — how dark the overlay is on top of the scene. Keep low so the 3D shows through. */
  overlayOpacity?: number;
}

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "spline-viewer": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          url?: string;
          "loading-anim-type"?: string;
        },
        HTMLElement
      >;
    }
  }
}

const SPLINE_VIEWER_SRC =
  "https://unpkg.com/@splinetool/viewer@1.9.48/build/spline-viewer.js";

/**
 * Loads the official Spline `<spline-viewer>` Web Component from a CDN.
 * This bypasses the npm @splinetool/react-spline package, which currently has
 * an exports-field that does not resolve cleanly under Next.js 15 webpack.
 */
export function SplineBackground({ scene, overlayOpacity = 0.25 }: SplineBackgroundProps) {
  const [ready, setReady] = useState(false);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Reuse the loader if it's already on the page.
    const existing = document.querySelector<HTMLScriptElement>(
      `script[data-spline-viewer]`,
    );
    if (existing && customElements.get("spline-viewer")) {
      setReady(true);
      return;
    }
    if (existing) {
      existing.addEventListener("load", () => setReady(true), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.type = "module";
    script.src = SPLINE_VIEWER_SRC;
    script.setAttribute("data-spline-viewer", "true");
    script.addEventListener("load", () => setReady(true), { once: true });
    document.head.appendChild(script);
    scriptRef.current = script;
  }, []);

  return (
    <>
      {/* Base dark color shown until the WebGL canvas paints. */}
      <div className="absolute inset-0 bg-[#05070A]" />

      {/* Spline 3D scene */}
      {ready && (
        <div className="absolute inset-0">
          <spline-viewer
            url={scene}
            loading-anim-type="none"
            style={{
              width: "100%",
              height: "100%",
              display: "block",
            }}
          />
        </div>
      )}

      {/* Subtle vignette so the foreground content stays readable — kept light so the 3D scene is clearly visible. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `radial-gradient(120% 80% at 50% 50%, transparent 0%, rgba(5,7,10,${overlayOpacity * 0.4}) 60%, rgba(5,7,10,${overlayOpacity}) 100%)`,
        }}
      />
    </>
  );
}
