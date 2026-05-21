import type { MarketingPageConfig } from "@/components/marketing/MarketingSubpage";

const coreSources = [
  {
    label: "SAT: digitalización de documentos anexos al pedimento",
    href: "https://wwwmatnp.sat.gob.mx/tramites/78386/envia-tus-documentos-anexos-al-pedimento-para-agilizar-el-despacho-aduanero",
  },
  {
    label: "VUCEM: ventanilla única de comercio exterior",
    href: "https://www.ventanillaunica.gob.mx/vucem/ventanillaunica.html",
  },
  {
    label: "SAT: preguntas frecuentes CFDI Carta Porte",
    href: "https://sat.gob.mx/minisitio/CartaPorte/documentos/PreguntasFrecuentes_Autotransporte.pdf",
  },
];

export const platformPage: MarketingPageConfig = {
  navKey: "platform",
  badge: "Control tower operativo",
  eyebrow: "Plataforma",
  title: "Una operación de importación, completa y explicable.",
  subtitle:
    "Nextport AI toma documentos dispersos desde correo, carpetas e inboxes de agentes, los convierte en datos estructurados y deja cada excepción lista para revisión humana antes del handoff a ERP, broker o autoridad.",
  primaryCta: "Abrir consola demo",
  secondaryCta: "Ver precios",
  metrics: [
    { value: "6", label: "etapas desde intake hasta handoff" },
    { value: "7+", label: "tipos de documento por expediente" },
    { value: "100%", label: "acciones críticas con trazabilidad" },
    { value: "1", label: "single source of truth por operación" },
  ],
  workflowTitle: "Flujo del producto",
  workflow: [
    { label: "Email o upload detectado", detail: "Gmail, Outlook, Drive, SharePoint o carga manual disparan una operación nueva o actualizada." },
    { label: "Documentos clasificados", detail: "Factura, BL, packing list, PO, pedimento, MVE, CFDI y Carta Porte quedan etiquetados." },
    { label: "Campos extraídos", detail: "RFC, valor factura, valor aduana, HS code, origen, pesos, contenedores y ETA pasan a tabla." },
    { label: "Validación cruzada", detail: "La IA compara documentos y explica diferencias antes de que causen retrasos." },
    { label: "Revisión humana", detail: "Compliance aprueba, solicita corrección, escala o exporta evidencia." },
    { label: "Handoff", detail: "La operación aprobada queda lista para SAP, NetSuite, Dynamics, SAT, VUCEM o broker." },
  ],
  sections: [
    {
      eyebrow: "Intake",
      title: "El expediente empieza donde vive la evidencia.",
      body: "El producto no espera que el usuario arme carpetas perfectas. Detecta correos, PDFs y adjuntos relacionados con una importación y los agrupa en una operación.",
      bullets: ["Fuentes manuales y conectadas", "Agrupación por proveedor, BL, pedimento, ruta o ETA", "Actualización de operaciones existentes"],
    },
    {
      eyebrow: "AI data layer",
      title: "Documentos convertidos en datos comparables.",
      body: "Cada archivo se clasifica, se le asigna confianza y se extraen campos clave para comparar factura, packing list, BL, pedimento y MVE sin copiar datos a mano.",
      bullets: ["Confidence score por campo", "Documento fuente siempre visible", "Historial de cambios y evidencia"],
    },
    {
      eyebrow: "Human-in-the-loop",
      title: "Automatización para preparar, no para aprobar a ciegas.",
      body: "Nextport AI explica riesgos y propone el siguiente paso, pero mantiene la aprobación crítica en manos del equipo de compliance.",
      bullets: ["Approve handoff", "Request correction", "Escalate y export audit package"],
    },
  ],
  sources: coreSources,
};

