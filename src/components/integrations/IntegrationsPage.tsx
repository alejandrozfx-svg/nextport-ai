"use client";

import { useState, useEffect } from "react";
import {
  AlertCircle,
  BarChart3,
  Box,
  Building2,
  CheckCircle2,
  Clock,
  Cloud,
  Database,
  FileText,
  Hash,
  Landmark,
  Mail,
  MessageCircle,
  RefreshCw,
  Ship,
  Truck,
  Users,
  WifiOff,
} from "lucide-react";
import { useLang } from "@/lib/lang-context";
import { t, type Lang, type TranslationKey } from "@/lib/i18n";
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

const brandStyles: Record<string, {
  label: string;
  icon: typeof Mail;
  bg: string;
  color: string;
  border: string;
  simpleIcon?: string;
}> = {
  gmail: { label: "G", icon: Mail, simpleIcon: "gmail/EA4335", bg: "linear-gradient(135deg, rgba(234,67,53,0.24), rgba(251,188,5,0.16), rgba(52,168,83,0.18))", color: "#F8D7D2", border: "rgba(234,67,53,0.36)" },
  outlook: { label: "O", icon: Mail, simpleIcon: "microsoftoutlook/0078D4", bg: "linear-gradient(135deg, rgba(0,120,212,0.30), rgba(44,160,232,0.16))", color: "#B9E2FF", border: "rgba(44,160,232,0.38)" },
  "ms-teams": { label: "T", icon: Users, simpleIcon: "microsoftteams/6264A7", bg: "linear-gradient(135deg, rgba(98,100,167,0.34), rgba(80,90,210,0.14))", color: "#D7D8FF", border: "rgba(122,124,220,0.38)" },
  slack: { label: "S", icon: Hash, simpleIcon: "slack/4A154B", bg: "linear-gradient(135deg, rgba(74,21,75,0.36), rgba(54,197,240,0.14), rgba(46,182,125,0.14))", color: "#F1D6FF", border: "rgba(180,120,190,0.35)" },
  whatsapp: { label: "W", icon: MessageCircle, simpleIcon: "whatsapp/25D366", bg: "linear-gradient(135deg, rgba(37,211,102,0.30), rgba(18,140,126,0.14))", color: "#BDF7D0", border: "rgba(37,211,102,0.40)" },
  gdrive: { label: "D", icon: Cloud, simpleIcon: "googledrive/4285F4", bg: "linear-gradient(135deg, rgba(66,133,244,0.22), rgba(251,188,5,0.14), rgba(52,168,83,0.16))", color: "#D5E7FF", border: "rgba(66,133,244,0.36)" },
  sharepoint: { label: "SP", icon: Cloud, simpleIcon: "microsoftsharepoint/0078D4", bg: "linear-gradient(135deg, rgba(3,120,124,0.30), rgba(0,170,180,0.12))", color: "#C9FBFF", border: "rgba(0,170,180,0.36)" },
  dropbox: { label: "Db", icon: Box, simpleIcon: "dropbox/0061FF", bg: "linear-gradient(135deg, rgba(0,97,255,0.28), rgba(0,160,255,0.10))", color: "#C9E0FF", border: "rgba(0,97,255,0.36)" },
  "sap-s4": { label: "SAP", icon: Database, simpleIcon: "sap/0FAAFF", bg: "linear-gradient(135deg, rgba(0,112,186,0.30), rgba(122,176,224,0.12))", color: "#BFE4FF", border: "rgba(122,176,224,0.38)" },
  netsuite: { label: "NS", icon: Database, simpleIcon: "oracle/F80000", bg: "linear-gradient(135deg, rgba(255,90,31,0.26), rgba(255,255,255,0.04))", color: "#FFD6C8", border: "rgba(255,120,80,0.32)" },
  dynamics365: { label: "D365", icon: Database, simpleIcon: "microsoftdynamics365/0B53CE", bg: "linear-gradient(135deg, rgba(0,120,212,0.28), rgba(80,90,210,0.12))", color: "#CBE7FF", border: "rgba(0,120,212,0.36)" },
  powerbi: { label: "BI", icon: BarChart3, simpleIcon: "powerbi/F2C811", bg: "linear-gradient(135deg, rgba(242,200,17,0.28), rgba(222,160,0,0.10))", color: "#FFE999", border: "rgba(242,200,17,0.38)" },
  tableau: { label: "Tb", icon: BarChart3, simpleIcon: "tableau/E97627", bg: "linear-gradient(135deg, rgba(64,140,220,0.24), rgba(255,130,60,0.12))", color: "#D2E7FF", border: "rgba(90,150,220,0.34)" },
  "sat-vucem": { label: "SAT", icon: Landmark, bg: "linear-gradient(135deg, rgba(28,132,114,0.26), rgba(255,255,255,0.04))", color: "#C6F7ED", border: "rgba(28,132,114,0.38)" },
  "sat-cfdi": { label: "SAT", icon: Landmark, bg: "linear-gradient(135deg, rgba(28,132,114,0.26), rgba(255,255,255,0.04))", color: "#C6F7ED", border: "rgba(28,132,114,0.38)" },
  vucem: { label: "VU", icon: Landmark, bg: "linear-gradient(135deg, rgba(28,132,114,0.22), rgba(122,176,224,0.10))", color: "#C6F7ED", border: "rgba(28,132,114,0.34)" },
  "aduanas-pacifico": { label: "AP", icon: FileText, bg: "linear-gradient(135deg, rgba(122,176,224,0.22), rgba(255,255,255,0.03))", color: "var(--brand)", border: "oklch(0.78 0.09 235 / 0.34)" },
  maersk: { label: "M", icon: Ship, simpleIcon: "maersk/42B0D5", bg: "linear-gradient(135deg, rgba(66,176,213,0.28), rgba(255,255,255,0.05))", color: "#CDEFFF", border: "rgba(66,176,213,0.38)" },
  dhl: { label: "DHL", icon: Truck, simpleIcon: "dhl/FFCC00", bg: "linear-gradient(135deg, rgba(255,204,0,0.28), rgba(212,5,17,0.12))", color: "#FFE999", border: "rgba(255,204,0,0.38)" },
  fedex: { label: "Fx", icon: Truck, simpleIcon: "fedex/4D148C", bg: "linear-gradient(135deg, rgba(78,40,145,0.30), rgba(255,102,0,0.16))", color: "#E7D8FF", border: "rgba(145,100,220,0.34)" },
};

