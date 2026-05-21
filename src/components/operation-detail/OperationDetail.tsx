"use client";

import { useState } from "react";
import { DocChip } from "./DocChip";
import { DocPreview } from "./DocPreview";
import { ExceptionCard } from "./ExceptionCard";
import { NextBestAction } from "./NextBestAction";
import { ApprovalRail } from "./ApprovalRail";
import { AuditTimeline } from "./AuditTimeline";
import { RiskChip } from "@/components/ui/RiskChip";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ArrowLeft, Plane, Ship, Truck, MapPin } from "lucide-react";
import Link from "next/link";
import type { OperationDetail as OperationDetailType } from "@/types";

const modeIcon: Record<string, React.ReactNode> = {
  air: <Plane size={14} />,
  sea: <Ship size={14} />,
  land: <Truck size={14} />,
};

interface OperationDetailProps {
  operation: OperationDetailType;
}

export function OperationDetail({ operation }: OperationDetailProps) {
  const [activeDocIndex, setActiveDocIndex] = useState(0);
  const activeDoc = operation.documents[activeDocIndex] ?? null;

  return (
    <div className="p-6 space-y-5">
      {/* Back + header */}
      <div className="flex items-start gap-4">
        <Link
          href="/console/operations"
          className="flex items-center gap-1.5 text-xs hover:opacity-80 transition-opacity mt-1"
          style={{ color: "var(--ink-4)" }}
        >
          <ArrowLeft size={12} />
          Operations
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-xl font-semibold font-mono" style={{ color: "var(--ink)" }}>
              {operation.id}
            </h1>
            <RiskChip kind={operation.status} pulse={operation.status === "risk"} />
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm" style={{ color: "var(--ink-3)" }}>
              {operation.supplier.name}
            </span>
            <span style={{ color: "var(--hair-2)" }}>·</span>
            <div className="flex items-center gap-1 text-sm" style={{ color: "var(--ink-4)" }}>
              {modeIcon[operation.mode] ?? <Truck size={14} />}
              {operation.origin} → {operation.destination}
            </div>
            <span style={{ color: "var(--hair-2)" }}>·</span>
            <span className="text-sm" style={{ color: "var(--ink-4)" }}>
              {operation.currency} {formatCurrency(operation.value)} · {operation.incoterm}
            </span>
            <span style={{ color: "var(--hair-2)" }}>·</span>
            <span className="text-sm font-mono" style={{ color: "var(--ink-4)" }}>
              ETA {formatDate(operation.eta)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Avatar initials={operation.owner.initials} size="md" />
          <div>
            <p className="text-xs font-medium" style={{ color: "var(--ink)" }}>
              {operation.owner.name}
            </p>
            <p className="text-xs" style={{ color: "var(--ink-4)" }}>
              {operation.owner.role}
            </p>
          </div>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left column: docs + timeline */}
        <div className="col-span-3 space-y-4">
          {/* Documents */}
          <div className="glass-panel p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                Documents ({operation.documents.length})
              </h3>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {operation.documents.map((doc, i) => (
                <DocChip
                  key={doc.id}
                  type={doc.type}
                  status={doc.status as "uploaded" | "classified" | "extracted" | "validated" | "ready"}
                  confidence={doc.confidence}
                  active={activeDocIndex === i}
                  onClick={() => setActiveDocIndex(i)}
                />
              ))}
            </div>
          </div>

          {/* Activity timeline */}
          <div className="glass-panel p-4 space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
              Activity
            </h3>
            <AuditTimeline events={operation.auditEvents.slice(0, 8)} />
          </div>
        </div>

        {/* Center: doc preview */}
        <div className="col-span-5">
          <div className="glass-panel p-4 sticky top-20">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--ink-4)" }}>
              Document Review
            </h3>
            <DocPreview document={activeDoc} />
          </div>
        </div>

        {/* Right column: exceptions + actions */}
        <div className="col-span-4 space-y-4">
          {/* Operation info */}
          <div className="glass-panel p-4 space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--ink-4)" }}>
              Operation Details
            </h3>
            {[
              { label: "Pedimento", value: operation.pedimento, mono: true },
              { label: "HS Bucket", value: operation.hsBucket, mono: true },
              { label: "Broker", value: `${operation.broker.name} (${operation.broker.patent})`, mono: false },
              { label: "Supplier", value: `${operation.supplier.name} · ${operation.supplier.city}, ${operation.supplier.country}`, mono: false },
            ].map(({ label, value, mono }) => (
              <div key={label} className="flex justify-between gap-3 text-xs">
                <span style={{ color: "var(--ink-4)" }}>{label}</span>
                <span className={mono ? "font-mono" : ""} style={{ color: "var(--ink-2)", textAlign: "right" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* AI recommendation */}
          <NextBestAction
            summary={operation.aiSummary}
            status={operation.status}
            exceptionCount={operation.exceptions.filter((e) => !e.resolved).length}
          />

          {/* Exceptions */}
          {operation.exceptions.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                Exceptions ({operation.exceptions.filter((e) => !e.resolved).length} open)
              </h3>
              {operation.exceptions.map((ex) => (
                <ExceptionCard key={ex.id} exception={ex} />
              ))}
            </div>
          )}

          {/* Approval rail */}
          <div className="glass-panel p-4">
            <ApprovalRail operationId={operation.id} status={operation.status} />
          </div>

          {/* Approval history */}
          {operation.approvals.length > 0 && (
            <div className="glass-panel p-4 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
                Approval History
              </h3>
              {operation.approvals.map((ap) => (
                <div key={ap.id} className="flex items-center gap-2 text-xs">
                  <Avatar initials={ap.user.initials} size="sm" />
                  <span style={{ color: "var(--ink-3)" }}>{ap.user.name}</span>
                  <span
                    className="px-1.5 py-0.5 rounded font-mono"
                    style={{ background: "var(--hair)", color: "var(--brand)", fontSize: 10 }}
                  >
                    {ap.action}
                  </span>
                  {ap.note && <span style={{ color: "var(--ink-4)" }}>{ap.note}</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
