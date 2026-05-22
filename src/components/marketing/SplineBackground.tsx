"use client";

import { Suspense, lazy } from "react";

const Spline = lazy(() => import("@splinetool/react-spline"));

interface SplineBackgroundProps {
  /** Spline scene URL (.splinecode) */
  scene: string;
  /** 0-1 — how dark the overlay is on top of the scene */
  overlayOpacity?: number;
}

export function SplineBackground({ scene, overlayOpacity = 0.5 }: SplineBackgroundProps) {
  return (
    <>
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-black" />}>
          <Spline scene={scene} className="h-full w-full" />
        </Suspense>
      </div>
      {/* Overlay so foreground glass + text stays readable on top of the 3D scene */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, rgba(0,0,0,${overlayOpacity * 0.6}), rgba(5,7,10,${overlayOpacity}) 55%, rgba(10,13,18,${overlayOpacity}))`,
        }}
      />
      <div className="absolute inset-0 grid-bg opacity-35" />
    </>
  );
}
