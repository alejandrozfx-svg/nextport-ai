"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  RefreshCw,
  WifiOff,
} from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t, type Lang, type TranslationKey } from "@/lib/i18n";
import { formatDateTime } from "@/lib/utils";
import { ActionButton, IntegrationLogo, PageHeader, SectionCard } from "@/components/ui";

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

function getStatusConfig(lang: Lang) {
  return {
    connected: { icon: CheckCircle2, color: "var(--ok)", label: t("connected", lang) },
    pending: { icon: Clock, color: "var(--warn)", label: t("pending", lang) },
    error: { icon: AlertCircle, color: "var(--risk)", label: t("error", lang) },
    disconnected: { icon: WifiOff, color: "var(--ink-4)", label: t("disconnected", lang) },
  };
}

const categoryOrder = ["Communication", "Storage", "ERP", "BI & Reporting", "Government", "Customs & Logistics"];

const categoryKeys: Record<string, TranslationKey> = {
  Communication: "catCommunication",
  Storage: "catStorage",
  ERP: "catERP",
  "BI & Reporting": "catBIReporting",
  Government: "catGovernment",
  "Customs & Logistics": "catCustomsLogistics",
};

const dataTypeKeys: Record<string, TranslationKey> = {
  pedimento: "dataTypePedimento",
  cfdi: "dataTypeCfdi",
  purchase_order: "dataTypePurchaseOrder",
  invoice: "dataTypeInvoice",
  bl: "dataTypeBl",
  payment: "dataTypePayment",
  notifications: "dataTypeNotifications",
  documents: "dataTypeDocuments",
  analytics: "dataTypeAnalytics",
  tracking: "dataTypeTracking",
};

const DEMO_INTEGRATIONS: Integration[] = [
  { id: "1",  name: "SAT · VUCEM",          slug: "sat-vucem",    category: "Government",           status: "connected",    lastSyncAt: "2026-05-21T09:14:00Z", syncHealth: "healthy", dataTypes: ["pedimento", "cfdi"],         errorMessage: null },
  { id: "2",  name: "SAP S/4 HANA",         slug: "sap-s4",       category: "ERP",                  status: "connected",    lastSyncAt: "2026-05-21T08:00:00Z", syncHealth: "healthy", dataTypes: ["purchase_order", "invoice"],  errorMessage: null },
  { id: "3",  name: "Aduanas del Pacífico",  slug: "adp",          category: "Customs & Logistics",  status: "connected",    lastSyncAt: "2026-05-21T09:10:00Z", syncHealth: "healthy", dataTypes: ["pedimento", "bl"],            errorMessage: null },
  { id: "4",  name: "Grupo Aduanal Tepeyac", slug: "tepeyac",      category: "Customs & Logistics",  status: "connected",    lastSyncAt: "2026-05-20T18:30:00Z", syncHealth: "healthy", dataTypes: ["pedimento"],                  errorMessage: null },
  { id: "5",  name: "Oracle NetSuite",       slug: "netsuite",     category: "ERP",                  status: "pending",      lastSyncAt: null,                   syncHealth: null,      dataTypes: ["invoice", "payment"],         errorMessage: null },
  { id: "15", name: "Gmail",                 slug: "gmail",        category: "Communication",        status: "connected",    lastSyncAt: "2026-05-21T07:25:00Z", syncHealth: "healthy", dataTypes: ["documents", "notifications"], errorMessage: null },
  { id: "16", name: "Microsoft Outlook",     slug: "outlook",      category: "Communication",        status: "pending",      lastSyncAt: null,                   syncHealth: null,      dataTypes: ["documents", "notifications"], errorMessage: null },
  { id: "6",  name: "Microsoft Teams",       slug: "ms-teams",     category: "Communication",        status: "connected",    lastSyncAt: "2026-05-21T07:00:00Z", syncHealth: "healthy", dataTypes: ["notifications"],              errorMessage: null },
  { id: "7",  name: "Slack",                 slug: "slack",        category: "Communication",        status: "connected",    lastSyncAt: "2026-05-21T07:00:00Z", syncHealth: "healthy", dataTypes: ["notifications"],              errorMessage: null },
  { id: "17", name: "WhatsApp Business",     slug: "whatsapp",     category: "Communication",        status: "pending",      lastSyncAt: null,                   syncHealth: null,      dataTypes: ["documents", "notifications"], errorMessage: null },
  { id: "8",  name: "Google Drive",          slug: "gdrive",       category: "Storage",              status: "connected",    lastSyncAt: "2026-05-21T06:00:00Z", syncHealth: "healthy", dataTypes: ["documents"],                  errorMessage: null },
  { id: "9",  name: "Dropbox",               slug: "dropbox",      category: "Storage",              status: "disconnected", lastSyncAt: null,                   syncHealth: null,      dataTypes: ["documents"],                  errorMessage: null },
  { id: "10", name: "Power BI",              slug: "powerbi",      category: "BI & Reporting",       status: "pending",      lastSyncAt: null,                   syncHealth: null,      dataTypes: ["analytics"],                  errorMessage: null },
  { id: "11", name: "Maersk Connect",        slug: "maersk",       category: "Customs & Logistics",  status: "connected",    lastSyncAt: "2026-05-21T08:45:00Z", syncHealth: "healthy", dataTypes: ["bl", "tracking"],             errorMessage: null },
  { id: "12", name: "FedEx API",             slug: "fedex",        category: "Customs & Logistics",  status: "error",        lastSyncAt: "2026-05-20T14:00:00Z", syncHealth: "error",   dataTypes: ["tracking"],                   errorMessage: "Auth token expired" },
  { id: "13", name: "Comercio Internacional Norte", slug: "cin", category: "Customs & Logistics",  status: "connected",    lastSyncAt: "2026-05-21T09:00:00Z", syncHealth: "healthy", dataTypes: ["pedimento"],                  errorMessage: null },
  { id: "14", name: "Tableau",               slug: "tableau",      category: "BI & Reporting",       status: "disconnected", lastSyncAt: null,                   syncHealth: null,      dataTypes: ["analytics"],                  errorMessage: null },
];

