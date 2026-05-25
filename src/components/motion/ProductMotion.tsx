import { cn } from "@/lib/utils";
import { AppIcon as Icon } from "@/components/ui/AppIcon";

type ScanState = "idle" | "scanning" | "done";
type ValidationState = "ok" | "warn" | "risk";
type ApprovalState = "idle" | "ready" | "approved";

interface MotionProps {
  className?: string;
}

export function DocumentScanIllustration({
  state = "idle",
  className,
}: MotionProps & { state?: ScanState }) {
  return (
    <div className={cn("motion-illustration document-scan-visual", className)} data-state={state}>
      <div className="scan-source scan-source-mail">
        <Icon name="mail" size={14} />
      </div>
      <div className="scan-source scan-source-cloud">
        <Icon name="cloud" size={14} />
      </div>

      <div className="scan-doc scan-doc-left">
        <span>INV</span>
        <i />
      </div>
      <div className="scan-doc scan-doc-center">
        <span>BL</span>
        <i />
      </div>
      <div className="scan-doc scan-doc-right">
        <span>MVE</span>
        <i />
      </div>

      <div className="scan-beam" aria-hidden="true" />

      <div className="scan-output">
        {[0, 1, 2].map((item) => (
          <span key={item} style={{ animationDelay: `${item * 180}ms` }} />
        ))}
      </div>
    </div>
  );
}

export function PipelineGlowIllustration({ className }: MotionProps) {
  const steps = [
    { icon: "mail", tone: "brand" },
    { icon: "file", tone: "brand" },
    { icon: "database", tone: "ok" },
    { icon: "shield_check", tone: "warn" },
    { icon: "eye", tone: "warn" },
    { icon: "zap", tone: "ok" },
  ] as const;

  return (
    <div className={cn("motion-illustration pipeline-glow-visual", className)} aria-hidden="true">
      <div className="pipeline-glow-line" />
      {steps.map((step, index) => (
        <div
          key={step.icon}
          className={`pipeline-glow-node pipeline-glow-node-${step.tone}`}
          style={{ animationDelay: `${index * 240}ms` }}
        >
          <Icon name={step.icon} size={14} />
        </div>
      ))}
    </div>
  );
}

export function CrossValidationIllustration({
  state = "ok",
  className,
}: MotionProps & { state?: ValidationState }) {
  const tone = state === "risk" ? "risk" : state === "warn" ? "warn" : "ok";

  return (
    <div className={cn("motion-illustration cross-validation-visual", className)} data-state={tone}>
      <div className="validation-doc validation-doc-left">
        <span>INV</span>
        <i />
        <i />
        <i />
      </div>
      <div className="validation-doc validation-doc-right">
        <span>PED</span>
        <i />
        <i />
        <i />
      </div>
      <div className="validation-link validation-link-top" />
      <div className="validation-link validation-link-bottom" />
      <div className="validation-pulse" />
      <div className="validation-result">
        <Icon name={tone === "risk" ? "alert" : tone === "warn" ? "info" : "check"} size={15} />
      </div>
    </div>
  );
}

export function ShieldApprovalIllustration({
  state = "idle",
  className,
}: MotionProps & { state?: ApprovalState }) {
  return (
    <div className={cn("motion-illustration shield-approval-visual", className)} data-state={state}>
      <div className="approval-document">
        <span />
        <span />
        <span />
      </div>
      <div className="approval-shield">
        <Icon name={state === "approved" ? "check" : "shield"} size={18} />
      </div>
      <div className="approval-hash">
        <span />
        <span />
      </div>
    </div>
  );
}

export function AISparkleBurst({ className }: MotionProps) {
  return (
    <span className={cn("ai-sparkle-burst", className)} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
    </span>
  );
}
