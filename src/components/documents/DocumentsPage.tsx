"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ArrowUpRight,
  BadgeDollarSign,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Database,
  Download,
  FileCheck2,
  FileText,
  Filter,
  Gavel,
  LayoutGrid,
  List,
  Landmark,
  Package,
  RotateCcw,
  Scan,
  ScanLine,
  Scale,
  Search as SearchIcon,
  Shield,
  ShieldCheck,
  Ship,
  Shuffle,
  Sparkles,
  TrendingDown,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { formatDate, formatDateTime, cn } from "@/lib/utils";
import { useLang } from "@/lib/lang-context";
import { t, type Lang, type TranslationKey } from "@/lib/i18n";
import { ActionButton, DocumentIcon, EmptyState, MetricCard, PageHeader, SectionCard } from "@/components/ui";

interface EvidenceField {
  id: string;
  label: string;
  value: string;
  confidence: number;
  mismatch?: boolean;
}

interface EvidenceCheck {
  id: string;
  checkName: string;
  passed: boolean;
  detail?: string | null;
}

interface DocumentItem {
  id: string;
  type: string;
  filename: string;
  status: string;
  confidence: number;
  source: string;
  uploadedAt: string;
  operation: { id: string; supplier: { shortName: string } };
  extractedFields?: EvidenceField[];
  validationChecks?: EvidenceCheck[];
}

interface DocVisualConfig {
  short: string;
  Icon: LucideIcon;
  accent: string;
  previewBg: string;
  stamp: string;
  pdfUrl?: string;
  fields: EvidenceField[];
  checks: EvidenceCheck[];
}

const statusIcon: Record<string, React.ReactNode> = {
  uploaded: <Clock size={12} />,
  classified: <Scan size={12} />,
  extracted: <FileText size={12} />,
  validated: <CheckCircle2 size={12} />,
  ready: <CheckCircle2 size={12} />,
};

const statusColor: Record<string, string> = {
  uploaded: "var(--ink-4)",
  classified: "var(--brand)",
  extracted: "var(--brand)",
  validated: "var(--warn)",
  ready: "var(--ok)",
};

const docTypeKeys: Record<string, TranslationKey> = {
  pedimento: "pedimento",
  invoice: "invoice",
  bl: "bl",
  packing_list: "packing_list",
  mve: "mve",
  cfdi: "cfdi",
  coo: "coo",
  carta_porte: "carta_porte",
};

const statusKeys: Record<string, TranslationKey> = {
  uploaded: "statusUploaded",
  classified: "statusClassified",
  extracted: "statusExtracted",
  validated: "statusValidated",
  ready: "statusReady",
};

const viewerCopy: Record<
  Lang,
  {
    evidenceViewer: string;
    documentPreview: string;
    selectedDocument: string;
    source: string;
    uploaded: string;
    relatedOperation: string;
    validationChecks: string;
    extractedFields: string;
    openExpediente: string;
    inspectPrompt: string;
    noPdf: string;
    fields: string;
    checks: string;
    selected: string;
  }
> = {
  en: {
    evidenceViewer: "Evidence viewer",
    documentPreview: "Document preview",
    selectedDocument: "Selected document",
    source: "Source",
    uploaded: "Uploaded",
    relatedOperation: "Related operation",
    validationChecks: "Validation checks",
    extractedFields: "Extracted fields",
    openExpediente: "Back to expediente",
    inspectPrompt: "Select a document to inspect its evidence pack.",
    noPdf: "Visual placeholder - PDF source not attached.",
    fields: "fields",
    checks: "checks",
    selected: "Selected",
  },
  es: {
    evidenceViewer: "Visor de evidencia",
    documentPreview: "Vista del documento",
    selectedDocument: "Documento seleccionado",
    source: "Fuente",
    uploaded: "Subido",
    relatedOperation: "Operación relacionada",
    validationChecks: "Validaciones",
    extractedFields: "Campos extraídos",
    openExpediente: "Volver al expediente",
    inspectPrompt: "Selecciona un documento para revisar su paquete de evidencia.",
    noPdf: "Placeholder visual - PDF fuente no adjunto.",
    fields: "campos",
    checks: "checks",
    selected: "Seleccionado",
  },
  zh: {
    evidenceViewer: "证据查看器",
    documentPreview: "文件预览",
    selectedDocument: "已选文件",
    source: "来源",
    uploaded: "上传时间",
    relatedOperation: "关联运营",
    validationChecks: "验证检查",
    extractedFields: "提取字段",
    openExpediente: "返回档案",
    inspectPrompt: "选择一个文件以查看证据包。",
    noPdf: "视觉占位 - 未附加PDF源。",
    fields: "字段",
    checks: "检查",
    selected: "已选择",
  },
};

const DOC_VISUALS: Record<string, DocVisualConfig> = {
  invoice: {
    short: "INV",
    Icon: BadgeDollarSign,
    accent: "var(--brand)",
    previewBg:
      "radial-gradient(circle at 20% 18%, rgba(122,176,224,0.26), transparent 34%), linear-gradient(145deg, rgba(122,176,224,0.18), rgba(255,255,255,0.035))",
    stamp: "VALUE",
    pdfUrl: "/sample-documents/01_commercial_invoice_dummy.pdf",
    fields: [
      { id: "invoice-1", label: "Invoice total", value: "USD 184,250", confidence: 0.995 },
      { id: "invoice-2", label: "Supplier RFC", value: "LUM2604189A2", confidence: 0.984 },
      { id: "invoice-3", label: "Incoterm", value: "FOB Shanghai", confidence: 0.972 },
      { id: "invoice-4", label: "Commercial value", value: "USD 178,920", confidence: 0.961 },
    ],
    checks: [
      { id: "invoice-c1", checkName: "Invoice total parsed", passed: true },
      { id: "invoice-c2", checkName: "Invoice vs pedimento value", passed: false, detail: "USD 5,330 delta" },
      { id: "invoice-c3", checkName: "Supplier tax ID present", passed: true },
    ],
  },
  bl: {
    short: "B/L",
    Icon: Ship,
    accent: "var(--accent)",
    previewBg:
      "radial-gradient(circle at 78% 14%, rgba(55,214,192,0.22), transparent 32%), linear-gradient(145deg, rgba(55,214,192,0.16), rgba(255,255,255,0.035))",
    stamp: "CARGO",
    pdfUrl: "/sample-documents/03_bill_of_lading_dummy.pdf",
    fields: [
      { id: "bl-1", label: "BL number", value: "MAEU-7741229", confidence: 0.991 },
      { id: "bl-2", label: "Container count", value: "3 x 40HQ", confidence: 0.968 },
      { id: "bl-3", label: "Gross weight", value: "18,420 kg", confidence: 0.982 },
      { id: "bl-4", label: "Route", value: "Shanghai - Manzanillo", confidence: 0.975 },
    ],
    checks: [
      { id: "bl-c1", checkName: "BL vs packing list containers", passed: true },
      { id: "bl-c2", checkName: "Weight within declared tolerance", passed: true },
      { id: "bl-c3", checkName: "ETA source attached", passed: true },
    ],
  },
  packing_list: {
    short: "PKG",
    Icon: Package,
    accent: "var(--ok)",
    previewBg:
      "radial-gradient(circle at 15% 78%, rgba(80,220,168,0.20), transparent 34%), linear-gradient(145deg, rgba(80,220,168,0.15), rgba(255,255,255,0.035))",
    stamp: "COUNT",
    pdfUrl: "/sample-documents/02_packing_list_dummy.pdf",
    fields: [
      { id: "pl-1", label: "Packages", value: "42 cartons", confidence: 0.987 },
      { id: "pl-2", label: "Net weight", value: "17,890 kg", confidence: 0.971 },
      { id: "pl-3", label: "Gross weight", value: "18,420 kg", confidence: 0.989 },
      { id: "pl-4", label: "Origin", value: "China", confidence: 0.963 },
    ],
    checks: [
      { id: "pl-c1", checkName: "Pack count reconciled", passed: true },
      { id: "pl-c2", checkName: "Country of origin matches invoice", passed: true },
      { id: "pl-c3", checkName: "BL gross weight matches", passed: true },
    ],
  },
  pedimento: {
    short: "PED",
    Icon: Landmark,
    accent: "var(--warn)",
    previewBg:
      "radial-gradient(circle at 74% 78%, rgba(244,184,77,0.23), transparent 34%), linear-gradient(145deg, rgba(244,184,77,0.17), rgba(255,255,255,0.035))",
    stamp: "ADUANA",
    pdfUrl: "/sample-documents/04_pedimento_simplified_dummy.pdf",
    fields: [
      { id: "ped-1", label: "Pedimento", value: "26 47 3145 6002847", confidence: 0.998 },
      { id: "ped-2", label: "Customs value", value: "USD 189,580", confidence: 0.974, mismatch: true },
      { id: "ped-3", label: "HS bucket", value: "8541.40.01", confidence: 0.965 },
      { id: "ped-4", label: "Regime", value: "A1 Definitive import", confidence: 0.982 },
    ],
    checks: [
      { id: "ped-c1", checkName: "Pedimento number valid", passed: true },
      { id: "ped-c2", checkName: "Customs value vs invoice", passed: false, detail: "Review discrepancy" },
      { id: "ped-c3", checkName: "HS evidence attached", passed: true },
    ],
  },
  mve: {
    short: "MVE",
    Icon: ShieldCheck,
    accent: "var(--ok)",
    previewBg:
      "radial-gradient(circle at 50% 18%, rgba(80,220,168,0.22), transparent 31%), linear-gradient(145deg, rgba(122,176,224,0.14), rgba(80,220,168,0.07))",
    stamp: "READY",
    pdfUrl: "/sample-documents/05_manifestacion_valor_electronica_dummy.pdf",
    fields: [
      { id: "mve-1", label: "Importer RFC", value: "NXT2601108K5", confidence: 0.972 },
      { id: "mve-2", label: "Related invoice", value: "LMT-44218", confidence: 0.968 },
      { id: "mve-3", label: "Declared value", value: "USD 184,250", confidence: 0.957 },
      { id: "mve-4", label: "Signature status", value: "Electronic signature present", confidence: 0.981 },
    ],
    checks: [
      { id: "mve-c1", checkName: "MVE references invoice", passed: true },
      { id: "mve-c2", checkName: "Importer data complete", passed: true },
      { id: "mve-c3", checkName: "Signature evidence found", passed: true },
    ],
  },
  cfdi: {
    short: "CFDI",
    Icon: FileCheck2,
    accent: "var(--brand)",
    previewBg:
      "radial-gradient(circle at 80% 20%, rgba(122,176,224,0.20), transparent 34%), linear-gradient(145deg, rgba(122,176,224,0.12), rgba(255,255,255,0.035))",
    stamp: "UUID",
    fields: [
      { id: "cfdi-1", label: "UUID", value: "B81F-22AC-9014", confidence: 0.999 },
      { id: "cfdi-2", label: "Amount", value: "MXN 18,400", confidence: 0.991 },
      { id: "cfdi-3", label: "Broker service", value: "Aduanas del Pacifico", confidence: 0.978 },
    ],
    checks: [
      { id: "cfdi-c1", checkName: "UUID format valid", passed: true },
      { id: "cfdi-c2", checkName: "Operation reference present", passed: true },
    ],
  },
};

