import { AppIcon } from "./AppIcon";
import { cn } from "@/lib/utils";

type ToastTone = "ok" | "risk" | "warn" | "brand";

interface ToastProps {
  tone?: ToastTone;
  title: React.ReactNode;
  detail?: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

const TONE_ICON: Record<ToastTone, string> = {
  ok: "check",
  risk: "flag",
  warn: "alert",
  brand: "sparkle",
};

export function Toast({ tone = "brand", title, detail, onClose, className }: ToastProps) {
  return (
    <div className={cn("toast-card flex items-start gap-3 rounded-xl p-3", className)}>
      <div className="icon-tile h-7 w-7 rounded-full" style={{ color: `var(--status-${tone})` }}>
        <AppIcon name={TONE_ICON[tone]} size={14} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12.5px] font-medium text-[var(--ink)]">{title}</div>
        {detail && <div className="text-[11.5px] text-[var(--ink-3)]">{detail}</div>}
      </div>
      {onClose && (
        <button className="btn btn-sm btn-ghost h-7 w-7 justify-center p-0" type="button" onClick={onClose}>
          <AppIcon name="x" size={12} />
        </button>
      )}
    </div>
  );
}
