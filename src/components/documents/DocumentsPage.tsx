"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  LayoutGrid,
  List,
  Landmark,
  Package,
  Scan,
  ScanLine,
  Search as SearchIcon,
  ShieldCheck,
  Ship,
  TrendingDown,
  X,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { formatDate, formatDateTime, cn } from "@/lib/utils";
import { useLang } from "@/lib/lang-context";
import { t, type Lang, type TranslationKey } from "@/lib/i18n";

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
  const Icon = visual.Icon;
  const isLarge = variant === "large";

  return (
    <div
      className={cn(
        "relative flex overflow-hidden rounded-xl border",
        isLarge ? "min-h-[310px] p-5" : "h-36 p-3"
      )}
      style={{ background: visual.previewBg, borderColor: "var(--hair)" }}
    >
      <div className="absolute inset-x-0 top-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${visual.accent}, transparent)` }} />
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: visual.accent, opacity: 0.18 }} />
      <div className="relative z-10 flex w-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2">
            <div
              className={cn("grid place-items-center rounded-lg border", isLarge ? "h-10 w-10" : "h-8 w-8")}
              style={{ borderColor: "var(--hair-2)", background: "rgba(0,0,0,0.22)" }}
            >
              <Icon size={isLarge ? 18 : 14} style={{ color: visual.accent }} />
            </div>
            <div>
              <p className="font-mono text-[10px] font-semibold tracking-[0.18em]" style={{ color: visual.accent }}>
                {visual.short}
              </p>
              <p className={cn("font-semibold", isLarge ? "text-base" : "text-xs")} style={{ color: "var(--ink)" }}>
                {visual.stamp}
              </p>
            </div>
          </div>
          <div
            className="rounded-full px-2 py-1 text-[9px] font-mono uppercase tracking-wider"
            style={{ background: "rgba(255,255,255,0.08)", color: "var(--ink-3)" }}
          >
            {Math.round(doc.confidence * 100)}%
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

        <DocumentSpecificPreview doc={doc} compact={!isLarge} />
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
            {fields.map((field) => (
              <div key={field.id} className="grid grid-cols-[1fr_auto] gap-3 rounded-lg border px-3 py-2" style={{ borderColor: "var(--hair)", background: field.mismatch ? "var(--risk-soft)" : "rgba(255,255,255,0.025)" }}>
                <div className="min-w-0">
                  <p className="truncate text-xs" style={{ color: "var(--ink-4)" }}>{field.label}</p>
                  <p className="truncate text-sm font-medium" style={{ color: "var(--ink)" }}>{field.value}</p>
                </div>
                <span className="font-mono text-xs" style={{ color: field.mismatch ? "var(--risk)" : "var(--ok)" }}>
                  {Math.round(field.confidence * 100)}%
                </span>
              </div>
            ))}
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

