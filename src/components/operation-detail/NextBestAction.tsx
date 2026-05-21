import { Sparkles } from "lucide-react";

interface NextBestActionProps {
  summary: string | null;
  status: string;
  exceptionCount: number;
}

export function NextBestAction({ summary, status, exceptionCount }: NextBestActionProps) {
  const defaultMsg =
    exceptionCount > 0
      ? `This operation has ${exceptionCount} exception(s). Review and resolve all exceptions before approving. Use the Escalate button if any require compliance manager attention.`
      : status === "ready"
      ? "All documents are validated and no exceptions found. This operation is ready for approval."
      : "Review all extracted fields for accuracy and check that all required documents have been received.";

  return (
    <div
      className="p-4 rounded-xl"
      style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.2)" }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={13} style={{ color: "var(--brand)" }} />
        <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--brand)" }}>
          AI Recommendation
        </h3>
      </div>
      <p className="text-sm leading-relaxed" style={{ color: "var(--ink-2)" }}>
        {summary ?? defaultMsg}
      </p>
    </div>
  );
}
