"use client";

import { createElement, useEffect, useState } from "react";
import { GitBranch } from "lucide-react";

const PLATFORM_WORKFLOW_LOTTIE =
  "https://lottie.host/f5dd7938-6210-4f97-a762-652eb99b829a/fwzWvzuvwA.lottie";

export function PlatformWorkflowLottie() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;

    import("@lottiefiles/dotlottie-wc")
      .then(() => {
        if (mounted) setReady(true);
      })
      .catch(() => {
        if (mounted) setReady(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <section className="relative z-10 mx-auto max-w-6xl overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:py-12">
      <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:inset-x-6" />
      <div className="absolute left-1/2 top-1/2 h-[240px] w-[240px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(122,176,224,0.14),rgba(21,191,167,0.05)_38%,transparent_70%)] blur-2xl" />
      <div className="relative mx-auto flex w-full items-center justify-center">
        <div className="platform-workflow-lottie pointer-events-none flex h-[160px] w-[160px] items-center justify-center rounded-full border border-white/10 bg-black/25 shadow-[0_18px_70px_rgba(0,0,0,0.36)] backdrop-blur-md sm:h-[190px] sm:w-[190px] lg:h-[220px] lg:w-[220px]">
          {ready ? (
            createElement("dotlottie-wc", {
              src: PLATFORM_WORKFLOW_LOTTIE,
              autoplay: true,
              loop: true,
              backgroundColor: "#00000000",
              style: { width: "100%", height: "100%" },
              "aria-label": "Animated import operation workflow",
            })
          ) : (
            <GitBranch className="text-[color:var(--brand)]" size={34} strokeWidth={1.5} />
          )}
        </div>
      </div>
    </section>
  );
}
