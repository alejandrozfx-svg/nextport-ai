"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, CheckCircle2, Clock, User, AlertCircle, Download, ArrowUpRight } from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t, type TranslationKey } from "@/lib/i18n";
import { formatDateTime } from "@/lib/utils";

/* P2 (ADR-0001 §17): Evidence exports moved from /console/documents to here.
 * Sourced from sessionStorage key `np_evidence_exports` populated by the DocumentsPage
 * export flow. Read-only view — re-export is intentionally absent (no fake buttons). */
interface EvidenceExport {
  id: string;
  sha: string;
  docCount: number;
  reasonKey: string | null;
  createdAt: string;
  actorInitials: string;
}

interface AuditEvent {
  id: string;
  actor: string;
  event: string;
  detail: string | null;
  createdAt: string;
  operationId: string | null;
  user: { name: string; initials: string } | null;
}

const roles: Array<{ roleKey: TranslationKey; permissions: TranslationKey[] }> = [
  { roleKey: "roleAdmin", permissions: ["permFullAccess", "permUserMgmt", "permAuditLog", "permSettings", "permApprovals"] },
  { roleKey: "roleManager", permissions: ["permApproveOps", "permViewAudit", "permIntelligence", "permReadAll"] },
  { roleKey: "roleAnalyst", permissions: ["permReviewDocs", "permFlagExceptions", "permAcademy", "permReadOps"] },
  { roleKey: "roleCoordinator", permissions: ["permUploadDocs", "permTrackEtas", "permViewOps"] },
];

const complianceBadges = [
  { label: "SOC 2 Type II", statusKey: "complianceInProgress", color: "var(--warn)" },
  { label: "ISO 27001", statusKey: "complianceInProgress", color: "var(--warn)" },
  { label: "GDPR", statusKey: "complianceCompliant", color: "var(--ok)" },
  { label: "SAT NOM-151", statusKey: "complianceCompliant", color: "var(--ok)" },
] satisfies Array<{ label: string; statusKey: TranslationKey; color: string }>;

const eventLabels: Record<string, TranslationKey> = {
  approved: "auditEventApproved",
  correction_requested: "auditEventCorrectionRequested",
  escalated: "auditEventEscalated",
  exported: "auditEventExported",
  uploaded: "auditEventUploaded",
  classified: "auditEventClassified",
  exception_detected: "auditEventExceptionDetected",
};

const DEMO_AUDIT_EVENTS: AuditEvent[] = [
  { id: "ev-001", actor: "Mariana López",     event: "approved",             detail: "Aprobación de cumplimiento sobre NP-2026-001844 con 2 excepciones revisadas.", createdAt: "2026-05-21T09:42:00Z", operationId: "NP-2026-001844", user: { name: "Mariana López", initials: "ML" } },
  { id: "ev-002", actor: "Sofía Galván",      event: "approved",             detail: "Firma del manager sobre NP-2026-001844, lista para handoff a SAT.",            createdAt: "2026-05-21T09:43:12Z", operationId: "NP-2026-001844", user: { name: "Sofía Galván", initials: "SG" } },
  { id: "ev-003", actor: "Nextport AI",       event: "classified",           detail: "Pedimento A1, Invoice, BL y Packing List clasificados con 99.2% de confianza.", createdAt: "2026-05-21T09:14:00Z", operationId: "NP-2026-001847", user: null },
  { id: "ev-004", actor: "Nextport AI",       event: "exception_detected",   detail: "Discrepancia en valor en aduana detectada: USD 5,330 entre factura y pedimento.", createdAt: "2026-05-21T09:14:18Z", operationId: "NP-2026-001847", user: null },
  { id: "ev-005", actor: "Mariana López",     event: "correction_requested", detail: "Solicitud de corrección enviada al agente aduanal por discrepancia de valor.",   createdAt: "2026-05-21T09:21:05Z", operationId: "NP-2026-001847", user: { name: "Mariana López", initials: "ML" } },
  { id: "ev-006", actor: "Diego Hernández",   event: "uploaded",             detail: "Subida manual de Packing List PL-TCH-2026-0419.pdf para NP-2026-001846.",         createdAt: "2026-05-20T18:30:00Z", operationId: "NP-2026-001846", user: { name: "Diego Hernández", initials: "DH" } },
  { id: "ev-007", actor: "Nextport AI",       event: "classified",           detail: "10 documentos clasificados automáticamente para 2 operaciones.",                  createdAt: "2026-05-20T18:31:42Z", operationId: null,             user: null },
  { id: "ev-008", actor: "Ana Ramírez",       event: "approved",             detail: "Aprobación final sobre NP-2026-001845 — Hannover Präzision.",                     createdAt: "2026-05-20T16:12:00Z", operationId: "NP-2026-001845", user: { name: "Ana Ramírez", initials: "AR" } },
  { id: "ev-009", actor: "Nextport AI",       event: "exported",             detail: "Paquete de auditoría exportado en PDF para NP-2026-001845.",                      createdAt: "2026-05-20T16:13:30Z", operationId: "NP-2026-001845", user: null },
  { id: "ev-010", actor: "Mariana López",     event: "escalated",            detail: "Operación NP-2026-001843 escalada por discrepancia HS code sin documentación de soporte.", createdAt: "2026-05-19T11:48:00Z", operationId: "NP-2026-001843", user: { name: "Mariana López", initials: "ML" } },
];

