/* Mock provider — the default. Always available, even without API keys.
 * Returns hardcoded plausible data per doc kind. Used for: local dev,
 * Vercel preview without keys, free-tier guard fallback, gemini/groq
 * failure fallback.
 */

import type {
  AIChatRequest,
  AIChatResponse,
  AIExtractRequest,
  AIExtractResponse,
} from "./provider";

const MOCK_MODEL = "mock-v1";

/* Per-kind canned data. Keep the shapes loose to satisfy any of the Zod
 * schemas — they all use the `confidence?: Record<string, number>` map. */
const MOCK_EXTRACTIONS: Record<string, unknown> = {
  invoice: {
    invoiceNumber: "INV-LMT-44218",
    issueDate: "2026-05-21",
    supplier: { name: "Lumitech Optics", taxId: "LUM2604189A2", address: "Shenzhen, CN" },
    consignee: { name: "Industrias Cardelio S.A. de C.V.", rfc: "ICA960314-9X2" },
    incoterm: "FOB Shanghai",
    currency: "USD",
    total: 184250,
    lines: [
      { description: "SMD LED driver module 24V", qty: 2400, unitPrice: 42.10, subtotal: 101040 },
      { description: "Heatsink alum. 80x80mm", qty: 1800, unitPrice: 22.50, subtotal: 40500 },
      { description: "Optical lens 120°", qty: 3800, unitPrice: 11.24, subtotal: 42710 },
    ],
    confidence: { invoiceNumber: 0.995, total: 0.961, "supplier.taxId": 0.984, incoterm: 0.972 },
  },
  bl: {
    blNumber: "MAEU-7741229",
    carrier: "Maersk Line",
    vessel: "SAN AGUSTÍN V.2026/14",
    portOfLoading: "Shanghai",
    portOfDischarge: "Manzanillo",
    eta: "2026-05-28",
    shipper: "Lumitech Optics",
    consignee: "Industrias Cardelio S.A. de C.V.",
    containers: [
      { id: "MSKU 778 4321 1", seal: "ML 4421 88", size: "40HQ" },
    ],
    packages: 120,
    grossWeightKg: 4860,
    netWeightKg: 4612,
    cbm: 14.2,
    confidence: { blNumber: 0.991, grossWeightKg: 0.982 },
  },
  packing_list: {
    documentNumber: "PL-LMT-44218",
    invoiceRef: "INV-LMT-44218",
    origin: "Shanghai, CN",
    packages: 120,
    totalGrossWeightKg: 4742,
    totalNetWeightKg: 4500,
    lines: Array.from({ length: 6 }).map((_, i) => ({
      carton: `C-${101 + i}`,
      contents: "SMD LED driver / Heatsink mix",
      qty: 220 + i * 40,
      grossKg: 540 + i * 40,
    })),
    confidence: { totalGrossWeightKg: 0.971, packages: 0.987 },
  },
  pedimento: {
    pedimentoNumber: "26 47 3145 6002847",
    regime: "A1",
    importer: { name: "Industrias Cardelio S.A. de C.V.", rfc: "ICA960314-9X2" },
    brokerage: "Aduanas del Pacífico",
    customsValueUsd: 189580,
    invoiceValueUsd: 184250,
    hsBucket: "8541.40.01",
    weightKg: 4742,
    igiAmountUsd: 0,
    ivaAmountMxn: 530440,
    mode: "Ocean",
    sectionalCustoms: "Sección 470 · CDMX",
    confidence: { pedimentoNumber: 0.998, customsValueUsd: 0.974, hsBucket: 0.965 },
  },
  mve: {
    importerRfc: "NXT2601108K5",
    relatedInvoice: "INV-LMT-44218",
    declaredValueUsd: 184250,
    incoterm: "FOB Shanghai",
    exchangeRate: 17.42,
    signaturePresent: true,
    signatureValid: true,
    emissionDate: "2026-05-21",
    confidence: { declaredValueUsd: 0.957, signaturePresent: 0.981 },
  },
  cfdi: {
    uuid: "B81F-22AC-9014-7C03-DA10-44B2",
    emitterRfc: "ADP800101AAA",
    receiverRfc: "ICA960314-9X2",
    amountMxn: 18400,
    ivaMxn: 2944,
    totalMxn: 21344,
    serviceDescription: "Servicios de despacho aduanal",
    issueDate: "2026-05-21",
    satSealValid: true,
    confidence: { uuid: 0.999, totalMxn: 0.991 },
  },
  coo: {
    certificateNumber: "TMEC-2026-001847",
    issuer: "Cámara de Comercio CN",
    originCountry: "CN",
    treaty: "Bilateral",
    producer: "Lumitech Optics Shenzhen",
    exporter: "Lumitech Optics",
    importer: "Industrias Cardelio S.A. de C.V.",
    periodStart: "2026-01-01",
    periodEnd: "2026-12-31",
    hsCodesCovered: ["8541.40.01"],
    signaturePresent: true,
    confidence: { certificateNumber: 0.978, originCountry: 0.995 },
  },
  carta_porte: {
    cartaPorteUuid: "CP-2026-MXN-44218-7741",
    transporterRfc: "TMP891202QX2",
    transporterName: "Transportes Manzanillo Pacífico",
    transportMode: "truck" as const,
    vehicleId: "RT-9421",
    driverLicense: "B1-MX-4429",
    originAddress: "Puerto de Manzanillo, Col.",
    destinationAddress: "CEDIS Industrias Cardelio, CDMX",
    totalDistanceKm: 778,
    totalWeightKg: 4742,
    segments: [
      { sequence: 1, from: "Manzanillo, Col.", to: "Guadalajara, Jal.", distanceKm: 290 },
      { sequence: 2, from: "Guadalajara, Jal.", to: "CDMX (CEDIS)",     distanceKm: 488 },
    ],
    confidence: { cartaPorteUuid: 0.992, totalWeightKg: 0.965 },
  },
};

