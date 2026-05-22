// Trade Compliance Academy — full content for all 12 lessons.
// Source: Ley Aduanera (LA), Reglamento de la Ley Aduanera (RLA),
// Reglas Generales de Comercio Exterior 2026 (RGCE), TIGIE, INCOTERMS 2020 (ICC),
// Manual de operación VUCEM, Anexo 22 RGCE, Anexo 24 RGCE, T-MEC capítulo 5.

import type { Lang } from "./i18n";

export type LessonLevel = "beginner" | "intermediate" | "advanced";

export interface LocalizedString {
  en: string;
  es: string;
  zh: string;
}

export interface LessonSection {
  title: LocalizedString;
  body: LocalizedString;
}

export interface LessonReference {
  label: string;
  source: string;
}

export interface AcademyLesson {
  id: string;
  moduleNum: string;
  level: LessonLevel;
  durationMin: number;
  tags: string[];
  levelName: LocalizedString;
  levelTag: LocalizedString;
  title: LocalizedString;
  intro: LocalizedString;
  sections: LessonSection[];
  keyPoints: { en: string[]; es: string[]; zh: string[] };
  references: LessonReference[];
}

// Helper to safely resolve a localized string with EN fallback.
export function pick(s: LocalizedString | undefined, lang: Lang): string {
  if (!s) return "";
  return s[lang] || s.en;
}

export function pickArray(s: { en: string[]; es: string[]; zh: string[] } | undefined, lang: Lang): string[] {
  if (!s) return [];
  return (s[lang] && s[lang].length > 0) ? s[lang] : s.en;
}

const FUNDAMENTALS: LocalizedString = {
  en: "Fundamentals",
  es: "Fundamentos",
  zh: "基础",
};

const DOC_INTEL: LocalizedString = {
  en: "Document intelligence",
  es: "Inteligencia documental",
  zh: "文件智能",
};

const MX_COMPLIANCE: LocalizedString = {
  en: "Mexico compliance",
  es: "Cumplimiento México",
  zh: "墨西哥合规",
};

const INTL_TRADE: LocalizedString = {
  en: "International trade",
  es: "Comercio internacional",
  zh: "国际贸易",
};

const EXCEPTION_MGMT: LocalizedString = {
  en: "Exception management",
  es: "Gestión de excepciones",
  zh: "异常管理",
};

const GOVERNANCE: LocalizedString = {
  en: "Governance",
  es: "Gobernanza",
  zh: "治理",
};

