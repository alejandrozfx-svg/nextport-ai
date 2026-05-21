export type OperationStatus = "risk" | "review" | "ready";
export type DocumentType =
  | "pedimento"
  | "invoice"
  | "bl"
  | "packing_list"
  | "mve"
  | "cfdi"
  | "coo"
  | "carta_porte";
export type DocumentStatus = "uploaded" | "classified" | "extracted" | "validated" | "ready";
export type IntegrationStatus = "connected" | "pending" | "error" | "disconnected";
export type ExceptionKind = "risk" | "warn" | "review";
export type ApprovalAction =
  | "approved"
  | "held"
  | "review"
  | "escalated"
  | "correction_requested"
  | "exported";
export type UserRole = "admin" | "analyst" | "manager" | "coordinator";
export type Lang = "en" | "es" | "zh";

export interface OperationSummary {
  id: string;
  supplier: { name: string; shortName: string };
  broker: { name: string };
  origin: string;
  destination: string;
  mode: string;
  incoterm: string;
  eta: Date;
  etaDelta: string;
  value: number;
  currency: string;
  status: OperationStatus;
  owner: { name: string; initials: string };
  pedimento: string;
  hsBucket: string;
  docCount: number;
  docsExpected: number;
  docTypes: string[];
  exceptionCount: number;
}

export interface ExceptionFlag {
  id: string;
  kind: ExceptionKind;
  title: string;
  detail: string;
  refs: string[];
  fields: string[];
  docs: string[];
  resolved: boolean;
}

export interface ExtractedFieldData {
  id: string;
  fieldKey: string;
  label: string;
  value: string;
  confidence: number;
  mismatch: boolean;
  mismatchRef?: string | null;
}

export interface DocumentData {
  id: string;
  type: string;
  filename: string;
  status: string;
  confidence: number;
  source: string;
  uploadedAt: Date;
  extractedFields: ExtractedFieldData[];
  validationChecks: ValidationCheckData[];
}

export interface ValidationCheckData {
  id: string;
  checkName: string;
  passed: boolean;
  detail?: string | null;
}

export interface OperationDetail {
  id: string;
  supplier: { name: string; shortName: string; country: string; city: string };
  broker: { name: string; patent: string };
  origin: string;
  destination: string;
  mode: string;
  incoterm: string;
  eta: Date;
  etaDelta: string;
  value: number;
  currency: string;
  pedimento: string;
  hsBucket: string;
  status: OperationStatus;
  owner: { name: string; initials: string; role: string };
  aiSummary: string | null;
  documents: DocumentData[];
  exceptions: ExceptionFlag[];
  approvals: ApprovalData[];
  auditEvents: AuditEventData[];
}

export interface ApprovalData {
  id: string;
  action: string;
  note: string | null;
  createdAt: Date;
  user: { name: string; initials: string };
}

export interface AuditEventData {
  id: string;
  actor: string;
  event: string;
  detail: string | null;
  createdAt: Date;
}

export interface IntegrationData {
  id: string;
  name: string;
  slug: string;
  category: string;
  status: IntegrationStatus;
  lastSyncAt: Date | null;
  syncHealth: string | null;
  dataTypes: string[];
  errorMessage: string | null;
}

export interface AcademyLessonData {
  id: string;
  moduleNum: string;
  title: string;
  level: string;
  durationMin: number;
  tags: string[];
  intro: string;
  lessons: string[];
  levelName: string;
  levelTag: string;
  sortOrder: number;
  progress?: { completed: boolean; startedAt: Date; doneAt: Date | null } | null;
}
