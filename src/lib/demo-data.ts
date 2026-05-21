// Demo operations — matches the Claude Design prototype exactly
// Used as fallback when DB is not connected

export interface DemoFlag {
  kind: "risk" | "warn" | "review";
  title: string;
  detail: string;
  ref: string[];
  fields: string[];
  docs: string[];
}

export interface DemoTimeline {
  t: string;
  e: string;
  who: string;
}

export interface DemoOperation {
  id: string;
  supplier: string;
  supplierShort: string;
  origin: string;
  destination: string;
  mode: string;
  incoterm: string;
  eta: string;
  etaDelta: string;
  value: number;
  currency: string;
  docs: string[];
  docCount: number;
  docsExpected: number;
  status: "risk" | "review" | "ready";
  owner: { name: string; initials: string };
  brokerage: string;
  pedimento: string;
  hsBucket: string;
  flags: DemoFlag[];
  recommendedAction?: {
    title: string;
    why: string;
    primary: string;
    secondary: string[];
  };
  summary: string;
  timeline: DemoTimeline[];
}

export const DEMO_OPERATIONS: DemoOperation[] = [
  {
    id: "NP-2026-001847",
    supplier: "Shenzhen Lumitech Optics Co., Ltd.",
    supplierShort: "Lumitech Optics",
    origin: "Shanghai, CN",
    destination: "Manzanillo → CDMX",
    mode: "Ocean • FCL",
    incoterm: "FOB",
    eta: "May 28",
    etaDelta: "+2d",
    value: 184250.00,
    currency: "USD",
    docs: ["Pedimento A1", "Invoice", "BL", "Packing List", "MVE", "CFDI"],
    docCount: 6,
    docsExpected: 6,
    status: "risk",
    owner: { name: "Mariana López", initials: "ML" },
    brokerage: "Aduanas del Pacífico (Agente 3145)",
    pedimento: "26 47 3145 6002847",
    hsBucket: "8541.40.01",
    flags: [
      {
        kind: "risk",
        title: "Valor declarado en factura no coincide con pedimento",
        detail: "Invoice total USD 184,250.00 vs. Pedimento A1 valor en aduana USD 178,920.00 — diferencia de USD 5,330.00 (2.89%).",
        ref: ["Invoice INV-LMT-44218 §Total", "Pedimento 26-47-3145-6002847 §Valor en Aduana"],
        fields: ["valorfact", "valoradu"],
        docs: ["Invoice", "Pedimento A1"],
      },
      {
        kind: "warn",
        title: "Peso bruto BL > Packing List",
        detail: "Bill of Lading reporta 4,860 kg vs. Packing List 4,742 kg.",
        ref: ["BL MAEU-7741229", "PL-LMT-44218"],
        fields: ["peso"],
        docs: ["BL", "Packing List"],
      },
      {
        kind: "warn",
        title: "Fracción arancelaria reutilizada de operación previa",
        detail: "8541.40.01 coincide con NP-2026-001012; verificar descripción de mercancía.",
        ref: ["Pedimento §Partida 1"],
        fields: ["fracarancel"],
        docs: ["Pedimento A1"],
      },
    ],
    recommendedAction: {
      title: "Send correction request to customs broker",
      why: "Discrepancia bloqueante de USD 5,330 entre factura comercial y valor en aduana. Resolver antes de pago de pedimento.",
      primary: "Request correction",
      secondary: ["Assign to broker", "Approve with exception", "Export evidence"],
    },
    summary:
      "Esta operación está marcada en riesgo. La IA detectó una diferencia de USD 5,330 entre la factura comercial y el valor declarado en el pedimento A1, además de inconsistencias menores de peso entre BL y lista de empaque. Se recomienda regresar al agente aduanal antes de la liberación, o aprobar manualmente con justificación documentada.",
    timeline: [
      { t: "09:14", e: "Pedimento A1 recibido del agente aduanal", who: "system" },
      { t: "09:14", e: "Clasificación: 6 documentos detectados", who: "ai" },
      { t: "09:15", e: "Validación cruzada de campos", who: "ai" },
      { t: "09:16", e: "Excepción: discrepancia de valor 2.89%", who: "ai" },
      { t: "09:22", e: "Asignado a Mariana López", who: "Carlos R." },
    ],
  },
  {
    id: "NP-2026-001846",
    supplier: "TaegukChem Industrial Co.",
    supplierShort: "TaegukChem",
    origin: "Busan, KR",
    destination: "Lázaro Cárdenas → Querétaro",
    mode: "Ocean • LCL",
    incoterm: "CIF",
    eta: "May 26",
    etaDelta: "On time",
    value: 62400.00,
    currency: "USD",
    docs: ["Pedimento A1", "Invoice", "BL", "Packing List", "MVE"],
    docCount: 5,
    docsExpected: 6,
    status: "review",
    owner: { name: "Diego Hernández", initials: "DH" },
    brokerage: "Grupo Aduanal Tepeyac",
    pedimento: "26 47 1108 6002846",
    hsBucket: "3824.99.99",
    flags: [
      {
        kind: "review",
        title: "Falta CFDI de servicios del agente aduanal",
        detail: "Esperado 1 CFDI de honorarios para complementar el expediente.",
        ref: ["Expediente NP-2026-001846"],
        fields: [],
        docs: [],
      },
    ],
    recommendedAction: {
      title: "Request missing CFDI from broker",
      why: "Falta el CFDI de honorarios del agente aduanal para cerrar el expediente.",
      primary: "Request correction",
      secondary: ["Assign to broker", "Export evidence"],
    },
    summary:
      "Documentación casi completa. Falta el CFDI de honorarios del agente aduanal para liberar la operación. El resto de los campos clave (BL, packing, MVE) están consistentes entre sí.",
    timeline: [
      { t: "Yesterday", e: "Pedimento recibido", who: "system" },
      { t: "Yesterday", e: "5 de 6 documentos clasificados", who: "ai" },
      { t: "Today 08:02", e: "Pendiente CFDI de honorarios", who: "ai" },
    ],
  },
  {
    id: "NP-2026-001845",
    supplier: "Hannover Präzisionsteile GmbH",
    supplierShort: "Hannover Präzision",
    origin: "Hamburg, DE",
    destination: "Veracruz → Monterrey",
    mode: "Ocean • FCL",
    incoterm: "DAP",
    eta: "Jun 04",
    etaDelta: "On time",
    value: 312880.00,
    currency: "EUR",
    docs: ["Pedimento A1", "Invoice", "BL", "Packing List", "MVE", "CFDI", "COO"],
    docCount: 7,
    docsExpected: 7,
    status: "ready",
    owner: { name: "Ana Patricia Ruiz", initials: "AR" },
    brokerage: "Comercio Internacional Norte",
    pedimento: "26 48 0817 6002845",
    hsBucket: "8483.40.99",
    flags: [],
    summary:
      "Operación lista. Todos los documentos clasificados y validados; los campos clave coinciden entre factura, BL, packing y pedimento. La IA recomienda liberar para handoff a ERP.",
    timeline: [
      { t: "Mon", e: "Expediente completo", who: "system" },
      { t: "Mon", e: "Cross-check 100% consistente", who: "ai" },
      { t: "Tue", e: "Pre-aprobado por Ana Patricia", who: "Ana R." },
    ],
  },
  {
    id: "NP-2026-001844",
    supplier: "Vértice Componentes S.A. de C.V.",
    supplierShort: "Vértice Componentes",
    origin: "Laredo, US",
    destination: "Nuevo Laredo → Saltillo",
    mode: "Land • FTL",
    incoterm: "DAP",
    eta: "May 22",
    etaDelta: "On time",
    value: 41200.00,
    currency: "USD",
    docs: ["Pedimento A1", "Invoice", "BL", "Packing List", "MVE"],
    docCount: 5,
    docsExpected: 5,
    status: "ready",
    owner: { name: "Mariana López", initials: "ML" },
    brokerage: "Aduanas del Pacífico",
    pedimento: "26 24 0124 6002844",
    hsBucket: "8708.99.99",
    flags: [],
    summary: "Operación lista. Cruce 100% consistente.",
    timeline: [],
  },
  {
    id: "NP-2026-001843",
    supplier: "Guangzhou Aero Plastics Ltd.",
    supplierShort: "Aero Plastics",
    origin: "Yantian, CN",
    destination: "Manzanillo → Guadalajara",
    mode: "Ocean • FCL",
    incoterm: "FOB",
    eta: "May 30",
    etaDelta: "+1d",
    value: 96780.00,
    currency: "USD",
    docs: ["Pedimento A1", "Invoice", "BL", "Packing List"],
    docCount: 4,
    docsExpected: 6,
    status: "review",
    owner: { name: "Diego Hernández", initials: "DH" },
    brokerage: "Grupo Aduanal Tepeyac",
    pedimento: "26 47 1108 6002843",
    hsBucket: "3926.90.99",
    flags: [
      {
        kind: "review",
        title: "Falta MVE y CFDI",
        detail: "Se esperan 6 documentos; se han recibido 4. Pendientes: MVE y CFDI de honorarios.",
        ref: ["Expediente NP-2026-001843"],
        fields: [],
        docs: [],
      },
    ],
    summary:
      "Documentación incompleta. Faltan MVE y CFDI para liberar. Los 4 documentos existentes están consistentes.",
    timeline: [
      { t: "Today", e: "4 documentos clasificados", who: "ai" },
      { t: "Today", e: "Esperando MVE y CFDI", who: "ai" },
    ],
  },
  {
    id: "NP-2026-001842",
    supplier: "Korea Display Tech Co.",
    supplierShort: "Korea Display",
    origin: "Incheon, KR",
    destination: "Lázaro Cárdenas → CDMX",
    mode: "Ocean • FCL",
    incoterm: "CIF",
    eta: "Jun 01",
    etaDelta: "On time",
    value: 228400.00,
    currency: "USD",
    docs: ["Pedimento A1", "Invoice", "BL", "Packing List", "MVE", "CFDI"],
    docCount: 6,
    docsExpected: 6,
    status: "risk",
    owner: { name: "Carlos Reyes", initials: "CR" },
    brokerage: "Aduanas del Pacífico",
    pedimento: "26 47 3145 6002842",
    hsBucket: "8528.72.00",
    flags: [
      {
        kind: "risk",
        title: "NOM-050 requerida — no encontrada",
        detail: "La fracción 8528.72.00 requiere NOM-050. No se encontró evidencia de cumplimiento en el expediente.",
        ref: ["Pedimento §Partida 1", "Norma Oficial Mexicana NOM-050-SCFI-2004"],
        fields: ["nom"],
        docs: ["Pedimento A1"],
      },
    ],
    recommendedAction: {
      title: "Obtain NOM-050 compliance certificate",
      why: "La operación no puede liberarse sin evidencia de NOM-050. Riesgo de retención en aduana.",
      primary: "Request correction",
      secondary: ["Assign to broker", "Export evidence"],
    },
    summary:
      "Operación bloqueada por NOM-050. La IA detectó que la fracción arancelaria requiere certificado de cumplimiento normativo no encontrado en el expediente.",
    timeline: [
      { t: "08:40", e: "6 documentos clasificados", who: "ai" },
      { t: "08:42", e: "Excepción NOM-050 detectada", who: "ai" },
      { t: "09:05", e: "Asignado a Carlos Reyes", who: "system" },
    ],
  },
  {
    id: "NP-2026-001841",
    supplier: "Mexichem Soluciones S.A. de C.V.",
    supplierShort: "Mexichem",
    origin: "Houston, US",
    destination: "Nuevo Laredo → Monterrey",
    mode: "Land • FTL",
    incoterm: "DAP",
    eta: "May 24",
    etaDelta: "On time",
    value: 55600.00,
    currency: "USD",
    docs: ["Pedimento A1", "Invoice", "Carta Porte", "Packing List", "CFDI"],
    docCount: 5,
    docsExpected: 5,
    status: "ready",
    owner: { name: "Ana Patricia Ruiz", initials: "AR" },
    brokerage: "Comercio Internacional Norte",
    pedimento: "26 24 0124 6002841",
    hsBucket: "3903.19.01",
    flags: [],
    summary: "Operación lista. Todos los documentos validados. Carta Porte conforme.",
    timeline: [
      { t: "Today", e: "5 documentos clasificados", who: "ai" },
      { t: "Today", e: "Cross-check aprobado", who: "ai" },
    ],
  },
];

export function getDemoOperation(id: string): DemoOperation | undefined {
  return DEMO_OPERATIONS.find((op) => op.id === id);
}
