"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle, ArrowUpCircle, Download, Clock } from "lucide-react";
import type { ApprovalAction } from "@/types";

interface ApprovalRailProps {
  operationId: string;
  status: string;
  onAction?: (action: ApprovalAction) => void;
}

const actions: Array<{ action: ApprovalAction; label: string; icon: React.ReactNode; style: React.CSSProperties }> = [
  {
    action: "approved",
    label: "Approve",
    icon: <CheckCircle2 size={14} />,
    style: { background: "var(--ok)", color: "#0A0D12" },
  },
  {
    action: "correction_requested",
    label: "Request Correction",
    icon: <AlertCircle size={14} />,
    style: { background: "var(--warn-soft)", color: "var(--warn)", border: "1px solid oklch(0.82 0.14 78 / 0.3)" },
  },
  {
    action: "escalated",
    label: "Escalate",
    icon: <ArrowUpCircle size={14} />,
    style: { background: "var(--risk-soft)", color: "var(--risk)", border: "1px solid oklch(0.70 0.16 25 / 0.3)" },
  },
  {
    action: "exported",
    label: "Export Audit Package",
    icon: <Download size={14} />,
    style: { background: "var(--hair)", color: "var(--ink-3)", border: "1px solid var(--hair-2)" },
  },
];

export function ApprovalRail({ operationId, status, onAction }: ApprovalRailProps) {
  const [lastAction, setLastAction] = useState<ApprovalAction | null>(null);
  const [loading, setLoading] = useState(false);
  const [note, setNote] = useState("");

  async function handleAction(action: ApprovalAction) {
    setLoading(true);
    try {
      await fetch(`/api/operations/${operationId}/approve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, note: note || undefined }),
      });
      setLastAction(action);
      onAction?.(action);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
        Approval Actions
      </h3>

      {lastAction && (
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm"
          style={{ background: "var(--ok-soft)", color: "var(--ok)", border: "1px solid oklch(0.78 0.13 155 / 0.3)" }}
        >
          <CheckCircle2 size={14} />
          Action recorded: <strong>{lastAction}</strong>
        </div>
      )}

      {/* Note */}
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note (optional)…"
        rows={2}
        className="w-full px-3 py-2 rounded-lg text-xs outline-none resize-none"
        style={{
          background: "var(--bg)",
          border: "1px solid var(--hair-2)",
          color: "var(--ink)",
          caretColor: "var(--brand)",
        }}
      />

      <div className="grid grid-cols-2 gap-2">
        {actions.map(({ action, label, icon, style }) => (
          <button
            key={action}
            onClick={() => handleAction(action)}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all disabled:opacity-50 hover:opacity-90"
            style={style}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--ink-4)" }}>
        <Clock size={10} />
        All actions logged to immutable audit trail
      </div>
    </div>
  );
}
