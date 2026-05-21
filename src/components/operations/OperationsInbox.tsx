"use client";

import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import { OperationRow } from "./OperationRow";
import { DEMO_OPERATIONS } from "@/lib/demo-data";

type TabKey = "all" | "risk" | "review" | "ready";
type WorkflowKey = "detected" | "classified" | "extracted" | "validated" | "review" | "handoff";

const OPERATIONS = DEMO_OPERATIONS;

const sampleDocuments = [
  {
    name: "00_document_guide_dummy.pdf",
    label: "Email / intake guide",
    type: "Inbox context",
    confidence: "Source",
    fields: 6,
    size: "3.6 KB",
    href: "/sample-documents/00_document_guide_dummy.pdf",
  },
  {
    name: "01_commercial_invoice_dummy.pdf",
    label: "Commercial invoice",
    type: "Invoice",
    confidence: "99.1%",
    fields: 24,
    size: "3.8 KB",
    href: "/sample-documents/01_commercial_invoice_dummy.pdf",
  },
  {
    name: "02_packing_list_dummy.pdf",
    label: "Packing list",
    type: "Packing List",
    confidence: "98.7%",
    fields: 18,
    size: "3.6 KB",
    href: "/sample-documents/02_packing_list_dummy.pdf",
  },
  {
    name: "03_bill_of_lading_dummy.pdf",
    label: "Bill of lading",
    type: "Bill of Lading",
    confidence: "98.2%",
    fields: 16,
    size: "3.6 KB",
    href: "/sample-documents/03_bill_of_lading_dummy.pdf",
  },
  {
    name: "04_pedimento_simplified_dummy.pdf",
    label: "Pedimento",
    type: "Pedimento",
    confidence: "97.4%",
    fields: 22,
    size: "4.0 KB",
    href: "/sample-documents/04_pedimento_simplified_dummy.pdf",
  },
  {
    name: "05_manifestacion_valor_electronica_dummy.pdf",
    label: "MVE",
    type: "MVE",
    confidence: "96.8%",
    fields: 14,
    size: "3.9 KB",
    href: "/sample-documents/05_manifestacion_valor_electronica_dummy.pdf",
  },
];