export const compliancePage: MarketingPageConfig = {
  navKey: "compliance",
  badge: "Mexico import compliance",
  eyebrow: "Cumplimiento",
  title: "Pedimento-ready, con evidencia antes de liberar.",
  subtitle:
    "La página de cumplimiento traduce requisitos operativos de comercio exterior en controles prácticos: documentos anexos, VUCEM, CFDI/Carta Porte, valor aduana, fracción arancelaria, origen y aprobaciones auditables.",
  primaryCta: "Ver flujo de revisión",
  secondaryCta: "Ver integraciones",
  metrics: [
    { value: "36-A", label: "referencia de documentos anexos al pedimento" },
    { value: "RRNA", label: "controles para regulaciones no arancelarias" },
    { value: "CFDI", label: "Carta Porte y servicios logísticos vinculados" },
    { value: "SOC", label: "evidencia de controles y auditoría interna" },
  ],
  workflowTitle: "Controles de cumplimiento",
  workflow: [
    { label: "Documentos anexos", detail: "Factura, transporte, permisos, certificados y evidencia quedan digitalizados y enlazados." },
    { label: "Valor y origen", detail: "Factura comercial, valor aduana, Incoterm, país de origen y soportes se comparan." },
    { label: "Fracción y NOM", detail: "HS code/fracción se marca para evidencia adicional cuando exige soporte normativo." },
    { label: "Carta Porte y CFDI", detail: "El sistema rastrea folios y datos logísticos que impactan el expediente." },
    { label: "Aprobación humana", detail: "Toda excepción requiere decisión, comentario o escalamiento." },
    { label: "Paquete auditable", detail: "Se exporta evidencia con documentos, campos, validaciones y trail." },
  ],
  sections: [
    {
      eyebrow: "VUCEM / SAT",
      title: "Digitalización enfocada en despacho.",
      body: "El SAT describe la digitalización como el envío electrónico de documentos necesarios para el despacho. Nextport AI prepara esos documentos como evidencia navegable.",
      bullets: ["Acuse y fuente por documento", "E-document y expediente digital", "Pendientes visibles antes del cierre"],
    },
    {
      eyebrow: "Validaciones",
      title: "Riesgos detectados antes de que lleguen al agente.",
      body: "El sistema compara datos sensibles entre documentos y los convierte en excepciones accionables para analistas y managers.",
      bullets: ["Invoice vs PO / pedimento", "BL vs packing list", "Origen, peso, cantidad, contenedores y valor"],
    },
    {
      eyebrow: "Governance",
      title: "Auditoría sin reconstruir la historia.",
      body: "Cada extracción, cambio de estatus y aprobación queda registrada para explicar quién decidió, con qué evidencia y cuándo.",
      bullets: ["RBAC conceptual", "Trail inmutable", "Preparación SOC 2 e ISO/IEC 27001"],
    },
  ],
  sources: [
    ...coreSources,
    {
      label: "AICPA: SOC suite of services",
      href: "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services",
    },
    {
      label: "ISO: ISO/IEC 27001:2022",
      href: "https://www.iso.org/standard/27001?s=aaa",
    },
  ],
};

export const integrationsPage: MarketingPageConfig = {
  navKey: "integrations",
  badge: "Inbox, ERP, broker y BI",
  eyebrow: "Integraciones",
  title: "Conecta las fuentes donde nace y termina la operación.",
  subtitle:
    "Nextport AI está diseñado para jalar evidencia desde correo y documentos, sincronizar estados con ERP o sistemas de agente, y dejar métricas listas para reporting operativo.",
  primaryCta: "Abrir consola de integraciones",
  secondaryCta: "Ver cumplimiento",
  metrics: [
    { value: "14", label: "conectores modelados en la demo" },
    { value: "4", label: "familias: inbox, storage, ERP y gobierno" },
    { value: "API", label: "handoff preparado para sistemas downstream" },
    { value: "BI", label: "operaciones listas para Power BI / reporting" },
  ],
  workflowTitle: "Mapa de integración",
  workflow: [
    { label: "Comunicación", detail: "Gmail, Outlook, Microsoft 365 y WhatsApp detectan correos, adjuntos y contexto logístico." },
    { label: "Storage", detail: "Google Drive y SharePoint alimentan PDFs y carpetas compartidas." },
    { label: "ERP", detail: "SAP S/4HANA, Oracle NetSuite y Dynamics reciben datos aprobados." },
    { label: "Gobierno", detail: "SAT y VUCEM se modelan como destinos de evidencia y validación." },
    { label: "Broker / carriers", detail: "Sistemas de agente y ETA providers actualizan estatus, documentos y demoras." },
    { label: "Analytics", detail: "Power BI consume operación, riesgos, tiempos y proveedores con más excepciones." },
  ],
  sections: [
    {
      eyebrow: "Sources",
      title: "Inbox y carpetas como disparadores.",
      body: "La entrada de documentos se modela alrededor de cómo trabajan los equipos: correos de broker, carpetas compartidas y adjuntos de proveedores.",
      bullets: ["Detección de nuevos paquetes", "Source metadata", "Estado de sync y errores visibles"],
    },
    {
      eyebrow: "ERP handoff",
      title: "Datos aprobados, no PDFs sin contexto.",
      body: "Después de revisión humana, Nextport AI prepara payloads con campos estructurados y evidencia para SAP, NetSuite o Dynamics.",
      bullets: ["Operation record", "Campos validados", "Audit package exportable"],
    },
    {
      eyebrow: "Observability",
      title: "Salud de integración como parte del flujo.",
      body: "Cada conector muestra conexión, último sync, health y tipos de datos importados para evitar cajas negras.",
      bullets: ["Connected / pending / error", "Test connection", "Reconnect y sync now"],
    },
  ],
  sources: [
    ...coreSources,
    {
      label: "SAP Help: integration scenarios",
      href: "https://help.sap.com/docs/s4hana-best-practices/s4cld-api/integration-scenarios?locale=en-US",
    },
    {
      label: "Oracle NetSuite: SuiteTalk REST Web Services",
      href: "https://docs.oracle.com/en/cloud/saas/netsuite/ns-online-help/section_1546938065.html",
    },
    {
      label: "Microsoft: Power BI and Dynamics 365",
      href: "https://www.microsoft.com/en-us/power-platform/products/power-bi/power-bi-and-dynamics",
    },
  ],
};