const REQUIRED_VISIBLE_SLUGS = ["gmail", "outlook", "ms-teams", "slack", "whatsapp"];

function withRequiredDemoIntegrations(integrations: Integration[]) {
  const existingSlugs = new Set(integrations.map((integration) => integration.slug));
  const missing = DEMO_INTEGRATIONS.filter(
    (integration) => REQUIRED_VISIBLE_SLUGS.includes(integration.slug) && !existingSlugs.has(integration.slug)
  );

  return [...integrations, ...missing];
}

export function IntegrationsPage() {
  const { lang } = useLang();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const statusConfig = getStatusConfig(lang);

  useEffect(() => {
    setIntegrations(DEMO_INTEGRATIONS);
    setLoading(false);
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 2000);
    fetch("/api/integrations", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => { if (d.integrations?.length) setIntegrations(withRequiredDemoIntegrations(d.integrations)); })
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
    <div className="space-y-7 p-4 sm:p-6">
      <PageHeader
        title={t("integrations", lang)}
        subtitle={`${integrations.filter((i) => i.status === "connected").length} ${t("of", lang)} ${integrations.length} ${t("connectedLower", lang)}`}
      />

      {loading ? (
        <div className="p-12 text-center" style={{ color: "var(--ink-4)" }}>{t("loadingIntegrations", lang)}</div>
      ) : (
        orderedCategories.map((category) => (
          <div key={category}>
            <h3
              className="text-xs font-semibold uppercase tracking-wider mb-3"
              style={{ color: "var(--ink-4)" }}
            >
              {categoryKeys[category] ? t(categoryKeys[category], lang) : category}
            </h3>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {byCategory[category].map((integration) => {
                const cfg = statusConfig[integration.status as keyof typeof statusConfig] ?? statusConfig.disconnected;
                const Icon = cfg.icon;
                const isSyncing = syncing === integration.id;

                return (
                  <SectionCard key={integration.id} className="space-y-3 p-4" interactive>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <IntegrationLogo name={integration.name} slug={integration.slug} category={integration.category} />
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold" style={{ color: "var(--ink)" }}>
                            {integration.name}
                          </p>
                          <p className="truncate text-xs font-mono" style={{ color: "var(--ink-4)" }}>
                            {integration.slug}
                          </p>
                        </div>
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
                          {dataTypeKeys[dt] ? t(dataTypeKeys[dt], lang) : dt}
                        </span>
                      ))}
                    </div>

                    {/* Last sync */}
                    {integration.lastSyncAt && (
                      <p className="text-xs" style={{ color: "var(--ink-4)" }}>
                        {t("lastSync", lang)}: {formatDateTime(integration.lastSyncAt, lang)}
                      </p>
                    )}

                    {/* Error */}
                    {integration.errorMessage && (
                      <p className="text-xs" style={{ color: "var(--risk)" }}>
                        {integration.errorMessage === "Auth token expired" ? t("integrationTokenExpired", lang) : integration.errorMessage}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2">
                      <ActionButton
                        onClick={() => handleSync(integration.id)}
                        disabled={isSyncing}
                        size="sm"
                        className="flex-1 justify-center"
                      >
                        <RefreshCw size={11} className={isSyncing ? "animate-spin" : ""} />
                        {isSyncing ? t("syncing", lang) : integration.status === "connected" ? t("testConnection", lang) : t("connectIntegration", lang)}
                      </ActionButton>
                    </div>
                  </SectionCard>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