const workflowSteps: Array<{
  key: WorkflowKey;
  icon: string;
  title: string;
  summary: string;
  status: string;
  statusTone: "ok" | "brand" | "warn" | "risk";
  objective: string;
  how: string;
  input: string;
  output: string;
  value: string;
}> = [
  {
    key: "detected",
    icon: "mail",
    title: "Email or upload detected",
    summary: "A user drops PDFs or connects Gmail, Outlook, Drive or broker inboxes.",
    status: "Trigger",
    statusTone: "brand",
    objective: "Start an import operation from the place where documents actually arrive.",
    how: "Nextport watches connected sources and manual uploads, groups related files, and creates or updates the operation record.",
    input: "Invoices, BL, packing list, PO, pedimento, MVE, CFDI, Carta Porte or logistics email context.",
    output: "Operation NP-2026-001848 is created or updated in the inbox with the source evidence attached.",
    value: "The coordinator avoids hunting through email, folders and chat threads before work can begin.",
  },
  {
    key: "classified",
    icon: "file",
    title: "Documents classified",
    summary: "AI tags invoice, BL, packing list, pedimento, MVE and other evidence.",
    status: "Auto",
    statusTone: "ok",
    objective: "Identify what each file is before a human has to sort the expediente.",
    how: "The classifier reads visual and text patterns, assigns a document type, and stores a confidence score.",
    input: "Documents detected from integrations or uploaded manually.",
    output: "Each document is labeled with type, confidence, linked operation and source.",
    value: "The analyst instantly knows what is present, what is missing and what needs review.",
  },
  {
    key: "extracted",
    icon: "database",
    title: "Fields extracted",
    summary: "RFC, totals, HS code, origin, containers, quantities, weights and ETA become data.",
    status: "Data",
    statusTone: "ok",
    objective: "Convert PDFs and emails into structured compliance data.",
    how: "The extraction layer reads the classified files and maps key values to the operational record with confidence and source document.",
    input: "Classified import documents.",
    output: "A field table with value, source evidence and confidence score.",
    value: "Teams stop copying values manually from PDFs just to compare them later.",
  },
  {
    key: "validated",
    icon: "shield",
    title: "Cross-document validation",
    summary: "Invoice vs PO, BL vs packing list, MVE vs pedimento and origin checks run.",
    status: "2 exceptions",
    statusTone: "risk",
    objective: "Find compliance and logistics inconsistencies before they create delays.",
    how: "Nextport compares totals, quantities, addresses, origin, containers, transport and customs values across documents.",
    input: "Extracted fields with source lineage.",
    output: "Exceptions such as invoice total mismatch, BL container mismatch, origin conflict and HS code support needed.",
    value: "The inbox prioritizes risky operations instead of treating every expediente the same.",
  },
  {
    key: "review",
    icon: "eye",
    title: "Human review",
    summary: "A specialist reviews evidence, AI summary, exceptions and recommended actions.",
    status: "Required",
    statusTone: "warn",
    objective: "Keep a human decision point before any critical compliance approval.",
    how: "The user reviews documents, fields, exceptions and evidence, then chooses approve, request correction, escalate, comment or export audit package.",
    input: "Validated operation with evidence, exceptions and AI summary.",
    output: "Approval event, correction request or escalation is persisted in the audit trail.",
    value: "The product assists the compliance team without turning sensitive decisions into blind automation.",
  },
  {
    key: "handoff",
    icon: "zap",
    title: "ERP / broker handoff",
    summary: "Approved data is prepared for SAP, NetSuite, Dynamics, VUCEM, SAT or broker systems.",
    status: "Ready after approval",
    statusTone: "brand",
    objective: "Close the workflow with traceable downstream delivery.",
    how: "Once approved, Nextport packages normalized data and evidence for export or integration sync.",
    input: "Human-approved operation package.",
    output: "ERP payload, broker package, PDF/CSV export or audit package with approval history.",
    value: "The team reduces rework and has a clear record of what was approved, by whom and from which evidence.",
  },
];

function Icon({ name, size = 14 }: { name: string; size?: number }) {
  const s = { width: size, height: size, flexShrink: 0 as const };
  const icons: Record<string, ReactElement> = {
    upload: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>,
    search: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>,
    alert: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>,
    check: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="20 6 9 17 4 12" /></svg>,
    activity: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
    dollar: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" /></svg>,
    arrow_right: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>,
    mail: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></svg>,
    file: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /><path d="M8 13h8" /><path d="M8 17h6" /></svg>,
    database: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><ellipse cx="12" cy="5" rx="8" ry="3" /><path d="M4 5v6c0 1.7 3.6 3 8 3s8-1.3 8-3V5" /><path d="M4 11v6c0 1.7 3.6 3 8 3s8-1.3 8-3v-6" /></svg>,
    shield: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><path d="m9 12 2 2 4-4" /></svg>,
    eye: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>,
    zap: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>,
    inbox: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>,
    link: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={s}><path d="M10 13a5 5 0 0 0 7.07 0l2.12-2.12a5 5 0 1 0-7.07-7.07L11 4.93" /><path d="M14 11a5 5 0 0 0-7.07 0L4.81 13.12a5 5 0 1 0 7.07 7.07L13 19.07" /></svg>,
    x: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={s}><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>,
  };
  return icons[name] ?? <svg style={s} />;
}

function toneColor(tone: "ok" | "brand" | "warn" | "risk") {
  return {
    ok: "var(--ok)",
    brand: "var(--brand)",
    warn: "var(--warn)",
    risk: "var(--risk)",
  }[tone];
}

function StatCard({ label, value, sub, color, active, onClick }: {
  label: string; value: string | number; sub: string; color?: string; active?: boolean; onClick?: () => void;
}) {
  return (
    <div
      className="glass-panel p-4 cursor-pointer transition-all"
      onClick={onClick}
      style={{
        outline: active ? `1px solid ${color ?? "var(--brand)"}` : undefined,
        background: active ? `${color ?? "var(--brand)"}1a` : undefined,
      }}
    >
      <div className="text-[11px] mb-1" style={{ color: "var(--ink-4)" }}>{label}</div>
      <div className="text-[24px] font-semibold tabular leading-none mb-1" style={{ color: color ?? "white" }}>
        {value}
      </div>
      <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{sub}</div>
    </div>
  );
}

