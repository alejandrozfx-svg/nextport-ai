import { cn } from "@/lib/utils";

interface AvatarProps {
  initials: string;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
}

export function Avatar({ initials, size = "md", color, className }: AvatarProps) {
  const sizes = { sm: "w-6 h-6 text-xs", md: "w-8 h-8 text-sm", lg: "w-10 h-10 text-base" };
  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold flex-shrink-0",
        sizes[size],
        className
      )}
      style={{ background: color ?? "var(--brand-soft)", color: color ? "#fff" : "var(--brand)", border: "1px solid var(--hair-2)" }}
    >
      {initials}
    </div>
  );
}