const fallbackVisual: DocVisualConfig = {
  short: "DOC",
  Icon: FileText,
  accent: "var(--ink-3)",
  previewBg:
    "radial-gradient(circle at 22% 20%, rgba(255,255,255,0.12), transparent 32%), linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
  stamp: "DOC",
  fields: [
    { id: "fallback-1", label: "Document type", value: "Detected evidence", confidence: 0.92 },
    { id: "fallback-2", label: "Linked record", value: "Import operation", confidence: 0.88 },
  ],
  checks: [
    { id: "fallback-c1", checkName: "Document linked to operation", passed: true },
    { id: "fallback-c2", checkName: "Ready for human review", passed: true },
  ],
};

const DEMO_DOCUMENTS: DocumentItem[] = [
  { id: "d1", type: "pedimento", filename: "Pedimento_A1_26-47-3145-6002847.pdf", status: "ready", confidence: 0.998, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d2", type: "invoice", filename: "Invoice_LMT-44218.pdf", status: "validated", confidence: 0.995, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d3", type: "bl", filename: "BL_MAEU-7741229.pdf", status: "ready", confidence: 0.991, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d4", type: "packing_list", filename: "PackingList_LMT-44218.pdf", status: "ready", confidence: 0.989, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d5", type: "mve", filename: "MVE_ScanCopy.pdf", status: "ready", confidence: 0.972, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d6", type: "cfdi", filename: "CFDI_Honorarios_Aduanas.xml", status: "ready", confidence: 0.999, source: "broker_upload", uploadedAt: "2026-05-21T09:14:00Z", operation: { id: "NP-2026-001847", supplier: { shortName: "Lumitech Optics" } } },
  { id: "d7", type: "pedimento", filename: "Pedimento_A1_26-47-1108-6002846.pdf", status: "ready", confidence: 0.994, source: "broker_upload", uploadedAt: "2026-05-20T18:30:00Z", operation: { id: "NP-2026-001846", supplier: { shortName: "TaegukChem" } } },
  { id: "d8", type: "invoice", filename: "Invoice_TCH-2026-0419.pdf", status: "ready", confidence: 0.987, source: "broker_upload", uploadedAt: "2026-05-20T18:30:00Z", operation: { id: "NP-2026-001846", supplier: { shortName: "TaegukChem" } } },
  { id: "d9", type: "bl", filename: "BL_KMTC-990442.pdf", status: "ready", confidence: 0.98, source: "broker_upload", uploadedAt: "2026-05-20T18:30:00Z", operation: { id: "NP-2026-001846", supplier: { shortName: "TaegukChem" } } },
  { id: "d10", type: "packing_list", filename: "PL-TCH-2026-0419.pdf", status: "classified", confidence: 0.962, source: "broker_upload", uploadedAt: "2026-05-20T18:30:00Z", operation: { id: "NP-2026-001846", supplier: { shortName: "TaegukChem" } } },
];

function getVisualConfig(type: string) {
  return DOC_VISUALS[type] ?? fallbackVisual;
}

function getDocTypeLabel(type: string, lang: Lang) {
  return t(docTypeKeys[type] ?? "documentsLabel", lang);
}

function getSourceLabel(source: string, lang: Lang) {
  const labels: Record<string, Record<Lang, string>> = {
    broker_upload: { en: "Broker upload", es: "Carga del agente", zh: "报关行上传" },
    upload: { en: "Manual upload", es: "Carga manual", zh: "手动上传" },
    inbox: { en: "Connected inbox", es: "Inbox conectado", zh: "已连接收件箱" },
  };
  return labels[source]?.[lang] ?? source.replace(/_/g, " ");
}

function getEvidenceFields(doc: DocumentItem): EvidenceField[] {
  if (doc.extractedFields?.length) return doc.extractedFields;
  return getVisualConfig(doc.type).fields;
}

function getEvidenceChecks(doc: DocumentItem): EvidenceCheck[] {
  if (doc.validationChecks?.length) return doc.validationChecks;
  return getVisualConfig(doc.type).checks;
}

/** Tiny helper to render two <tr> rows under one keyed wrapper without breaking <tbody>. */
function FragmentRow({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

/* ── Audit playbooks ─────────────────────────────────────────────────
 * Real-world starting points. Each playbook applies a preset combination
 * of filters that maps to a specific compliance scenario the user actually
 * encounters. Picking one immediately narrows the table so the user goes
 * from "open page → pick scenario → refine → export" in 3 clicks.
 * ────────────────────────────────────────────────────────────────────*/
type PlaybookId = "sat" | "quarterly" | "supplier" | "soc2" | "qa";

interface PlaybookPreset {
  filter?: string;
  period?: PeriodFilter;
  confFilter?: ConfidenceFilter;
  statusFilter?: string;
  sourceFilter?: string;
  supplierFilter?: string;
  operationFilter?: string;
  search?: string;
  sortKey?: SortKey;
}

interface Playbook {
  id: PlaybookId;
  icon: LucideIcon;
  accent: string;
  titleKey: TranslationKey;
  descKey: TranslationKey;
  preset: PlaybookPreset;
}

/* Playbooks kept after the 2026-05-23 cleanup (ADR-0001):
 * Only the 3 presets that genuinely compose multi-filter combinations beyond what a single
 * manual control does. "SOC 2 sample" and "Supplier dispute" were removed because their
 * presets only set sort order and required the user to do the real work manually — they
 * were named like features but did nothing. See docs/decisions/0001-documents-cleanup.md. */
const PLAYBOOKS: Playbook[] = [
  {
    id: "sat",
    icon: Landmark,
    accent: "var(--warn)",
    titleKey: "playbookSatTitle",
    descKey: "playbookSatDesc",
    preset: { period: "30d", statusFilter: "ready", sortKey: "recent" },
  },
  {
    id: "quarterly",
    icon: Scale,
    accent: "var(--brand)",
    titleKey: "playbookQuarterlyTitle",
    descKey: "playbookQuarterlyDesc",
    preset: { period: "quarter", statusFilter: "validated", sortKey: "supplier" },
  },
  {
    id: "qa",
    icon: ScanLine,
    accent: "var(--risk)",
    titleKey: "playbookQaTitle",
    descKey: "playbookQaDesc",
    preset: { confFilter: "low", sortKey: "confAsc" },
  },
];

/* ── Recent pulls ────────────────────────────────────────────────────
 * Demo history of past evidence exports. Reinforces that this is a
 * recurring workflow (audit defense is a routine, not a one-off) and
 * makes the chain-of-custody concept visible.
 * ────────────────────────────────────────────────────────────────────*/
interface RecentPull {
  id: string;
  user: { name: string; initials: string };
  reasonKey: TranslationKey;
  docCount: number;
  manifestSha: string;
  createdAt: string;
}

/* Empty by default — the list only populates after the user actually exports something
 * in-session. ADR-0001 removed the demo-seeded entries because pre-populating a "trail" the
 * user did not create was theatre. */
const DEMO_RECENT_PULLS: RecentPull[] = [];

/* ── P1 helpers ──────────────────────────────────────────────────────
 * Below are pure helpers added in the P1 iteration. They derive UI labels
 * and counts from the existing data shape without needing new state.
 * ────────────────────────────────────────────────────────────────────*/

/** Returns how many documents would match a playbook's preset, run against the full list.
 * Lets us show "12 docs match" on each chip without committing to applying the filter. */
function previewPlaybookCount(playbook: Playbook, documents: DocumentItem[]): number {
  const p = playbook.preset;
  return documents.filter((doc) => {
    if (p.filter && p.filter !== "all" && doc.type !== p.filter) return false;
    if (p.statusFilter && p.statusFilter !== "all" && doc.status !== p.statusFilter) return false;
    if (p.supplierFilter && p.supplierFilter !== "all" && doc.operation.supplier.shortName !== p.supplierFilter) return false;
    if (p.operationFilter && p.operationFilter !== "all" && doc.operation.id !== p.operationFilter) return false;
    if (p.period && !docMatchesPeriod(doc, p.period)) return false;
    if (p.confFilter && !docMatchesConfidence(doc, p.confFilter)) return false;
    if (p.search && !docMatchesSearch(doc, p.search)) return false;
    return true;
  }).length;
}

/** Per-document purpose label — what role this doc plays in the audit narrative.
 * Computed from the doc's checks + status + field confidences. */
type DocPurpose = "auditReady" | "needsReview" | "mismatch" | "lowConfidence";

function getDocPurpose(doc: DocumentItem): DocPurpose {
  const checks = getEvidenceChecks(doc);
  if (checks.some((c) => !c.passed)) return "mismatch";
  const fields = getEvidenceFields(doc);
  if (fields.some((f) => f.mismatch)) return "mismatch";
  if (fields.some((f) => f.confidence < 0.90)) return "lowConfidence";
  if (doc.status !== "ready" && doc.status !== "validated") return "needsReview";
  return "auditReady";
}

const purposeMeta: Record<DocPurpose, { color: string; bg: string; labelKey: TranslationKey }> = {
  auditReady:    { color: "var(--ok)",   bg: "var(--ok-soft)",   labelKey: "purposeAuditReady" },
  needsReview:   { color: "var(--warn)", bg: "var(--warn-soft)", labelKey: "purposeNeedsReview" },
  mismatch:      { color: "var(--risk)", bg: "var(--risk-soft)", labelKey: "purposeMismatch" },
  lowConfidence: { color: "var(--warn)", bg: "var(--warn-soft)", labelKey: "purposeLowConfidence" },
};

/** Explains WHY the AI assigned this confidence level. Heuristic based on the demo data —
 * in production this would surface the actual reasoning from the classifier. */
function explainFieldConfidence(field: EvidenceField, lang: Lang): string {
  if (field.mismatch) return t("confidenceMismatch", lang);
  if (field.confidence >= 0.95) return t("confidenceHigh", lang);
  if (field.confidence >= 0.90) return t("confidenceMid", lang);
  return t("confidenceLow", lang);
}

/** P2: derives the recommended "Next" action for a doc based on its purpose. */
function getNextActionKey(purpose: DocPurpose): TranslationKey {
  switch (purpose) {
    case "auditReady":   return "nextActionAuditReady";
    case "needsReview":  return "nextActionNeedsReview";
    case "mismatch":     return "nextActionMismatch";
    case "lowConfidence": return "nextActionLowConf";
  }
}

/* Real SHA-256 over the manifest JSON via the Web Crypto API. Falls back to a clearly-marked
 * placeholder only if crypto.subtle is unavailable (very old browsers). The previous version
 * used Math.random() and called the result a hash — ADR-0001 forbids that. */
async function computeManifestSha(payload: unknown): Promise<string> {
  if (typeof window === "undefined" || !window.crypto?.subtle) {
    return "sha-unavailable";
  }
  const json = JSON.stringify(payload);
  const bytes = new TextEncoder().encode(json);
  const hashBuf = await window.crypto.subtle.digest("SHA-256", bytes);
  const hex = Array.from(new Uint8Array(hashBuf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Display chunks for readability: 4-4-4 hex segments.
  return `${hex.slice(0, 4)}·${hex.slice(4, 8)}·${hex.slice(8, 12)}`;
}

function DocumentSpecificPreview({ doc, compact }: { doc: DocumentItem; compact?: boolean }) {
  const visual = getVisualConfig(doc.type);
  const Icon = visual.Icon;

  if (doc.type === "bl") {
    return (
      <div className="mt-auto space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-mono" style={{ color: "var(--ink-3)" }}>
          <span>SHA</span>
          <span className="h-px flex-1" style={{ background: visual.accent }} />
          <Ship size={compact ? 12 : 15} style={{ color: visual.accent }} />
          <span className="h-px flex-1" style={{ background: visual.accent }} />
          <span>MEX</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[1, 2, 3].map((item) => (
            <div key={item} className="h-4 rounded border" style={{ borderColor: "var(--hair-2)", background: "rgba(255,255,255,0.05)" }} />
          ))}
        </div>
      </div>
    );
  }

  if (doc.type === "packing_list") {
    return (
      <div className="mt-auto grid grid-cols-4 gap-1.5">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
          <div key={item} className="aspect-square rounded-md border" style={{ borderColor: "var(--hair-2)", background: "rgba(255,255,255,0.045)" }} />
        ))}
      </div>
    );
  }

  if (doc.type === "pedimento" || doc.type === "mve") {
    return (
      <div className="mt-auto flex items-end justify-between gap-3">
        <div className="space-y-1.5 flex-1">
          {[65, 90, 55].map((width) => (
            <div key={width} className="h-1.5 rounded-full" style={{ width: `${width}%`, background: "rgba(255,255,255,0.16)" }} />
          ))}
        </div>
        <div
          className="grid h-14 w-14 place-items-center rounded-full border text-[9px] font-black tracking-widest rotate-[-10deg]"
          style={{ borderColor: visual.accent, color: visual.accent, boxShadow: `0 0 22px ${visual.accent}` }}
        >
          {visual.stamp}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-auto rounded-xl border p-2" style={{ borderColor: "var(--hair)", background: "rgba(0,0,0,0.14)" }}>
      <div className="flex items-center justify-between text-[10px] font-mono" style={{ color: "var(--ink-4)" }}>
        <span>{visual.stamp}</span>
        <Icon size={compact ? 12 : 15} style={{ color: visual.accent }} />
      </div>
      <div className="mt-2 space-y-1.5">
        {[90, 72, 48].map((width) => (
          <div key={width} className="h-1.5 rounded-full" style={{ width: `${width}%`, background: "rgba(255,255,255,0.14)" }} />
        ))}
      </div>
    </div>
  );
}

function DocumentThumbnail({ doc, variant = "card" }: { doc: DocumentItem; variant?: "card" | "large" }) {
  const visual = getVisualConfig(doc.type);
  const isLarge = variant === "large";

  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-xl border",
        isLarge ? "min-h-[310px] p-5" : "h-24 p-3"
      )}
      style={{ background: visual.previewBg, borderColor: "var(--hair)" }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${visual.accent}, transparent)` }} />
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: visual.accent, opacity: 0.18 }} />
      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <DocumentIcon type={doc.type} classified size={isLarge ? "lg" : "md"} />
            {/* Single, unambiguous label: just the type short code (PED / INV / BL / PKG / MVE / CFDI) */}
            <p className="font-mono text-[11px] font-semibold tracking-[0.20em]" style={{ color: visual.accent }}>
              {visual.short}
            </p>
          </div>
        </div>

        {isLarge && (
          <div className="my-5 grid grid-cols-2 gap-2">
            {getEvidenceFields(doc).slice(0, 4).map((field) => (
              <div key={field.id} className="rounded-lg border p-2" style={{ borderColor: "var(--hair)", background: "rgba(0,0,0,0.12)" }}>
                <p className="text-[10px]" style={{ color: "var(--ink-4)" }}>{field.label}</p>
                <p className="mt-1 truncate text-xs font-semibold" style={{ color: "var(--ink)" }}>{field.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* The compact thumbnail no longer renders DocumentSpecificPreview — it was just decorative
         * skeleton bars with no real info and ate ~40% of the card. Large variant still shows it
         * for the evidence viewer where we have the vertical budget. */}
        {isLarge && <DocumentSpecificPreview doc={doc} compact={false} />}
      </div>
    </div>
  );
}

function EvidenceViewer({ doc, lang }: { doc: DocumentItem | null; lang: Lang }) {
  const copy = viewerCopy[lang];

  if (!doc) {
    return (
      <aside className="glass-panel p-5">
        <div className="flex h-72 flex-col items-center justify-center rounded-xl border border-dashed text-center" style={{ borderColor: "var(--hair-2)" }}>
          <FileText size={26} style={{ color: "var(--ink-4)" }} />
          <p className="mt-3 text-sm" style={{ color: "var(--ink-4)" }}>{copy.inspectPrompt}</p>
        </div>
      </aside>
    );
  }

  const visual = getVisualConfig(doc.type);
  const fields = getEvidenceFields(doc);
  const checks = getEvidenceChecks(doc);
  const passedChecks = checks.filter((check) => check.passed).length;
  const color = statusColor[doc.status] ?? "var(--ink-4)";

  return (
    <aside className="glass-panel elev-2 overflow-hidden">
      <div className="border-b p-5" style={{ borderColor: "var(--hair)" }}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--ink-4)" }}>
              {copy.evidenceViewer}
            </p>
            <h3 className="mt-1 text-lg font-semibold" style={{ color: "var(--ink)" }}>
              {getDocTypeLabel(doc.type, lang)}
            </h3>
            <p className="mt-1 max-w-[340px] truncate text-xs font-mono" style={{ color: "var(--ink-4)" }}>
              {doc.filename}
            </p>
          </div>
          <Link
            href={`/console/operations/${doc.operation.id}`}
            className="btn btn-secondary shrink-0"
            style={{ minHeight: 34 }}
          >
            {copy.openExpediente}
            <ArrowUpRight size={13} />
          </Link>
        </div>
      </div>

      <div className="space-y-5 p-5">
        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
              {copy.documentPreview}
            </p>
            <span className="flex items-center gap-1 text-xs" style={{ color }}>
              {statusIcon[doc.status]}
              {t(statusKeys[doc.status] ?? "statusReady", lang)}
            </span>
          </div>

          {visual.pdfUrl ? (
            <div className="h-[360px] overflow-hidden rounded-xl border" style={{ borderColor: "var(--hair-2)", background: "rgba(255,255,255,0.93)" }}>
              <iframe
                src={`${visual.pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                title={`${getDocTypeLabel(doc.type, lang)} PDF`}
                className="h-full w-full bg-white"
              />
            </div>
          ) : (
            <div>
              <DocumentThumbnail doc={doc} variant="large" />
              <p className="mt-2 text-xs" style={{ color: "var(--ink-4)" }}>{copy.noPdf}</p>
            </div>
          )}
        </section>

        <section className="grid grid-cols-2 gap-2">
          <div className="glass-panel-tight p-3">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("confidence", lang)}</p>
            <p className="mt-1 font-mono text-lg font-semibold" style={{ color }}>{Math.round(doc.confidence * 100)}%</p>
          </div>
          <div className="glass-panel-tight p-3">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{copy.validationChecks}</p>
            <p className="mt-1 font-mono text-lg font-semibold" style={{ color: passedChecks === checks.length ? "var(--ok)" : "var(--warn)" }}>
              {passedChecks}/{checks.length}
            </p>
          </div>
          <div className="glass-panel-tight p-3">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{copy.source}</p>
            <p className="mt-1 truncate text-sm font-medium" style={{ color: "var(--ink)" }}>{getSourceLabel(doc.source, lang)}</p>
          </div>
          <div className="glass-panel-tight p-3">
            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{copy.uploaded}</p>
            <p className="mt-1 truncate text-sm font-medium" style={{ color: "var(--ink)" }}>{formatDateTime(doc.uploadedAt, lang)}</p>
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
              {copy.extractedFields}
            </p>
            <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>{fields.length} {copy.fields}</span>
          </div>
          <div className="space-y-1.5">
            {fields.map((field) => {
              // P1: explanation of WHY this confidence — surfaces the AI's reasoning per field.
              const confColor = field.mismatch
                ? "var(--risk)"
                : field.confidence < 0.90 ? "var(--risk)"
                : field.confidence < 0.95 ? "var(--warn)" : "var(--ok)";
              const explanation = explainFieldConfidence(field, lang);
              return (
                <div key={field.id} className="rounded-lg border px-3 py-2" style={{ borderColor: "var(--hair)", background: field.mismatch ? "var(--risk-soft)" : "rgba(255,255,255,0.025)" }}>
                  <div className="grid grid-cols-[1fr_auto] gap-3">
                    <div className="min-w-0">
                      <p className="truncate text-xs" style={{ color: "var(--ink-4)" }}>{field.label}</p>
                      <p className="truncate text-sm font-medium" style={{ color: "var(--ink)" }}>{field.value}</p>
                    </div>
                    <span className="font-mono text-xs" style={{ color: confColor }}>
                      {Math.round(field.confidence * 100)}%
                    </span>
                  </div>
                  <p className="mt-1.5 text-[10.5px] leading-snug" style={{ color: "var(--ink-3)" }}>
                    <span className="font-medium" style={{ color: confColor }}>{t("confidenceWhy", lang)}</span>{" "}
                    {explanation}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
              {copy.validationChecks}
            </p>
            <span className="text-xs font-mono" style={{ color: "var(--ink-4)" }}>{checks.length} {copy.checks}</span>
          </div>
          <div className="space-y-1.5">
            {checks.map((check) => (
              <div key={check.id} className="flex items-start gap-2 rounded-lg border px-3 py-2" style={{ borderColor: "var(--hair)", background: "rgba(255,255,255,0.025)" }}>
                {check.passed ? (
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0" style={{ color: "var(--ok)" }} />
                ) : (
                  <XCircle size={14} className="mt-0.5 shrink-0" style={{ color: "var(--risk)" }} />
                )}
                <div className="min-w-0">
                  <p className="text-sm" style={{ color: check.passed ? "var(--ink-2)" : "var(--risk)" }}>{check.checkName}</p>
                  {check.detail && <p className="mt-0.5 text-xs" style={{ color: "var(--ink-4)" }}>{check.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* P2: Next action hint — tells the user what to DO with this doc based on its purpose. */}
        {(() => {
          const purpose = getDocPurpose(doc);
          const meta = purposeMeta[purpose];
          const actionKey = getNextActionKey(purpose);
          return (
            <section className="rounded-xl border p-4" style={{ borderColor: meta.color, background: meta.bg }}>
              <div className="flex items-start gap-3">
                <div
                  className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full"
                  style={{ background: meta.color + "22", color: meta.color }}
                >
                  <ArrowUpRight size={14} strokeWidth={1.8} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10.5px] uppercase tracking-wider" style={{ color: meta.color }}>
                    {t("nextActionLabel", lang)} · {t(meta.labelKey, lang)}
                  </p>
                  <p className="mt-1 text-sm font-medium" style={{ color: "var(--ink)" }}>
                    {t(actionKey, lang)}
                  </p>
                </div>
              </div>
            </section>
          );
        })()}

        <section className="rounded-xl border p-4" style={{ borderColor: "var(--hair-2)", background: "rgba(122,176,224,0.055)" }}>
          <div className="flex items-center gap-2">
            <Database size={15} style={{ color: "var(--brand)" }} />
            <p className="text-xs font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
              {copy.relatedOperation}
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-mono text-sm font-semibold" style={{ color: "var(--ink)" }}>
                {doc.operation.id}
              </p>
              <p className="truncate text-xs" style={{ color: "var(--ink-4)" }}>
                {doc.operation.supplier.shortName}
              </p>
            </div>
            <Link href={`/console/operations/${doc.operation.id}`} className="btn btn-primary shrink-0">
              {copy.openExpediente}
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </section>
      </div>
    </aside>
  );
}

type PeriodFilter = "all" | "7d" | "30d" | "quarter";
type ConfidenceFilter = "all" | "low" | "mid" | "high";
type SortKey = "recent" | "confAsc" | "supplier" | "status";
type ViewMode = "cards" | "table";

function docMatchesPeriod(doc: DocumentItem, period: PeriodFilter): boolean {
  if (period === "all") return true;
  const uploaded = new Date(doc.uploadedAt).getTime();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  if (period === "7d") return now - uploaded <= 7 * day;
  if (period === "30d") return now - uploaded <= 30 * day;
  if (period === "quarter") return now - uploaded <= 92 * day;
  return true;
}

function docMatchesConfidence(doc: DocumentItem, filter: ConfidenceFilter): boolean {
  if (filter === "all") return true;
  if (filter === "low")  return doc.confidence < 0.90;
  if (filter === "mid")  return doc.confidence >= 0.90 && doc.confidence < 0.95;
  if (filter === "high") return doc.confidence >= 0.95;
  return true;
}

function docMatchesSearch(doc: DocumentItem, q: string): boolean {
  if (!q) return true;
  const needle = q.toLowerCase();
  if (doc.filename.toLowerCase().includes(needle)) return true;
  if (doc.operation.id.toLowerCase().includes(needle)) return true;
  if (doc.operation.supplier.shortName.toLowerCase().includes(needle)) return true;
  if (doc.type.toLowerCase().includes(needle)) return true;
  const fields = getEvidenceFields(doc);
  return fields.some(
    (f) => f.label.toLowerCase().includes(needle) || f.value.toLowerCase().includes(needle),
  );
}

function sortDocs(list: DocumentItem[], key: SortKey): DocumentItem[] {
  const copy = [...list];
  if (key === "recent") {
    copy.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  } else if (key === "confAsc") {
    copy.sort((a, b) => a.confidence - b.confidence);
  } else if (key === "supplier") {
    copy.sort((a, b) => a.operation.supplier.shortName.localeCompare(b.operation.supplier.shortName));
  } else if (key === "status") {
    const rank: Record<string, number> = { uploaded: 0, classified: 1, extracted: 2, validated: 3, ready: 4 };
    copy.sort((a, b) => (rank[a.status] ?? 99) - (rank[b.status] ?? 99));
  }
  return copy;
}

function buildAuditManifest(docs: DocumentItem[]) {
  return {
    generatedAt: new Date().toISOString(),
    generator: "Nextport AI · Evidence vault",
    documentCount: docs.length,
    documents: docs.map((doc) => {
      const fields = getEvidenceFields(doc);
      const checks = getEvidenceChecks(doc);
      return {
        id: doc.id,
        type: doc.type,
        filename: doc.filename,
        status: doc.status,
        confidence: doc.confidence,
        uploadedAt: doc.uploadedAt,
        source: doc.source,
        operation: { id: doc.operation.id, supplier: doc.operation.supplier.shortName },
        extractedFields: fields.map((f) => ({ label: f.label, value: f.value, confidence: f.confidence, mismatch: !!f.mismatch })),
        validationChecks: checks.map((c) => ({ name: c.checkName, passed: c.passed, detail: c.detail ?? null })),
      };
    }),
  };
}

function downloadAuditManifest(docs: DocumentItem[]) {
  if (typeof window === "undefined") return;
  const manifest = buildAuditManifest(docs);
  const blob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  link.download = `nextport-audit-${stamp}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/* ════════════════════════════════════════════════════════════════════
 * DocumentsPage — Evidence Vault (post ADR-0001 P0 cleanup, 2026-05-23)
 *
 * Single job: find evidence + select + export audit manifest.
 *
 * Removed in this iteration (do not re-introduce without updating ADR-0001):
 *   • Cards view + view-toggle (table is the only view now)
 *   • Type chips row above the table (filter type lives in the drawer)
 *   • Scan Document button + scan modal (lives in the global TopBar)
 *   • Always-on EvidenceViewer side panel (now opens as modal on row click)
 *   • Recent pulls section (will move to /console/security as Evidence exports tab)
 *   • KPI strip 4 cards (collapsed into header subtitle + 2 clickable chips)
 *   • 2 fake playbooks (SOC 2 sample + Supplier dispute) — kept only the 3 honest ones
 *
 * If you need any of those back, justify the regression in a new ADR.
 * ════════════════════════════════════════════════════════════════════ */
export function DocumentsPage() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [confFilter, setConfFilter] = useState<ConfidenceFilter>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [supplierFilter, setSupplierFilter] = useState<string>("all");
  const [operationFilter, setOperationFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exportState, setExportState] = useState<"idle" | "preparing" | "done">("idle");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [activePlaybook, setActivePlaybook] = useState<PlaybookId | null>(null);
  const [lastExport, setLastExport] = useState<{ docCount: number; sha: string; reasonKey: TranslationKey | null } | null>(null);
  const [viewerDocId, setViewerDocId] = useState<string | null>(null);
  // P1: Review package modal sits between "click Export" and the actual download.
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    setDocuments(DEMO_DOCUMENTS);
    setLoading(false);
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 2000);
    fetch("/api/documents", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => { if (d.documents?.length) setDocuments(d.documents); })
      .catch(() => {});
  }, []);

  // Deep-link ?op=NP-XXX (ADR-0001 §"Behavior contract" item 5).
  useEffect(() => {
    const opParam = searchParams.get("op");
    if (!opParam || documents.length === 0) return;
    const matchingDocs = documents.filter((d) => d.operation.id === opParam);
    if (matchingDocs.length === 0) return;
    setOperationFilter(opParam);
    setSelectedIds(new Set(matchingDocs.map((d) => d.id)));
  }, [searchParams, documents]);

  const filtered = documents.filter((doc) => {
    if (filter !== "all" && doc.type !== filter) return false;
    if (statusFilter !== "all" && doc.status !== statusFilter) return false;
    if (supplierFilter !== "all" && doc.operation.supplier.shortName !== supplierFilter) return false;
    if (operationFilter !== "all" && doc.operation.id !== operationFilter) return false;
    if (!docMatchesPeriod(doc, period)) return false;
    if (!docMatchesConfidence(doc, confFilter)) return false;
    if (!docMatchesSearch(doc, search)) return false;
    return true;
  });
  const sorted = sortDocs(filtered, sortKey);
  const viewerDoc = viewerDocId ? documents.find((doc) => doc.id === viewerDocId) ?? null : null;

  const total = documents.length;
  const needsReview = documents.filter((d) => d.status !== "ready" && d.status !== "validated").length;
  const avgConf = total > 0 ? documents.reduce((sum, d) => sum + d.confidence, 0) / total : 0;
  const mismatchCount = documents.filter((d) => getEvidenceChecks(d).some((c) => !c.passed)).length;
  const allStatuses = Array.from(new Set(documents.map((d) => d.status)));
  const allSuppliers = Array.from(new Set(documents.map((d) => d.operation.supplier.shortName))).sort();
  const allOperations = Array.from(new Set(documents.map((d) => d.operation.id))).sort();
  const opContext = searchParams.get("op");
  const contextSupplier = opContext ? documents.find((d) => d.operation.id === opContext)?.operation.supplier.shortName : null;
  const hasActiveFilter =
    search !== "" || period !== "all" || confFilter !== "all" || statusFilter !== "all" ||
    supplierFilter !== "all" || operationFilter !== "all" || filter !== "all";

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }
  function toggleSelectAll() {
    const allSelected = sorted.every((d) => selectedIds.has(d.id));
    setSelectedIds(allSelected ? new Set() : new Set(sorted.map((d) => d.id)));
  }
  function clearAllFilters() {
    setSearch(""); setPeriod("all"); setConfFilter("all"); setStatusFilter("all");
    setSupplierFilter("all"); setOperationFilter("all"); setFilter("all"); setActivePlaybook(null);
  }
  function applyPlaybook(playbook: Playbook) {
    clearAllFilters();
    const p = playbook.preset;
    if (p.filter) setFilter(p.filter);
    if (p.period) setPeriod(p.period);
    if (p.confFilter) setConfFilter(p.confFilter);
    if (p.statusFilter) setStatusFilter(p.statusFilter);
    if (p.supplierFilter) setSupplierFilter(p.supplierFilter);
    if (p.operationFilter) setOperationFilter(p.operationFilter);
    if (p.search) setSearch(p.search);
    if (p.sortKey) setSortKey(p.sortKey);
    setActivePlaybook(playbook.id);
  }

  /* P1: clicking the Export button opens the Review package modal instead of
   * immediately downloading. The user reviews what is going into the manifest
   * (counts by type / operations covered / date range / avg conf / failed checks)
   * and then clicks "Export now" to actually trigger the download. */
  function handleExportZip() {
    if (selectedIds.size === 0) return;
    setReviewOpen(true);
  }

  async function confirmExport() {
    if (selectedIds.size === 0) return;
    setReviewOpen(false);
    setExportState("preparing");
    const selectedDocs = documents.filter((d) => selectedIds.has(d.id));
    const manifest = buildAuditManifest(selectedDocs);
    const sha = await computeManifestSha(manifest);
    if (typeof window !== "undefined") {
      const blob = new Blob([JSON.stringify({ ...manifest, manifestSha: sha }, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      const stamp = new Date().toISOString().replace(/[:.]/g, "-");
      link.download = `nextport-audit-${stamp}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
    const playbook = PLAYBOOKS.find((p) => p.id === activePlaybook);
    setLastExport({ docCount: selectedDocs.length, sha, reasonKey: playbook?.titleKey ?? null });

    // P2: persist the export to sessionStorage so /console/security can show it under
    // the Evidence exports tab. ADR-0001 committed to moving Recent pulls there — this
    // is the simplest cross-page handoff without a global store.
    if (typeof window !== "undefined") {
      try {
        const stored = sessionStorage.getItem("np_evidence_exports");
        const prev = stored ? (JSON.parse(stored) as Array<{ id: string; sha: string; docCount: number; reasonKey: string | null; createdAt: string; actorInitials: string }>) : [];
        const next = [
          {
            id: `exp-${Date.now()}`,
            sha,
            docCount: selectedDocs.length,
            reasonKey: playbook?.titleKey ?? null,
            createdAt: new Date().toISOString(),
            actorInitials: "DS",
          },
          ...prev,
        ].slice(0, 20);
        sessionStorage.setItem("np_evidence_exports", JSON.stringify(next));
      } catch {}
    }

    setExportState("done");
    setTimeout(() => setExportState("idle"), 2500);
  }

  const exportLabel =
    exportState === "preparing" ? t("auditExportPreparing", lang)
    : exportState === "done"    ? t("auditExportReady", lang)
    : `${t("pullExportSelected", lang)} (${selectedIds.size})`;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      <PageHeader
        title={t("auditPullTitle", lang)}
        subtitle={`${t("auditPullSubtitle", lang)} · ${total} ${t("auditKpiTotal", lang).toLowerCase()} · ${(avgConf * 100).toFixed(1)}% ${t("auditKpiAvgConf", lang).toLowerCase()}`}
      />

      {opContext && (
        <div className="flex flex-col gap-2 rounded-xl px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
             style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.35)" }}>
          <div className="flex items-center gap-2 text-sm">
            <Database size={14} strokeWidth={1.6} style={{ color: "var(--brand)" }} />
            <span style={{ color: "var(--ink-2)" }}>
              {t("pullContextLabel", lang)}{" "}
              <span className="font-mono" style={{ color: "var(--ink)" }}>{opContext}</span>
              {contextSupplier && <span style={{ color: "var(--ink-3)" }}> · {contextSupplier}</span>}
            </span>
          </div>
          <Link href="/console/documents" className="btn btn-ghost btn-sm">
            <X size={11} /> {t("pullContextClear", lang)}
          </Link>
        </div>
      )}

      {(needsReview > 0 || mismatchCount > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          {needsReview > 0 && (
            <button onClick={() => setStatusFilter(statusFilter === "classified" ? "all" : "classified")}
                    className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all"
                    style={statusFilter === "classified"
                      ? { background: "var(--warn-soft)", borderColor: "var(--warn)", color: "var(--warn)" }
                      : { background: "transparent", borderColor: "var(--hair-2)", color: "var(--ink-3)" }}>
              <Clock size={11} strokeWidth={1.6} />
              {needsReview} {t("pullChipNeedsReview", lang).toLowerCase()}
            </button>
          )}
          {mismatchCount > 0 && (
            <button onClick={() => setConfFilter(confFilter === "low" ? "all" : "low")}
                    className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all"
                    style={confFilter === "low"
                      ? { background: "var(--risk-soft)", borderColor: "var(--risk)", color: "var(--risk)" }
                      : { background: "transparent", borderColor: "var(--hair-2)", color: "var(--ink-3)" }}>
              <TrendingDown size={11} strokeWidth={1.6} />
              {mismatchCount} {t("pullChipMismatches", lang).toLowerCase()}
            </button>
          )}
        </div>
      )}

      {/* P1: Selection state transformation — hide playbook chips once the user is in
       * "review my selection" mode. They are starting points; once you have a selection,
       * they only add noise. */}
      {selectedIds.size === 0 && (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>
          {t("playbooksTitle", lang)}:
        </span>
        {PLAYBOOKS.map((pb) => {
          const Icon = pb.icon;
          const isActive = activePlaybook === pb.id;
          // P1: show how many docs the preset would surface, computed from the live dataset.
          const count = previewPlaybookCount(pb, documents);
          return (
            <button key={pb.id}
                    onClick={() => isActive ? clearAllFilters() : applyPlaybook(pb)}
                    className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition-all"
                    style={isActive
                      ? { background: `${pb.accent}24`, borderColor: pb.accent, color: pb.accent }
                      : { background: "transparent", borderColor: "var(--hair-2)", color: "var(--ink-3)" }}
                    title={`${t(pb.descKey, lang)} — ${count} ${t("playbookPreviewDocs", lang)}`}
                    aria-pressed={isActive}>
              <Icon size={11} strokeWidth={1.6} />
              {t(pb.titleKey, lang)}
              <span
                className="rounded-full px-1.5 py-0.5 font-mono text-[9px] tabular"
                style={isActive ? { background: `${pb.accent}33`, color: pb.accent } : { background: "var(--surface-2)", color: "var(--ink-3)" }}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>
      )}

      {lastExport && exportState === "done" && (
        <div className="flex flex-col gap-3 rounded-xl p-4 sm:flex-row sm:items-center sm:justify-between"
             style={{ background: "var(--ok-soft)", border: "1px solid oklch(0.78 0.13 155 / 0.4)" }}>
          <div className="flex items-start gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-full" style={{ background: "oklch(0.78 0.13 155 / 0.2)" }}>
              <Shield size={16} style={{ color: "var(--ok)" }} />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>{t("auditExportSummaryTitle", lang)}</p>
              <p className="text-xs" style={{ color: "var(--ink-3)" }}>{lastExport.docCount} {t("auditExportSummaryDocs", lang)}</p>
              <p className="mt-1 font-mono text-[10.5px]" style={{ color: "var(--ink-4)" }}>
                {t("auditExportHashLabel", lang)}: <span style={{ color: "var(--ok)" }}>{lastExport.sha}</span>
              </p>
            </div>
          </div>
          <button onClick={() => setLastExport(null)} aria-label={t("auditExportDoneClose", lang)} className="btn btn-ghost btn-sm">
            <X size={12} />
          </button>
        </div>
      )}

      <SectionCard className="space-y-3 p-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2"
               style={{ background: "var(--bg)", border: "1px solid var(--hair-2)" }}>
            <SearchIcon size={14} style={{ color: "var(--ink-4)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
                   placeholder={t("auditSearchPlaceholder", lang)}
                   className="flex-1 bg-transparent text-sm outline-none"
                   style={{ color: "var(--ink)" }} />
            {search && (
              <button onClick={() => setSearch("")} aria-label={t("auditClearFilters", lang)}>
                <X size={13} style={{ color: "var(--ink-4)" }} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap text-xs" style={{ color: "var(--ink-4)" }}>{t("auditSortLabel", lang)}</label>
            <select value={sortKey} onChange={(e) => setSortKey(e.target.value as SortKey)}
                    className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}>
              <option value="recent">{t("auditSortRecent", lang)}</option>
              <option value="confAsc">{t("auditSortConfAsc", lang)}</option>
              <option value="supplier">{t("auditSortSupplier", lang)}</option>
            </select>
          </div>
          <button onClick={() => setFiltersOpen((v) => !v)} className="btn btn-secondary" style={{ minHeight: 34 }}>
            <Filter size={12} />
            {t("auditFilters", lang)}
            {hasActiveFilter && <span className="ml-1 rounded-full bg-[var(--brand)] px-1.5 text-[9px] font-bold" style={{ color: "#0A0D12" }}>ON</span>}
            {filtersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {filtersOpen && (
          <div className="grid gap-2 border-t pt-3 md:grid-cols-2 lg:grid-cols-3" style={{ borderColor: "var(--hair)" }}>
            <select value={period} onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
                    className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}>
              <option value="all">{t("auditPeriodAll", lang)}</option>
              <option value="7d">{t("auditPeriod7d", lang)}</option>
              <option value="30d">{t("auditPeriod30d", lang)}</option>
              <option value="quarter">{t("auditPeriodQuarter", lang)}</option>
            </select>
            <select value={confFilter} onChange={(e) => setConfFilter(e.target.value as ConfidenceFilter)}
                    className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}>
              <option value="all">{t("auditConfAll", lang)}</option>
              <option value="low">{t("auditConfLow", lang)}</option>
              <option value="mid">{t("auditConfMid", lang)}</option>
              <option value="high">{t("auditConfHigh", lang)}</option>
            </select>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}>
              <option value="all">{t("auditStatusAll", lang)}</option>
              {allStatuses.map((s) => <option key={s} value={s}>{t(statusKeys[s] ?? "statusReady", lang)}</option>)}
            </select>
            <select value={supplierFilter} onChange={(e) => setSupplierFilter(e.target.value)}
                    className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}>
              <option value="all">{t("auditColSupplier", lang)}</option>
              {allSuppliers.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={operationFilter} onChange={(e) => setOperationFilter(e.target.value)}
                    className="rounded-lg px-2.5 py-1.5 font-mono text-xs outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}>
              <option value="all">{t("auditColOperation", lang)}</option>
              {allOperations.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}
                    className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}>
              <option value="all">{t("allTypes", lang)}</option>
              {["pedimento","invoice","bl","packing_list","mve","cfdi","coo","carta_porte"].map((k) => (
                <option key={k} value={k}>{t(docTypeKeys[k] ?? "documentsLabel", lang)}</option>
              ))}
            </select>
            {hasActiveFilter && (
              <button onClick={clearAllFilters} className="btn btn-ghost col-span-full justify-center" style={{ minHeight: 30 }}>
                <X size={12} /> {t("auditClearFilters", lang)}
              </button>
            )}
          </div>
        )}
      </SectionCard>

      {selectedIds.size > 0 && (
        <div className="flex flex-col gap-3 rounded-xl p-3 sm:flex-row sm:items-center sm:justify-between"
             style={{ background: "var(--brand-soft)", border: "1px solid oklch(0.78 0.09 235 / 0.35)" }}>
          <div className="flex items-center gap-3 text-sm" style={{ color: "var(--ink)" }}>
            <span className="font-mono text-base font-semibold tabular" style={{ color: "var(--brand)" }}>{selectedIds.size}</span>
            <span style={{ color: "var(--ink-2)" }}>{t("auditSelectedCount", lang)}</span>
            <button onClick={() => setSelectedIds(new Set())} className="btn btn-ghost btn-sm">
              <X size={11} /> {t("auditClearSelection", lang)}
            </button>
          </div>
          <button onClick={handleExportZip} disabled={exportState === "preparing"}
                  className="btn btn-primary justify-center disabled:opacity-60">
            <Download size={13} />
            {exportLabel}
          </button>
        </div>
      )}

      {loading ? (
        <div className="glass-panel h-96 shimmer" />
      ) : (
        <>
          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--hair)", background: "var(--surface-1)" }}>
                    <th className="px-3 py-2.5 text-left" style={{ width: 36 }}>
                      <input type="checkbox"
                             checked={sorted.length > 0 && sorted.every((d) => selectedIds.has(d.id))}
                             onChange={toggleSelectAll}
                             aria-label={t("auditSelectAll", lang)}
                             className="accent-[var(--brand)]" />
                    </th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColDoc", lang)}</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColSupplier", lang)}</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColOperation", lang)}</th>
                    <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColConfidence", lang)}</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColChecks", lang)}</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColStatus", lang)}</th>
                    <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColDate", lang)}</th>
                    <th className="px-3 py-2.5 text-right" style={{ width: 120 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((doc) => {
                    const visual = getVisualConfig(doc.type);
                    const Icon = visual.Icon;
                    const fields = getEvidenceFields(doc);
                    const checks = getEvidenceChecks(doc);
                    const passed = checks.filter((c) => c.passed).length;
                    const hasFailed = passed < checks.length;
                    const isChecked = selectedIds.has(doc.id);
                    const isExpanded = expandedRow === doc.id;
                    const color = statusColor[doc.status] ?? "var(--ink-4)";
                    const confColor = doc.confidence < 0.90 ? "var(--risk)" : doc.confidence < 0.95 ? "var(--warn)" : "var(--ok)";
                    return (
                      <FragmentRow key={doc.id}>
                        <tr style={{ borderBottom: "1px solid var(--hair)", background: isChecked ? "var(--brand-soft)" : "transparent" }}>
                          <td className="px-3 py-2.5">
                            <input type="checkbox" checked={isChecked} onChange={() => toggleSelect(doc.id)} className="accent-[var(--brand)]" />
                          </td>
                          <td className="px-3 py-2.5">
                            <button onClick={() => setViewerDocId(doc.id)} className="flex items-start gap-2 text-left">
                              <div className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg"
                                   style={{ background: visual.previewBg, border: "1px solid var(--hair)" }}>
                                <Icon size={13} style={{ color: visual.accent }} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <span className="truncate text-sm font-medium" style={{ color: "var(--ink)" }}>{getDocTypeLabel(doc.type, lang)}</span>
                                  {/* P1: purpose label — what role does this doc play in the audit narrative */}
                                  {(() => {
                                    const purpose = getDocPurpose(doc);
                                    const meta = purposeMeta[purpose];
                                    return (
                                      <span
                                        className="whitespace-nowrap rounded-full px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider"
                                        style={{ background: meta.bg, color: meta.color }}
                                      >
                                        {t(meta.labelKey, lang)}
                                      </span>
                                    );
                                  })()}
                                </div>
                                <div className="truncate font-mono text-[10.5px]" style={{ color: "var(--ink-4)" }}>{doc.filename}</div>
                              </div>
                            </button>
                          </td>
                          <td className="px-3 py-2.5 text-sm truncate" style={{ color: "var(--ink-2)" }}>{doc.operation.supplier.shortName}</td>
                          <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: "var(--ink-3)" }}>{doc.operation.id}</td>
                          <td className="px-3 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="h-1 w-14 rounded-full" style={{ background: "var(--hair)" }}>
                                <div className="h-full rounded-full transition-all" style={{ width: `${doc.confidence * 100}%`, background: confColor }} />
                              </div>
                              <span className="font-mono text-xs tabular" style={{ color: confColor }}>{Math.round(doc.confidence * 100)}%</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1.5">
                              {hasFailed ? <XCircle size={12} style={{ color: "var(--risk)" }} /> : <CheckCircle2 size={12} style={{ color: "var(--ok)" }} />}
                              <span className="font-mono text-[11px]" style={{ color: hasFailed ? "var(--risk)" : "var(--ok)" }}>{passed}/{checks.length}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5">
                            <div className="flex items-center gap-1 text-xs" style={{ color }}>
                              {statusIcon[doc.status]}<span>{t(statusKeys[doc.status] ?? "statusReady", lang)}</span>
                            </div>
                          </td>
                          <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: "var(--ink-4)" }}>{formatDate(doc.uploadedAt, lang)}</td>
                          <td className="px-3 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-0.5">
                              {visual.pdfUrl && (
                                <a href={visual.pdfUrl} download onClick={(e) => e.stopPropagation()} className="btn btn-ghost btn-sm" title="Download PDF">
                                  <Download size={11} />
                                </a>
                              )}
                              <Link href={`/console/operations/${doc.operation.id}`} onClick={(e) => e.stopPropagation()} className="btn btn-ghost btn-sm" title={viewerCopy[lang].openExpediente}>
                                <ArrowUpRight size={11} />
                              </Link>
                              <button onClick={() => setExpandedRow(isExpanded ? null : doc.id)} className="btn btn-ghost btn-sm">
                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                              </button>
                            </div>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--hair)" }}>
                            <td colSpan={9} className="px-3 py-3">
                              <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                                {fields.map((field) => {
                                  const fc = field.confidence < 0.90 ? "var(--risk)" : field.confidence < 0.95 ? "var(--warn)" : "var(--ok)";
                                  return (
                                    <div key={field.id} className="rounded-lg border p-2"
                                         style={{ borderColor: field.mismatch ? "oklch(0.66 0.20 25 / 0.5)" : "var(--hair)", background: field.mismatch ? "var(--risk-soft)" : "var(--surface-1)" }}>
                                      <div className="flex items-center justify-between">
                                        <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{field.label}</p>
                                        <span className="font-mono text-[10px]" style={{ color: fc }}>{Math.round(field.confidence * 100)}%</span>
                                      </div>
                                      <p className="mt-1 truncate text-xs font-medium" style={{ color: field.mismatch ? "var(--risk)" : "var(--ink)" }}>{field.value}</p>
                                    </div>
                                  );
                                })}
                              </div>
                            </td>
                          </tr>
                        )}
                      </FragmentRow>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 px-1 text-[11px]" style={{ color: "var(--ink-4)" }}>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--warn)" }} /> {t("pullLegendLowConf", lang)}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--risk)" }} /> {t("pullLegendFailedCheck", lang)}
            </span>
          </div>

          {sorted.length === 0 && (
            // P2: guided empty state. Two variants depending on whether filters caused the empty result.
            <div className="glass-panel flex flex-col items-center gap-4 p-10 text-center">
              {hasActiveFilter ? (
                <>
                  <div
                    className="grid h-12 w-12 place-items-center rounded-full"
                    style={{ background: "var(--warn-soft)", color: "var(--warn)" }}
                  >
                    <SearchIcon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-base font-semibold" style={{ color: "var(--ink)" }}>{t("emptyStateNoMatchTitle", lang)}</p>
                    <p className="mt-1 text-sm" style={{ color: "var(--ink-4)" }}>{t("emptyStateNoMatchSub", lang)}</p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    <button onClick={clearAllFilters} className="btn btn-secondary">
                      <X size={11} /> {t("auditClearFilters", lang)}
                    </button>
                    {PLAYBOOKS.map((pb) => {
                      const Icon = pb.icon;
                      return (
                        <button key={pb.id} onClick={() => applyPlaybook(pb)}
                                className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium"
                                style={{ background: "transparent", borderColor: "var(--hair-2)", color: pb.accent }}>
                          <Icon size={11} strokeWidth={1.6} />
                          {t(pb.titleKey, lang)}
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="grid h-12 w-12 place-items-center rounded-full"
                    style={{ background: "var(--brand-soft)", color: "var(--brand)" }}
                  >
                    <FileText size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-base font-semibold" style={{ color: "var(--ink)" }}>{t("emptyStateNoDocsTitle", lang)}</p>
                    <p className="mt-1 text-sm" style={{ color: "var(--ink-4)" }}>{t("emptyStateNoDocsSub", lang)}</p>
                  </div>
                  <Link href="/console/pipeline" className="btn btn-primary">
                    <ArrowUpRight size={11} /> {t("emptyStateGoPipeline", lang)}
                  </Link>
                </>
              )}
            </div>
          )}
        </>
      )}

      {viewerDoc && (
        <div className="fixed inset-0 z-50 flex items-start justify-end p-4 sm:p-6"
             style={{ background: "rgba(4,6,10,0.65)", backdropFilter: "blur(8px)" }}
             onClick={() => setViewerDocId(null)}>
          <div className="w-full max-w-xl" style={{ maxHeight: "calc(100vh - 32px)", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
            <EvidenceViewer doc={viewerDoc} lang={lang} />
            <button onClick={() => setViewerDocId(null)}
                    className="fixed right-6 top-6 grid h-9 w-9 place-items-center rounded-full"
                    aria-label={t("pullViewerClose", lang)}
                    style={{ background: "var(--bg-2)", border: "1px solid var(--hair-2)", color: "var(--ink-2)" }}>
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* P1: Review package modal — pre-export confirmation. Shows what is going into the
       * manifest (counts by type, operations covered, date range, avg confidence, failed checks)
       * so the user gets a clear "I'm sure" moment before triggering the download. */}
      {reviewOpen && (() => {
        const selectedDocs = documents.filter((d) => selectedIds.has(d.id));
        if (selectedDocs.length === 0) return null;
        const byType: Record<string, number> = {};
        selectedDocs.forEach((d) => { byType[d.type] = (byType[d.type] ?? 0) + 1; });
        const opsCovered = new Set(selectedDocs.map((d) => d.operation.id)).size;
        const dates = selectedDocs.map((d) => new Date(d.uploadedAt).getTime());
        const minDate = new Date(Math.min(...dates));
        const maxDate = new Date(Math.max(...dates));
        const avgConfSel = selectedDocs.reduce((s, d) => s + d.confidence, 0) / selectedDocs.length;
        const failedCheckCount = selectedDocs.filter((d) => getEvidenceChecks(d).some((c) => !c.passed)).length;
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(4,6,10,0.65)", backdropFilter: "blur(8px)" }}
            onClick={() => setReviewOpen(false)}
          >
            <div
              className="glass-panel elev-3 w-full max-w-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="border-b p-5" style={{ borderColor: "var(--hair)" }}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>{t("reviewPackageTitle", lang)}</h3>
                    <p className="mt-1 text-xs" style={{ color: "var(--ink-4)" }}>{t("reviewPackageSubtitle", lang)}</p>
                  </div>
                  <button onClick={() => setReviewOpen(false)} className="btn btn-ghost btn-sm" aria-label={t("auditExportDoneClose", lang)}>
                    <X size={13} />
                  </button>
                </div>
              </div>
              <div className="grid gap-3 p-5 sm:grid-cols-2">
                <div className="rounded-lg border p-3" style={{ borderColor: "var(--hair)", background: "var(--surface-1)" }}>
                  <p className="text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("reviewPackageDocs", lang)}</p>
                  <p className="mt-1 text-2xl font-semibold tabular" style={{ color: "var(--ink)" }}>{selectedDocs.length}</p>
                </div>
                <div className="rounded-lg border p-3" style={{ borderColor: "var(--hair)", background: "var(--surface-1)" }}>
                  <p className="text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("reviewPackageOps", lang)}</p>
                  <p className="mt-1 text-2xl font-semibold tabular" style={{ color: "var(--ink)" }}>{opsCovered}</p>
                </div>
                <div className="rounded-lg border p-3" style={{ borderColor: "var(--hair)", background: "var(--surface-1)" }}>
                  <p className="text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("reviewPackageAvgConf", lang)}</p>
                  <p className="mt-1 text-2xl font-semibold tabular" style={{ color: avgConfSel >= 0.95 ? "var(--ok)" : avgConfSel >= 0.90 ? "var(--warn)" : "var(--risk)" }}>
                    {(avgConfSel * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="rounded-lg border p-3" style={{ borderColor: "var(--hair)", background: "var(--surface-1)" }}>
                  <p className="text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("reviewPackageFailedChecks", lang)}</p>
                  <p className="mt-1 text-2xl font-semibold tabular" style={{ color: failedCheckCount > 0 ? "var(--risk)" : "var(--ok)" }}>
                    {failedCheckCount}
                  </p>
                </div>
              </div>
              <div className="grid gap-3 px-5 pb-5 sm:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("reviewPackageTypes", lang)}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {Object.entries(byType).map(([type, count]) => (
                      <span key={type}
                            className="rounded-full px-2 py-0.5 font-mono text-[10px]"
                            style={{ background: "var(--surface-2)", color: "var(--ink-2)" }}>
                        {getDocTypeLabel(type, lang)} · {count}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-1.5 text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("reviewPackageDateRange", lang)}</p>
                  <p className="font-mono text-xs" style={{ color: "var(--ink-2)" }}>
                    {formatDate(minDate.toISOString(), lang)} → {formatDate(maxDate.toISOString(), lang)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 border-t p-5" style={{ borderColor: "var(--hair)" }}>
                <button onClick={() => setReviewOpen(false)} className="btn btn-secondary flex-1 justify-center">
                  {t("reviewPackageBack", lang)}
                </button>
                <button onClick={confirmExport} className="btn btn-primary flex-1 justify-center">
                  <Download size={13} /> {t("reviewPackageConfirm", lang)}
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