function getBrandStyle(integration: Integration) {
  if (brandStyles[integration.slug]) return brandStyles[integration.slug];
  if (integration.category === "Customs & Logistics") {
    return { label: "A", icon: FileText, bg: "linear-gradient(135deg, rgba(122,176,224,0.22), rgba(255,255,255,0.03))", color: "var(--brand)", border: "oklch(0.78 0.09 235 / 0.34)" };
  }
  return { label: integration.name.slice(0, 2), icon: Building2, bg: "rgba(255,255,255,0.045)", color: "var(--ink-2)", border: "var(--hair-2)" };
}

function IntegrationLogo({ integration }: { integration: Integration }) {
  const [logoFailed, setLogoFailed] = useState(false);
  const brand = getBrandStyle(integration);
  const Icon = brand.icon;
  const showOfficialLogo = brand.simpleIcon && !logoFailed;

  return (
    <div
      className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl"
      style={{
        background: brand.bg,
        border: `1px solid ${brand.border}`,
        color: brand.color,
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08)",
      }}
      aria-hidden="true"
    >
      {showOfficialLogo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://cdn.simpleicons.org/${brand.simpleIcon}`}
          alt=""
          width={22}
          height={22}
          onError={() => setLogoFailed(true)}
          style={{ display: "block", width: 22, height: 22, objectFit: "contain" }}
        />
      ) : (
        <div className="flex flex-col items-center gap-0.5">
          <Icon size={16} />
          <span className="font-mono text-[9px] font-semibold leading-none">{brand.label}</span>
        </div>
      )}
    </div>
  );
}

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
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>{t("integrations", lang)}</h2>
        <p className="text-sm" style={{ color: "var(--ink-4)" }}>
          {integrations.filter((i) => i.status === "connected").length} {t("of", lang)} {integrations.length} {t("connectedLower", lang)}
        </p>
      </div>

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
                  <div key={integration.id} className="glass-panel p-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <IntegrationLogo integration={integration} />
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
                      <button
                        onClick={() => handleSync(integration.id)}
                        disabled={isSyncing}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-50"
                        style={{ border: "1px solid var(--hair-2)", color: "var(--ink-3)" }}
                      >
                        <RefreshCw size={11} className={isSyncing ? "animate-spin" : ""} />
                        {isSyncing ? t("syncing", lang) : integration.status === "connected" ? t("testConnection", lang) : t("connectIntegration", lang)}
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
