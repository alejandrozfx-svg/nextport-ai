"use client";

import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { FileText, Cpu, CheckCheck, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/operations/StatCard";
import { useLang } from "@/lib/lang-context";
import { t } from "@/lib/i18n";

interface KPIs {
  documentsClassified: number;
  fieldsExtracted: number;
  validationsRun: number;
  avgConfidence: number;
  passRate: number;
}

interface IntelData {
  kpis: KPIs;
  operationsByStatus: Array<{ status: string; count: number }>;
  docsByDay: Array<{ date: string; count: number }>;
  confidenceDistribution: Array<{ range: string; count: number }>;
}

const STATUS_COLORS: Record<string, string> = {
  risk: "var(--risk)",
  review: "var(--warn)",
  ready: "var(--ok)",
};

const tooltipStyle = {
  background: "rgba(15,19,24,0.82)",
  border: "1px solid var(--hair-2)",
  borderRadius: 12,
  boxShadow: "var(--elev-3)",
  backdropFilter: "blur(16px) saturate(140%)",
  color: "var(--ink)",
};

const DEMO_INTEL: IntelData = {
  kpis: { documentsClassified: 142, fieldsExtracted: 3408, validationsRun: 892, avgConfidence: 0.972, passRate: 0.847 },
  operationsByStatus: [
    { status: "risk",   count: 2 },
    { status: "review", count: 2 },
    { status: "ready",  count: 3 },
  ],
  docsByDay: [
    { date: "May 15", count: 18 }, { date: "May 16", count: 24 }, { date: "May 17", count: 12 },
    { date: "May 18", count: 0  }, { date: "May 19", count: 0  }, { date: "May 20", count: 31 },
    { date: "May 21", count: 22 },
  ],
  confidenceDistribution: [
    { range: "90–95%", count: 8 }, { range: "95–98%", count: 22 }, { range: "98–100%", count: 112 },
  ],
};

export function IntelligencePage() {
  const { lang } = useLang();
  const [data, setData] = useState<IntelData>(DEMO_INTEL);

  useEffect(() => {
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 2000);
    fetch("/api/intelligence", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => { if (d?.kpis) setData(d); })
      .catch(() => {});
  }, []);

  const { kpis, operationsByStatus, docsByDay, confidenceDistribution } = data;

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>{t("dataIntelligence", lang)}</h2>
        <p className="text-sm" style={{ color: "var(--ink-4)" }}>{t("aiPerformanceSubtitle", lang)}</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label={t("kpiDocumentsClassified", lang)} value={kpis.documentsClassified} icon={<FileText size={14} />} color="var(--brand)" />
        <StatCard label={t("kpiFieldsExtracted", lang)} value={kpis.fieldsExtracted} icon={<Cpu size={14} />} color="var(--brand)" />
        <StatCard label={t("kpiValidationsRun", lang)} value={kpis.validationsRun} icon={<CheckCheck size={14} />} color="var(--ok)" />
        <StatCard label={t("kpiAvgConfidence", lang)} value={`${(kpis.avgConfidence * 100).toFixed(1)}%`} icon={<TrendingUp size={14} />} color={kpis.avgConfidence >= 0.85 ? "var(--ok)" : kpis.avgConfidence >= 0.70 ? "var(--warn)" : "var(--risk)"} sub={`${(kpis.passRate * 100).toFixed(1)}${t("passRateSuffix", lang)}`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Operations by status pie */}
        <div className="glass-panel p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--ink-4)" }}>
            {t("chartOpsByStatus", lang)}
          </h3>
          {operationsByStatus.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--ink-4)" }}>{t("noData", lang)}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <defs>
                  <filter id="pieGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="2.5" floodColor="rgba(122,176,224,0.25)" />
                  </filter>
                </defs>
                <Pie
                  data={operationsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={3}
                  filter="url(#pieGlow)"
                >
                  {operationsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "var(--brand)"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "var(--ink)" }}
                  itemStyle={{ color: "var(--ink-2)" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div className="flex flex-wrap gap-2 mt-2">
            {operationsByStatus.map((s) => (
              <div key={s.status} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ background: STATUS_COLORS[s.status] ?? "var(--brand)" }}
                />
                <span className="text-xs capitalize" style={{ color: "var(--ink-3)" }}>
                  {(s.status === "risk" ? t("atRisk", lang) : s.status === "review" ? t("needsReview", lang) : t("statusReady", lang))} ({s.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Docs over time */}
        <div className="glass-panel p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--ink-4)" }}>
            {t("chartDocsOverTime", lang)}
          </h3>
          {docsByDay.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--ink-4)" }}>{t("noData", lang)}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={docsByDay}>
                <defs>
                  <linearGradient id="docsLine" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="oklch(0.82 0.13 195)" stopOpacity="0.50" />
                    <stop offset="55%" stopColor="oklch(0.78 0.09 235)" stopOpacity="1" />
                    <stop offset="100%" stopColor="oklch(0.92 0.05 235)" stopOpacity="0.88" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.055)" />
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--ink-4)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--ink-4)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "var(--ink)" }}
                  itemStyle={{ color: "var(--ink-2)" }}
                  cursor={{ stroke: "rgba(122,176,224,0.18)", strokeWidth: 1 }}
                />
                <Line type="monotone" dataKey="count" stroke="url(#docsLine)" strokeWidth={2.5} dot={false} activeDot={{ r: 4, fill: "oklch(0.82 0.13 195)", stroke: "var(--bg-2)", strokeWidth: 2 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Confidence distribution */}
        <div className="glass-panel p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--ink-4)" }}>
            {t("chartConfidenceDist", lang)}
          </h3>
          {confidenceDistribution.every((c) => c.count === 0) ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--ink-4)" }}>{t("noData", lang)}</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={confidenceDistribution}>
                <defs>
                  <linearGradient id="confidenceBars" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="oklch(0.78 0.09 235)" stopOpacity="0.32" />
                    <stop offset="100%" stopColor="oklch(0.82 0.13 195)" stopOpacity="0.92" />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.055)" />
                <XAxis dataKey="range" tick={{ fontSize: 9, fill: "var(--ink-4)" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--ink-4)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelStyle={{ color: "var(--ink)" }}
                  itemStyle={{ color: "var(--ink-2)" }}
                  cursor={{ fill: "rgba(122,176,224,0.045)" }}
                />
                <Bar dataKey="count" fill="url(#confidenceBars)" radius={[6, 6, 2, 2]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
