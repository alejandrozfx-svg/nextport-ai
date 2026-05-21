"use client";

import { useState, useEffect } from "react";
import { Shield, CheckCircle2, Clock, User, AlertCircle } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface AuditEvent {
  id: string;
  actor: string;
  event: string;
  detail: string | null;
  createdAt: string;
  operationId: string | null;
  user: { name: string; initials: string } | null;
}

const roles = [
  { role: "Admin", permissions: ["Full access", "User management", "Audit log", "Settings", "Approvals"] },
  { role: "Manager", permissions: ["Approve operations", "View audit log", "Intelligence", "Read all"] },
  { role: "Analyst", permissions: ["Review documents", "Flag exceptions", "Academy", "Read operations"] },
  { role: "Coordinator", permissions: ["Upload documents", "Track ETAs", "View operations"] },
];

const complianceBadges = [
  { label: "SOC 2 Type II", status: "In Progress", color: "var(--warn)" },
  { label: "ISO 27001", status: "In Progress", color: "var(--warn)" },
  { label: "GDPR", status: "Compliant", color: "var(--ok)" },
  { label: "SAT NOM-151", status: "Compliant", color: "var(--ok)" },
];

export function SecurityPage() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/audit?page=${page}&limit=20`)
      .then((r) => r.json())
      .then((d) => {
        setEvents(d.events ?? []);
        setTotal(d.total ?? 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [page]);

  const eventColor: Record<string, string> = {
    approved: "var(--ok)",
    correction_requested: "var(--warn)",
    escalated: "var(--risk)",
    exported: "var(--brand)",
    uploaded: "var(--brand)",
    classified: "var(--brand)",
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>Security & Audit</h2>
        <p className="text-sm" style={{ color: "var(--ink-4)" }}>
          Immutable audit trail · Role-based access control · Compliance readiness
        </p>
      </div>

      {/* Compliance badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {complianceBadges.map((b) => (
          <div
            key={b.label}
            className="glass-panel p-4 flex flex-col items-center gap-2 text-center"
          >
            <Shield size={20} style={{ color: b.color }} />
            <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{b.label}</p>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ background: b.color + "22", color: b.color }}
            >
              {b.status}
            </span>
          </div>
        ))}
      </div>

      {/* Role matrix */}
      <div className="glass-panel overflow-hidden">
        <div
          className="px-4 py-3"
          style={{ borderBottom: "1px solid var(--hair)", background: "rgba(255,255,255,0.015)" }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
            Role Permission Matrix
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--hair)" }}>
                <th className="text-left px-4 py-2 text-xs font-medium" style={{ color: "var(--ink-4)" }}>Role</th>
                <th className="text-left px-4 py-2 text-xs font-medium" style={{ color: "var(--ink-4)" }}>Permissions</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.role} style={{ borderBottom: "1px solid var(--hair)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User size={13} style={{ color: "var(--brand)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>{r.role}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1.5">
                      {r.permissions.map((p) => (
                        <span
                          key={p}
                          className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                          style={{ background: "var(--hair)", color: "var(--ink-3)" }}
                        >
                          <CheckCircle2 size={9} style={{ color: "var(--ok)" }} />
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit trail */}
      <div className="glass-panel overflow-hidden">
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--hair)", background: "rgba(255,255,255,0.015)" }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
            Audit Trail ({total} events)
          </h3>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--ok)" }}>
            <CheckCircle2 size={11} />
            Tamper-proof log
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--ink-4)" }}>Loading…</div>
        ) : (
          <>
            <div className="divide-y" style={{ borderColor: "var(--hair)" }}>
              {events.map((ev) => {
                const color = eventColor[ev.event] ?? "var(--ink-4)";
                return (
                  <div key={ev.id} className="flex items-start gap-3 px-4 py-3">
                    <div
                      className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5"
                      style={{ background: color }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>
                          {ev.actor}
                        </span>
                        <span
                          className="text-xs px-1.5 py-0.5 rounded font-mono"
                          style={{ background: "var(--hair)", color }}
                        >
                          {ev.event}
                        </span>
                        {ev.operationId && (
                          <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
                            {ev.operationId}
                          </span>
                        )}
                      </div>
                      {ev.detail && (
                        <p className="text-xs mt-0.5" style={{ color: "var(--ink-3)" }}>{ev.detail}</p>
                      )}
                    </div>
                    <span className="text-xs font-mono flex-shrink-0" style={{ color: "var(--ink-4)" }}>
                      {formatDateTime(ev.createdAt)}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {total > 20 && (
              <div className="flex justify-center gap-2 p-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded-lg text-xs disabled:opacity-40"
                  style={{ border: "1px solid var(--hair-2)", color: "var(--ink-3)" }}
                >
                  Previous
                </button>
                <span className="px-3 py-1 text-xs" style={{ color: "var(--ink-4)" }}>
                  Page {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 20 >= total}
                  className="px-3 py-1 rounded-lg text-xs disabled:opacity-40"
                  style={{ border: "1px solid var(--hair-2)", color: "var(--ink-3)" }}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