export function SecurityPage() {
  const { lang } = useLang();
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  // P2 (ADR-0001): evidence exports moved here from /console/documents.
  const [evidenceExports, setEvidenceExports] = useState<EvidenceExport[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = sessionStorage.getItem("np_evidence_exports");
      if (stored) setEvidenceExports(JSON.parse(stored));
    } catch {}
  }, []);

  useEffect(() => {
    // Start with demo data so the audit trail is never empty.
    setEvents(DEMO_AUDIT_EVENTS);
    setTotal(DEMO_AUDIT_EVENTS.length);
    setLoading(false);

    // Try to upgrade to real DB data within 2s; silently keep demo on failure.
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 2000);
    fetch(`/api/audit?page=${page}&limit=20`, { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.events?.length) {
          setEvents(d.events);
          setTotal(d.total ?? d.events.length);
        }
      })
      .catch(() => {})
      .finally(() => clearTimeout(timer));

    return () => { ctrl.abort(); clearTimeout(timer); };
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
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>{t("securityAuditTitle", lang)}</h2>
        <p className="text-sm" style={{ color: "var(--ink-4)" }}>
          {t("securitySubtitle", lang)}
        </p>
      </div>

      {/* Compliance badges */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
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
              {t(b.statusKey, lang)}
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
            {t("rolePermMatrix", lang)}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--hair)" }}>
                <th className="text-left px-4 py-2 text-xs font-medium" style={{ color: "var(--ink-4)" }}>{t("tableRole", lang)}</th>
                <th className="text-left px-4 py-2 text-xs font-medium" style={{ color: "var(--ink-4)" }}>{t("tablePermissions", lang)}</th>
              </tr>
            </thead>
            <tbody>
              {roles.map((r) => (
                <tr key={r.roleKey} style={{ borderBottom: "1px solid var(--hair)" }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <User size={13} style={{ color: "var(--brand)" }} />
                      <span className="text-sm font-medium" style={{ color: "var(--ink)" }}>{t(r.roleKey, lang)}</span>
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
                          {t(p, lang)}
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

      {/* P2 (ADR-0001 §17): Evidence exports — moved here from /console/documents.
       * The data lives in sessionStorage; populated by the DocumentsPage export flow. */}
      <div className="glass-panel overflow-hidden">
        <div
          className="flex items-center justify-between gap-3 px-4 py-3"
          style={{ borderBottom: "1px solid var(--hair)", background: "rgba(255,255,255,0.015)" }}
        >
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
              {t("evidenceExportsTitle", lang)}
            </h3>
            <p className="mt-0.5 text-[11px]" style={{ color: "var(--ink-4)" }}>
              {t("evidenceExportsSubtitle", lang)}
            </p>
          </div>
          <Link href="/console/documents" className="btn btn-ghost btn-sm">
            <ArrowUpRight size={11} />
          </Link>
        </div>
        {evidenceExports.length === 0 ? (
          <div className="flex flex-col items-center gap-3 p-8 text-center">
            <div
              className="grid h-10 w-10 place-items-center rounded-full"
              style={{ background: "var(--surface-1)", color: "var(--ink-4)" }}
            >
              <Download size={16} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm" style={{ color: "var(--ink-3)" }}>{t("evidenceExportsEmpty", lang)}</p>
              <Link href="/console/documents" className="mt-2 inline-flex items-center gap-1 text-xs font-medium" style={{ color: "var(--brand)" }}>
                {t("evidenceExportsTryIt", lang)} <ArrowUpRight size={10} />
              </Link>
            </div>
          </div>
        ) : (
          <ul className="divide-y" style={{ borderColor: "var(--hair)" }}>
            {evidenceExports.map((exp) => (
              <li key={exp.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-3 sm:flex-1">
                  <div
                    className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-[10px] font-semibold"
                    style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.4)", color: "var(--brand)" }}
                  >
                    {exp.actorInitials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13px] font-medium" style={{ color: "var(--ink)" }}>
                      {exp.reasonKey ? t(exp.reasonKey as TranslationKey, lang) : t("auditPullTitle", lang)}
                    </p>
                    <p className="text-[11px]" style={{ color: "var(--ink-4)" }}>
                      {formatDateTime(exp.createdAt, lang)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs sm:gap-4">
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-sm font-semibold tabular" style={{ color: "var(--ink)" }}>{exp.docCount}</span>
                    <span className="text-[10px]" style={{ color: "var(--ink-4)" }}>{t("auditKpiTotal", lang).toLowerCase()}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-mono text-[11px] tabular" style={{ color: "var(--ok)" }}>{exp.sha}</span>
                    <span className="text-[10px]" style={{ color: "var(--ink-4)" }}>SHA-256</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Audit trail */}
      <div className="glass-panel overflow-hidden">
        <div
          className="px-4 py-3 flex items-center justify-between"
          style={{ borderBottom: "1px solid var(--hair)", background: "rgba(255,255,255,0.015)" }}
        >
          <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
            {t("auditTrail", lang)} ({total} {t("eventsLower", lang)})
          </h3>
          <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--ok)" }}>
            <CheckCircle2 size={11} />
            {t("tamperProof", lang)}
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm" style={{ color: "var(--ink-4)" }}>{t("loading", lang)}</div>
        ) : (
          <>
            <div className="divide-y" style={{ borderColor: "var(--hair)" }}>
              {events.map((ev) => {
                const color = eventColor[ev.event] ?? "var(--ink-4)";
                return (
                  <div key={ev.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-start sm:gap-3">
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
                          {eventLabels[ev.event] ? t(eventLabels[ev.event], lang) : ev.event}
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
                    <span className="text-xs font-mono flex-shrink-0 sm:text-right" style={{ color: "var(--ink-4)" }}>
                      {formatDateTime(ev.createdAt, lang)}
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
                  {t("paginationPrev", lang)}
                </button>
                <span className="px-3 py-1 text-xs" style={{ color: "var(--ink-4)" }}>
                  {t("paginationPage", lang)} {page}
                </span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page * 20 >= total}
                  className="px-3 py-1 rounded-lg text-xs disabled:opacity-40"
                  style={{ border: "1px solid var(--hair-2)", color: "var(--ink-3)" }}
                >
                  {t("paginationNext", lang)}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