/* Keyword-matched canned tutor responses. The real Groq path streams; this
 * mock returns a single string. Covers the most common compliance questions. */
function mockChatResponse(userText: string): string {
  const text = userText.toLowerCase();
  if (text.includes("mve") || text.includes("valor")) {
    return "La Manifestación de Valor Electrónica (MVE) declara el valor en aduana y debe referenciar la factura comercial + INCOTERM. Verifica que el total coincida con la factura y que la firma electrónica esté presente.";
  }
  if (text.includes("origen") || text.includes("t-mec") || text.includes("tmec")) {
    return "Para reglas de origen T-MEC, el certificado debe identificar el criterio (A, B, C o D), el productor y el período cubierto. Revisa que la fracción arancelaria sea consistente con la factura y que el origen coincida con el packing list.";
  }
  if (text.includes("bl") || text.includes("conocimiento") || text.includes("peso")) {
    return "El BL debe coincidir con el packing list en número de contenedores, peso bruto y puerto de descarga. Una discrepancia de peso suele indicar carga adicional no declarada — bloqueante para aprobación.";
  }
  if (text.includes("cofepris")) {
    return "Productos COFEPRIS requieren registro sanitario vigente, etiquetado NOM-241 (dispositivos) o NOM correspondiente, y aviso automático SE. Verifica el folio del registro contra el padrón COFEPRIS antes de aprobar.";
  }
  if (text.includes("pedimento")) {
    return "El pedimento A1 (importación definitiva) debe tener: importador con padrón vigente, agente aduanal, fracción arancelaria correcta, valor en aduana = factura, IGI + IVA calculados, y sello digital del SAT.";
  }
  return "Como tutor de cumplimiento, te puedo ayudar con: clasificación arancelaria, validaciones cruzadas entre documentos, reglas de origen T-MEC, NOMs sectoriales (COFEPRIS, SEMARNAT, SENASICA) y proceso de aprobación humana. ¿Sobre qué quieres profundizar?";
}

export const mockProvider = {
  async extract<T>(req: AIExtractRequest<T>): Promise<AIExtractResponse<T>> {
    const canned = MOCK_EXTRACTIONS[req.docKind];
    if (!canned) {
      // No canned data for this kind — return a generic shape with confidence=0.85.
      return {
        data: { confidence: { _unknown: 0.85 } } as unknown as T,
        model: MOCK_MODEL,
        latencyMs: 0,
        cached: false,
        confidencePerField: { _unknown: 0.85 },
      };
    }
    // Validate against the schema (defensive — catches schema drift in mock data).
    const parsed = req.schema.safeParse(canned);
    const data = (parsed.success ? parsed.data : canned) as T;
    const confidencePerField = (canned as { confidence?: Record<string, number> }).confidence;
    return {
      data,
      model: MOCK_MODEL,
      latencyMs: 0,
      cached: false,
      confidencePerField,
    };
  },
  async chat(req: AIChatRequest): Promise<AIChatResponse> {
    const lastUser = [...req.messages].reverse().find((m) => m.role === "user");
    return {
      text: mockChatResponse(lastUser?.content ?? ""),
      model: MOCK_MODEL,
      latencyMs: 0,
    };
  },
};
