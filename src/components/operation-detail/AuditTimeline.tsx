import { formatDateTime } from "@/lib/utils";
import type { AuditEventData } from "@/types";

interface AuditTimelineProps {
  events: AuditEventData[];
  lang?: string;
}

const eventColors: Record<string, string> = {
  approved: "var(--ok)",
  correction_requested: "var(--warn)",
  escalated: "var(--risk)",
  exported: "var(--brand)",
  uploaded: "var(--brand)",
  classified: "var(--brand)",
  extracted: "var(--brand)",
  validated: "var(--warn)",
};

export function AuditTimeline({ events, lang = "en" }: AuditTimelineProps) {
  if (events.length === 0) {
    return <p className="text-xs" style={{ color: "var(--ink-4)" }}>No audit events yet.</p>;
  }

  return (
    <div className="space-y-3">
      {events.map((ev, i) => {
        const color = eventColors[ev.event] ?? "var(--ink-4)";
        return (
          <div key={ev.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0 mt-1"
                style={{ background: color }}
              />
              {i < events.length - 1 && (
                <div className="w-px flex-1 mt-1" style={{ background: "var(--hair)" }} />
              )}
            </div>
            <div className="pb-3 flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium" style={{ color: "var(--ink)" }}>
                  {ev.actor}
                </span>
                <span
                  className="text-xs px-1.5 py-0.5 rounded font-mono"
                  style={{ background: "var(--hair)", color }}
                >
                  {ev.event}
                </span>
              </div>
              {ev.detail && (
                <p className="text-xs" style={{ color: "var(--ink-3)" }}>
                  {ev.detail}
                </p>
              )}
              <p className="text-xs mt-1 font-mono" style={{ color: "var(--ink-4)" }}>
                {formatDateTime(ev.createdAt, lang)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
