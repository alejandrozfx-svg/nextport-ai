"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OperationRow } from "./OperationRow";
import { UploadModal } from "./UploadModal";
import { DEMO_OPERATIONS } from "@/lib/demo-data";
import type { DemoOperation } from "@/lib/demo-data";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";
import { ActionButton, AppIcon as Icon, DocumentIcon, EmptyState, MetricCard, PageHeader, StatusChip } from "@/components/ui";

type TabKey = "all" | "risk" | "review" | "ready";

const OPERATIONS = DEMO_OPERATIONS;

function MiniDocIcon({ classified, index = 0 }: { classified: boolean; index?: number }) {
  const docTypes = ["pedimento", "invoice", "bl", "packing_list", "mve", "cfdi", "carta_porte"];
  return (
    <DocumentIcon type={docTypes[index % docTypes.length]} classified={classified} size="mini" />
  );
}

function OperationMobileCard({ op }: { op: DemoOperation }) {
  const { lang } = useLang();
  const chipKind: Record<string, "risk" | "warn" | "ok"> = {
    risk: "risk",
    review: "warn",
    ready: "ok",
  };
  const chipLabel: Record<string, string> = {
    risk: t("atRisk", lang),
    review: t("needsReview", lang),
    ready: t("statusReady", lang),
  };
  const docComplete = op.docCount >= op.docsExpected;
  const docColor = docComplete ? "var(--ok)" : "var(--warn)";
  const reviewLabel = lang === "es" ? "Revisar operación" : lang === "zh" ? "查看运营" : "Review operation";

  return (
    <Link
      href={`/console/operations/${op.id}`}
      className="glass-panel block p-4 transition-colors hover:bg-white/[0.035]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <StatusChip tone={chipKind[op.status]}>
            {chipLabel[op.status]}
          </StatusChip>
          <div className="mt-3 truncate text-[15px] font-semibold" style={{ color: "white" }}>
            {op.supplierShort}
          </div>
          <div className="mt-0.5 text-[11px] font-mono" style={{ color: "var(--ink-4)" }}>
            {op.id}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{t("eta", lang)}</div>
          <div className="text-[13px] font-medium tabular" style={{ color: "white" }}>{op.eta}</div>
          <div className="text-[11px] font-mono" style={{ color: op.etaDelta.startsWith("+") ? "var(--warn)" : "var(--ink-4)" }}>
            {op.etaDelta}
          </div>
        </div>
      </div>

      <div className="my-4 grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <div style={{ color: "var(--ink-4)" }}>{t("tableRoute", lang)}</div>
          <div className="mt-1 truncate" style={{ color: "var(--ink-2)" }}>{op.origin}</div>
          <div className="truncate text-[11px]" style={{ color: "var(--ink-4)" }}>{op.destination}</div>
        </div>
        <div>
          <div style={{ color: "var(--ink-4)" }}>{t("value", lang)}</div>
          <div className="mt-1 font-mono tabular" style={{ color: "white" }}>
            {op.currency} {op.value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{op.incoterm}</div>
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 border-t pt-3" style={{ borderColor: "var(--hair)" }}>
        <div className="min-w-0">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: op.docsExpected }).map((_, i) => (
              <MiniDocIcon key={i} classified={i < op.docCount} index={i} />
            ))}
          </div>
          <div className="mt-1 text-[11px] font-mono tabular" style={{ color: docColor }}>
            {op.docCount}/{op.docsExpected} {t("documentsLabel", lang)}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{t("tableExceptions", lang)}</div>
            <div className="text-[13px] font-semibold tabular" style={{ color: op.flags.length ? "var(--risk)" : "var(--ink-3)" }}>
              {op.flags.length || "0"}
            </div>
          </div>
          <span className="btn btn-sm">
            {reviewLabel}
            <Icon name="arrow_right" size={12} />
          </span>
        </div>
      </div>
    </Link>
  );
}


