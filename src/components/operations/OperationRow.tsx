"use client";

import Link from "next/link";
import { RiskChip } from "@/components/ui/RiskChip";
import { Avatar } from "@/components/ui/Avatar";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { OperationStatus } from "@/types";
import { AlertTriangle, FileText, Plane, Ship, Truck } from "lucide-react";

interface OperationRowProps {
  id: string;
  supplier: { name: string; shortName: string };
  broker: { name: string };
  origin: string;
  destination: string;
  mode: string;
  incoterm: string;
  eta: string | Date;
  etaDelta: string;
  value: number;
  currency: string;
  status: OperationStatus;
  owner: { name: string; initials: string };
  pedimento: string;
  hsBucket: string;
  docCount: number;
  docsExpected: number;
  exceptionCount: number;
}

const modeIcon: Record<string, React.ReactNode> = {
  air: <Plane size={12} />,
  sea: <Ship size={12} />,
  land: <Truck size={12} />,
};

const statusBorder: Record<OperationStatus, string> = {
  risk: "border-risk",
  review: "border-warn",
  ready: "border-ok",
};

export function OperationRow({
  id, supplier, broker, origin, destination, mode, incoterm,
  eta, etaDelta, value, currency, status, owner, pedimento, hsBucket,
  docCount, docsExpected, exceptionCount,
}: OperationRowProps) {
  const docColor = docCount < docsExpected ? "var(--warn)" : "var(--ok)";

  return (
    <Link
      href={`/console/operations/${id}`}
      className={`flex items-center px-4 py-3 gap-4 transition-all hover:bg-white/[0.03] ${statusBorder[status]}`}
      style={{ borderBottom: "1px solid var(--hair)" }}
    >
      {/* Status + ID */}
      <div className="flex flex-col gap-1 min-w-[110px]">
        <RiskChip kind={status} size="sm" pulse={status === "risk"} />
        <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
          {id}
        </span>
      </div>

      {/* Supplier + broker */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" style={{ color: "var(--ink)" }}>
          {supplier.name}
        </p>
        <p className="text-xs truncate" style={{ color: "var(--ink-4)" }}>
          {broker.name}
        </p>
      </div>

      {/* Route */}
      <div className="flex items-center gap-1 min-w-[120px]">
        <span style={{ color: "var(--ink-4)" }}>{modeIcon[mode] ?? <Truck size={12} />}</span>
        <span className="text-xs" style={{ color: "var(--ink-3)" }}>
          {origin} → {destination}
        </span>
      </div>

      {/* ETA */}
      <div className="min-w-[80px] text-right">
        <p className="text-xs" style={{ color: "var(--ink)" }}>
          {formatDate(eta)}
        </p>
        <p
          className="text-xs font-mono"
          style={{ color: etaDelta.startsWith("+") ? "var(--warn)" : "var(--ok)" }}
        >
          {etaDelta}
        </p>
      </div>

      {/* Value */}
      <div className="min-w-[100px] text-right">
        <p className="text-sm font-mono" style={{ color: "var(--ink)" }}>
          {currency} {formatCurrency(value)}
        </p>
        <p className="text-xs" style={{ color: "var(--ink-4)" }}>
          {incoterm}
        </p>
      </div>

      {/* Pedimento */}
      <div className="min-w-[90px]">
        <p className="text-xs font-mono" style={{ color: "var(--ink-3)" }}>
          {pedimento.slice(0, 12)}…
        </p>
        <p className="text-xs" style={{ color: "var(--ink-4)" }}>
          {hsBucket}
        </p>
      </div>

      {/* Docs */}
      <div className="flex items-center gap-1 min-w-[60px]">
        <FileText size={12} style={{ color: docColor }} />
        <span className="text-xs font-mono" style={{ color: docColor }}>
          {docCount}/{docsExpected}
        </span>
      </div>

      {/* Exceptions */}
      {exceptionCount > 0 && (
        <div className="flex items-center gap-1 min-w-[40px]">
          <AlertTriangle size={12} style={{ color: "var(--risk)" }} />
          <span className="text-xs font-mono" style={{ color: "var(--risk)" }}>
            {exceptionCount}
          </span>
        </div>
      )}

      {/* Owner */}
      <Avatar initials={owner.initials} size="sm" />
    </Link>
  );
}
