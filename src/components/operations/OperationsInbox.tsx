"use client";

import { useMemo, useState, useEffect } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { OperationRow } from "./OperationRow";
import { UploadModal } from "./UploadModal";
import { DEMO_OPERATIONS } from "@/lib/demo-data";
import type { DemoOperation } from "@/lib/demo-data";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

type TabKey = "all" | "risk" | "review" | "ready";

const OPERATIONS = DEMO_OPERATIONS;

function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const s = { width: size, height: size, flexShrink: 0 as const };
  const icons: Record<string, ReactElement> = {
    upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="20 6 9 17 4 12" /></svg>,
    activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    arrow_right: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
    mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
    file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h6" /></svg>,
    database: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>,
    zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    inbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
    link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 1 0-7.07-7.07L11 4.93" /><path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 1 0 7.07 7.07L13 19.07" /></svg>,
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  };
  return icons[name] ?? <svg style={s} />;
}

function MiniDocIcon({ classified }: { classified: boolean }) {
  return (
    <div className="w-4 h-5 rounded-[2px] flex-shrink-0 relative" style={{
      background: classified
        ? "linear-gradient(180deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))"
        : "rgba(255,255,255,0.03)",
      border: `1px solid ${classified ? "var(--hair-2)" : "var(--hair)"}`,
      borderStyle: classified ? "solid" : "dashed",
    }}>
      {classified && (
        <div style={{ position: "absolute", top: 0, right: 0, width: 5, height: 5, background: "var(--bg)", borderLeft: "1px solid var(--hair-2)", borderBottom: "1px solid var(--hair-2)" }} />
      )}
    </div>
  );
}

function StatCard({ label, value, sub, color, active, onClick }: {
  label: string; value: string | number; sub: string; color?: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <div
      className="glass-panel p-4 cursor-pointer transition-all"
      onClick={onClick}
      style={{
        outline: active ? `1px solid ${color ?? "var(--brand)"}` : undefined,
        background: active ? `${color ?? "var(--brand)"}1a` : undefined,
      }}
    >
      <div className="text-[11px] mb-1" style={{ color: "var(--ink-4)" }}>{label}</div>
      <div className="text-[24px] font-semibold tabular leading-none mb-1" style={{ color: color ?? "white" }}>
        {value}
      </div>
      <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{sub}</div>
    </div>
  );
}

function OperationMobileCard({ op }: { op: DemoOperation }) {
  const { lang } = useLang();
  const chipKind: Record<string, string> = {
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
          <span className={`chip chip-${chipKind[op.status]}`}>
            <span className="dot" />
            {chipLabel[op.status]}
          </span>
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
              <MiniDocIcon key={i} classified={i < op.docCount} />
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
      <div className="mb-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "white" }}>{t("operationsInbox", lang)}</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-3)" }}>
            {t("controlTowerDesc", lang)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm"><Icon name="search" size={13} /> {t("filter", lang)}</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-2 xl:grid-cols-5">
        <StatCard label={t("activeOps", lang)} value={counts.all} sub={lang === "es" ? "Este mes" : lang === "zh" ? "本月" : "This month"} active={filter === "all"} onClick={() => setFilter("all")} />
        <StatCard label={t("atRisk", lang)} value={counts.risk} sub={lang === "es" ? "Discrepancia bloqueante" : lang === "zh" ? "阻断性差异" : "Blocking mismatch"} color="var(--risk)" active={filter === "risk"} onClick={() => setFilter("risk")} />
        <StatCard label={t("needsReview", lang)} value={counts.review} sub={lang === "es" ? "Documento faltante" : lang === "zh" ? "缺少文件" : "Missing document"} color="var(--warn)" active={filter === "review"} onClick={() => setFilter("review")} />
        <StatCard label={t("readyForHandoff", lang)} value={counts.ready} sub={t("closedExpediente", lang)} color="var(--ok)" active={filter === "ready"} onClick={() => setFilter("ready")} />
        <StatCard label={t("customsValueToday", lang)} value={`$${(totalValue / 1000).toFixed(0)}k`} sub={t("usdEquivalent", lang)} />
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
        <div className="glass-panel-tight ml-0 flex items-center gap-2 rounded-lg px-3 py-2 sm:ml-auto sm:py-1.5">
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
            {t("noOpsMatch", lang)}
          </div>
        ) : (
          filtered.map((op) => <OperationMobileCard key={op.id} op={op} />)
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
                  {t("noOpsMatch", lang)}
                </td>
              </tr>
            ) : (
              filtered.map((op) => <OperationRow key={op.id} op={op} />)
            )}
          </tbody>
        </table>
      </div>

      {openUpload && <UploadModal onClose={() => setOpenUpload(false)} />}
    </div>
  );
}

