import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  icon?: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ title, description, icon = "file", action, className }: EmptyStateProps) {
  return (
    <div className={cn("empty-state py-8", className)}>
      <div className="empty-illustration" />
      <div className="icon-tile mt-1 h-9 w-9 rounded-xl text-[var(--brand)]">
        <AppIcon name={icon} size={16} />
      </div>
      {title && <h3 className="mt-3 text-sm font-semibold text-[var(--ink)]">{title}</h3>}
      {description && <p className="mt-1 max-w-sm text-xs leading-relaxed text-[var(--ink-4)]">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