export function OperationsInbox() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";
  const [filter, setFilter] = useState<TabKey>("all");
  const [search, setSearch] = useState(initialQuery);
  const [openUpload, setOpenUpload] = useState(false);

  // Sync URL ?q= → local search state when the user navigates from TopBar
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    setSearch(q);
  }, [searchParams]);

  // Restore filter (and search if URL didn't carry one) from sessionStorage
  // when returning from operation detail.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const saved = sessionStorage.getItem("np_ops_state");
      if (!saved) return;
      const parsed = JSON.parse(saved) as { filter?: TabKey; search?: string };
      if (parsed.filter && ["all", "risk", "review", "ready"].includes(parsed.filter)) {
        setFilter(parsed.filter);
      }
      // URL ?q= wins over sessionStorage so deep-links keep working.
      if (!initialQuery && typeof parsed.search === "string") {
        setSearch(parsed.search);
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist current filter+search so the back navigation can restore it.
  useEffect(() => {
    if (typeof window === "undefined") return;
    sessionStorage.setItem("np_ops_state", JSON.stringify({ filter, search }));
  }, [filter, search]);

  const filtered = useMemo(() => {
    return OPERATIONS.filter((op) => {
      if (filter !== "all" && op.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          op.id.toLowerCase().includes(q) ||
          op.supplier.toLowerCase().includes(q) ||
          op.pedimento.toLowerCase().includes(q) ||
          op.origin.toLowerCase().includes(q) ||
          op.destination.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, search]);

  const counts = {
    all: OPERATIONS.length,
    risk: OPERATIONS.filter((o) => o.status === "risk").length,
    review: OPERATIONS.filter((o) => o.status === "review").length,
    ready: OPERATIONS.filter((o) => o.status === "ready").length,
  };

  const totalValue = OPERATIONS.reduce((s, o) => s + o.value, 0);

  const tabs: { key: TabKey; label: string; color?: string }[] = [
    { key: "all",    label: t("allOperations", lang) },
    { key: "risk",   label: t("atRiskTab", lang),       color: "var(--risk)" },
    { key: "review", label: t("needsReviewTab", lang),  color: "var(--warn)" },
    { key: "ready",  label: t("readyTab", lang),        color: "var(--ok)" },
  ];

  const tableHeaders = [
    t("tableStatus", lang),
    t("supplier", lang),
    t("tableRoute", lang),
    t("eta", lang),
    t("value", lang),
    t("pedimentoNum", lang),
    t("documentsLabel", lang),
    t("tableExceptions", lang),
    t("owner", lang),
  ];

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 md:px-8 md:py-7">
      <PageHeader
        title={t("operationsInbox", lang)}
        subtitle={t("controlTowerDesc", lang)}
        actions={(
          <ActionButton size="sm">
            <Icon name="search" size={13} />
            {t("filter", lang)}
          </ActionButton>
        )}
      />

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard label={t("activeOps", lang)} value={counts.all} sub={t("thisMonth", lang)} active={filter === "all"} onClick={() => setFilter("all")} />
        <MetricCard label={t("atRisk", lang)} value={counts.risk} sub={t("blockingMismatch", lang)} color="var(--risk)" active={filter === "risk"} onClick={() => setFilter("risk")} />
        <MetricCard label={t("needsReview", lang)} value={counts.review} sub={t("missingDocument", lang)} color="var(--warn)" active={filter === "review"} onClick={() => setFilter("review")} />
        <MetricCard label={t("readyForHandoff", lang)} value={counts.ready} sub={t("closedExpediente", lang)} color="var(--ok)" active={filter === "ready"} onClick={() => setFilter("ready")} />
        <MetricCard label={t("customsValueToday", lang)} value={`$${(totalValue / 1000).toFixed(0)}k`} sub={t("usdEquivalent", lang)} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="glass-panel-tight flex max-w-full items-center gap-1 overflow-x-auto p-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12.5px] transition-all"
              style={{
                background: filter === tab.key ? "rgba(255,255,255,0.08)" : "transparent",
                color: filter === tab.key ? (tab.color ?? "white") : "var(--ink-4)",
                boxShadow: filter === tab.key ? "inset 0 0 0 1px var(--hair-2)" : undefined,
              }}
            >
              {tab.label}
              <span className="text-[11px] tabular" style={{ color: "var(--ink-4)" }}>
                {counts[tab.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="app-input ml-0 flex items-center gap-2 rounded-lg px-3 py-2 sm:ml-auto sm:py-1.5">
          <Icon name="search" size={12} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchOps", lang)}
            className="w-full bg-transparent text-[12.5px] outline-none sm:w-48"
            style={{ color: "var(--ink)", caretColor: "var(--brand)" }}
          />
        </div>
      </div>

      <div className="space-y-3 md:hidden">
        {filtered.length === 0 ? (
          <div className="glass-panel p-5 text-center text-[13px]" style={{ color: "var(--ink-4)" }}>
            <EmptyState description={t("noOpsMatch", lang)} icon="inbox" className="py-2" />
          </div>
        ) : (
          filtered.map((op, index) => (
            <div key={`${filter}-${op.id}`} className="ops-row-animate" style={{ animationDelay: `${index * 45}ms` }}>
              <OperationMobileCard op={op} />
            </div>
          ))
        )}
      </div>

      <div className="glass-panel hidden overflow-hidden md:block">
        <table className="table" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 120 }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 50 }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr>
              {tableHeaders.map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10" style={{ color: "var(--ink-4)" }}>
                  <EmptyState description={t("noOpsMatch", lang)} icon="inbox" className="py-2" />
                </td>
              </tr>
            ) : (
              filtered.map((op, index) => (
                <OperationRow key={`${filter}-${op.id}`} op={op} index={index} />
              ))
            )}
          </tbody>
        </table>
      </div>

      {openUpload && <UploadModal onClose={() => setOpenUpload(false)} />}
    </div>
  );
}

