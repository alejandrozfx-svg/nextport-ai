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

const DEMO_INTEGRATIONS: Integration[] = [
  { id: "1",  name: "SAT · VUCEM",          slug: "sat-vucem",    category: "Government",           status: "connected",    lastSyncAt: "2026-05-21T09:14:00Z", syncHealth: "healthy", dataTypes: ["pedimento", "cfdi"],         errorMessage: null },
  { id: "2",  name: "SAP S/4 HANA",         slug: "sap-s4",       category: "ERP",                  status: "connected",    lastSyncAt: "2026-05-21T08:00:00Z", syncHealth: "healthy", dataTypes: ["purchase_order", "invoice"],  errorMessage: null },
  { id: "3",  name: "Aduanas del Pacífico",  slug: "adp",          category: "Customs & Logistics",  status: "connected",    lastSyncAt: "2026-05-21T09:10:00Z", syncHealth: "healthy", dataTypes: ["pedimento", "bl"],            errorMessage: null },
  { id: "4",  name: "Grupo Aduanal Tepeyac", slug: "tepeyac",      category: "Customs & Logistics",  status: "connected",    lastSyncAt: "2026-05-20T18:30:00Z", syncHealth: "healthy", dataTypes: ["pedimento"],                  errorMessage: null },
  { id: "5",  name: "Oracle NetSuite",       slug: "netsuite",     category: "ERP",                  status: "pending",      lastSyncAt: null,                   syncHealth: null,      dataTypes: ["invoice", "payment"],         errorMessage: null },
  { id: "6",  name: "Microsoft Teams",       slug: "ms-teams",     category: "Communication",        status: "connected",    lastSyncAt: "2026-05-21T07:00:00Z", syncHealth: "healthy", dataTypes: ["notifications"],              errorMessage: null },
  { id: "7",  name: "Slack",                 slug: "slack",        category: "Communication",        status: "connected",    lastSyncAt: "2026-05-21T07:00:00Z", syncHealth: "healthy", dataTypes: ["notifications"],              errorMessage: null },
  { id: "8",  name: "Google Drive",          slug: "gdrive",       category: "Storage",              status: "connected",    lastSyncAt: "2026-05-21T06:00:00Z", syncHealth: "healthy", dataTypes: ["documents"],                  errorMessage: null },
  { id: "9",  name: "Dropbox",               slug: "dropbox",      category: "Storage",              status: "disconnected", lastSyncAt: null,                   syncHealth: null,      dataTypes: ["documents"],                  errorMessage: null },
  { id: "10", name: "Power BI",              slug: "powerbi",      category: "BI & Reporting",       status: "pending",      lastSyncAt: null,                   syncHealth: null,      dataTypes: ["analytics"],                  errorMessage: null },
  { id: "11", name: "Maersk Connect",        slug: "maersk",       category: "Customs & Logistics",  status: "connected",    lastSyncAt: "2026-05-21T08:45:00Z", syncHealth: "healthy", dataTypes: ["bl", "tracking"],             errorMessage: null },
  { id: "12", name: "FedEx API",             slug: "fedex",        category: "Customs & Logistics",  status: "error",        lastSyncAt: "2026-05-20T14:00:00Z", syncHealth: "error",   dataTypes: ["tracking"],                   errorMessage: "Auth token expired" },
  { id: "13", name: "Comercio Internacional Norte", slug: "cin", category: "Customs & Logistics",  status: "connected",    lastSyncAt: "2026-05-21T09:00:00Z", syncHealth: "healthy", dataTypes: ["pedimento"],                  errorMessage: null },
  { id: "14", name: "Tableau",               slug: "tableau",      category: "BI & Reporting",       status: "disconnected", lastSyncAt: null,                   syncHealth: null,      dataTypes: ["analytics"],                  errorMessage: null },
];

export function IntegrationsPage() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIntegrations(DEMO_INTEGRATIONS);
    setLoading(false);
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 2000);
    fetch("/api/integrations", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => { if (d.integrations?.length) setIntegrations(d.integrations); })
      .catch(() => {});
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