function AIWorkflowPanel({ onStartScan }: { onStartScan: () => void }) {
  const [activeKey, setActiveKey] = useState<WorkflowKey>("detected");
  const active = workflowSteps.find((step) => step.key === activeKey) ?? workflowSteps[0];
  const activeIndex = workflowSteps.findIndex((step) => step.key === active.key);

  return (
    <section className="glass-panel overflow-hidden">
      <div className="p-5 border-b" style={{ borderColor: "var(--hair)" }}>
        <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="chip chip-brand"><span className="dot" />PRD flow</span>
              <span className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--ink-4)" }}>
                Human-in-the-loop
              </span>
            </div>
            <h2 className="text-[19px] font-semibold" style={{ color: "white" }}>AI workflow</h2>
            <p className="text-[12.5px] mt-1 max-w-3xl" style={{ color: "var(--ink-3)" }}>
              Nextport AI converts messy document intake into structured data, risk explanations and a human-approved handoff package.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-sm" onClick={() => setActiveKey("detected")}>
              <Icon name="inbox" size={13} /> Connect inbox
            </button>
            <button className="btn btn-primary btn-sm" onClick={onStartScan}>
              <Icon name="upload" size={13} /> Run sample workflow
            </button>
          </div>
        </div>

        <div className="mt-4 grid gap-2 md:grid-cols-3">
          {[
            { label: "Gmail / Outlook", value: "New broker email detected", color: "var(--brand)" },
            { label: "Manual upload", value: "6 PDFs ready to process", color: "var(--ok)" },
            { label: "Operation result", value: "Creates or updates NP-2026-001848", color: "var(--warn)" },
          ].map((item) => (
            <div key={item.label} className="glass-panel-tight px-3 py-2.5">
              <div className="flex items-center gap-2 text-[11px]" style={{ color: "var(--ink-4)" }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: item.color, boxShadow: `0 0 8px ${item.color}` }} />
                {item.label}
              </div>
              <div className="text-[12.5px] mt-1 truncate" style={{ color: "white" }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
        <div className="p-4 border-b xl:border-b-0 xl:border-r" style={{ borderColor: "var(--hair)" }}>
          <div className="space-y-2">
            {workflowSteps.map((step, index) => {
              const activeStep = step.key === active.key;
              const completed = index < activeIndex;
              const color = toneColor(step.statusTone);
              return (
                <button
                  key={step.key}
                  type="button"
                  onClick={() => setActiveKey(step.key)}
                  className="w-full text-left rounded-xl border px-3 py-3 transition-all"
                  style={{
                    borderColor: activeStep ? color : "var(--hair)",
                    background: activeStep ? `${color}18` : completed ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.018)",
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{
                        color,
                        background: activeStep ? `${color}24` : "rgba(255,255,255,0.055)",
                        border: `1px solid ${activeStep ? color : "var(--hair-2)"}`,
                      }}
                    >
                      <Icon name={step.icon} size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[13.5px] font-medium truncate" style={{ color: "white" }}>{step.title}</span>
                        <span className="text-[10.5px] rounded-full px-2 py-0.5 border" style={{ color, borderColor: `${color}66`, background: `${color}14` }}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-[11.8px] mt-1 leading-relaxed" style={{ color: "var(--ink-4)" }}>{step.summary}</p>
                    </div>
                    <Icon name="arrow_right" size={14} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <div className="text-[11px] uppercase tracking-[0.14em]" style={{ color: "var(--ink-4)" }}>Selected step</div>
              <h3 className="text-[17px] font-semibold mt-1" style={{ color: "white" }}>{active.title}</h3>
            </div>
            <div className="text-[11px] font-mono tabular" style={{ color: "var(--ink-4)" }}>
              {activeIndex + 1} / {workflowSteps.length}
            </div>
          </div>

          <div className="mt-4 grid gap-2">
            {[
              ["Objective", active.objective],
              ["How it works", active.how],
              ["Expected input", active.input],
              ["Expected result", active.output],
              ["User value", active.value],
            ].map(([label, text]) => (
              <div key={label} className="glass-panel-tight px-3 py-2.5">
                <div className="text-[10.5px] uppercase tracking-[0.12em]" style={{ color: "var(--ink-4)" }}>{label}</div>
                <div className="text-[12.3px] leading-relaxed mt-1" style={{ color: "var(--ink-2)" }}>{text}</div>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[12px] font-medium" style={{ color: "white" }}>Evidence pack used in this demo</div>
              <span className="text-[11px] font-mono" style={{ color: "var(--ink-4)" }}>{sampleDocuments.length} files</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sampleDocuments.map((doc) => (
                <a
                  key={doc.name}
                  href={doc.href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-panel-tight px-3 py-2.5 transition-all hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-8 rounded-[4px] border flex items-center justify-center" style={{ borderColor: "var(--hair-2)", color: "var(--brand)", background: "rgba(255,255,255,0.04)" }}>
                      <Icon name="file" size={13} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-[12px] truncate" style={{ color: "white" }}>{doc.label}</div>
                      <div className="text-[10.5px] mt-0.5 truncate" style={{ color: "var(--ink-4)" }}>
                        {doc.type} - {doc.confidence} - {doc.fields} fields
                      </div>
                    </div>
                    <Icon name="link" size={12} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function OperationsInbox() {
  const [filter, setFilter] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [openUpload, setOpenUpload] = useState(false);

  const filtered = useMemo(() => {
    return OPERATIONS.filter((op) => {
      if (filter !== "all" && op.status !== filter) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          op.id.toLowerCase().includes(q) ||
          op.supplier.toLowerCase().includes(q) ||
          op.pedimento.toLowerCase().includes(q) ||
          op.origin.toLowerCase().includes(q) ||
          op.destination.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [filter, search]);

  const counts = {
    all: OPERATIONS.length,
    risk: OPERATIONS.filter((o) => o.status === "risk").length,
    review: OPERATIONS.filter((o) => o.status === "review").length,
    ready: OPERATIONS.filter((o) => o.status === "ready").length,
  };

  const totalValue = OPERATIONS.reduce((s, o) => s + o.value, 0);

  const tabs: { key: TabKey; label: string; color?: string }[] = [
    { key: "all", label: "All operations" },
    { key: "risk", label: "At risk", color: "var(--risk)" },
    { key: "review", label: "Needs review", color: "var(--warn)" },
    { key: "ready", label: "Ready", color: "var(--ok)" },
  ];

  return (
    <div className="px-8 py-7 space-y-5">
      <div className="flex items-center justify-between mb-1">
        <div>
          <h1 className="text-[22px] font-semibold" style={{ color: "white" }}>Operations inbox</h1>
          <p className="text-[13px] mt-0.5" style={{ color: "var(--ink-3)" }}>
            Control tower for active import operations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="btn btn-sm"><Icon name="search" size={13} /> Filter</button>
          <button className="btn btn-primary btn-sm" onClick={() => setOpenUpload(true)}>
            <Icon name="upload" size={13} /> Scan documents
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        <StatCard label="Active operations" value={counts.all} sub="This month" active={filter === "all"} onClick={() => setFilter("all")} />
        <StatCard label="At risk" value={counts.risk} sub="Blocking mismatch" color="var(--risk)" active={filter === "risk"} onClick={() => setFilter("risk")} />
        <StatCard label="Needs review" value={counts.review} sub="Missing document" color="var(--warn)" active={filter === "review"} onClick={() => setFilter("review")} />
        <StatCard label="Ready for handoff" value={counts.ready} sub="Ready for handoff" color="var(--ok)" active={filter === "ready"} onClick={() => setFilter("ready")} />
        <StatCard label="Customs value today" value={`$${(totalValue / 1000).toFixed(0)}k`} sub="USD equivalent" />
      </div>

      <AIWorkflowPanel onStartScan={() => setOpenUpload(true)} />

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 glass-panel-tight p-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilter(t.key)}
              className="px-3 py-1.5 rounded-lg text-[12.5px] transition-all"
              style={{
                background: filter === t.key ? "rgba(255,255,255,0.08)" : "transparent",
                color: filter === t.key ? (t.color ?? "white") : "var(--ink-4)",
                boxShadow: filter === t.key ? "inset 0 0 0 1px var(--hair-2)" : undefined,
              }}
            >
              {t.label}
              <span className="ml-1.5 text-[11px] tabular" style={{ color: "var(--ink-4)" }}>
                {counts[t.key]}
              </span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg ml-auto glass-panel-tight">
          <Icon name="search" size={12} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search operations..."
            className="bg-transparent text-[12.5px] outline-none w-48"
            style={{ color: "var(--ink)", caretColor: "var(--brand)" }}
          />
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <table className="table" style={{ tableLayout: "fixed" }}>
          <colgroup>
            <col style={{ width: 120 }} />
            <col style={{ width: "16%" }} />
            <col style={{ width: "14%" }} />
            <col style={{ width: 80 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 150 }} />
            <col style={{ width: 90 }} />
            <col style={{ width: 50 }} />
            <col style={{ width: 100 }} />
          </colgroup>
          <thead>
            <tr>
              {["Status", "Supplier", "Route", "ETA", "Value", "Pedimento", "Documents", "Exc", "Owner"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="text-center py-10" style={{ color: "var(--ink-4)" }}>
                  No operations match your filter.
                </td>
              </tr>
            ) : (
              filtered.map((op) => <OperationRow key={op.id} op={op} />)
            )}
          </tbody>
        </table>
      </div>

      {openUpload && <UploadModal onClose={() => setOpenUpload(false)} />}
    </div>
  );
}

function UploadModal({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<"idle" | "scanning" | "done">("idle");
  const [files, setFiles] = useState<Array<{
    name: string;
    type: string;
    size: string;
    href: string;
    confidence: string;
    progress: number;
    classified: boolean;
    extracted: number;
  }>>([]);

  function startScan() {
    setFiles(sampleDocuments.map((d) => ({
      name: d.name,
      type: d.type,
      size: d.size,
      href: d.href,
      confidence: d.confidence,
      progress: 0,
      classified: false,
      extracted: 0,
    })));
    setPhase("scanning");
    animateScan(sampleDocuments.length);
  }

  function animateScan(count: number) {
    const start = performance.now();
    function tick(now: number) {
      const elapsed = (now - start) / 1000;
      setFiles((prev) => prev.map((file, index) => {
        const offset = index * 0.35;
        const progress = Math.max(0, Math.min(1, (elapsed - offset) / 1.6));
        const extracted = Math.max(0, Math.min(1, (elapsed - offset - 1.0) / 1.5));
        return {
          ...file,
          progress,
          classified: progress >= 1,
          extracted: Math.floor(extracted * (index === 0 ? 6 : 24)),
        };
      }));
      if (elapsed < count * 0.35 + 3.0) {
        requestAnimationFrame(tick);
      } else {
        setPhase("done");
      }
    }
    requestAnimationFrame(tick);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6" style={{ background: "rgba(4,6,10,0.65)", backdropFilter: "blur(8px)" }} onClick={onClose}>
      <div className="glass-panel fade-up" style={{ width: 780, maxHeight: "85vh", overflow: "auto" }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b" style={{ borderColor: "var(--hair)" }}>
          <div className="flex items-center gap-2.5">
            <Icon name="inbox" size={16} />
            <div>
              <div className="text-[15px]" style={{ color: "white" }}>Detect import documents</div>
              <div className="text-[12px]" style={{ color: "var(--ink-4)" }}>
                Simulate email or upload intake, then classify, extract, validate and queue human review.
              </div>
            </div>
          </div>
          <button className="btn btn-sm btn-ghost" onClick={onClose}><Icon name="x" size={14} /></button>
        </div>

        <div className="p-6">
          {phase === "idle" && (
            <div className="space-y-4">
              <div className="grid gap-3 md:grid-cols-3">
                {[
                  ["Gmail inbox", "Broker email with 5 attached PDFs", "Connected"],
                  ["Manual upload", "Drop PDFs from the sample document pack", "Ready"],
                  ["Broker folder", "Shared Drive / SharePoint watcher", "Pending setup"],
                ].map(([label, value, status]) => (
                  <div key={label} className="glass-panel-tight p-3">
                    <div className="text-[11px]" style={{ color: "var(--ink-4)" }}>{label}</div>
                    <div className="text-[12.5px] leading-snug mt-1" style={{ color: "white" }}>{value}</div>
                    <div className="text-[10.5px] mt-2" style={{ color: status === "Pending setup" ? "var(--warn)" : "var(--ok)" }}>{status}</div>
                  </div>
                ))}
              </div>

              <div className="rounded-xl border-2 border-dashed p-10 text-center" style={{ borderColor: "rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.015)" }}>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center liquid-glass">
                  <Icon name="upload" size={18} />
                </div>
                <div className="text-[14px] mb-1.5" style={{ color: "white" }}>
                  Start from email detection or use the dummy document pack
                </div>
                <div className="text-[12px] mb-4" style={{ color: "var(--ink-4)" }}>
                  PDF, XML, ZIP or JPG up to 50 MB. This demo uses the provided trade compliance PDFs.
                </div>
                <button className="btn btn-primary btn-sm mx-auto" onClick={startScan}>
                  Use sample document pack
                </button>
              </div>
            </div>
          )}

          {(phase === "scanning" || phase === "done") && (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div className="text-[12.5px] flex items-center gap-2" style={{ color: "white" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{
                    background: phase === "done" ? "var(--ok)" : "var(--brand)",
                    boxShadow: `0 0 8px ${phase === "done" ? "var(--ok)" : "var(--brand)"}`,
                  }} />
                  {phase === "done" ? "Validation ready for human review" : "Detecting, classifying and extracting..."}
                </div>
                <div className="text-[11px] font-mono tabular" style={{ color: "var(--ink-4)" }}>
                  {files.filter((f) => f.classified).length} / {files.length} classified
                </div>
              </div>

              <div className="space-y-1.5">
                {files.map((f) => (
                  <div key={f.name} className="glass-panel-tight px-3 py-2.5 flex items-center gap-3">
                    <a href={f.href} target="_blank" rel="noreferrer" className="w-7 h-9 rounded-[3px] border flex-shrink-0 flex items-center justify-center" style={{ background: "linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))", borderColor: "var(--hair-2)", color: "var(--brand)" }}>
                      <Icon name="file" size={13} />
                    </a>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <a href={f.href} target="_blank" rel="noreferrer" className="text-[12.5px] truncate flex-1 hover:underline" style={{ color: "white" }}>{f.name}</a>
                        <div className="font-mono text-[10.5px]" style={{ color: "var(--ink-4)" }}>{f.size}</div>
                      </div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <div className="progress flex-1"><span style={{ width: `${f.progress * 100}%` }} /></div>
                        <div className="flex items-center gap-1.5 min-w-[175px] justify-end">
                          {f.classified ? (
                            <>
                              <span className="chip chip-brand"><span className="dot" />{f.type}</span>
                              <span className="text-[10.5px] font-mono tabular" style={{ color: "var(--ink-4)" }}>{f.confidence} - {f.extracted} fields</span>
                            </>
                          ) : (
                            <span className="text-[10.5px] font-mono tabular" style={{ color: "var(--ink-4)" }}>{Math.round(f.progress * 100)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {phase === "done" && (
                <div className="glass-panel-tight p-3 mt-3 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: "var(--warn-soft)", border: "1px solid oklch(0.78 0.14 70 / 0.4)", color: "var(--warn)" }}>
                    <Icon name="alert" size={14} />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px]" style={{ color: "white" }}>Operation NP-2026-001848 created or updated from email/upload evidence.</div>
                    <div className="text-[11.5px]" style={{ color: "var(--ink-4)" }}>
                      2 exceptions detected: BL container mismatch and origin support needed. Awaiting human review.
                    </div>
                  </div>
                  <button className="btn btn-sm btn-primary" onClick={onClose}>
                    Back to inbox <Icon name="arrow_right" size={13} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