export const ACADEMY_LESSONS: AcademyLesson[] = [
  // ────────────────────────────────────────────────────────
  // 01 · What is an import operation?
  // ────────────────────────────────────────────────────────
  {
    id: "01",
    moduleNum: "01",
    level: "beginner",
    durationMin: 22,
    tags: ["Operations", "Documents"],
    levelName: FUNDAMENTALS,
    levelTag: { en: "L1 · Fundamentals", es: "N1 · Fundamentos", zh: "L1 · 基础" },
    title: {
      en: "What is an import operation?",
      es: "¿Qué es una operación de importación?",
      zh: "什么是进口业务？",
    },
    intro: {
      en: "The full lifecycle of an import — from purchase order to customs clearance — and who is responsible at each step.",
      es: "El ciclo completo de una importación — de la orden de compra al despacho aduanero — y quién es responsable en cada etapa.",
      zh: "进口业务的完整生命周期 — 从采购订单到海关清关 — 以及每个阶段的责任人。",
    },
    sections: [
      {
        title: {
          en: "What 'import' means under Mexican law",
          es: "Qué significa 'importación' en la Ley Aduanera",
          zh: "墨西哥法律下的“进口”定义",
        },
        body: {
          en: "Under Mexican law (Ley Aduanera Art. 35–36), an import is the legal entry of foreign goods into national territory. The importer of record assumes responsibility for declared value, classification, duties and compliance with non-tariff regulations. The operation is not 'closed' until the pedimento is paid and the goods are released from the customs section (recinto fiscal).",
          es: "Conforme a la Ley Aduanera (Art. 35–36), una importación es la entrada legal de mercancías extranjeras a territorio nacional. El importador asume responsabilidad sobre el valor declarado, la clasificación arancelaria, el pago de contribuciones y el cumplimiento de regulaciones no arancelarias. La operación no se considera cerrada hasta que el pedimento se paga y la mercancía sale del recinto fiscal.",
          zh: "根据墨西哥海关法（第35–36条），进口是将外国货物合法进入墨西哥领土。进口商对申报价值、归类、关税和非关税合规承担责任。操作直到报关单付清且货物从海关区放行后才视为完成。",
        },
      },
      {
        title: {
          en: "Who participates in the operation",
          es: "Quién participa en la operación",
          zh: "谁参与业务",
        },
        body: {
          en: "Five core roles: (1) Importer of record — legal owner of the obligation; (2) Customs broker (agente aduanal) — only they can sign the pedimento on behalf of the importer; (3) Shipper / supplier abroad; (4) Freight forwarder and carrier; (5) SAT / customs authority. Each generates documents that the operation must reconcile.",
          es: "Cinco roles centrales: (1) Importador — titular legal de la obligación; (2) Agente aduanal — el único habilitado para firmar el pedimento a nombre del importador; (3) Embarcador / proveedor en el extranjero; (4) Forwarder y transportista; (5) SAT / autoridad aduanera. Cada uno genera documentos que la operación debe reconciliar.",
          zh: "五个核心角色：(1) 进口商 — 义务的法定主体；(2) 海关代理 — 唯一可代表进口商签署报关单的人；(3) 国外发货人/供应商；(4) 货运代理与承运人；(5) SAT/海关当局。每个角色生成的文件都需要业务进行调和。",
        },
      },
      {
        title: {
          en: "The five phases of an import",
          es: "Las cinco fases de una importación",
          zh: "进口的五个阶段",
        },
        body: {
          en: "1) Pre-shipment: PO, supplier confirmation, HS code preview. 2) Shipping: BL/AWB issued, vessel/flight booking. 3) Pre-clearance: invoice, packing list, MVE submitted; broker prepares pedimento. 4) Customs clearance: SAT validates, broker pays duties, customs releases. 5) Post-clearance: 5-year document retention obligation, audit readiness.",
          es: "1) Pre-embarque: PO, confirmación del proveedor, vista previa de fracción. 2) Embarque: BL/Guía emitida, reserva de buque/vuelo. 3) Pre-despacho: factura, packing list, MVE; el agente prepara el pedimento. 4) Despacho: SAT valida, agente paga contribuciones, aduana libera. 5) Post-despacho: obligación de conservar documentación 5 años, listo para auditoría.",
          zh: "1) 装运前：采购单、供应商确认、HS编码预审。2) 装运：提单/空运单签发，订舱/订机。3) 清关前：发票、装箱单、MVE提交；代理准备报关单。4) 清关：SAT验证，代理付清税款，海关放行。5) 清关后：5年文件保留义务，随时接受审计。",
        },
      },
      {
        title: {
          en: "Why operations get blocked",
          es: "Por qué se atoran las operaciones",
          zh: "为什么业务会被卡住",
        },
        body: {
          en: "Most blockages fall into three buckets: (a) data discrepancies between invoice, BL, packing list and pedimento (value, weight, container); (b) missing documents — typically MVE, certificate of origin, or NOM compliance evidence; (c) tariff misclassification creating duty or restriction conflicts. Nextport's job is to surface these before SAT does.",
          es: "La mayoría de bloqueos caen en tres categorías: (a) discrepancias de datos entre factura, BL, packing list y pedimento (valor, peso, contenedor); (b) documentos faltantes — típicamente MVE, certificado de origen, o evidencia de cumplimiento NOM; (c) clasificación arancelaria incorrecta que genera conflictos de impuestos o restricciones. El trabajo de Nextport es detectar esto antes que el SAT.",
          zh: "大多数阻塞分为三类：(a) 发票、提单、装箱单和报关单之间的数据差异（价值、重量、集装箱）；(b) 缺少文件 — 通常是MVE、原产地证书或NOM合规证据；(c) 关税分类错误，产生税费或限制冲突。Nextport的工作是在SAT发现之前提前识别这些问题。",
        },
      },
    ],
    keyPoints: {
      en: [
        "Importer of record bears the legal liability — not the broker.",
        "An import operation has 5 phases, only one of which (clearance) is at the port.",
        "Document retention is mandatory for 5 years under Art. 67 of the Ley Aduanera.",
        "Most operational delays are data quality problems, not policy problems.",
      ],
      es: [
        "El importador asume la responsabilidad legal — no el agente aduanal.",
        "Una operación tiene 5 fases, solo una (despacho) ocurre en el puerto.",
        "Conservación documental obligatoria 5 años según Art. 67 Ley Aduanera.",
        "La mayoría de los atrasos operativos son problemas de calidad de datos, no de política.",
      ],
      zh: [
        "进口商承担法律责任 — 不是代理。",
        "进口业务有5个阶段，只有一个（清关）发生在港口。",
        "根据海关法第67条，文件必须保留5年。",
        "大多数运营延迟是数据质量问题，而非政策问题。",
      ],
    },
    references: [
      { label: "Ley Aduanera Art. 35-36 (definition of import)", source: "DOF / SAT" },
      { label: "Ley Aduanera Art. 67 (5-year retention)", source: "DOF / SAT" },
      { label: "RGCE 2026 §1.6 (operation lifecycle)", source: "SAT" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 02 · Core trade documents
  // ────────────────────────────────────────────────────────
  {
    id: "02",
    moduleNum: "02",
    level: "beginner",
    durationMin: 28,
    tags: ["Documents", "Pedimento", "MVE"],
    levelName: FUNDAMENTALS,
    levelTag: { en: "L1 · Fundamentals", es: "N1 · Fundamentos", zh: "L1 · 基础" },
    title: {
      en: "Core trade documents",
      es: "Documentos centrales de comercio exterior",
      zh: "核心贸易文件",
    },
    intro: {
      en: "Each document explained: what it is, what fields matter, and how it relates to the others.",
      es: "Cada documento explicado: qué es, qué campos importan y cómo se relaciona con los demás.",
      zh: "每份文件详细说明：它是什么、哪些字段重要、与其他文件的关系。",
    },
    sections: [
      {
        title: {
          en: "Pedimento (the master record)",
          es: "Pedimento (el documento maestro)",
          zh: "报关单（主文档）",
        },
        body: {
          en: "The pedimento is the formal customs declaration. Format A1 is the most common (definitive import). It is the source of truth for customs: HS code, customs value, duties paid, transport, brokerage data and partidas (line items). All other documents must reconcile against it.",
          es: "El pedimento es la declaración formal ante aduana. El formato A1 es el más común (importación definitiva). Es la fuente de verdad para aduana: fracción arancelaria, valor en aduana, contribuciones pagadas, transporte, datos del agente y partidas. Todos los demás documentos deben cuadrar contra él.",
          zh: "报关单是正式的海关申报文件。A1格式最常见（最终进口）。它是海关的真实来源：HS编码、海关价值、已付税款、运输、代理数据和分项。所有其他文件必须与之对账。",
        },
      },
      {
        title: {
          en: "Commercial invoice",
          es: "Factura comercial",
          zh: "商业发票",
        },
        body: {
          en: "Issued by the supplier abroad. Drives the customs value calculation. Required fields under Art. 36-A LA: full seller and buyer identification, complete merchandise description, unit price and total, country of origin, currency, INCOTERM, and date. A missing or vague description is the #1 cause of value flags.",
          es: "Emitida por el proveedor en el extranjero. Determina el cálculo del valor en aduana. Campos requeridos por Art. 36-A LA: identificación completa del vendedor y comprador, descripción completa de la mercancía, precio unitario y total, país de origen, divisa, INCOTERM y fecha. Una descripción vaga es la causa #1 de banderas de valor.",
          zh: "由国外供应商签发，决定海关价值的计算。海关法第36-A条要求字段：完整的卖方和买方信息、完整的货物描述、单价和总价、原产国、货币、INCOTERM和日期。描述模糊是价值警示的首要原因。",
        },
      },
      {
        title: {
          en: "Bill of Lading (BL) / Air Waybill (AWB)",
          es: "Conocimiento de embarque (BL) / Guía aérea (AWB)",
          zh: "提单 (BL) / 空运单 (AWB)",
        },
        body: {
          en: "Issued by the carrier. Proves the contract of carriage and title to the goods. Key fields: shipper, consignee, port of loading, port of discharge, vessel/flight, container number(s), seal, gross weight, CBM, freight terms. Container and seal numbers must match the packing list and the customs inspection record.",
          es: "Emitido por el transportista. Acredita el contrato de transporte y la titularidad de la mercancía. Campos clave: embarcador, consignatario, puerto de carga, puerto de descarga, buque/vuelo, contenedor(es), sello, peso bruto, CBM, términos de flete. El número de contenedor y sello debe coincidir con el packing list y el acta de reconocimiento aduanal.",
          zh: "由承运人签发。证明运输合同和货物所有权。关键字段：发货人、收货人、装货港、卸货港、船舶/航班、集装箱号、铅封号、毛重、CBM、运费条款。集装箱和铅封号必须与装箱单及海关检验记录一致。",
        },
      },
      {
        title: {
          en: "Packing list",
          es: "Lista de empaque",
          zh: "装箱单",
        },
        body: {
          en: "Detail of cartons, weights, dimensions and contents per package. Cross-validated against BL (total weight, count) and the customs physical inspection. Discrepancy between BL gross weight and packing list total is a frequent warn-level exception.",
          es: "Detalle de cartones, pesos, dimensiones y contenido por empaque. Validado contra el BL (peso total, cantidad) y el reconocimiento físico aduanero. La discrepancia entre peso bruto del BL y total del packing list es una excepción de advertencia frecuente.",
          zh: "纸箱、重量、尺寸和每包内容的明细。与提单（总重量、数量）和海关实物检验交叉验证。提单毛重与装箱单总重量不符是常见的警示级异常。",
        },
      },
      {
        title: {
          en: "Manifestación de Valor Electrónica (MVE)",
          es: "Manifestación de Valor Electrónica (MVE)",
          zh: "电子价值申报 (MVE)",
        },
        body: {
          en: "Mexican-specific document under Anexo 22 RGCE. The importer declares the customs value methodology used (transaction value is the default), incremental costs (freight, insurance, loading), and any relationship with the supplier. Required for every A1 import. Missing MVE = automatic block.",
          es: "Documento mexicano específico bajo el Anexo 22 RGCE. El importador declara la metodología del valor en aduana usada (valor de transacción por defecto), incrementables (flete, seguro, carga), y cualquier vinculación con el proveedor. Requerido para toda importación A1. MVE faltante = bloqueo automático.",
          zh: "墨西哥特有文件，依据 RGCE 附录22。进口商申报使用的海关价值方法（默认为成交价格）、增量成本（运费、保险、装卸费）以及与供应商的任何关联关系。每次A1进口都需要。缺少MVE = 自动阻断。",
        },
      },
      {
        title: {
          en: "CFDI (Mexican electronic tax invoice)",
          es: "CFDI (factura electrónica mexicana)",
          zh: "CFDI（墨西哥电子税务发票）",
        },
        body: {
          en: "When the importer pays Mexican-side fees (broker, freight forwarder, customs storage), each provider must issue a CFDI to deduct the expense and reconcile with the pedimento. The CFDI must reference the pedimento number to be deductible (Art. 29-A CFF).",
          es: "Cuando el importador paga gastos del lado mexicano (agente, forwarder, almacenaje), cada proveedor debe emitir un CFDI para deducir el gasto y conciliar con el pedimento. El CFDI debe referenciar el número de pedimento para ser deducible (Art. 29-A CFF).",
          zh: "当进口商支付墨西哥侧费用（代理、货运代理、仓储），每个供应商必须开具CFDI以扣除费用并与报关单对账。CFDI必须引用报关单号才能扣除（联邦税法第29-A条）。",
        },
      },
    ],
    keyPoints: {
      en: [
        "The pedimento is the master record — all other documents reconcile against it.",
        "MVE is mandatory and Mexico-specific — not optional.",
        "Container number and seal number link BL ↔ packing list ↔ inspection record.",
        "CFDI of broker fees must reference the pedimento number to be deductible.",
      ],
      es: [
        "El pedimento es el documento maestro — todos los demás cuadran contra él.",
        "El MVE es obligatorio y único de México — no es opcional.",
        "Contenedor y sello enlazan BL ↔ packing list ↔ reconocimiento.",
        "El CFDI de honorarios del agente debe referenciar el pedimento para ser deducible.",
      ],
      zh: [
        "报关单是主文档 — 所有其他文件都与之对账。",
        "MVE是墨西哥特有的强制要求 — 非可选。",
        "集装箱号和铅封号连接提单 ↔ 装箱单 ↔ 检验记录。",
        "代理费的CFDI必须引用报关单号才能扣除。",
      ],
    },
    references: [
      { label: "Ley Aduanera Art. 36-A (commercial invoice)", source: "DOF" },
      { label: "Anexo 22 RGCE 2026 (MVE)", source: "SAT" },
      { label: "Código Fiscal de la Federación Art. 29-A (CFDI)", source: "DOF" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 03 · Key fields every user should know
  // ────────────────────────────────────────────────────────
  {
    id: "03",
    moduleNum: "03",
    level: "beginner",
    durationMin: 35,
    tags: ["Documents", "Customs Value", "HS Code"],
    levelName: FUNDAMENTALS,
    levelTag: { en: "L1 · Fundamentals", es: "N1 · Fundamentos", zh: "L1 · 基础" },
    title: {
      en: "Key fields every user should know",
      es: "Campos clave que todo usuario debe conocer",
      zh: "每个用户都应了解的关键字段",
    },
    intro: {
      en: "The 20 fields the AI extracts most often — and what each one is used for in compliance review.",
      es: "Los 20 campos que la IA extrae con más frecuencia — y para qué sirve cada uno en revisión de cumplimiento.",
      zh: "AI最常提取的20个字段 — 以及每个字段在合规审查中的用途。",
    },
    sections: [
      {
        title: { en: "Importer identity fields", es: "Campos de identidad del importador", zh: "进口商身份字段" },
        body: {
          en: "RFC, full corporate name, fiscal address, customs sector. RFC must match the importer registered with SAT in the Padrón de Importadores. Operating outside the padrón is grounds for confiscation under Art. 184 LA.",
          es: "RFC, razón social completa, domicilio fiscal, sector aduanero. El RFC debe coincidir con el importador registrado en el Padrón de Importadores del SAT. Operar fuera del padrón es causa de embargo precautorio bajo el Art. 184 LA.",
          zh: "RFC（税号）、完整公司名称、税务地址、海关行业。RFC必须与SAT进口商登记册中注册的进口商一致。在登记册外操作根据海关法第184条可被扣押。",
        },
      },
      {
        title: { en: "Customs value & incrementables", es: "Valor en aduana e incrementables", zh: "海关价值和增量" },
        body: {
          en: "Customs value = transaction value + freight + insurance + loading. This is the base for IVA and IGI. The single most-watched field — value discrepancy between invoice and pedimento is the #1 trigger for compliance flags. Currency conversion uses the Banco de México rate on the day prior to validation.",
          es: "Valor en aduana = valor de transacción + flete + seguro + carga. Es la base para IVA e IGI. El campo más vigilado — la discrepancia de valor entre factura y pedimento es el trigger #1 de banderas de cumplimiento. La conversión usa el tipo de cambio Banxico del día anterior a la validación.",
          zh: "海关价值 = 成交价格 + 运费 + 保险 + 装卸费。这是IVA和IGI（进口关税）的基础。最受关注的单一字段 — 发票与报关单之间的价值差异是合规警示的首要触发因素。汇率换算使用墨西哥银行验证前一日的汇率。",
        },
      },
      {
        title: { en: "HS code (fracción arancelaria + NICO)", es: "Fracción arancelaria + NICO", zh: "HS编码（关税分类 + NICO）" },
        body: {
          en: "Mexico uses 10-digit codes: 8 digits from the Harmonized System + 2-digit NICO (Número de Identificación Comercial). The full code determines duty rate, NOM applicability, and trade agreement preference. Misclassification by even one NICO digit can change duty by 10-20%.",
          es: "México usa códigos de 10 dígitos: 8 dígitos del Sistema Armonizado + 2 dígitos del NICO (Número de Identificación Comercial). El código completo determina la tasa arancelaria, aplicabilidad de NOM y preferencia bajo tratados. Una mala clasificación de un solo dígito NICO puede cambiar el impuesto 10-20%.",
          zh: "墨西哥使用10位编码：协调制度的8位 + 2位NICO（商业识别号）。完整编码决定关税税率、NOM适用性和贸易协定优惠。即使一个NICO数字错误也可能使关税变动10-20%。",
        },
      },
      {
        title: { en: "Origin and shipping data", es: "Origen y datos de embarque", zh: "原产地和运输数据" },
        body: {
          en: "Country of origin (manufacturing, not shipping), port of loading, port of discharge, vessel name and voyage number, container and seal numbers, ETA. Origin determines trade agreement eligibility (T-MEC, TLC, etc.) and certain anti-dumping duties. China-origin goods may face surcharges.",
          es: "País de origen (de manufactura, no de embarque), puerto de carga, puerto de descarga, nombre del buque y número de viaje, contenedor y sello, ETA. El origen determina elegibilidad a tratados (T-MEC, TLC) y ciertas cuotas anti-dumping. Mercancía origen China puede tener sobrecargos.",
          zh: "原产国（制造地，非装运地）、装货港、卸货港、船名和航次、集装箱号和铅封号、ETA。原产地决定贸易协定资格（T-MEC、自贸协定）和某些反倾销税。中国原产货物可能有附加费。",
        },
      },
      {
        title: { en: "INCOTERM and freight breakdown", es: "INCOTERM y desglose de flete", zh: "INCOTERM和运费明细" },
        body: {
          en: "FOB, CIF, EXW, DDP, etc. determine who pays freight, insurance and risk transfer point. Wrong INCOTERM creates incorrect customs value (freight should be added under FOB; should not be added under CIF). Freight breakdown must match invoice and forwarder CFDI.",
          es: "FOB, CIF, EXW, DDP, etc. determinan quién paga flete, seguro y dónde transfiere el riesgo. Un INCOTERM equivocado produce valor en aduana incorrecto (el flete se suma bajo FOB; no se suma bajo CIF). El desglose de flete debe coincidir con la factura y el CFDI del forwarder.",
          zh: "FOB、CIF、EXW、DDP等决定谁支付运费、保险和风险转移点。INCOTERM错误会导致海关价值不正确（FOB下应加运费；CIF下不应加）。运费明细必须与发票和货代CFDI一致。",
        },
      },
    ],
    keyPoints: {
      en: [
        "RFC must match the Padrón de Importadores or the goods can be seized.",
        "Customs value uses Banxico FX from the day BEFORE validation — not the day of.",
        "HS code = 8 HS digits + 2 NICO digits = 10 digits total in Mexico.",
        "INCOTERM dictates whether freight is incrementable to customs value.",
      ],
      es: [
        "El RFC debe coincidir con el Padrón de Importadores o se puede embargar la mercancía.",
        "El valor en aduana usa el tipo de cambio Banxico del día ANTERIOR a la validación.",
        "Fracción arancelaria = 8 dígitos HS + 2 dígitos NICO = 10 dígitos en México.",
        "El INCOTERM determina si el flete es incrementable al valor en aduana.",
      ],
      zh: [
        "RFC必须与进口商登记册一致，否则货物可能被扣押。",
        "海关价值使用验证前一日的墨西哥银行汇率 — 不是当日。",
        "HS编码 = 8位HS + 2位NICO = 墨西哥共10位。",
        "INCOTERM决定运费是否计入海关价值。",
      ],
    },
    references: [
      { label: "Ley Aduanera Art. 64-78 (customs value)", source: "DOF" },
      { label: "TIGIE — Tarifa LIGIE 2025", source: "SAT" },
      { label: "INCOTERMS 2020 — Cámara de Comercio Internacional (ICC)", source: "ICC" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 04 · Document classification
  // ────────────────────────────────────────────────────────
  {
    id: "04",
    moduleNum: "04",
    level: "intermediate",
    durationMin: 18,
    tags: ["Documents", "AI Governance"],
    levelName: DOC_INTEL,
    levelTag: { en: "L2 · Document intelligence", es: "N2 · Inteligencia documental", zh: "L2 · 文件智能" },
    title: {
      en: "Document classification",
      es: "Clasificación de documentos",
      zh: "文件分类",
    },
    intro: {
      en: "How the AI knows a PDF is a Commercial Invoice and not a Packing List — and what to do when it gets it wrong.",
      es: "Cómo la IA sabe que un PDF es factura y no packing list — y qué hacer cuando se equivoca.",
      zh: "AI如何识别PDF是商业发票而非装箱单 — 以及AI误判时该怎么做。",
    },
    sections: [
      {
        title: { en: "Signals the classifier uses", es: "Señales que usa el clasificador", zh: "分类器使用的信号" },
        body: {
          en: "The classifier reads three layers: (1) layout — header positions, table structure, official seals; (2) keywords — 'pedimento', 'manifestación', 'bill of lading', 'CFDI Series'; (3) numeric patterns — pedimento format ##-##-####-#######, RFC pattern, container number pattern. All three combine into a confidence score.",
          es: "El clasificador lee tres capas: (1) layout — posiciones de encabezado, estructura de tabla, sellos; (2) palabras clave — 'pedimento', 'manifestación', 'bill of lading', 'CFDI Serie'; (3) patrones numéricos — formato pedimento ##-##-####-#######, patrón RFC, patrón de contenedor. Las tres se combinan en un score de confianza.",
          zh: "分类器读取三层：(1) 版面 — 标题位置、表格结构、官方印章；(2) 关键词 — “pedimento”、“manifestación”、“bill of lading”、“CFDI Serie”；(3) 数字模式 — 报关单格式 ##-##-####-#######、RFC模式、集装箱号模式。三者组合产生置信度分数。",
        },
      },
      {
        title: { en: "Confidence thresholds and human review", es: "Umbrales de confianza y revisión humana", zh: "置信度阈值和人工审核" },
        body: {
          en: "≥ 99%: auto-classified, no human needed. 95-99%: classified, flagged for spot review. 85-95%: requires human confirmation. < 85%: rejected, sent to manual triage. The 85% threshold is a SOC 2 governance requirement — automation can never act on low-confidence classifications.",
          es: "≥ 99%: auto-clasificado, sin intervención humana. 95-99%: clasificado, marcado para revisión muestreal. 85-95%: requiere confirmación humana. < 85%: rechazado, va a triage manual. El umbral del 85% es un requisito de gobernanza SOC 2 — la automatización nunca actúa con baja confianza.",
          zh: "≥99%：自动分类，无需人工。95-99%：已分类，标记抽查。85-95%：需人工确认。<85%：拒绝，送往人工分类。85%阈值是SOC 2治理要求 — 自动化绝不在低置信度下操作。",
        },
      },
      {
        title: { en: "When the AI is wrong", es: "Cuando la IA se equivoca", zh: "AI出错时" },
        body: {
          en: "Most common errors: (a) MVE confused with pedimento (both have similar headers), (b) CFDI confused with commercial invoice (both are 'invoice'-shaped), (c) certificate of origin missed because it's a free-form letter. When you reclassify manually, the correction is fed back as a training signal — repeated corrections improve accuracy at the supplier level.",
          es: "Errores comunes: (a) MVE confundido con pedimento (encabezados parecidos), (b) CFDI confundido con factura comercial (ambos parecen 'invoice'), (c) certificado de origen no detectado por ser carta libre. Al reclasificar manualmente, la corrección se retroalimenta como señal de entrenamiento — correcciones repetidas mejoran precisión por proveedor.",
          zh: "常见错误：(a) MVE与报关单混淆（标题相似），(b) CFDI与商业发票混淆（两者都像“发票”），(c) 漏识别原产地证书因为是自由格式信函。手动重新分类时，更正会反馈作为训练信号 — 重复更正可在供应商层面提升准确率。",
        },
      },
    ],
    keyPoints: {
      en: [
        "Classification combines layout + keywords + numeric patterns.",
        "Below 85% confidence, the system never auto-acts.",
        "Manual corrections feed back into supplier-specific accuracy.",
        "MVE vs pedimento and CFDI vs invoice are the most common confusions.",
      ],
      es: [
        "La clasificación combina layout + palabras clave + patrones numéricos.",
        "Bajo 85% de confianza el sistema nunca actúa solo.",
        "Las correcciones manuales mejoran precisión por proveedor.",
        "MVE vs pedimento y CFDI vs factura son las confusiones más frecuentes.",
      ],
      zh: [
        "分类结合版面 + 关键词 + 数字模式。",
        "置信度低于85%时系统从不自动操作。",
        "人工更正可提升供应商层面的准确性。",
        "MVE与报关单、CFDI与发票是最常见的混淆。",
      ],
    },
    references: [
      { label: "Internal governance: AI confidence policy v3.2", source: "Nextport" },
      { label: "SOC 2 CC7.2 — System Operations", source: "AICPA" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 05 · Field extraction
  // ────────────────────────────────────────────────────────
  {
    id: "05",
    moduleNum: "05",
    level: "intermediate",
    durationMin: 22,
    tags: ["Documents", "AI Governance"],
    levelName: DOC_INTEL,
    levelTag: { en: "L2 · Document intelligence", es: "N2 · Inteligencia documental", zh: "L2 · 文件智能" },
    title: {
      en: "Field extraction",
      es: "Extracción de campos",
      zh: "字段提取",
    },
    intro: {
      en: "Turning a scanned PDF into structured fields with full source lineage back to the original document.",
      es: "Convirtiendo un PDF escaneado en campos estructurados con trazabilidad completa al documento original.",
      zh: "将扫描PDF转化为结构化字段，并完整追溯回原始文件。",
    },
    sections: [
      {
        title: { en: "Source lineage requirement", es: "Requisito de trazabilidad", zh: "来源追溯要求" },
        body: {
          en: "Every extracted field carries a pointer back to: document ID, page number, bounding box coordinates, and the exact OCR'd text snippet. This is non-negotiable for SAT audit defense. If you cannot show 'this $184,250 came from line 14 of invoice INV-LMT-44218', the value is inadmissible.",
          es: "Cada campo extraído lleva apuntador hacia: ID del documento, página, coordenadas del bounding box, y el texto OCR exacto. Esto es no-negociable para defensa ante auditoría SAT. Si no puedes mostrar 'este $184,250 vino de la línea 14 de la factura INV-LMT-44218', el valor es inadmisible.",
          zh: "每个提取字段都带有指向：文件ID、页码、边界框坐标和OCR出的精确文本片段。这对SAT审计辩护不可妥协。如果无法证明“这184,250美元来自发票INV-LMT-44218第14行”，该值不可受理。",
        },
      },
      {
        title: { en: "Numeric vs text extraction", es: "Extracción numérica vs texto", zh: "数字与文本提取" },
        body: {
          en: "Numbers (values, quantities, weights) use a separate validator pass: locale parsing (1,234.56 vs 1.234,56), currency detection, and reasonableness checks (a 50,000 kg shipment in a 20-foot container is wrong). Text (descriptions, addresses) is preserved verbatim — never normalized — to maintain audit fidelity.",
          es: "Los números (valores, cantidades, pesos) pasan por un validador adicional: parsing por locale (1,234.56 vs 1.234,56), detección de divisa, y verificaciones de razonabilidad (un embarque de 50,000 kg en un contenedor de 20 pies está mal). El texto (descripciones, domicilios) se conserva literal — nunca se normaliza — para mantener fidelidad de auditoría.",
          zh: "数字（金额、数量、重量）经过单独的验证器：地区解析（1,234.56 vs 1.234,56）、货币检测和合理性检查（20英尺集装箱装50,000公斤是错的）。文本（描述、地址）保持逐字提取 — 从不规范化 — 以保持审计真实性。",
        },
      },
      {
        title: { en: "Confidence per field, not per document", es: "Confianza por campo, no por documento", zh: "按字段置信度，不按文件" },
        body: {
          en: "A document at 98% overall confidence can still have a 60%-confidence field (typically the customs value if the number is partly obscured by a stamp). The system flags low-confidence fields individually so the reviewer focuses only on the weak spots, not the whole document.",
          es: "Un documento con 98% de confianza global puede tener un campo al 60% (típicamente el valor en aduana si está parcialmente cubierto por un sello). El sistema marca campos de baja confianza individualmente para que el revisor enfoque solo los puntos débiles, no el documento completo.",
          zh: "整体置信度98%的文件仍可能有60%置信度的字段（通常是被印章部分遮挡的海关价值）。系统单独标记低置信度字段，让审核人只关注薄弱点，而非整个文件。",
        },
      },
    ],
    keyPoints: {
      en: [
        "Every field must trace back to document + page + bounding box.",
        "Text is preserved verbatim — numbers are validated and normalized.",
        "Confidence is per-field, not per-document.",
        "Audit defense fails without source lineage.",
      ],
      es: [
        "Cada campo debe trazar a documento + página + bounding box.",
        "El texto se conserva literal — los números se validan y normalizan.",
        "La confianza es por campo, no por documento.",
        "La defensa ante auditoría falla sin trazabilidad.",
      ],
      zh: [
        "每个字段必须追溯到文件 + 页面 + 边界框。",
        "文本保持原样 — 数字经过验证和规范化。",
        "置信度按字段计算，不按文件。",
        "没有来源追溯，审计辩护将失败。",
      ],
    },
    references: [
      { label: "Ley Aduanera Art. 144 (audit & documentation)", source: "DOF" },
      { label: "Anexo 24 RGCE (electronic records)", source: "SAT" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 06 · Cross-validation & exceptions
  // ────────────────────────────────────────────────────────
  {
    id: "06",
    moduleNum: "06",
    level: "intermediate",
    durationMin: 30,
    tags: ["Exceptions", "Cross-validation"],
    levelName: DOC_INTEL,
    levelTag: { en: "L2 · Document intelligence", es: "N2 · Inteligencia documental", zh: "L2 · 文件智能" },
    title: {
      en: "Cross-validation & exceptions",
      es: "Validación cruzada y excepciones",
      zh: "交叉验证与异常",
    },
    intro: {
      en: "How the AI checks fields across multiple documents — and generates exceptions when they don't match.",
      es: "Cómo la IA verifica campos entre múltiples documentos — y genera excepciones cuando no coinciden.",
      zh: "AI如何在多个文件之间核查字段 — 并在不一致时生成异常。",
    },
    sections: [
      {
        title: { en: "The 12 standard cross-checks", es: "Las 12 verificaciones cruzadas estándar", zh: "12项标准交叉检查" },
        body: {
          en: "Customs value: invoice total = pedimento valor en aduana (after incrementables). Weight: BL gross = packing list total + tolerance ±2%. Container: BL container # = inspection record container #. INCOTERM: invoice INCOTERM = pedimento INCOTERM. Origin: invoice country = pedimento country = certificate of origin. RFC: invoice consignee RFC = pedimento importer RFC. Plus 6 more covering dates, NOM compliance, supplier identification and currency.",
          es: "Valor en aduana: total de factura = pedimento valor en aduana (después de incrementables). Peso: bruto BL = total packing list ± 2%. Contenedor: # BL = # acta de reconocimiento. INCOTERM: factura = pedimento. Origen: factura = pedimento = certificado de origen. RFC: consignatario factura = importador pedimento. Más 6 sobre fechas, cumplimiento NOM, identificación del proveedor y divisa.",
          zh: "海关价值：发票总额 = 报关单海关价值（含增量）。重量：提单毛重 = 装箱单总重 ±2%。集装箱：提单集装箱号 = 检验记录号。INCOTERM：发票 = 报关单。原产地：发票 = 报关单 = 原产地证书。RFC：发票收货人RFC = 报关单进口商RFC。另外6项涵盖日期、NOM合规、供应商识别和货币。",
        },
      },
      {
        title: { en: "Severity levels", es: "Niveles de severidad", zh: "严重性级别" },
        body: {
          en: "Risk (red): blocking — customs would reject. Examples: value mismatch > 3%, missing MVE, wrong RFC. Warn (yellow): operational risk but not blocking. Examples: weight mismatch within 5%, broker fee CFDI missing. Info (blue): informational, no action required. Risk-level exceptions cannot pass to ERP handoff until resolved.",
          es: "Riesgo (rojo): bloqueante — aduana rechazaría. Ejemplos: discrepancia de valor > 3%, MVE faltante, RFC incorrecto. Advertencia (amarillo): riesgo operativo no bloqueante. Ejemplos: discrepancia de peso dentro del 5%, CFDI del agente faltante. Info (azul): informativo. Excepciones de riesgo no pasan al ERP hasta resolverse.",
          zh: "风险（红色）：阻断 — 海关会拒绝。例如：价值差异>3%、缺少MVE、RFC错误。警告（黄色）：运营风险但不阻断。例如：重量差异在5%以内、缺少代理CFDI。信息（蓝色）：仅供参考。风险级异常解决前不能进入ERP。",
        },
      },
      {
        title: { en: "Resolution patterns", es: "Patrones de resolución", zh: "解决模式" },
        body: {
          en: "Three resolution paths: (1) Correct the document — request the supplier or broker to reissue. (2) Document the discrepancy — sometimes a 2% value gap is from rounding in currency conversion; record the rationale. (3) Override with manager approval — exceptional, requires sign-off by a manager-level user, audit-logged. Never silently delete an exception.",
          es: "Tres rutas de resolución: (1) Corregir el documento — pedir al proveedor o agente reemitir. (2) Documentar la discrepancia — a veces un 2% de gap viene de redondeo de tipo de cambio; se registra la razón. (3) Override con aprobación gerencial — excepcional, requiere firma de un manager, queda en bitácora. Nunca borrar una excepción en silencio.",
          zh: "三种解决路径：(1) 修正文件 — 请供应商或代理重新出具。(2) 记录差异 — 有时2%的价值差来自汇率舍入；记录理由。(3) 经理批准覆盖 — 例外情况，需经理签字，记录在审计日志。绝不静默删除异常。",
        },
      },
    ],
    keyPoints: {
      en: [
        "12 standard cross-checks run on every operation automatically.",
        "Risk-level exceptions block ERP handoff until resolved.",
        "Resolution = correct, document, or override — never silent delete.",
        "All resolutions are audit-logged including the actor.",
      ],
      es: [
        "12 verificaciones cruzadas automáticas en cada operación.",
        "Excepciones de riesgo bloquean el ERP hasta resolverse.",
        "Resolución = corregir, documentar u override — nunca borrar.",
        "Todas las resoluciones quedan en bitácora con el responsable.",
      ],
      zh: [
        "每次业务自动运行12项标准交叉检查。",
        "风险级异常阻止ERP移交，直到解决。",
        "解决 = 修正、记录或覆盖 — 不可静默删除。",
        "所有解决方案都记录在审计日志中，包括操作人。",
      ],
    },
    references: [
      { label: "Ley Aduanera Art. 78-A (value adjustment)", source: "DOF" },
      { label: "RGCE 2026 §4.3 (cross-doc validation criteria)", source: "SAT" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 07 · Pedimento A1 deep dive
  // ────────────────────────────────────────────────────────
  {
    id: "07",
    moduleNum: "07",
    level: "intermediate",
    durationMin: 40,
    tags: ["Pedimento", "Mexico compliance"],
    levelName: MX_COMPLIANCE,
    levelTag: { en: "L3 · Mexico compliance", es: "N3 · Cumplimiento México", zh: "L3 · 墨西哥合规" },
    title: {
      en: "Pedimento A1 deep dive",
      es: "Pedimento A1 a fondo",
      zh: "报关单A1深度解析",
    },
    intro: {
      en: "Every section of the Mexican pedimento de importación: what each field means and how to spot errors.",
      es: "Cada sección del pedimento mexicano: qué significa cada campo y cómo detectar errores.",
      zh: "墨西哥进口报关单的每个部分：每个字段的含义以及如何发现错误。",
    },
    sections: [
      {
        title: { en: "Pedimento number anatomy", es: "Anatomía del número de pedimento", zh: "报关单号结构" },
        body: {
          en: "Format ##-##-####-#######. Position 1-2: year (last two digits). 3-4: aduana section (e.g. 47 = AICM, 80 = Manzanillo). 5-8: broker patente (license number). 9-15: sequential. A broker patente number you don't recognize means you should question who signed for you.",
          es: "Formato ##-##-####-#######. Posición 1-2: año (últimos dos dígitos). 3-4: aduana / sección (47 = AICM, 80 = Manzanillo, etc.). 5-8: patente del agente. 9-15: secuencial. Un número de patente que no reconoces es razón para cuestionar quién firmó por ti.",
          zh: "格式 ##-##-####-#######。位置1-2：年份（后两位）。3-4：海关/科段（47=AICM，80=Manzanillo等）。5-8：代理执照号。9-15：序列号。不认识的代理执照号是需要质疑谁代表你签字的理由。",
        },
      },
      {
        title: { en: "Datos generales del pedimento", es: "Datos generales del pedimento", zh: "报关单一般数据" },
        body: {
          en: "Block 1: importer (RFC, name, address, sector), broker (patente, name), tipo de operación (A1 for definitive import), regime (importación), entry date, customs section, transport mode. Errors here trigger SAT system rejection at the validation step.",
          es: "Bloque 1: importador (RFC, razón social, domicilio, sector), agente (patente, nombre), tipo de operación (A1 importación definitiva), régimen, fecha de entrada, sección aduanera, medio de transporte. Errores aquí provocan rechazo del SAT en la validación.",
          zh: "区块1：进口商（RFC、公司名、地址、行业）、代理（执照号、名称）、操作类型（A1=最终进口）、制度、入境日期、海关科段、运输方式。此处错误会在SAT验证步骤触发系统拒绝。",
        },
      },
      {
        title: { en: "Partidas (line items)", es: "Partidas", zh: "分项 (Partidas)" },
        body: {
          en: "Each partida is one HS code + one merchandise description + qty + unit value + customs value. Multiple partidas per pedimento are common. Each must have: fracción + NICO, UMC (unit of commercial measure), UMT (unit of tariff measure), country of origin, country of acquisition. Most extraction errors live in the partida block because tables are dense.",
          es: "Cada partida es una fracción + descripción + cantidad + valor unitario + valor aduana. Es común tener múltiples partidas por pedimento. Cada una con: fracción + NICO, UMC (unidad de medida comercial), UMT (unidad tarifaria), país de origen, país de venta. La mayoría de los errores de extracción viven en partidas por la densidad de las tablas.",
          zh: "每个分项 = 一个HS编码 + 一个货物描述 + 数量 + 单价 + 海关价值。每个报关单有多个分项是常见的。每个必须包含：HS编码 + NICO、UMC（商业计量单位）、UMT（关税计量单位）、原产国、采购国。大多数提取错误存在于分项区块，因为表格非常密集。",
        },
      },
      {
        title: { en: "Liquidación (taxes & duties)", es: "Liquidación (impuestos y contribuciones)", zh: "结算（税款和费用）" },
        body: {
          en: "IGI (general import duty, varies by HS), IVA (16% on customs value + IGI), DTA (derecho de trámite aduanero, ~0.008% on customs value), PRV (prevalidación), and any compensatory duties. The pedimento shows a 'forma de pago' code; the broker has 5 business days from validation to pay or the operation expires (RGCE §1.4.6).",
          es: "IGI (impuesto general de importación, varía por fracción), IVA (16% sobre valor aduana + IGI), DTA (~0.008% sobre valor aduana), PRV (prevalidación), y cualquier cuota compensatoria. El pedimento muestra una 'forma de pago'; el agente tiene 5 días hábiles desde la validación para pagar o caduca (RGCE §1.4.6).",
          zh: "IGI（一般进口税，因HS而异）、IVA（海关价值+IGI的16%）、DTA（~0.008%海关价值）、PRV（预验证费）和任何补偿税。报关单显示“付款方式”代码；代理从验证起有5个工作日付款，否则失效（RGCE §1.4.6）。",
        },
      },
    ],
    keyPoints: {
      en: [
        "Pedimento number encodes year, customs section, broker patente, and sequence.",
        "Most extraction errors live in the partida (line item) block.",
        "IGI rate depends on HS code; IVA is 16% on customs value + IGI.",
        "Broker has 5 business days from validation to pay or the pedimento expires.",
      ],
      es: [
        "El número codifica año, sección aduanera, patente del agente y secuencial.",
        "La mayoría de errores de extracción están en las partidas.",
        "IGI depende de la fracción; IVA es 16% sobre valor aduana + IGI.",
        "El agente tiene 5 días hábiles para pagar o el pedimento caduca.",
      ],
      zh: [
        "报关单号编码年份、海关科段、代理执照号和序列号。",
        "大多数提取错误存在于分项区块。",
        "IGI税率取决于HS编码；IVA为海关价值+IGI的16%。",
        "代理有5个工作日付款，否则报关单失效。",
      ],
    },
    references: [
      { label: "Anexo 22 RGCE — Pedimento layout", source: "SAT" },
      { label: "RGCE 2026 §1.4 (payment deadlines)", source: "SAT" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 08 · SAT & VUCEM integration
  // ────────────────────────────────────────────────────────
  {
    id: "08",
    moduleNum: "08",
    level: "intermediate",
    durationMin: 25,
    tags: ["SAT", "VUCEM", "Mexico compliance"],
    levelName: MX_COMPLIANCE,
    levelTag: { en: "L3 · Mexico compliance", es: "N3 · Cumplimiento México", zh: "L3 · 墨西哥合规" },
    title: {
      en: "SAT & VUCEM integration",
      es: "Integración SAT y VUCEM",
      zh: "SAT 与 VUCEM 集成",
    },
    intro: {
      en: "How Nextport AI connects to SAT and VUCEM to validate pedimentos and detect CFDI discrepancies.",
      es: "Cómo Nextport AI se conecta al SAT y VUCEM para validar pedimentos y detectar discrepancias CFDI.",
      zh: "Nextport AI 如何与 SAT 和 VUCEM 连接以验证报关单并检测 CFDI 差异。",
    },
    sections: [
      {
        title: { en: "VUCEM — what it is", es: "VUCEM — qué es", zh: "VUCEM — 它是什么" },
        body: {
          en: "Ventanilla Única de Comercio Exterior Mexicano — the single window for all foreign-trade transactions with the Mexican government. Operates via FIEL (digital signature). Nextport connects to VUCEM web services using your FIEL on your behalf to fetch pedimento status, MVE confirmations, and permission tracking.",
          es: "Ventanilla Única de Comercio Exterior Mexicano — el portal único para toda transacción de comercio exterior con el gobierno mexicano. Opera con FIEL (firma electrónica avanzada). Nextport se conecta a los servicios web de VUCEM usando tu FIEL para consultar estado de pedimentos, confirmaciones MVE y seguimiento de permisos.",
          zh: "墨西哥外贸单一窗口 — 与墨西哥政府所有外贸交易的统一门户。通过 FIEL（数字签名）运作。Nextport使用你的FIEL代表你连接VUCEM网络服务，获取报关单状态、MVE确认和许可证跟踪。",
        },
      },
      {
        title: { en: "SAT CFDI validation", es: "Validación CFDI con SAT", zh: "SAT CFDI 验证" },
        body: {
          en: "Every CFDI uploaded gets verified against SAT's real-time webservice: (1) does the UUID exist?; (2) is the issuer authorized?; (3) has it been cancelled?; (4) does the total match what was reported? A cancelled CFDI in your operation = SAT will reject the deduction.",
          es: "Cada CFDI subido se verifica contra el webservice del SAT en tiempo real: (1) ¿existe el UUID?; (2) ¿el emisor está autorizado?; (3) ¿está cancelado?; (4) ¿el total coincide con lo reportado? Un CFDI cancelado en tu operación = SAT rechazará la deducción.",
          zh: "每个上传的CFDI都会与SAT的实时网络服务验证：(1) UUID是否存在？(2) 开票方是否授权？(3) 是否已取消？(4) 总额是否与报告一致？操作中有已取消的CFDI = SAT将拒绝扣除。",
        },
      },
      {
        title: { en: "FIEL security and delegation", es: "Seguridad FIEL y delegación", zh: "FIEL安全与委托" },
        body: {
          en: "Your FIEL is the most sensitive credential in your business — equivalent to a handwritten signature plus passport. Nextport stores FIEL using AES-256 envelope encryption with per-tenant keys; FIEL is used only on request, never cached longer than the session, and every use creates an audit event with timestamp and intent.",
          es: "Tu FIEL es la credencial más sensible de tu negocio — equivale a firma autógrafa más pasaporte. Nextport almacena FIEL con encriptación AES-256 por sobre con llaves por tenant; se usa solo bajo solicitud, jamás se cachea más allá de la sesión, y cada uso genera evento de auditoría con timestamp e intención.",
          zh: "FIEL是你业务中最敏感的凭证 — 等同于亲笔签名加护照。Nextport使用AES-256信封加密配合按租户的密钥存储FIEL；仅在请求时使用，绝不在会话之外缓存，每次使用都生成带时间戳和意图的审计事件。",
        },
      },
    ],
    keyPoints: {
      en: [
        "VUCEM is the single window for all government trade transactions.",
        "FIEL is treated as the most sensitive credential — encrypted at rest, never cached.",
        "CFDI validation against SAT prevents deduction failures.",
        "Every FIEL use generates an audit event.",
      ],
      es: [
        "VUCEM es la ventanilla única para todo trámite gubernamental de comercio.",
        "La FIEL es la credencial más sensible — encriptada en reposo, nunca cacheada.",
        "Validación CFDI con SAT previene fallas de deducción.",
        "Cada uso de FIEL genera evento de auditoría.",
      ],
      zh: [
        "VUCEM 是所有政府贸易交易的单一窗口。",
        "FIEL被视为最敏感凭证 — 静态加密，永不缓存。",
        "对SAT的CFDI验证防止扣除失败。",
        "每次使用FIEL都生成审计事件。",
      ],
    },
    references: [
      { label: "Manual de Operación VUCEM 2026", source: "SHCP" },
      { label: "Anexo 24 RGCE (CFDI integration)", source: "SAT" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 09 · INCOTERMS in practice
  // ────────────────────────────────────────────────────────
  {
    id: "09",
    moduleNum: "09",
    level: "intermediate",
    durationMin: 20,
    tags: ["INCOTERMS", "Customs Value"],
    levelName: INTL_TRADE,
    levelTag: { en: "L4 · International trade", es: "N4 · Comercio internacional", zh: "L4 · 国际贸易" },
    title: {
      en: "INCOTERMS in practice",
      es: "INCOTERMS en la práctica",
      zh: "INCOTERMS 实务",
    },
    intro: {
      en: "How INCOTERMS affect customs value, who pays freight and insurance, and what to check on the invoice.",
      es: "Cómo los INCOTERMS afectan el valor en aduana, quién paga flete y seguro, y qué verificar en la factura.",
      zh: "INCOTERMS如何影响海关价值，谁支付运费和保险，以及发票上应检查什么。",
    },
    sections: [
      {
        title: { en: "The 11 INCOTERMS 2020", es: "Los 11 INCOTERMS 2020", zh: "11个INCOTERMS 2020" },
        body: {
          en: "Group E (departure): EXW. Group F (main carriage unpaid): FCA, FAS, FOB. Group C (main carriage paid): CFR, CIF, CPT, CIP. Group D (delivery at destination): DAP, DPU, DDP. Each defines: who arranges transport, who pays freight, who pays insurance, where risk transfers from seller to buyer.",
          es: "Grupo E (salida): EXW. Grupo F (transporte principal no pagado): FCA, FAS, FOB. Grupo C (transporte principal pagado): CFR, CIF, CPT, CIP. Grupo D (entrega en destino): DAP, DPU, DDP. Cada uno define: quién arregla transporte, quién paga flete, quién paga seguro, dónde se transfiere el riesgo.",
          zh: "E组（出厂）：EXW。F组（主运输未付）：FCA、FAS、FOB。C组（主运输已付）：CFR、CIF、CPT、CIP。D组（目的地交货）：DAP、DPU、DDP。每个定义：谁安排运输、谁付运费、谁付保险、风险在何处从卖方转移到买方。",
        },
      },
      {
        title: { en: "Impact on customs value", es: "Impacto en el valor en aduana", zh: "对海关价值的影响" },
        body: {
          en: "Customs value must include freight to the Mexican border. So under EXW or FOB, freight is added (incrementable). Under CIF or DDP, freight is already in the invoice price and is not added again — adding it would double-count and inflate IVA/IGI. Wrong handling here is the #1 cause of unintentional over-payment of duties.",
          es: "El valor en aduana debe incluir el flete hasta la frontera mexicana. Bajo EXW o FOB, el flete se suma (incrementable). Bajo CIF o DDP, el flete ya está en el precio de factura y no se suma de nuevo — sumarlo sería contar doble e inflar IVA/IGI. Manejarlo mal es la causa #1 de sobre-pago no intencional de impuestos.",
          zh: "海关价值必须包括到墨西哥边境的运费。在EXW或FOB下，运费需加入（增量）。在CIF或DDP下，运费已在发票价格中，不再加一次 — 加上会重复计算并夸大IVA/IGI。处理错误是无意中多缴关税的首要原因。",
        },
      },
      {
        title: { en: "Common mistakes", es: "Errores frecuentes", zh: "常见错误" },
        body: {
          en: "(a) Invoice says FOB but freight CFDI is also added → over-declaration. (b) Invoice says DDP but the broker added DTA → DDP includes Mexican-side duties but not DTA/PRV; check the precise definition. (c) FCA used for sea freight — strictly speaking FCA is for any mode but FOB is more common in maritime; using FCA in maritime invites questions.",
          es: "(a) Factura FOB pero también se suma flete CFDI → sobre-declaración. (b) Factura DDP pero el agente sumó DTA → DDP cubre impuestos del lado mexicano pero no DTA/PRV; verifica la definición precisa. (c) FCA usado en flete marítimo — técnicamente FCA aplica a cualquier modo pero FOB es más común marítimo; usar FCA marítimo invita preguntas.",
          zh: "(a) 发票写FOB但运费CFDI也被加入 → 过度申报。(b) 发票写DDP但代理加了DTA → DDP包含墨西哥侧税款但不包含DTA/PRV；核对精确定义。(c) FCA用于海运 — 严格来说FCA适用任何模式但海运更常用FOB；海运使用FCA会引起质疑。",
        },
      },
    ],
    keyPoints: {
      en: [
        "EXW/FOB → freight is added to customs value. CIF/DDP → freight is already included.",
        "DDP does NOT include DTA and PRV — those are still added.",
        "Wrong INCOTERM handling causes double-counting and over-payment.",
        "FCA in maritime works but invites scrutiny — prefer FOB for sea.",
      ],
      es: [
        "EXW/FOB → flete se suma al valor en aduana. CIF/DDP → ya está incluido.",
        "DDP NO incluye DTA ni PRV — esos sí se suman.",
        "Mal manejo del INCOTERM causa doble contabilización y sobre-pago.",
        "FCA en marítimo funciona pero invita escrutinio — preferir FOB.",
      ],
      zh: [
        "EXW/FOB → 运费加入海关价值。CIF/DDP → 运费已包含。",
        "DDP 不包含 DTA 和 PRV — 这些仍需加上。",
        "INCOTERM处理错误导致重复计算和多缴费。",
        "海运使用FCA可行但易招审查 — 海运优先用FOB。",
      ],
    },
    references: [
      { label: "INCOTERMS 2020 — ICC publication 723E", source: "ICC" },
      { label: "Ley Aduanera Art. 65 (incrementables to customs value)", source: "DOF" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 10 · HS codes & tariff classification
  // ────────────────────────────────────────────────────────
  {
    id: "10",
    moduleNum: "10",
    level: "intermediate",
    durationMin: 35,
    tags: ["HS Code", "Tariffs", "Mexico compliance"],
    levelName: MX_COMPLIANCE,
    levelTag: { en: "L3 · Mexico compliance", es: "N3 · Cumplimiento México", zh: "L3 · 墨西哥合规" },
    title: {
      en: "HS codes & tariff classification",
      es: "Fracciones arancelarias y clasificación",
      zh: "HS编码与关税分类",
    },
    intro: {
      en: "How to read and verify a fracción arancelaria, find the right code, and catch misclassification risk.",
      es: "Cómo leer y verificar una fracción arancelaria, encontrar el código correcto y detectar riesgos.",
      zh: "如何阅读和验证关税分类、找到正确编码以及识别错误分类风险。",
    },
    sections: [
      {
        title: { en: "Structure of the Mexican HS code", es: "Estructura del código HS mexicano", zh: "墨西哥HS编码结构" },
        body: {
          en: "10 digits: chapters 1-97 (digits 1-2), heading (3-4), subheading (5-6), tariff item (7-8), NICO (9-10). Mexico publishes the TIGIE (Tarifa de la Ley de los Impuestos Generales de Importación y Exportación). The first 6 digits align with the World Customs Organization HS — the last 4 are Mexican-specific.",
          es: "10 dígitos: capítulos 1-97 (dígitos 1-2), partida (3-4), subpartida (5-6), fracción (7-8), NICO (9-10). México publica la TIGIE (Tarifa de la Ley de los Impuestos Generales de Importación y Exportación). Los primeros 6 dígitos alinean con la OMA — los últimos 4 son específicos de México.",
          zh: "10位：章节1-97（数字1-2）、品目（3-4）、子目（5-6）、税则项（7-8）、NICO（9-10）。墨西哥发布TIGIE（进出口一般税法税则）。前6位与世界海关组织HS一致 — 后4位是墨西哥特有的。",
        },
      },
      {
        title: { en: "General Rules of Interpretation", es: "Reglas Generales de Interpretación", zh: "解释通则" },
        body: {
          en: "6 rules that govern classification: GR1 (text of headings), GR2 (incomplete or unassembled goods), GR3 (most specific description, essential character, last in numerical order), GR4 (most similar goods), GR5 (containers and packaging), GR6 (extension to subheadings). When a product could fit two headings, you apply the rules in order until one resolves it.",
          es: "6 reglas que rigen la clasificación: GR1 (texto de partidas), GR2 (bienes incompletos), GR3 (descripción más específica, carácter esencial, último orden numérico), GR4 (bienes más similares), GR5 (envases), GR6 (subpartidas). Si dos partidas aplican, se aplican las reglas en orden hasta resolver.",
          zh: "6条管辖分类的规则：GR1（品目条文）、GR2（未完成或未组装货物）、GR3（最具体描述、本质特征、数字顺序最后者）、GR4（最相似货物）、GR5（容器和包装）、GR6（延伸到子目）。当两个品目都适用时，按顺序应用直到解决。",
        },
      },
      {
        title: { en: "Trade agreement preferences", es: "Preferencias de tratados", zh: "贸易协定优惠" },
        body: {
          en: "Origin + HS code determine if you qualify for preferential duty under T-MEC, the Mexico-EU agreement, CPTPP, or others. Origin must be proven with a certificate of origin signed by the producer or exporter. Misclassification can disqualify you from a preference that was worth 0% duty.",
          es: "Origen + fracción determinan elegibilidad a preferencia bajo T-MEC, México-UE, CPTPP, etc. El origen se prueba con certificado firmado por productor o exportador. Una mala clasificación puede descalificarte de una preferencia que valía 0%.",
          zh: "原产地 + HS编码决定是否符合 T-MEC、墨欧、CPTPP 等优惠关税。原产地需由生产者或出口商签署的原产地证书证明。错误分类可能使你失去本可享受0%关税的优惠。",
        },
      },
      {
        title: { en: "Catching misclassification", es: "Detectando mala clasificación", zh: "识别错误分类" },
        body: {
          en: "Warning signs: (a) HS code reused across very different products in the same importer's history; (b) HS code matching the lowest-duty option for the description provided; (c) description that doesn't match the chapter notes for that heading. Nextport flags these patterns at the partida level.",
          es: "Señales de alerta: (a) fracción reutilizada para productos muy distintos en el histórico; (b) fracción que coincide con la opción de menor impuesto para la descripción; (c) descripción que no concuerda con notas del capítulo. Nextport marca estos patrones a nivel de partida.",
          zh: "警示信号：(a) 同一进口商历史中相同HS编码用于差异很大的产品；(b) HS编码恰好是该描述下税率最低的选项；(c) 描述与该品目章节注释不符。Nextport在分项层面标记这些模式。",
        },
      },
    ],
    keyPoints: {
      en: [
        "Mexico's HS is 10 digits: 6 international + 4 NICO national.",
        "Six General Rules of Interpretation are applied in order.",
        "Origin + HS code together unlock trade agreement preferences.",
        "Reused HS codes across dissimilar products is a misclassification signal.",
      ],
      es: [
        "La fracción mexicana es de 10 dígitos: 6 internacionales + 4 NICO nacionales.",
        "Las 6 Reglas Generales se aplican en orden.",
        "Origen + fracción habilitan preferencias arancelarias.",
        "Reutilizar fracción entre productos distintos es señal de mala clasificación.",
      ],
      zh: [
        "墨西哥HS为10位：6位国际 + 4位NICO国家特有。",
        "6条解释通则按顺序应用。",
        "原产地 + HS编码共同解锁贸易协定优惠。",
        "在不同产品间复用HS编码是错误分类的信号。",
      ],
    },
    references: [
      { label: "TIGIE — Tarifa LIGIE 2025", source: "SAT" },
      { label: "World Customs Organization — HS 2022 nomenclature", source: "WCO" },
      { label: "T-MEC Capítulo 5 (rules of origin)", source: "DOF" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 11 · Value discrepancy exceptions
  // ────────────────────────────────────────────────────────
  {
    id: "11",
    moduleNum: "11",
    level: "advanced",
    durationMin: 28,
    tags: ["Exceptions", "Customs Value"],
    levelName: EXCEPTION_MGMT,
    levelTag: { en: "L5 · Exception management", es: "N5 · Gestión de excepciones", zh: "L5 · 异常管理" },
    title: {
      en: "Value discrepancy exceptions",
      es: "Excepciones de discrepancia de valor",
      zh: "价值差异异常",
    },
    intro: {
      en: "How to investigate and resolve invoice-vs-pedimento value mismatches — the most common blocking exception.",
      es: "Cómo investigar y resolver discrepancias factura-vs-pedimento — la excepción bloqueante más común.",
      zh: "如何调查和解决发票与报关单价值不符 — 最常见的阻断性异常。",
    },
    sections: [
      {
        title: { en: "Reading the discrepancy", es: "Leyendo la discrepancia", zh: "解读差异" },
        body: {
          en: "Always start with: 'invoice $X vs pedimento $Y, delta $Z, expressed as % of pedimento'. Below 1% is usually rounding. 1-3% is investigatable. Above 3% is a hard flag. Note which document is the reference — the pedimento is what SAT will see, so if invoice > pedimento it's better, if invoice < pedimento it's worse.",
          es: "Empieza siempre con: 'factura $X vs pedimento $Y, delta $Z, expresado como % del pedimento'. Bajo 1% suele ser redondeo. 1-3% es investigable. Arriba del 3% es bandera dura. Nota cuál documento es la referencia — el pedimento es lo que SAT verá, así que si factura > pedimento es mejor, si factura < pedimento es peor.",
          zh: "总是从以下开始：“发票$X 与 报关单$Y，差额$Z，按报关单的百分比表示”。低于1%通常是舍入。1-3%需要调查。高于3%是硬性警示。注意哪个文件是参考 — 报关单是SAT看到的，所以发票>报关单更好，发票<报关单更糟。",
        },
      },
      {
        title: { en: "Six common root causes", es: "Seis causas raíz comunes", zh: "六种常见根本原因" },
        body: {
          en: "(1) Currency conversion using wrong day's FX. (2) Freight already included in CIF invoice but added again in pedimento. (3) Discount applied on invoice but not declared. (4) Sample/bonus units excluded from value but counted in quantity. (5) Royalty or licensing fee that should be an incrementable was omitted. (6) Transfer pricing adjustment between related parties (LA Art. 67).",
          es: "(1) Conversión con tipo de cambio del día equivocado. (2) Flete en CIF ya incluido pero sumado de nuevo. (3) Descuento aplicado en factura pero no declarado. (4) Unidades muestra excluidas del valor pero contadas en cantidad. (5) Regalía o licencia que debía ser incrementable se omitió. (6) Ajuste de precios de transferencia entre partes relacionadas (Art. 67 LA).",
          zh: "(1) 使用错误日期的汇率换算。(2) 运费在CIF发票中已包含但又在报关单中再次相加。(3) 发票应用折扣但未申报。(4) 样品/赠品单位从价值中排除但计入数量。(5) 应作为增量的特许权使用费或许可费被遗漏。(6) 关联方之间的转让定价调整（海关法第67条）。",
        },
      },
      {
        title: { en: "Resolution workflow", es: "Flujo de resolución", zh: "解决流程" },
        body: {
          en: "Step 1: confirm the delta sign and magnitude. Step 2: pull the supporting evidence (forwarder CFDI, royalty contract, supplier credit note). Step 3: decide between correction, documentation, or rectification (rectificación de pedimento). Rectification has a 3-month window from validation and costs the broker an additional patente fee. Step 4: log the decision with audit trail.",
          es: "Paso 1: confirma signo y magnitud del delta. Paso 2: junta evidencia (CFDI forwarder, contrato de regalía, nota de crédito del proveedor). Paso 3: decide entre corrección, documentación o rectificación de pedimento. La rectificación tiene ventana de 3 meses desde validación y cuesta una patente adicional al agente. Paso 4: deja la decisión en bitácora.",
          zh: "步骤1：确认差异的方向和大小。步骤2：收集支持证据（货代CFDI、特许权合同、供应商贷记单）。步骤3：在更正、记录或报关单更正（rectificación）之间决定。更正有从验证起3个月的窗口，并需要代理支付额外的执照费。步骤4：将决策记入审计日志。",
        },
      },
    ],
    keyPoints: {
      en: [
        "Below 1% delta is usually FX rounding — document and proceed.",
        "Above 3% is a blocking flag that needs root-cause analysis.",
        "Rectificación de pedimento is allowed within 3 months of validation.",
        "Transfer pricing between related parties triggers Art. 67 LA scrutiny.",
      ],
      es: [
        "Bajo 1% suele ser redondeo de tipo de cambio — documentar y seguir.",
        "Arriba del 3% es bandera bloqueante que necesita análisis causal.",
        "Rectificación de pedimento permitida dentro de 3 meses de validación.",
        "Precios de transferencia entre partes relacionadas activan Art. 67 LA.",
      ],
      zh: [
        "差异低于1%通常是汇率舍入 — 记录并继续。",
        "高于3%是阻断性警示，需要根本原因分析。",
        "报关单更正在验证后3个月内允许。",
        "关联方之间的转让定价触发海关法第67条审查。",
      ],
    },
    references: [
      { label: "Ley Aduanera Art. 67-78 (customs value methodology)", source: "DOF" },
      { label: "RGCE 2026 §6.1 (rectificación)", source: "SAT" },
    ],
  },

  // ────────────────────────────────────────────────────────
  // 12 · Human-in-the-loop approval
  // ────────────────────────────────────────────────────────
  {
    id: "12",
    moduleNum: "12",
    level: "advanced",
    durationMin: 20,
    tags: ["Approval", "AI Governance", "SOC 2"],
    levelName: GOVERNANCE,
    levelTag: { en: "L8 · Governance", es: "N8 · Gobernanza", zh: "L8 · 治理" },
    title: {
      en: "Human-in-the-loop approval",
      es: "Aprobación humana en el flujo",
      zh: "人机协作审批",
    },
    intro: {
      en: "Why human approval is required, what the approver is certifying, and how the audit trail is maintained.",
      es: "Por qué se requiere aprobación humana, qué certifica el aprobador y cómo se mantiene la bitácora.",
      zh: "为什么需要人工审批、审批人证明什么、以及如何维护审计轨迹。",
    },
    sections: [
      {
        title: { en: "What the approver is certifying", es: "Qué certifica el aprobador", zh: "审批人证明什么" },
        body: {
          en: "Not 'the AI did good work'. The approver certifies: (1) the data extracted matches the source documents to the best of their inspection; (2) all exceptions have been resolved or documented; (3) the customs value is what the business intends to declare; (4) they have authority to bind the company. The legal weight of the approval is on the human, not the model.",
          es: "No 'la IA hizo buen trabajo'. El aprobador certifica: (1) los datos extraídos coinciden con los documentos fuente hasta donde alcanzó su inspección; (2) todas las excepciones se resolvieron o documentaron; (3) el valor en aduana es lo que el negocio quiere declarar; (4) tiene autoridad para vincular a la empresa. El peso legal de la aprobación recae en el humano, no en el modelo.",
          zh: "不是“AI干得好”。审批人证明：(1) 提取的数据与源文件在其检查范围内一致；(2) 所有异常已解决或记录；(3) 海关价值是企业意图申报的；(4) 他们有权约束公司。审批的法律重量在人身上，而非模型。",
        },
      },
      {
        title: { en: "Two-person rule for high-value operations", es: "Regla de dos personas para operaciones de alto valor", zh: "高价值业务双人规则" },
        body: {
          en: "Operations above the workspace threshold (default USD 50,000 customs value) require dual sign-off: a compliance reviewer who confirms data integrity, and a manager who confirms commercial intent. Below threshold, single approval suffices. The threshold and roles are configurable but every change is itself audit-logged.",
          es: "Operaciones arriba del umbral del workspace (USD 50,000 valor en aduana por defecto) requieren doble firma: revisor de cumplimiento que confirma integridad de datos, y gerente que confirma intención comercial. Bajo umbral, una firma basta. El umbral y los roles son configurables pero cada cambio queda en bitácora.",
          zh: "工作区阈值以上（默认海关价值50,000美元）的业务需要双重签字：合规审核员确认数据完整性，经理确认商业意图。阈值以下，单次审批即可。阈值和角色可配置，但每次变更也都记入审计日志。",
        },
      },
      {
        title: { en: "Audit trail content", es: "Contenido de la bitácora", zh: "审计轨迹内容" },
        body: {
          en: "Every approval event records: actor (with user ID, role at time of action, IP), timestamp (UTC + local), operation hash (SHA-256 of the full operation state at that moment), decision (approve, hold, request correction, escalate), free-text justification, and the version of the AI summary and exception list shown at the time. The hash means later tampering is detectable.",
          es: "Cada evento de aprobación registra: actor (ID, rol al momento, IP), timestamp (UTC + local), hash de la operación (SHA-256 del estado completo en ese momento), decisión (aprobar, retener, solicitar corrección, escalar), justificación libre, y la versión del resumen IA y lista de excepciones mostrados en ese momento. El hash hace detectable cualquier manipulación posterior.",
          zh: "每个审批事件记录：操作人（用户ID、行动时的角色、IP）、时间戳（UTC + 本地）、业务哈希（当时完整状态的SHA-256）、决定（批准、暂停、请求更正、升级）、自由文本理由、以及当时显示的AI摘要和异常列表的版本。哈希使任何后续篡改都可被检测。",
        },
      },
      {
        title: { en: "When to escalate vs override", es: "Cuándo escalar vs override", zh: "何时升级 vs 覆盖" },
        body: {
          en: "Escalate when: a risk flag involves a regulation you don't fully understand, the supplier is new, the value is significantly above your authority level, or you suspect fraud. Override when: the flag is a known false positive backed by documented evidence, the resolution is within your authority, and the audit trail will defend the decision. When in doubt — escalate.",
          es: "Escala cuando: una bandera involucra regulación que no dominas, el proveedor es nuevo, el valor está muy por encima de tu autoridad, o sospechas fraude. Override cuando: la bandera es un falso positivo conocido con evidencia documentada, la resolución está en tu autoridad, y la bitácora defenderá la decisión. En duda — escala.",
          zh: "升级当：警示涉及你不完全理解的法规、供应商是新的、价值远超你的权限、或你怀疑欺诈。覆盖当：警示是已知误报且有书面证据、解决方案在你的权限内、且审计轨迹将支持该决定。有疑虑时 — 升级。",
        },
      },
    ],
    keyPoints: {
      en: [
        "The approver, not the AI, carries the legal weight of the declaration.",
        "Operations > USD 50k require dual sign-off by default.",
        "Every approval is hashed and timestamped — tampering is detectable.",
        "When in doubt between override and escalate — always escalate.",
      ],
      es: [
        "El aprobador, no la IA, carga el peso legal de la declaración.",
        "Operaciones > USD 50k requieren doble firma por defecto.",
        "Cada aprobación se hashea y timestamp — manipulación es detectable.",
        "En duda entre override y escalar — siempre escala.",
      ],
      zh: [
        "审批人而非AI承担申报的法律重量。",
        "> 50k美元的业务默认需要双重签字。",
        "每次审批都哈希并加时间戳 — 篡改可被检测。",
        "在覆盖和升级之间犹豫时 — 始终升级。",
      ],
    },
    references: [
      { label: "SOC 2 CC1.4, CC7.4 — Audit logging", source: "AICPA" },
      { label: "Ley Aduanera Art. 54 (broker liability)", source: "DOF" },
      { label: "NOM-151-SCFI-2016 (electronic record integrity)", source: "DOF" },
    ],
  },
];

/** Quick lookup by lesson id. */
export function getLesson(id: string): AcademyLesson | undefined {
  return ACADEMY_LESSONS.find((l) => l.id === id);
}
