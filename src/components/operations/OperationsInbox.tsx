"use client";

import { useState, useEffect } from "react";
import { StatCard } from "./StatCard";
import { FlowStrip } from "./FlowStrip";
import { FilterTabs, type TabKey } from "./FilterTabs";
import { OperationRow } from "./OperationRow";
import { formatCurrency } from "@/lib/utils";
import { AlertOctagon, AlertTriangle, CheckCircle2, Activity, DollarSign, Search } from "lucide-react";
import type { OperationStatus } from "@/types";

interface OperationItem {
  id: string;
  supplier: { name: string; shortName: string };
  broker: { name: string };
  origin: string;
  destination: string;
  mode: string;
  incoterm: string;
  eta: string;
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

export function OperationsInbox() {
  const [operations, setOperations] = useState<OperationItem[]>([]);
  const [filter, setFilter] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/operations")
      .then((r) => r.json())
      .then((data) => {
        setOperations(data.operations ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = operations.filter((op) => {
    if (filter !== "all" && op.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        op.id.toLowerCase().includes(q) ||
        op.supplier.name.toLowerCase().includes(q) ||
        op.pedimento.toLowerCase().includes(q) ||
        op.origin.toLowerCase().includes(q) ||
        op.destination.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const counts = {
    all: operations.length,
    risk: operations.filter((o) => o.status === "risk").length,
    review: operations.filter((o) => o.status === "review").length,
    ready: operations.filter((o) => o.status === "ready").length,
  };

  const totalValue = operations.reduce((s, o) => s + o.value, 0);

  return (
    <div className="p-6 space-y-5">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard
          label="Active Operations"
          value={counts.all}
          sub="This month"
          icon={<Activity size={14} />}
          color="var(--brand)"
        />
        <StatCard
          label="At Risk"
          value={counts.risk}
          sub="Need immediate attention"
          icon={<AlertOctagon size={14} />}
          color="var(--risk)"
        />
        <StatCard
          label="Needs Review"
          value={counts.review}
          sub="Pending human review"
          icon={<AlertTriangle size={14} />}
          color="var(--warn)"
        />
        <StatCard
          label="Ready"
          value={counts.ready}
          sub="Ready to approve"
          icon={<CheckCircle2 size={14} />}
          color="var(--ok)"
        />
        <StatCard
          label="Customs Value"
          value={`$${formatCurrency(totalValue)}`}
          sub="USD equivalent"
          icon={<DollarSign size={14} />}
        />
      </div>

      {/* Flow strip */}
      <FlowStrip />

      {/* Filters + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <FilterTabs active={filter} onChange={setFilter} counts={counts} />
        <div
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg ml-auto"
          style={{ background: "var(--bg-2)", border: "1px solid var(--hair-2)" }}
        >
          <Search size={12} style={{ color: "var(--ink-4)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search operations…"
            className="bg-transparent text-xs outline-none w-48"
            style={{ color: "var(--ink)" }}
          />
        </div>
      </div>

      {/* Table */}
      <div className="glass-panel overflow-hidden">
        {/* Header */}
        <div
          className="flex items-center px-4 py-2 gap-4"
          style={{ borderBottom: "1px solid var(--hair)", background: "rgba(255,255,255,0.015)" }}
        >
          {["Status / ID", "Supplier", "Route", "ETA", "Value", "Pedimento", "Docs", "Exc", "Owner"].map((h) => (
            <span
              key={h}
              className="text-xs font-medium flex-1 min-w-0 first:min-w-[110px] last:min-w-0 last:flex-none"
              style={{ color: "var(--ink-4)" }}
            >
              {h}
            </span>
          ))}
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: "var(--ink-4)" }}>Loading operations…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm" style={{ color: "var(--ink-4)" }}>No operations match your filter.</p>
          </div>
        ) : (
          filtered.map((op) => (
            <OperationRow key={op.id} {...op} />
          ))
        )}
      </div>
    </div>
  );
}
