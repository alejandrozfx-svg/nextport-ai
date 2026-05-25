"use client";

import Link from "next/link";
import type { DemoOperation } from "@/lib/demo-data";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { DocumentIcon, StatusChip } from "@/components/ui";

const ruleClass: Record<string, string> = {
  risk:   "row-risk-rule",
  review: "row-warn-rule",
  ready:  "row-ok-rule",
};

const chipKind: Record<string, "risk" | "warn" | "ok"> = {
  risk:   "risk",
  review: "warn",
  ready:  "ok",
};

function MiniDocIcon({ classified, index = 0 }: { classified: boolean; index?: number }) {
  const docTypes = ["pedimento", "invoice", "bl", "packing_list", "mve", "cfdi", "carta_porte"];
  return (
    <DocumentIcon type={docTypes[index % docTypes.length]} classified={classified} size="mini" />
  );
}

export function OperationRow({ op, index = 0 }: { op: DemoOperation; index?: number }) {
  const { lang } = useLang();
  const rule = ruleClass[op.status] ?? "";
  const docComplete = op.docCount >= op.docsExpected;
  const docColor = docComplete ? "var(--ok)" : "var(--warn)";
  const chipLabel: Record<string, string> = {
    risk:   t("atRisk", lang),
    review: t("needsReview", lang),
    ready:  t("statusReady", lang),
  };

  return (
    <tr className={`row-link ${rule} ops-row-animate transition-colors`} style={{ cursor: "pointer", animationDelay: `${index * 45}ms` }}>
      <td style={{ paddingLeft: 16 }}>
        <Link href={`/console/operations/${op.id}`} className="block">
          <StatusChip tone={chipKind[op.status]} pulse={op.status === "risk"}>
            {chipLabel[op.status]}
          </StatusChip>
          <div className="font-mono text-[10.5px] mt-1" style={{ color: "var(--ink-4)" }}>{op.id}</div>
        </Link>
      </td>
      <td>
        <Link href={`/console/operations/${op.id}`} className="block">
          <div className="text-[13px] font-medium truncate" style={{ color: "white" }}>{op.supplierShort}</div>
          <div className="text-[11px] truncate" style={{ color: "var(--ink-4)" }}>{op.brokerage.split("(")[0].trim()}</div>
        </Link>
      </td>
      <td>
        <Link href={`/console/operations/${op.id}`} className="block">
          <div className="text-[12px] truncate" style={{ color: "var(--ink-2)" }}>{op.origin}</div>
          <div className="text-[11px] truncate" style={{ color: "var(--ink-4)" }}>{op.destination}</div>
        </Link>
      </td>
      <td>
        <Link href={`/console/operations/${op.id}`} className="block">
          <div className="text-[12.5px] tabular" style={{ color: "white" }}>{op.eta}</div>
          <div className="text-[11px] font-mono tabular" style={{ color: op.etaDelta.startsWith("+") ? "var(--warn)" : "var(--ink-4)" }}>{op.etaDelta}</div>
        </Link>
      </td>
      <td>
        <Link href={`/console/operations/${op.id}`} className="block">
          <div className="text-[12.5px] font-mono tabular" style={{ color: "white" }}>
            {op.currency} {op.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{op.incoterm}</div>
        </Link>
      </td>
      <td>
        <Link href={`/console/operations/${op.id}`} className="block">
          <div className="text-[11.5px] font-mono" style={{ color: "var(--ink-3)" }}>{op.pedimento}</div>
          <div className="text-[10.5px] font-mono" style={{ color: "var(--ink-4)" }}>{op.hsBucket}</div>
        </Link>
      </td>
      <td>
        <Link href={`/console/operations/${op.id}`} className="block">
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: op.docsExpected }).map((_, i) => (
              <MiniDocIcon key={i} classified={i < op.docCount} index={i} />
            ))}
          </div>
          <div className="text-[10.5px] font-mono tabular" style={{ color: docColor }}>
            {op.docCount}/{op.docsExpected}
          </div>
        </Link>
      </td>
      <td>
        <Link href={`/console/operations/${op.id}`} className="block">
          {op.flags.length > 0 ? (
            <span className="text-[12.5px] font-mono tabular font-medium" style={{ color: "var(--risk)" }}>{op.flags.length}</span>
          ) : (
            <span className="text-[12px]" style={{ color: "var(--ink-4)" }}>—</span>
          )}
        </Link>
      </td>
      <td>
        <Link href={`/console/operations/${op.id}`} className="block">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-medium" style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.4)", color: "var(--brand)" }}>
              {op.owner.initials}
            </div>
            <span className="text-[11.5px] truncate" style={{ color: "var(--ink-3)" }}>{op.owner.name.split(" ")[0]}</span>
          </div>
        </Link>
      </td>
    </tr>
  );
}
