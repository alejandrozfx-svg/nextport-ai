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
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { FileText, Cpu, CheckCheck, TrendingUp } from "lucide-react";
import { StatCard } from "@/components/operations/StatCard";

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
  risk: "oklch(0.70 0.16 25)",
  review: "oklch(0.82 0.14 78)",
  ready: "oklch(0.78 0.13 155)",
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
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>Data & Intelligence</h2>
        <p className="text-sm" style={{ color: "var(--ink-4)" }}>AI performance metrics and compliance analytics</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Documents Classified" value={kpis.documentsClassified} icon={<FileText size={14} />} color="var(--brand)" />
        <StatCard label="Fields Extracted" value={kpis.fieldsExtracted} icon={<Cpu size={14} />} color="var(--brand)" />
        <StatCard label="Validations Run" value={kpis.validationsRun} icon={<CheckCheck size={14} />} color="var(--ok)" />
        <StatCard label="Avg Confidence" value={`${(kpis.avgConfidence * 100).toFixed(1)}%`} icon={<TrendingUp size={14} />} color={kpis.avgConfidence >= 0.85 ? "var(--ok)" : kpis.avgConfidence >= 0.70 ? "var(--warn)" : "var(--risk)"} sub={`${(kpis.passRate * 100).toFixed(1)}% pass rate`} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Operations by status pie */}
        <div className="glass-panel p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--ink-4)" }}>
            Operations by Status
          </h3>
          {operationsByStatus.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--ink-4)" }}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={operationsByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                >
                  {operationsByStatus.map((entry) => (
                    <Cell key={entry.status} fill={STATUS_COLORS[entry.status] ?? "var(--brand)"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                  labelStyle={{ color: "#fff" }}
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
                  {s.status} ({s.count})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Docs over time */}
        <div className="glass-panel p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--ink-4)" }}>
            Documents Over Time
          </h3>
          {docsByDay.length === 0 ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--ink-4)" }}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={docsByDay}>
                <XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--ink-4)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--ink-4)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                  labelStyle={{ color: "#fff" }}
                />
                <Line type="monotone" dataKey="count" stroke="oklch(0.78 0.09 235)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Confidence distribution */}
        <div className="glass-panel p-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--ink-4)" }}>
            Confidence Distribution
          </h3>
          {confidenceDistribution.every((c) => c.count === 0) ? (
            <p className="text-xs text-center py-8" style={{ color: "var(--ink-4)" }}>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={confidenceDistribution}>
                <XAxis dataKey="range" tick={{ fontSize: 9, fill: "var(--ink-4)" }} tickLine={false} />
                <YAxis tick={{ fontSize: 9, fill: "var(--ink-4)" }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#0F1318", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8 }}
                />
                <Bar dataKey="count" fill="oklch(0.78 0.09 235)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
