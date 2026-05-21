import { cn } from "@/lib/utils";

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  tight?: boolean;
  liquid?: boolean;
  style?: React.CSSProperties;
}

export function GlassPanel({ children, className, tight, liquid, style }: GlassPanelProps) {
  return (
    <div
      className={cn(
        liquid ? "liquid-glass" : tight ? "glass-panel-tight" : "glass-panel",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
