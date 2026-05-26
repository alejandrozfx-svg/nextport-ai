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
    <section className="relative z-10 mx-auto -mt-8 h-[150px] max-w-6xl px-4 pb-2 sm:-mt-12 sm:h-[180px] sm:px-6 lg:-mt-16 lg:h-[210px]">
      <div className="absolute inset-x-4 top-1/2 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent sm:inset-x-6" />
      <div className="absolute left-1/2 top-1/2 h-[280px] w-[280px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(122,176,224,0.16),rgba(21,191,167,0.07)_38%,transparent_70%)] blur-2xl" />
      <div className="relative mx-auto flex h-full w-full items-center justify-center">
        <div className="platform-workflow-lottie flex h-[220px] w-[220px] items-center justify-center rounded-full border border-white/10 bg-black/20 shadow-[0_24px_90px_rgba(0,0,0,0.42)] backdrop-blur-md sm:h-[260px] sm:w-[260px] lg:h-[300px] lg:w-[300px]">
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
