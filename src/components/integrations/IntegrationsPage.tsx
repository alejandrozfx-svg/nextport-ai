"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, Clock, AlertCircle, Wifi, WifiOff, RefreshCw } from "lucide-react";
import { formatDateTime } from "@/lib/utils";

interface Integration {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: string;
  lastSyncAt: string | null;
  syncHealth: string | null;
  dataTypes: string[];
  errorMessage: string | null;
}

const statusConfig = {
  connected: { icon: CheckCircle2, color: "var(--ok)", label: "Connected" },
  pending: { icon: Clock, color: "var(--warn)", label: "Pending" },
  error: { icon: AlertCircle, color: "var(--risk)", label: "Error" },
  disconnected: { icon: WifiOff, color: "var(--ink-4)", label: "Not connected" },
};

const categoryOrder = ["Communication", "Storage", "ERP", "BI & Reporting", "Government", "Customs & Logistics"];

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/integrations")
      .then((r) => r.json())
      .then((d) => { setIntegrations(d.integrations ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSync(id: string) {
    setSyncing(id);
    try {
      const res = await fetch(`/api/integrations/${id}/sync`, { method: "POST" });
      const data = await res.json();
      if (data.integration) {
        setIntegrations((prev) =>
          prev.map((i) => (i.id === id ? { ...i, ...data.integration } : i))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(null);
    }
  }

  const byCategory: Record<string, Integration[]> = {};
  integrations.forEach((i) => {
    if (!byCategory[i.category]) byCategory[i.category] = [];
    byCategory[i.category].push(i);
  });

  const orderedCategories = [
    ...categoryOrder.filter((c) => byCategory[c]),
    ...Object.keys(byCategory).filter((c) => !categoryOrder.includes(c)),
  ];

  return (
    <div className="p-6 space-y-8">
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>Integrations</h2>
        <p className="text-sm" style={{ color: "var(--ink-4)" }}>
          {integrations.filter((i) => i.status === "connected").length} of {integrations.length} connected
        </p>
      </div>

      {loading ? (
        <div className="p-12 text-center" style={{ color: "var(--ink-4)" }}>Loading integrations…</div>
      ) : (
        orderedCategories.map((category) => (
          <div key={category}>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--ink-4)" }}
            >
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {byCategory[category].map((integration) => {
                const cfg = statusConfig[integration.status as keyof typeof statusConfig] ?? statusConfig.disconnected;
                const Icon = cfg.icon;
                const isSyncing = syncing === integration.id;

                return (
                  <div key={integration.id} className="glass-panel p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                          {integration.name}
                        </p>
                        <p className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>
                          {integration.slug}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Icon size={12} style={{ color: cfg.color }} />
                        <span className="text-xs" style={{ color: cfg.color }}>
                          {cfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Data types */}
                    <div className="flex flex-wrap gap-1">
                      {integration.dataTypes.map((dt) => (
                        <span
                          key={dt}
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: "var(--hair)", color: "var(--ink-4)" }}
                        >
                          {dt}
                        </span>
                      ))}
                    </div>

                    {/* Last sync */}
                    {integration.lastSyncAt && (
                      <p className="text-xs" style={{ color: "var(--ink-4)" }}>
                        Last sync: {formatDateTime(integration.lastSyncAt)}
                      </p>
                    )}

                    {/* Error */}
                    {integration.errorMessage && (
                      <p className="text-xs" style={{ color: "var(--risk)" }}>
                        {integration.errorMessage}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSync(integration.id)}
                        disabled={isSyncing}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                        style={{ border: "1px solid var(--hair-2)", color: "var(--ink-3)" }}
                      >
                        <RefreshCw size={11} className={isSyncing ? "animate-spin" : ""} />
                        {isSyncing ? "Syncing…" : integration.status === "connected" ? "Test connection" : "Connect"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