export function DocumentsPage() {
  const { lang } = useLang();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [filter, setFilter] = useState("all");
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [scanOpen, setScanOpen] = useState(false);
  const [scanFilename, setScanFilename] = useState("");
  const [scanOpId, setScanOpId] = useState("NP-2026-001847");
  const [scanning, setScanning] = useState(false);

  // Audit-pull state
  const [search, setSearch] = useState("");
  const [period, setPeriod] = useState<PeriodFilter>("all");
  const [confFilter, setConfFilter] = useState<ConfidenceFilter>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [view, setView] = useState<ViewMode>("cards");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [exportState, setExportState] = useState<"idle" | "preparing" | "done">("idle");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    setDocuments(DEMO_DOCUMENTS);
    setSelectedDocId(DEMO_DOCUMENTS[0]?.id ?? null);
    setLoading(false);
    const ctrl = new AbortController();
    setTimeout(() => ctrl.abort(), 2000);
    fetch("/api/documents", { signal: ctrl.signal })
      .then((r) => r.json())
      .then((d) => {
        if (d.documents?.length) {
          setDocuments(d.documents);
          setSelectedDocId(d.documents[0]?.id ?? null);
        }
      })
      .catch(() => {});
  }, []);

  // Master filter pipeline
  const filtered = documents.filter((doc) => {
    if (filter !== "all" && doc.type !== filter) return false;
    if (statusFilter !== "all" && doc.status !== statusFilter) return false;
    if (sourceFilter !== "all" && doc.source !== sourceFilter) return false;
    if (!docMatchesPeriod(doc, period)) return false;
    if (!docMatchesConfidence(doc, confFilter)) return false;
    if (!docMatchesSearch(doc, search)) return false;
    return true;
  });
  const sorted = sortDocs(filtered, sortKey);

  const selectedDoc =
    (selectedDocId ? documents.find((doc) => doc.id === selectedDocId) : null) ?? sorted[0] ?? null;
  const visibleSelectedId = sorted.some((doc) => doc.id === selectedDoc?.id) ? selectedDoc?.id : sorted[0]?.id;
  const viewerDoc = sorted.find((doc) => doc.id === visibleSelectedId) ?? selectedDoc;

  // KPIs
  const total = documents.length;
  const needsReview = documents.filter((d) => d.status !== "ready" && d.status !== "validated").length;
  const avgConf = total > 0
    ? documents.reduce((sum, d) => sum + d.confidence, 0) / total
    : 0;
  const mismatchCount = documents.filter((d) =>
    getEvidenceChecks(d).some((c) => !c.passed),
  ).length;

  const allStatuses = Array.from(new Set(documents.map((d) => d.status)));
  const allSources = Array.from(new Set(documents.map((d) => d.source)));
  const hasActiveFilter =
    search !== "" || period !== "all" || confFilter !== "all" || statusFilter !== "all" || sourceFilter !== "all";

  function toggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSelectAll() {
    const allVisibleIds = new Set(sorted.map((d) => d.id));
    const allSelected = sorted.every((d) => selectedIds.has(d.id));
    setSelectedIds(allSelected ? new Set() : allVisibleIds);
  }

  function clearAllFilters() {
    setSearch("");
    setPeriod("all");
    setConfFilter("all");
    setStatusFilter("all");
    setSourceFilter("all");
    setFilter("all");
  }

  async function handleExportZip() {
    if (selectedIds.size === 0) return;
    setExportState("preparing");
    const selectedDocs = documents.filter((d) => selectedIds.has(d.id));
    // Simulate package prep with a short delay so the user sees the state transition
    await new Promise((r) => setTimeout(r, 700));
    downloadAuditManifest(selectedDocs);
    setExportState("done");
    setTimeout(() => setExportState("idle"), 2000);
  }

  async function handleScan() {
    if (!scanFilename.trim()) return;
    setScanning(true);
    try {
      const res = await fetch("/api/documents/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ operationId: scanOpId, filename: scanFilename }),
      });
      const data = await res.json();
      if (data.document) {
        const newDoc = { ...data.document, operation: { id: scanOpId, supplier: { shortName: "Manual" } } };
        setDocuments((prev) => [newDoc, ...prev]);
        setSelectedDocId(newDoc.id);
      }
      setScanOpen(false);
      setScanFilename("");
    } catch (e) {
      console.error(e);
    } finally {
      setScanning(false);
    }
  }

  const allVisibleSelected = sorted.length > 0 && sorted.every((d) => selectedIds.has(d.id));
  const exportLabel =
    exportState === "preparing" ? t("auditExportPreparing", lang)
    : exportState === "done"    ? t("auditExportReady", lang)
    : `${t("auditExportZip", lang)} (${selectedIds.size})`;

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--ink)" }}>
            {t("auditPullTitle", lang)}
          </h2>
          <p className="text-sm" style={{ color: "var(--ink-4)" }}>
            {t("auditPullSubtitle", lang)}
          </p>
        </div>
        <button onClick={() => setScanOpen(true)} className="btn btn-primary w-full justify-center sm:w-auto">
          <ScanLine size={14} />
          {t("scanDocumentBtn", lang)}
        </button>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="glass-panel-tight p-3">
          <p className="text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditKpiTotal", lang)}</p>
          <p className="mt-1 text-2xl font-semibold tabular" style={{ color: "var(--ink)" }}>{total}</p>
        </div>
        <div className="glass-panel-tight p-3">
          <p className="text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditKpiNeedsReview", lang)}</p>
          <p className="mt-1 text-2xl font-semibold tabular" style={{ color: needsReview > 0 ? "var(--warn)" : "var(--ok)" }}>{needsReview}</p>
        </div>
        <div className="glass-panel-tight p-3">
          <p className="text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditKpiAvgConf", lang)}</p>
          <p className="mt-1 text-2xl font-semibold tabular" style={{ color: avgConf >= 0.95 ? "var(--ok)" : avgConf >= 0.90 ? "var(--warn)" : "var(--risk)" }}>
            {(avgConf * 100).toFixed(1)}%
          </p>
        </div>
        <div className="glass-panel-tight p-3">
          <p className="text-[10.5px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditKpiMismatch", lang)}</p>
          <p className="mt-1 flex items-center gap-1.5 text-2xl font-semibold tabular" style={{ color: mismatchCount > 0 ? "var(--risk)" : "var(--ok)" }}>
            {mismatchCount > 0 && <TrendingDown size={16} />}
            {mismatchCount}
          </p>
        </div>
      </div>

      {/* Toolbar: search + view toggle + filters trigger */}
      <div className="glass-panel-tight p-3 space-y-3">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          {/* Search */}
          <div className="flex flex-1 items-center gap-2 rounded-lg px-3 py-2"
               style={{ background: "var(--bg)", border: "1px solid var(--hair-2)" }}>
            <SearchIcon size={14} style={{ color: "var(--ink-4)" }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("auditSearchPlaceholder", lang)}
              className="flex-1 bg-transparent text-sm outline-none"
              style={{ color: "var(--ink)" }}
            />
            {search && (
              <button onClick={() => setSearch("")} aria-label={t("auditClearFilters", lang)}>
                <X size={13} style={{ color: "var(--ink-4)" }} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-xs whitespace-nowrap" style={{ color: "var(--ink-4)" }}>{t("auditSortLabel", lang)}</label>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            >
              <option value="recent">{t("auditSortRecent", lang)}</option>
              <option value="confAsc">{t("auditSortConfAsc", lang)}</option>
              <option value="supplier">{t("auditSortSupplier", lang)}</option>
              <option value="status">{t("auditSortStatus", lang)}</option>
            </select>
          </div>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg p-0.5" style={{ background: "var(--surface-1)", border: "1px solid var(--hair-2)" }}>
            <button
              onClick={() => setView("cards")}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all"
              style={view === "cards"
                ? { background: "var(--surface-3)", color: "var(--ink)" }
                : { color: "var(--ink-4)" }}
            >
              <LayoutGrid size={12} /> {t("auditViewCards", lang)}
            </button>
            <button
              onClick={() => setView("table")}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs transition-all"
              style={view === "table"
                ? { background: "var(--surface-3)", color: "var(--ink)" }
                : { color: "var(--ink-4)" }}
            >
              <List size={12} /> {t("auditViewTable", lang)}
            </button>
          </div>

          {/* Filters toggle */}
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="btn btn-secondary"
            style={{ minHeight: 34 }}
          >
            <Filter size={12} />
            {t("auditFilters", lang)}
            {hasActiveFilter && (
              <span className="ml-1 rounded-full bg-[var(--brand)] px-1.5 text-[9px] font-bold" style={{ color: "#0A0D12" }}>
                ON
              </span>
            )}
            {filtersOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          </button>
        </div>

        {filtersOpen && (
          <div className="grid gap-2 border-t pt-3 md:grid-cols-2 lg:grid-cols-4" style={{ borderColor: "var(--hair)" }}>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as PeriodFilter)}
              className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            >
              <option value="all">{t("auditPeriodAll", lang)}</option>
              <option value="7d">{t("auditPeriod7d", lang)}</option>
              <option value="30d">{t("auditPeriod30d", lang)}</option>
              <option value="quarter">{t("auditPeriodQuarter", lang)}</option>
            </select>
            <select
              value={confFilter}
              onChange={(e) => setConfFilter(e.target.value as ConfidenceFilter)}
              className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            >
              <option value="all">{t("auditConfAll", lang)}</option>
              <option value="low">{t("auditConfLow", lang)}</option>
              <option value="mid">{t("auditConfMid", lang)}</option>
              <option value="high">{t("auditConfHigh", lang)}</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            >
              <option value="all">{t("auditStatusAll", lang)}</option>
              {allStatuses.map((s) => (
                <option key={s} value={s}>{t(statusKeys[s] ?? "statusReady", lang)}</option>
              ))}
            </select>
            <select
              value={sourceFilter}
              onChange={(e) => setSourceFilter(e.target.value)}
              className="rounded-lg px-2.5 py-1.5 text-xs outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
            >
              <option value="all">{t("auditSourceAll", lang)}</option>
              {allSources.map((s) => (
                <option key={s} value={s}>{getSourceLabel(s, lang)}</option>
              ))}
            </select>
            {hasActiveFilter && (
              <button onClick={clearAllFilters} className="btn btn-ghost col-span-full justify-center" style={{ minHeight: 30 }}>
                <X size={12} /> {t("auditClearFilters", lang)}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Type filter chips (existing) */}
      <div className="flex flex-wrap gap-1.5">
        {["all", "pedimento", "invoice", "bl", "packing_list", "mve", "cfdi", "coo", "carta_porte"].map((typeKey) => (
          <button
            key={typeKey}
            onClick={() => setFilter(typeKey)}
            className={cn(
              "rounded-full px-3 py-1 text-xs font-medium transition-all",
              filter === typeKey ? "lifted-active" : ""
            )}
            style={
              filter === typeKey
                ? { background: "var(--brand-soft)", color: "var(--brand)", border: "1px solid oklch(0.78 0.09 235 / 0.3)" }
                : { background: "var(--hair)", color: "var(--ink-4)", border: "1px solid transparent" }
            }
          >
            {typeKey === "all" ? t("allTypes", lang) : t(docTypeKeys[typeKey] ?? "documentsLabel", lang)}
          </button>
        ))}
      </div>

      {/* Bulk action bar — appears when there's a selection */}
      {selectedIds.size > 0 && (
        <div className="glass-panel flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between"
             style={{ background: "var(--brand-soft)", borderColor: "oklch(0.78 0.09 235 / 0.35)" }}>
          <div className="flex items-center gap-3 text-sm" style={{ color: "var(--ink)" }}>
            <span className="font-mono tabular text-base font-semibold" style={{ color: "var(--brand)" }}>
              {selectedIds.size}
            </span>
            <span style={{ color: "var(--ink-2)" }}>{t("auditSelectedCount", lang)}</span>
            <button onClick={() => setSelectedIds(new Set())} className="btn btn-ghost btn-sm">
              <X size={11} /> {t("auditClearSelection", lang)}
            </button>
          </div>
          <button
            onClick={handleExportZip}
            disabled={exportState === "preparing"}
            className="btn btn-primary justify-center disabled:opacity-60"
          >
            <Download size={13} />
            {exportLabel}
          </button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.05fr)_minmax(380px,0.95fr)]">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="glass-panel h-72 shimmer" />
            ))}
          </div>
          <div className="glass-panel h-[720px] shimmer" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(420px,0.95fr)]">
          <div className="space-y-3">
            {view === "cards" ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
                {sorted.map((doc) => {
                  const color = statusColor[doc.status] ?? "var(--ink-4)";
                  const isSelected = viewerDoc?.id === doc.id;
                  const isChecked = selectedIds.has(doc.id);
                  const fields = getEvidenceFields(doc);
                  const checks = getEvidenceChecks(doc);
                  const hasFailedCheck = checks.some((c) => !c.passed);

                  return (
                    <div
                      key={doc.id}
                      className={cn(
                        "glass-panel group relative overflow-hidden p-0 text-left transition-all hover:-translate-y-0.5",
                        isSelected ? "lifted-active" : ""
                      )}
                    >
                      {/* Selection checkbox — top-left overlay */}
                      <label
                        className="absolute left-3 top-3 z-20 flex h-5 w-5 cursor-pointer items-center justify-center rounded-md transition-all"
                        style={{
                          background: isChecked ? "var(--brand)" : "rgba(10,13,18,0.55)",
                          border: `1px solid ${isChecked ? "var(--brand)" : "var(--hair-2)"}`,
                          backdropFilter: "blur(6px)",
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleSelect(doc.id)}
                          className="sr-only"
                        />
                        {isChecked && <CheckCircle2 size={12} style={{ color: "#0A0D12" }} />}
                      </label>

                      {/* Failed-check indicator — top-right corner pulse */}
                      {hasFailedCheck && (
                        <span
                          className="absolute right-3 top-3 z-20 h-2 w-2 rounded-full"
                          style={{ background: "var(--risk)", boxShadow: "0 0 8px var(--risk)" }}
                          title={`${checks.filter((c) => !c.passed).length} failed`}
                        />
                      )}

                      <button
                        onClick={() => setSelectedDocId(doc.id)}
                        className="block w-full text-left"
                        aria-label={`${viewerCopy[lang].selectedDocument}: ${doc.filename}`}
                      >
                        <DocumentThumbnail doc={doc} />

                        <div className="space-y-3 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-semibold" style={{ color: "var(--ink)" }}>
                                  {getDocTypeLabel(doc.type, lang)}
                                </p>
                                {isSelected && (
                                  <span className="chip chip-brand py-0.5 text-[10px]">
                                    <span className="dot" />
                                    {viewerCopy[lang].selected}
                                  </span>
                                )}
                              </div>
                              <p className="mt-1 truncate text-xs font-mono" style={{ color: "var(--ink-4)" }}>
                                {doc.filename}
                              </p>
                            </div>
                            <div className="flex shrink-0 items-center gap-1 text-xs" style={{ color }}>
                              {statusIcon[doc.status]}
                              <span>{t(statusKeys[doc.status] ?? "statusReady", lang)}</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div className="rounded-lg border px-2 py-1.5" style={{ borderColor: "var(--hair)", background: "rgba(255,255,255,0.025)" }}>
                              <p className="text-[10px]" style={{ color: "var(--ink-4)" }}>{t("confidence", lang)}</p>
                              <p className="font-mono text-xs font-semibold" style={{ color }}>{Math.round(doc.confidence * 100)}%</p>
                            </div>
                            <div className="rounded-lg border px-2 py-1.5" style={{ borderColor: "var(--hair)", background: "rgba(255,255,255,0.025)" }}>
                              <p className="text-[10px]" style={{ color: "var(--ink-4)" }}>{viewerCopy[lang].fields}</p>
                              <p className="font-mono text-xs font-semibold" style={{ color: "var(--ink)" }}>{fields.length}</p>
                            </div>
                            <div className="rounded-lg border px-2 py-1.5" style={{ borderColor: "var(--hair)", background: "rgba(255,255,255,0.025)" }}>
                              <p className="text-[10px]" style={{ color: "var(--ink-4)" }}>{viewerCopy[lang].checks}</p>
                              <p className="font-mono text-xs font-semibold" style={{ color: hasFailedCheck ? "var(--risk)" : "var(--ok)" }}>
                                {checks.filter((c) => c.passed).length}/{checks.length}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between gap-3 text-xs" style={{ color: "var(--ink-4)" }}>
                            <span className="min-w-0 truncate">{doc.operation.supplier.shortName} · {doc.operation.id}</span>
                            <span className="shrink-0 font-mono">{formatDate(doc.uploadedAt, lang)}</span>
                          </div>
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* TABLE VIEW */
              <div className="glass-panel overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr style={{ borderBottom: "1px solid var(--hair)", background: "var(--surface-1)" }}>
                        <th className="px-3 py-2.5 text-left" style={{ width: 36 }}>
                          <input
                            type="checkbox"
                            checked={allVisibleSelected}
                            onChange={toggleSelectAll}
                            aria-label={t("auditSelectAll", lang)}
                            className="accent-[var(--brand)]"
                          />
                        </th>
                        <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColDoc", lang)}</th>
                        <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColType", lang)}</th>
                        <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColSupplier", lang)}</th>
                        <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColOperation", lang)}</th>
                        <th className="px-3 py-2.5 text-right text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColConfidence", lang)}</th>
                        <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColChecks", lang)}</th>
                        <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColStatus", lang)}</th>
                        <th className="px-3 py-2.5 text-left text-[11px] font-medium uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{t("auditColDate", lang)}</th>
                        <th className="px-3 py-2.5 text-right" style={{ width: 80 }}></th>
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
                            <tr
                              className="transition-colors"
                              style={{
                                borderBottom: "1px solid var(--hair)",
                                background: isChecked ? "var(--brand-soft)" : viewerDoc?.id === doc.id ? "var(--surface-1)" : "transparent",
                              }}
                            >
                              <td className="px-3 py-2.5">
                                <input
                                  type="checkbox"
                                  checked={isChecked}
                                  onChange={() => toggleSelect(doc.id)}
                                  className="accent-[var(--brand)]"
                                />
                              </td>
                              <td className="px-3 py-2.5">
                                <button onClick={() => setSelectedDocId(doc.id)} className="flex items-start gap-2 text-left">
                                  <div
                                    className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-lg"
                                    style={{ background: visual.previewBg, border: "1px solid var(--hair)" }}
                                  >
                                    <Icon size={13} style={{ color: visual.accent }} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="truncate text-sm font-medium" style={{ color: "var(--ink)" }}>
                                      {getDocTypeLabel(doc.type, lang)}
                                    </div>
                                    <div className="truncate font-mono text-[10.5px]" style={{ color: "var(--ink-4)" }}>
                                      {doc.filename}
                                    </div>
                                  </div>
                                </button>
                              </td>
                              <td className="px-3 py-2.5">
                                <span className="font-mono text-[11px]" style={{ color: visual.accent }}>{visual.short}</span>
                              </td>
                              <td className="px-3 py-2.5 text-sm truncate" style={{ color: "var(--ink-2)" }}>
                                {doc.operation.supplier.shortName}
                              </td>
                              <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: "var(--ink-3)" }}>
                                {doc.operation.id}
                              </td>
                              <td className="px-3 py-2.5 text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <div className="h-1 w-14 rounded-full" style={{ background: "var(--hair)" }}>
                                    <div
                                      className="h-full rounded-full transition-all"
                                      style={{ width: `${doc.confidence * 100}%`, background: confColor }}
                                    />
                                  </div>
                                  <span className="font-mono text-xs tabular" style={{ color: confColor }}>
                                    {Math.round(doc.confidence * 100)}%
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-1.5">
                                  {hasFailed
                                    ? <XCircle size={12} style={{ color: "var(--risk)" }} />
                                    : <CheckCircle2 size={12} style={{ color: "var(--ok)" }} />}
                                  <span className="font-mono text-[11px]" style={{ color: hasFailed ? "var(--risk)" : "var(--ok)" }}>
                                    {passed}/{checks.length}
                                  </span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5">
                                <div className="flex items-center gap-1 text-xs" style={{ color }}>
                                  {statusIcon[doc.status]}
                                  <span>{t(statusKeys[doc.status] ?? "statusReady", lang)}</span>
                                </div>
                              </td>
                              <td className="px-3 py-2.5 font-mono text-[11px]" style={{ color: "var(--ink-4)" }}>
                                {formatDate(doc.uploadedAt, lang)}
                              </td>
                              <td className="px-3 py-2.5 text-right">
                                <button
                                  onClick={() => setExpandedRow(isExpanded ? null : doc.id)}
                                  className="btn btn-ghost btn-sm"
                                  aria-label={isExpanded ? t("auditRowCollapse", lang) : t("auditRowExpand", lang)}
                                  title={isExpanded ? t("auditRowCollapse", lang) : t("auditRowExpand", lang)}
                                >
                                  {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                </button>
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr style={{ background: "var(--surface-1)", borderBottom: "1px solid var(--hair)" }}>
                                <td colSpan={10} className="px-3 py-3">
                                  <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                                    {fields.map((field) => {
                                      const fConfColor = field.confidence < 0.90 ? "var(--risk)" : field.confidence < 0.95 ? "var(--warn)" : "var(--ok)";
                                      return (
                                        <div
                                          key={field.id}
                                          className="rounded-lg border p-2"
                                          style={{
                                            borderColor: field.mismatch ? "oklch(0.66 0.20 25 / 0.5)" : "var(--hair)",
                                            background: field.mismatch ? "var(--risk-soft)" : "var(--surface-1)",
                                          }}
                                        >
                                          <div className="flex items-center justify-between">
                                            <p className="text-[10px] uppercase tracking-wider" style={{ color: "var(--ink-4)" }}>{field.label}</p>
                                            <span className="font-mono text-[10px]" style={{ color: fConfColor }}>{Math.round(field.confidence * 100)}%</span>
                                          </div>
                                          <p className="mt-1 truncate text-xs font-medium" style={{ color: field.mismatch ? "var(--risk)" : "var(--ink)" }}>
                                            {field.value}
                                          </p>
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
            )}

            {sorted.length === 0 && (
              <div className="glass-panel p-12 text-center" style={{ color: "var(--ink-4)" }}>
                {hasActiveFilter ? t("auditNoResults", lang) : t("noDocumentsFound", lang)}
              </div>
            )}
          </div>

          <div className="xl:sticky xl:top-20 xl:self-start">
            <EvidenceViewer doc={viewerDoc} lang={lang} />
          </div>
        </div>
      )}

      {scanOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.6)" }}>
          <div className="glass-panel elev-3 w-full max-w-md space-y-4 p-6">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold" style={{ color: "var(--ink)" }}>{t("scanDocumentModal", lang)}</h3>
              <button onClick={() => setScanOpen(false)} aria-label={t("cancel", lang)}>
                <X size={16} style={{ color: "var(--ink-4)" }} />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-4)" }}>{t("filename", lang)}</label>
                <input
                  value={scanFilename}
                  onChange={(e) => setScanFilename(e.target.value)}
                  placeholder={t("scanFilenamePlaceholder", lang)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs" style={{ color: "var(--ink-4)" }}>{t("operationId", lang)}</label>
                <input
                  value={scanOpId}
                  onChange={(e) => setScanOpId(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 font-mono text-sm outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--hair-2)", color: "var(--ink)" }}
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setScanOpen(false)} className="btn btn-secondary flex-1 justify-center">
                {t("cancel", lang)}
              </button>
              <button onClick={handleScan} disabled={scanning} className="btn btn-primary flex-1 justify-center disabled:opacity-60">
                {scanning ? t("scanning", lang) : t("scanClassify", lang)}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
