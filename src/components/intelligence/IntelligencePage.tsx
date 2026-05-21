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

export function IntelligencePage() {
  const [data, setData] = useState<IntelData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intelligence")
      .then((r) => r.json())
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="p-6 text-sm" style={{ color: "var(--ink-4)" }}>Loading intelligence data…</div>;
  }

  if (!data) {
    return <div className="p-6 text-sm" style={{ color: "var(--ink-4)" }}>Failed to load data. Please connect a database.</div>;
  }

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
        <StatCard label="Avg Confidence" value={`${kpis.avgConfidence}%`} icon={<TrendingUp size={14} />} color={kpis.avgConfidence >= 85 ? "var(--ok)" : kpis.avgConfidence >= 70 ? "var(--warn)" : "var(--risk)"} sub={`${kpis.passRate}% pass rate`} />
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
