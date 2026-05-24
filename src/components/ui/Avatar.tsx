"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  src?: string | null;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  alt?: string;
}

const sizes = {
  sm: { box: "w-6 h-6 text-xs",  px: 24 },
  md: { box: "w-8 h-8 text-sm",  px: 32 },
  lg: { box: "w-10 h-10 text-base", px: 40 },
};

export function Avatar({ initials, src, size = "md", color, className, alt }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = src && !imgFailed;
  const cfg = sizes[size];

  return (
    <div
      className={cn(
        "avatar-ring rounded-full flex items-center justify-center font-semibold flex-shrink-0 overflow-hidden",
        cfg.box,
        className
      )}
      style={{
        background: color ?? "var(--brand-soft)",
        color: color ? "#fff" : "var(--brand)",
        border: "1px solid var(--hair-2)",
      }}
    >
      {showImg ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src!}
          alt={alt ?? initials}
          width={cfg.px}
          height={cfg.px}
          onError={() => setImgFailed(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      ) : (
        initials
      )}
    </div>
  );
}
