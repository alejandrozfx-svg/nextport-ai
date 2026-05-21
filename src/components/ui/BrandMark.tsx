import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  showName?: boolean;
}

export function BrandMark({ size = "md", className, showName = true }: BrandMarkProps) {
  const sizes = { sm: "w-5 h-5 text-xs", md: "w-7 h-7 text-sm", lg: "w-9 h-9 text-base" };
  const textSizes = { sm: "text-xs", md: "text-sm", lg: "text-base" };
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn("rounded-lg flex items-center justify-center font-bold flex-shrink-0", sizes[size])}
        style={{ background: "var(--brand)", color: "#0A0D12" }}
      >
        N
      </div>
      {showName && (
        <span className={cn("font-semibold", textSizes[size])} style={{ color: "var(--ink)" }}>
          Nextport AI
        </span>
      )}
    </div>
  );
}
