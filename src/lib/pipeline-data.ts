// Shared data for the operations Pipeline page and the Operations inbox UploadModal.
// `sampleDocuments` is the demo evidence pack the UploadModal uses to simulate intake.
// `workflowSteps` is the storytelling content for the Pipeline page.

export type WorkflowKey =
  | "detected"
  | "classified"
  | "extracted"
  | "validated"
  | "review"
  | "handoff";

export interface SampleDocument {
  name: string;
  label: string;
  type: string;
  confidence: string;
  fields: number;
  size: string;
  href: string;
}

export interface WorkflowStep {
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
}

export const sampleDocuments: SampleDocument[] = [
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

export const workflowSteps: WorkflowStep[] = [
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
