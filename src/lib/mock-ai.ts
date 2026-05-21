export interface MockAIResponse {
  response: string;
  relatedLessons: string[];
  suggestedAction?: string;
}

const patterns: Array<{ keywords: string[]; response: MockAIResponse }> = [
  {
    keywords: ["commercial value", "customs value", "valor comercial", "valor en aduana"],
    response: {
      response:
        "The **commercial value** on the invoice reflects the transaction price agreed between buyer and seller. The **customs value** (valor en aduana) is calculated per GATT Valuation Agreement Article 1 and must include CIF (Cost, Insurance, Freight) adjustments when the incoterm is EXW or FOB. A discrepancy between invoice value and declared customs value is one of the most common triggers for a SAT verification audit. Always reconcile these figures before submitting your pedimento.",
      relatedLessons: ["mod-04", "mod-07"],
      suggestedAction: "Review the invoice and pedimento commercial value fields side by side.",
    },
  },
  {
    keywords: ["bl weight", "bill of lading weight", "peso bl", "weight mismatch"],
    response: {
      response:
        "The **B/L (Bill of Lading) gross weight** must match the packing list and pedimento declared weight within tolerance margins (typically ±5% for bulk, ±1% for containerized cargo). A weight discrepancy signals potential underdeclaration or classification errors. The broker must reconcile via a corrected BL or attach a weighing certificate before the pedimento is submitted. This is flagged by SAT's SAAI system automatically.",
      relatedLessons: ["mod-03", "mod-06"],
      suggestedAction: "Request updated packing list or weighing certificate from supplier.",
    },
  },
  {
    keywords: ["mve", "valor estimado", "estimated value", "minimum value"],
    response: {
      response:
        "The **MVE (Minimum Estimated Value)** is SAT's reference price database for import goods, used to detect potential undervaluation. When the declared value falls below MVE thresholds for the HS code, the pedimento is automatically flagged and may require a **valor estimado guarantee deposit** (equivalent to the difference in duties). To avoid delays, document the price with purchase orders, contracts, and transfer pricing studies if applicable.",
      relatedLessons: ["mod-05", "mod-07"],
      suggestedAction: "Compare declared value with MVE table for HS 9002.11 and attach supporting docs.",
    },
  },
  {
    keywords: ["country of origin", "origin certificate", "origen", "certificado de origen", "coo"],
    response: {
      response:
        "A **Certificate of Origin** mismatch occurs when the declared manufacturing country differs from the origin on the COO document. This has significant implications: (1) preferential tariff rates under USMCA/T-MEC require valid Form A or Certificate of Origin, (2) anti-dumping duties apply if origin is a country subject to additional measures, (3) IMMEX programs require USMCA compliance tracking. Always verify that the origin on the invoice, COO, and BL are consistent.",
      relatedLessons: ["mod-02", "mod-08"],
      suggestedAction: "Request corrected COO from supplier and verify USMCA eligibility.",
    },
  },
  {
    keywords: ["at risk", "risk", "riesgo", "flagged", "exception"],
    response: {
      response:
        "Operations flagged **At Risk** have one or more critical exceptions that could result in: (1) **customs detention** at the port of entry, (2) **SAT audit trigger** requiring additional documentation, (3) **duty reassessment** with surcharges and penalties. The risk score is calculated from exception severity, document completeness, declared value vs MVE thresholds, and historical broker performance. Resolve all Risk-level exceptions before submitting the pedimento.",
      relatedLessons: ["mod-01", "mod-07"],
      suggestedAction: "Review all Risk exceptions in the Exceptions panel and resolve before approving.",
    },
  },
  {
    keywords: ["invoice", "po", "purchase order", "factura", "mismatch", "discrepancy"],
    response: {
      response:
        "An **invoice vs PO mismatch** means the commercial invoice doesn't match the purchase order reference. This can cause: (1) customs rejection if the invoice is missing PO number, (2) accounting discrepancies for IVA/VAT matching, (3) IMMEX control issues if goods are part of a maquiladora program. The broker needs a **corrected invoice** or an **explanation letter** (carta explicativa) from the importer, plus the original PO attached as supporting documentation.",
      relatedLessons: ["mod-03", "mod-04"],
      suggestedAction: "Request corrected invoice with PO reference from the supplier.",
    },
  },
  {
    keywords: ["human-in-the-loop", "human in the loop", "ai review", "manual review"],
    response: {
      response:
        "Nextport AI uses a **human-in-the-loop** model where AI handles document classification, field extraction, and exception detection — but a human compliance officer makes the final decision on every operation. This ensures AI efficiency while maintaining legal accountability. AI confidence scores below 85% automatically require human review. All approval actions are logged to the immutable audit trail for SAT and SOC 2 compliance.",
      relatedLessons: ["mod-01"],
      suggestedAction: undefined,
    },
  },
  {
    keywords: ["escalate", "escalation", "compliance manager", "escalar"],
    response: {
      response:
        "Use **Escalate** when: (1) an exception requires a compliance manager or legal counsel, (2) the declared value is challenged by SAT, (3) there's a potential anti-dumping or countervailing duty issue, (4) the operation involves restricted goods or dual-use items. Escalation creates a priority task and sends notifications to the designated compliance manager. All escalations are recorded in the audit trail with timestamps and actor information.",
      relatedLessons: ["mod-07", "mod-09"],
      suggestedAction: "Use the Escalate button in the Approval Rail to notify the compliance manager.",
    },
  },
  {
    keywords: ["pedimento", "customs declaration", "aduana", "customs entry"],
    response: {
      response:
        "The **Pedimento** is Mexico's official customs entry document, required for all imports and exports. It must include: HS classification codes (fracción arancelaria), declared commercial value, country of origin, regime (importación definitiva, temporal, etc.), pedimento number (e.g. 26  48  3654  0001234), broker patent number, and all required document references. In Nextport AI, the pedimento is cross-referenced against extracted document fields to detect discrepancies automatically.",
      relatedLessons: ["mod-02", "mod-06"],
      suggestedAction: undefined,
    },
  },
  {
    keywords: ["hs code", "hs classification", "tariff", "fraccion arancelaria", "fracción"],
    response: {
      response:
        "**HS (Harmonized System) codes** determine the import duty rate, applicable restrictions, and compliance requirements. Mexico uses 8-digit codes (fracción arancelaria). Classification errors are a top SAT audit trigger. Key rules: (1) classify by the good's essential character, (2) for mixtures/sets, use the predominant component, (3) optical systems like lenses typically fall under Chapter 90. Misclassification penalties can reach 70-100% of duties owed plus surcharges.",
      relatedLessons: ["mod-02", "mod-05"],
      suggestedAction: "Verify HS code against Mexico's TIGIE tariff schedule.",
    },
  },
  {
    keywords: ["sat", "vucem", "government", "gobierno"],
    response: {
      response:
        "**SAT (Servicio de Administración Tributaria)** is Mexico's tax authority that oversees customs. **VUCEM (Ventanilla Única de Comercio Exterior Mexicano)** is the single electronic window for all trade documents. Nextport AI integrates with both to: (1) validate pedimento numbers in real-time, (2) check COVE (Comprobante de Valor Electrónico) requirements, (3) monitor SAT risk indicators, (4) file electronic documents via VUCEM API. Connection status is shown in the integrations panel.",
      relatedLessons: ["mod-06", "mod-09"],
      suggestedAction: "Check SAT·VUCEM integration status in the Integrations panel.",
    },
  },
];

const defaultResponse: MockAIResponse = {
  response:
    "I'm the **Nextport Tutor**, your AI guide for Mexican import compliance. I can help you with: customs valuations, HS classification, document requirements (pedimento, invoice, BL, COO, MVE), SAT regulations, VUCEM filings, IMMEX programs, and trade compliance best practices. What would you like to know?",
  relatedLessons: ["mod-01"],
  suggestedAction: undefined,
};

export function getMockResponse(message: string): MockAIResponse {
  const lower = message.toLowerCase();
  for (const { keywords, response } of patterns) {
    if (keywords.some((kw) => lower.includes(kw))) {
      return response;
    }
  }
  return defaultResponse;
}