export const pricingPage: MarketingPageConfig = {
  navKey: "pricing",
  badge: "Pricing para equipos de importación",
  eyebrow: "Precios",
  title: "Empieza con un workspace, escala por volumen operativo.",
  subtitle:
    "El pricing está pensado para un producto B2B de compliance: cobra por workspace y volumen de operaciones/documentos, no por obligar a cada broker o analista externo a tener un asiento caro.",
  primaryCta: "Probar demo",
  secondaryCta: "Hablar de enterprise",
  metrics: [
    { value: "$499", label: "Starter mensual para pilotos controlados" },
    { value: "$1.8k", label: "Growth mensual para equipos operativos" },
    { value: "Custom", label: "Enterprise con SSO, SLAs y conectores dedicados" },
    { value: "0", label: "costo extra por usuario externo invitado en piloto" },
  ],
  workflowTitle: "Planes sugeridos",
  workflow: [
    { label: "Starter", detail: "Hasta 150 documentos/mes, 1 workspace, demo data, upload manual y export audit package." },
    { label: "Growth", detail: "Hasta 1,500 documentos/mes, integraciones de inbox/storage, status sync y dashboards." },
    { label: "Enterprise", detail: "Volumen negociado, SSO/SAML, ambientes dedicados, conectores ERP/broker y soporte de seguridad." },
    { label: "Implementation", detail: "Sprint de configuración para mapear documentos, campos, excepciones y handoff." },
  ],
  sections: [
    {
      eyebrow: "Starter",
      title: "$499 / mes",
      body: "Para validar el flujo con un equipo pequeño sin esperar integración ERP. Ideal para demo, entrevista o piloto de compliance.",
      bullets: ["1 workspace", "Upload manual y scan simulation", "Academy y Nextport Tutor incluidos"],
    },
    {
      eyebrow: "Growth",
      title: "$1,800 / mes",
      body: "Para equipos que reciben documentos de varios proveedores, brokers y rutas. Incluye intake conectado y reporting operativo.",
      bullets: ["Inbox + storage connectors", "1,500 documentos/mes", "Dashboards y exception trends"],
    },
    {
      eyebrow: "Enterprise",
      title: "Custom",
      body: "Para compañías con ERP, controles de seguridad, requerimientos de auditoría y múltiples agentes aduanales.",
      bullets: ["SSO/SAML y RBAC avanzado", "SAP / NetSuite / Dynamics handoff", "SLA, soporte y data retention"],
    },
  ],
  sources: [
    {
      label: "Neon: serverless Postgres pricing reference",
      href: "https://neon.com/pricing",
    },
    {
      label: "AICPA: SOC suite for assurance expectations",
      href: "https://www.aicpa-cima.com/resources/landing/system-and-organization-controls-soc-suite-of-services",
    },
    {
      label: "ISO: ISO/IEC 27001 information security management",
      href: "https://www.iso.org/standard/27001?s=aaa",
    },
  ],
};
