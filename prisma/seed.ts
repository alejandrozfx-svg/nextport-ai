import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database…");

  // Cleanup
  await prisma.assistantMessage.deleteMany();
  await prisma.assistantConversation.deleteMany();
  await prisma.academyProgress.deleteMany();
  await prisma.academyLesson.deleteMany();
  await prisma.glossaryTerm.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.approval.deleteMany();
  await prisma.exception.deleteMany();
  await prisma.aISummary.deleteMany();
  await prisma.extractedField.deleteMany();
  await prisma.validationCheck.deleteMany();
  await prisma.document.deleteMany();
  await prisma.operation.deleteMany();
  await prisma.supplier.deleteMany();
  await prisma.customsBroker.deleteMany();
  await prisma.workspace.deleteMany();
  await prisma.integration.deleteMany();
  await prisma.user.deleteMany();

  // Workspace
  await prisma.workspace.create({
    data: { name: "Cardelio Industries", rfc: "ICA960314KP9" },
  });

  // Users
  const demoUser = await prisma.user.create({
    data: {
      email: "demo@nextport.ai",
      name: "Alejandro Reyes",
      role: "admin",
      initials: "AR",
    },
  });

  const users = await Promise.all([
    prisma.user.create({ data: { email: "mlopez@nextport.ai", name: "Mariana López", role: "manager", initials: "ML" } }),
    prisma.user.create({ data: { email: "dhernandez@nextport.ai", name: "Diego Hernández", role: "analyst", initials: "DH" } }),
    prisma.user.create({ data: { email: "creyes@nextport.ai", name: "Carlos Reyes", role: "coordinator", initials: "CR" } }),
    prisma.user.create({ data: { email: "aruiz@nextport.ai", name: "Ana Patricia Ruiz", role: "analyst", initials: "AP" } }),
  ]);

  const [mariana, diego, carlos, ana] = users;

  // Suppliers
  const suppliers = await Promise.all([
    prisma.supplier.create({ data: { name: "Lumitech Optics Co., Ltd.", shortName: "Lumitech", country: "CN", city: "Shenzhen", taxId: "91440300MA5FXXX" } }),
    prisma.supplier.create({ data: { name: "TaegukChem Industries", shortName: "TaegukChem", country: "KR", city: "Incheon", taxId: "120-81-XXXXX" } }),
    prisma.supplier.create({ data: { name: "Hannover Präzision GmbH", shortName: "Hannover", country: "DE", city: "Hannover", taxId: "DE123456789" } }),
    prisma.supplier.create({ data: { name: "Vértice Componentes S.A.", shortName: "Vértice", country: "MX", city: "Monterrey", taxId: "VCO971204JM0" } }),
    prisma.supplier.create({ data: { name: "Aero Plastics Inc.", shortName: "AeroPlastics", country: "US", city: "Houston", taxId: "XX-XXXXXXX" } }),
    prisma.supplier.create({ data: { name: "Osaka Bearings & Precision", shortName: "Osaka Bearings", country: "JP", city: "Osaka", taxId: "1234567890" } }),
    prisma.supplier.create({ data: { name: "Bogotá Textiles S.A.S.", shortName: "Bogotá Textiles", country: "CO", city: "Bogotá", taxId: "900.XXX.XXX-X" } }),
  ]);

  const [lumitech, taeguk, hannover, vertice, aeroplastics, osaka, bogota] = suppliers;

  // Brokers
  const brokers = await Promise.all([
    prisma.customsBroker.create({ data: { name: "Aduanas Pacífico S.A.", patent: "3654" } }),
    prisma.customsBroker.create({ data: { name: "Globalink Brokers México", patent: "2198" } }),
    prisma.customsBroker.create({ data: { name: "Intertek Customs Services", patent: "4721" } }),
    prisma.customsBroker.create({ data: { name: "Despacho Aduanal Norteño", patent: "1087" } }),
  ]);

  const [pacifico, globalink, intertek, norteno] = brokers;

  // Helper
  function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate() - n); return d; }
  function daysFromNow(n: number) { const d = new Date(); d.setDate(d.getDate() + n); return d; }

  // Operations
  const opData = [
    {
      id: "NP-2026-001847",
      supplierId: lumitech.id,
      brokerId: pacifico.id,
      origin: "SZX", destination: "MEX",
      mode: "air", incoterm: "CIF",
      eta: daysFromNow(3), etaDelta: "+2d",
      value: 184250, currency: "USD",
      pedimento: "26  48  3654  0012847",
      hsBucket: "HS 9002.11",
      status: "risk",
      ownerId: demoUser.id,
      aiSummary: "MVE discrepancy detected on lens assemblies. Declared value of USD 184,250 falls 23% below SAT's estimated reference price for HS 9002.11. Recommend requesting supplier price justification and attaching transfer pricing study before pedimento submission.",
    },
    {
      id: "NP-2026-001846",
      supplierId: taeguk.id,
      brokerId: globalink.id,
      origin: "ICN", destination: "MTY",
      mode: "sea", incoterm: "FOB",
      eta: daysFromNow(7), etaDelta: "+1d",
      value: 62400, currency: "USD",
      pedimento: "26  48  2198  0012846",
      hsBucket: "HS 3812.30",
      status: "review",
      ownerId: mariana.id,
      aiSummary: "COO mismatch between invoice and certificate of origin. Invoice states 'manufactured in Korea' but COO shows 'Republic of Korea (South)' — confirm denomination alignment with SAT requirements.",
    },
    {
      id: "NP-2026-001845",
      supplierId: hannover.id,
      brokerId: intertek.id,
      origin: "HAM", destination: "VER",
      mode: "sea", incoterm: "DDP",
      eta: daysFromNow(12), etaDelta: "-1d",
      value: 312880, currency: "EUR",
      pedimento: "26  48  4721  0012845",
      hsBucket: "HS 8466.94",
      status: "ready",
      ownerId: diego.id,
      aiSummary: "All documents validated. CNC tooling components classified correctly under HS 8466.94. DDP incoterm means duty payment is supplier's responsibility — verify broker confirmation letter is on file.",
    },
    {
      id: "NP-2026-001844",
      supplierId: vertice.id,
      brokerId: norteno.id,
      origin: "MTY", destination: "MEX",
      mode: "land", incoterm: "EXW",
      eta: daysFromNow(2), etaDelta: "0d",
      value: 41200, currency: "USD",
      pedimento: "26  48  1087  0012844",
      hsBucket: "HS 8541.21",
      status: "ready",
      ownerId: carlos.id,
      aiSummary: "Domestic supplier, all documents complete. CFDI 4.0 verified against SAT RFC. Semiconductor components qualify for preferential tariff rate under USMCA Certificate of Origin.",
    },
    {
      id: "NP-2026-001843",
      supplierId: aeroplastics.id,
      brokerId: pacifico.id,
      origin: "HOU", destination: "MEX",
      mode: "air", incoterm: "FCA",
      eta: daysFromNow(5), etaDelta: "+3d",
      value: 96780, currency: "USD",
      pedimento: "26  48  3654  0012843",
      hsBucket: "HS 3926.90",
      status: "review",
      ownerId: ana.id,
      aiSummary: "ETA delayed 3 days due to carrier routing change. Packing list weight (1,240 kg) does not match BL gross weight (1,315 kg). Discrepancy of 75 kg requires correction before customs submission.",
    },
    {
      id: "NP-2026-001842",
      supplierId: osaka.id,
      brokerId: globalink.id,
      origin: "KIX", destination: "GDL",
      mode: "sea", incoterm: "CIF",
      eta: daysFromNow(9), etaDelta: "+5d",
      value: 28950, currency: "USD",
      pedimento: "26  48  2198  0012842",
      hsBucket: "HS 8482.10",
      status: "risk",
      ownerId: demoUser.id,
      aiSummary: "Multiple risk flags: significant ETA delay (+5 days), missing anti-dumping certificate for bearings from Japan under provisional measure PM-06-2025, and invoice PO reference does not match purchase order on file.",
    },
    {
      id: "NP-2026-001841",
      supplierId: bogota.id,
      brokerId: intertek.id,
      origin: "BOG", destination: "VER",
      mode: "sea", incoterm: "FOB",
      eta: daysFromNow(15), etaDelta: "0d",
      value: 18420, currency: "USD",
      pedimento: "26  48  4721  0012841",
      hsBucket: "HS 6006.10",
      status: "ready",
      ownerId: mariana.id,
      aiSummary: "Textile import cleared. COO valid under Colombia-Mexico FTA. All documents received and validated. IVA declaration verified against CFDI. Ready for approval.",
    },
  ];

  const createdOps: Record<string, string> = {};

  for (const op of opData) {
    const created = await prisma.operation.create({ data: op });
    createdOps[op.id] = created.id;

    // AI Summary
    await prisma.aISummary.create({
      data: { operationId: op.id, summary: op.aiSummary ?? "" },
    });
  }

  // Documents for NP-2026-001847 (Lumitech, risk)
  const lumitechDocTypes = [
    { type: "pedimento", status: "validated", confidence: 0.91, filename: "pedimento-NP001847.pdf" },
    { type: "invoice", status: "extracted", confidence: 0.87, filename: "invoice-lumitech-Q2-847.pdf" },
    { type: "bl", status: "validated", confidence: 0.94, filename: "bl-shenzhen-mex-847.pdf" },
    { type: "packing_list", status: "validated", confidence: 0.96, filename: "packing-list-847.pdf" },
    { type: "mve", status: "classified", confidence: 0.73, filename: "mve-9002.11-2026.pdf" },
    { type: "coo", status: "validated", confidence: 0.88, filename: "coo-cn-to-mx-847.pdf" },
  ];

  for (const doc of lumitechDocTypes) {
    const d = await prisma.document.create({
      data: {
        operationId: "NP-2026-001847",
        type: doc.type,
        filename: doc.filename,
        status: doc.status,
        confidence: doc.confidence,
        source: "upload",
        uploadedAt: daysAgo(2),
        classifiedAt: daysAgo(2),
        extractedAt: doc.status !== "classified" ? daysAgo(1) : null,
        validatedAt: doc.status === "validated" ? daysAgo(1) : null,
      },
    });

    if (doc.type === "invoice") {
      await prisma.extractedField.createMany({
        data: [
          { documentId: d.id, fieldKey: "invoice_number", label: "Invoice Number", value: "LTO-2026-Q2-8471", confidence: 0.97, mismatch: false },
          { documentId: d.id, fieldKey: "supplier_name", label: "Supplier Name", value: "Lumitech Optics Co., Ltd.", confidence: 0.99, mismatch: false },
          { documentId: d.id, fieldKey: "total_value", label: "Total Value", value: "USD 184,250.00", confidence: 0.95, mismatch: true, mismatchRef: "MVE reference: USD 239,000.00" },
          { documentId: d.id, fieldKey: "hs_code", label: "HS Code", value: "9002.11", confidence: 0.89, mismatch: false },
          { documentId: d.id, fieldKey: "quantity", label: "Quantity", value: "1,250 units (lens assemblies)", confidence: 0.96, mismatch: false },
          { documentId: d.id, fieldKey: "unit_price", label: "Unit Price", value: "USD 147.40/unit", confidence: 0.94, mismatch: true, mismatchRef: "MVE unit price: USD 191.20/unit" },
        ],
      });
      await prisma.validationCheck.createMany({
        data: [
          { documentId: d.id, checkName: "Invoice number present", passed: true },
          { documentId: d.id, checkName: "Supplier RFC/tax ID matches", passed: true },
          { documentId: d.id, checkName: "Value above MVE threshold", passed: false, detail: "Declared USD 147.40/unit vs MVE USD 191.20/unit" },
          { documentId: d.id, checkName: "HS code consistent with description", passed: true },
          { documentId: d.id, checkName: "Currency match with pedimento", passed: true },
        ],
      });
    }

    if (doc.type === "pedimento") {
      await prisma.extractedField.createMany({
        data: [
          { documentId: d.id, fieldKey: "pedimento_num", label: "Pedimento Number", value: "26  48  3654  0012847", confidence: 0.99, mismatch: false },
          { documentId: d.id, fieldKey: "customs_value", label: "Customs Value", value: "USD 184,250.00", confidence: 0.97, mismatch: true, mismatchRef: "MVE discrepancy flagged by SAT" },
          { documentId: d.id, fieldKey: "regime", label: "Regime", value: "A1 — Definitiva de Importación", confidence: 0.98, mismatch: false },
          { documentId: d.id, fieldKey: "broker_patent", label: "Broker Patent", value: "3654", confidence: 0.99, mismatch: false },
        ],
      });
      await prisma.validationCheck.createMany({
        data: [
          { documentId: d.id, checkName: "Pedimento number format valid", passed: true },
          { documentId: d.id, checkName: "Regime code valid", passed: true },
          { documentId: d.id, checkName: "Broker patent registered", passed: true },
          { documentId: d.id, checkName: "Value consistent with MVE", passed: false, detail: "23% below SAT reference price" },
        ],
      });
    }
  }

  // Exceptions for NP-2026-001847
  await prisma.exception.createMany({
    data: [
      {
        operationId: "NP-2026-001847",
        kind: "risk",
        title: "MVE Discrepancy — Declared value 23% below reference",
        detail: "The declared unit price of USD 147.40 is 23% below SAT's Minimum Value Estimate (MVE) of USD 191.20 for HS 9002.11 lens assemblies. This may trigger a SAT value verification procedure and require a guarantee deposit.",
        refs: ["SAT MVE Table 2026-Q2", "Art. 78 Ley Aduanera", "HS 9002.11"],
        fields: ["total_value", "unit_price"],
        docs: ["invoice", "mve"],
        resolved: false,
      },
      {
        operationId: "NP-2026-001847",
        kind: "warn",
        title: "MVE document confidence below 80%",
        detail: "The MVE reference document was classified with only 73% confidence. Manual verification of the MVE table applicable to this HS code and import date is recommended.",
        refs: ["MVE classification"],
        fields: [],
        docs: ["mve"],
        resolved: false,
      },
    ],
  });

  // Documents for NP-2026-001846 (TaegukChem, review)
  const taegukDocs = [
    { type: "invoice", status: "validated", confidence: 0.93, filename: "invoice-taeguk-q2-846.pdf" },
    { type: "bl", status: "validated", confidence: 0.95, filename: "bl-icn-mty-846.pdf" },
    { type: "packing_list", status: "validated", confidence: 0.91, filename: "packing-846.pdf" },
    { type: "coo", status: "extracted", confidence: 0.82, filename: "coo-kr-846.pdf" },
    { type: "cfdi", status: "validated", confidence: 0.98, filename: "cfdi-taeguk-846.xml" },
  ];

  for (const doc of taegukDocs) {
    const d = await prisma.document.create({
      data: {
        operationId: "NP-2026-001846",
        type: doc.type,
        filename: doc.filename,
        status: doc.status,
        confidence: doc.confidence,
        source: "email",
        uploadedAt: daysAgo(4),
        classifiedAt: daysAgo(4),
        extractedAt: daysAgo(3),
        validatedAt: doc.status === "validated" ? daysAgo(3) : null,
      },
    });

    if (doc.type === "coo") {
      await prisma.extractedField.createMany({
        data: [
          { documentId: d.id, fieldKey: "origin_country", label: "Country of Origin", value: "Republic of Korea (South)", confidence: 0.84, mismatch: true, mismatchRef: "Invoice states: 'Korea'" },
          { documentId: d.id, fieldKey: "manufacturer", label: "Manufacturer", value: "TaegukChem Industries", confidence: 0.97, mismatch: false },
          { documentId: d.id, fieldKey: "hs_code", label: "HS Code on COO", value: "3812.30", confidence: 0.91, mismatch: false },
        ],
      });
    }
  }

  await prisma.exception.create({
    data: {
      operationId: "NP-2026-001846",
      kind: "review",
      title: "Country of origin denomination mismatch",
      detail: "Invoice states 'Korea' while Certificate of Origin states 'Republic of Korea (South)'. SAT may flag this inconsistency. Confirm that both documents use the exact same country denomination per TIGIE Annex specifications.",
      refs: ["TIGIE Annex 10", "COO validation"],
      fields: ["origin_country"],
      docs: ["invoice", "coo"],
      resolved: false,
    },
  });

  // Documents for NP-2026-001845 (Hannover, ready)
  const hannoverDocs = [
    { type: "pedimento", status: "ready", confidence: 0.97 },
    { type: "invoice", status: "ready", confidence: 0.98 },
    { type: "bl", status: "ready", confidence: 0.96 },
    { type: "packing_list", status: "ready", confidence: 0.97 },
    { type: "coo", status: "ready", confidence: 0.95 },
    { type: "cfdi", status: "ready", confidence: 0.99 },
  ];

  for (const doc of hannoverDocs) {
    await prisma.document.create({
      data: {
        operationId: "NP-2026-001845",
        type: doc.type,
        filename: `${doc.type}-hannover-845.pdf`,
        status: doc.status,
        confidence: doc.confidence,
        source: "integration",
        uploadedAt: daysAgo(8),
        classifiedAt: daysAgo(8),
        extractedAt: daysAgo(7),
        validatedAt: daysAgo(7),
      },
    });
  }

  // Exceptions for NP-2026-001843 (AeroPlastics)
  await prisma.exception.createMany({
    data: [
      {
        operationId: "NP-2026-001843",
        kind: "warn",
        title: "BL gross weight mismatch",
        detail: "Packing list gross weight (1,240 kg) does not match BL gross weight (1,315 kg). Discrepancy of 75 kg (6%). This may cause rejection at customs scanning. Request amended BL or corrected packing list.",
        refs: ["BL#PCXMEX2026-843", "Packing List PL-843"],
        fields: ["gross_weight"],
        docs: ["bl", "packing_list"],
        resolved: false,
      },
      {
        operationId: "NP-2026-001843",
        kind: "review",
        title: "ETA delayed +3 days",
        detail: "Carrier rerouted through Panama Canal delay. New ETA is 3 days later than contracted. Notify importer for IVA provisional payment adjustment.",
        refs: ["Flight/vessel schedule update"],
        fields: ["eta"],
        docs: ["bl"],
        resolved: false,
      },
    ],
  });

  // Exceptions for NP-2026-001842 (Osaka Bearings)
  await prisma.exception.createMany({
    data: [
      {
        operationId: "NP-2026-001842",
        kind: "risk",
        title: "Missing anti-dumping certificate",
        detail: "Ball bearings from Japan (HS 8482.10) are subject to provisional anti-dumping measure PM-06-2025. An anti-dumping certificate or exemption letter from SECOFI is required before pedimento submission.",
        refs: ["PM-06-2025", "DOF 15-Mar-2026", "HS 8482.10"],
        fields: [],
        docs: [],
        resolved: false,
      },
      {
        operationId: "NP-2026-001842",
        kind: "risk",
        title: "Invoice PO reference mismatch",
        detail: "Invoice references PO#OSAK-2026-0033 but the purchase order on file is PO#OSAK-2026-0033-REV1. Broker cannot submit pedimento with mismatched PO. Request corrected invoice from Osaka Bearings.",
        refs: ["Invoice#OBP-2026-0188", "PO#OSAK-2026-0033-REV1"],
        fields: ["po_number"],
        docs: ["invoice"],
        resolved: false,
      },
      {
        operationId: "NP-2026-001842",
        kind: "warn",
        title: "Significant ETA delay (+5 days)",
        detail: "Vessel was delayed at Kobe port due to inspection. New ETA is 5 days later than contracted. This affects Carta Porte validity and may require VUCEM update.",
        refs: ["Vessel tracking ID: JPK-2026-1133"],
        fields: ["eta"],
        docs: ["bl", "carta_porte"],
        resolved: false,
      },
    ],
  });

  // Documents for operations with fewer docs
  for (const opId of ["NP-2026-001844", "NP-2026-001841", "NP-2026-001842"]) {
    const docTypes = ["invoice", "bl", "packing_list", "coo", "cfdi"];
    for (const type of docTypes) {
      await prisma.document.create({
        data: {
          operationId: opId,
          type,
          filename: `${type}-${opId.slice(-3)}.pdf`,
          status: opId === "NP-2026-001842" ? "extracted" : "ready",
          confidence: 0.88 + Math.random() * 0.1,
          source: "upload",
          uploadedAt: daysAgo(5),
          classifiedAt: daysAgo(5),
          extractedAt: daysAgo(4),
          validatedAt: opId !== "NP-2026-001842" ? daysAgo(4) : null,
        },
      });
    }
  }

  // Audit events
  const auditEvents = [
    { actor: "Alejandro Reyes", event: "operation_created", detail: "Operation NP-2026-001847 created", operationId: "NP-2026-001847", userId: demoUser.id },
    { actor: "AI System", event: "classified", detail: "6 documents classified for NP-2026-001847", operationId: "NP-2026-001847", userId: null },
    { actor: "AI System", event: "exception_flagged", detail: "MVE discrepancy detected — Risk level", operationId: "NP-2026-001847", userId: null },
    { actor: "Mariana López", event: "reviewed", detail: "Operation NP-2026-001846 reviewed", operationId: "NP-2026-001846", userId: mariana.id },
    { actor: "Diego Hernández", event: "approved", detail: "Operation NP-2026-001845 approved", operationId: "NP-2026-001845", userId: diego.id },
    { actor: "AI System", event: "uploaded", detail: "BL and packing list received for NP-2026-001843", operationId: "NP-2026-001843", userId: null },
    { actor: "Ana Patricia Ruiz", event: "correction_requested", detail: "BL weight correction requested", operationId: "NP-2026-001843", userId: ana.id },
    { actor: "Carlos Reyes", event: "approved", detail: "Operation NP-2026-001844 approved", operationId: "NP-2026-001844", userId: carlos.id },
    { actor: "AI System", event: "exception_flagged", detail: "Anti-dumping certificate missing for NP-2026-001842", operationId: "NP-2026-001842", userId: null },
    { actor: "Alejandro Reyes", event: "escalated", detail: "Escalated to compliance manager — anti-dumping issue", operationId: "NP-2026-001842", userId: demoUser.id },
    { actor: "Mariana López", event: "approved", detail: "Operation NP-2026-001841 approved", operationId: "NP-2026-001841", userId: mariana.id },
  ];

  for (let i = 0; i < auditEvents.length; i++) {
    const ev = auditEvents[i];
    await prisma.auditEvent.create({
      data: {
        ...ev,
        entityType: "Operation",
        entityId: ev.operationId,
        createdAt: new Date(Date.now() - (auditEvents.length - i) * 3600000),
      },
    });
  }

  // Approvals
  await prisma.approval.createMany({
    data: [
      { operationId: "NP-2026-001845", userId: diego.id, action: "approved", note: "All docs validated, ready to submit pedimento" },
      { operationId: "NP-2026-001844", userId: carlos.id, action: "approved", note: "CFDI verified, USMCA confirmed" },
      { operationId: "NP-2026-001841", userId: mariana.id, action: "approved", note: "COO under Colombia-Mexico FTA verified" },
      { operationId: "NP-2026-001843", userId: ana.id, action: "correction_requested", note: "BL weight must be corrected before approval" },
      { operationId: "NP-2026-001842", userId: demoUser.id, action: "escalated", note: "Anti-dumping certificate required per PM-06-2025" },
    ],
  });

  // Integrations
  const integrations = [
    // Communication
    { name: "Gmail", slug: "gmail", category: "Communication", status: "connected", dataTypes: ["Documents", "Notifications"], syncHealth: "healthy" },
    { name: "Microsoft Outlook", slug: "outlook", category: "Communication", status: "connected", dataTypes: ["Documents", "Calendar"], syncHealth: "healthy" },
    { name: "WhatsApp Business", slug: "whatsapp", category: "Communication", status: "pending", dataTypes: ["Alerts", "Notifications"] },
    // Storage
    { name: "Google Drive", slug: "gdrive", category: "Storage", status: "connected", dataTypes: ["Documents", "Archive"], syncHealth: "healthy" },
    { name: "SharePoint", slug: "sharepoint", category: "Storage", status: "connected", dataTypes: ["Documents", "Templates"], syncHealth: "healthy" },
    // ERP
    { name: "SAP S/4HANA", slug: "sap-s4", category: "ERP", status: "connected", dataTypes: ["POs", "Invoices", "Payments"], syncHealth: "healthy" },
    { name: "Oracle NetSuite", slug: "netsuite", category: "ERP", status: "pending", dataTypes: ["POs", "Financials"] },
    { name: "Microsoft Dynamics 365", slug: "dynamics365", category: "ERP", status: "disconnected", dataTypes: ["POs", "Finance"] },
    // BI
    { name: "Power BI", slug: "powerbi", category: "BI & Reporting", status: "connected", dataTypes: ["Analytics", "Dashboards"], syncHealth: "healthy" },
    // Government
    { name: "SAT CFDI", slug: "sat-cfdi", category: "Government", status: "connected", dataTypes: ["CFDI", "Tax validation"], syncHealth: "healthy" },
    { name: "VUCEM", slug: "vucem", category: "Government", status: "connected", dataTypes: ["Pedimentos", "COVE"], syncHealth: "healthy" },
    // Customs & Logistics
    { name: "Aduanas Pacífico", slug: "aduanas-pacifico", category: "Customs & Logistics", status: "pending", dataTypes: ["Pedimentos", "Status"] },
    { name: "DHL Carrier", slug: "dhl", category: "Customs & Logistics", status: "connected", dataTypes: ["ETAs", "Tracking"], syncHealth: "healthy" },
    { name: "Maersk ETA API", slug: "maersk", category: "Customs & Logistics", status: "error", dataTypes: ["ETAs", "Vessel tracking"], errorMessage: "API key expired — renewal required" },
  ];

  const now = new Date();
  for (const integ of integrations) {
    await prisma.integration.create({
      data: {
        ...integ,
        lastSyncAt: integ.status === "connected" ? new Date(now.getTime() - Math.random() * 3600000) : null,
        errorMessage: integ.errorMessage ?? null,
        syncHealth: integ.syncHealth ?? null,
      },
    });
  }

  // Academy lessons
  const lessons = [
    // Beginner
    {
      moduleNum: "MOD-01",
      title: "Introduction to Mexican Import Compliance",
      level: "beginner",
      durationMin: 25,
      tags: ["fundamentals", "SAT", "overview"],
      intro: "Get a complete overview of Mexico's import regulatory framework, key agencies, and the role of technology in modern trade compliance.",
      lessons: [
        "Mexico's trade regulatory landscape",
        "Key institutions: SAT, VUCEM, SE, and COFEPRIS",
        "The import lifecycle from PO to customs clearance",
        "Human-in-the-loop: AI's role in compliance",
        "Understanding risk levels and exception management",
      ],
      levelName: "Beginner",
      levelTag: "Start here",
      sortOrder: 1,
    },
    {
      moduleNum: "MOD-02",
      title: "HS Classification and Tariff Schedule",
      level: "beginner",
      durationMin: 40,
      tags: ["HS codes", "tariff", "TIGIE", "classification"],
      intro: "Master the Harmonized System classification used in Mexico's TIGIE. Learn to classify goods correctly and avoid the most common classification errors.",
      lessons: [
        "The Harmonized System: structure and logic",
        "Mexico's TIGIE: 8-digit codes",
        "General rules of classification (GRI 1-6)",
        "Common classification errors and penalties",
        "Tools for classification: SAT consultas and customs databases",
        "Practice: classifying electronic components",
      ],
      levelName: "Beginner",
      levelTag: "Core skill",
      sortOrder: 2,
    },
    {
      moduleNum: "MOD-03",
      title: "Required Import Documents",
      level: "beginner",
      durationMin: 35,
      tags: ["documents", "pedimento", "invoice", "BL", "COO"],
      intro: "Learn every document required for a Mexican import operation: what it must contain, common errors, and how AI validation works.",
      lessons: [
        "The pedimento: structure and required fields",
        "Commercial invoice requirements for SAT",
        "Bill of Lading vs. Airway Bill: key fields",
        "Packing list requirements",
        "Certificate of Origin: types and formats",
        "CFDI 4.0: structure and validation",
        "Carta Porte: when required and how to complete",
      ],
      levelName: "Beginner",
      levelTag: "Core skill",
      sortOrder: 3,
    },
    {
      moduleNum: "MOD-04",
      title: "Customs Valuation Methods",
      level: "beginner",
      durationMin: 45,
      tags: ["valuation", "customs value", "GATT", "MVE"],
      intro: "Understand how customs value is determined under GATT Article 1-7 methods and Mexico's specific MVE requirements.",
      lessons: [
        "GATT Valuation Agreement: the 6 methods",
        "Transaction value: the primary method",
        "Additions and deductions to transaction value",
        "MVE (Minimum Value Estimate): what it is and how it works",
        "When SAT applies alternative valuation methods",
        "Transfer pricing and related-party transactions",
      ],
      levelName: "Beginner",
      levelTag: "Core concept",
      sortOrder: 4,
    },
    // Intermediate
    {
      moduleNum: "MOD-05",
      title: "Anti-Dumping and Trade Defense",
      level: "intermediate",
      durationMin: 50,
      tags: ["anti-dumping", "SECOFI", "trade defense", "duties"],
      intro: "Navigate Mexico's trade defense measures including anti-dumping and countervailing duties, and learn how to identify at-risk product categories.",
      lessons: [
        "Anti-dumping fundamentals: definition and purpose",
        "Mexico's trade defense legal framework (Ley de Comercio Exterior)",
        "How to check if your product has active AD measures",
        "Provisional measures vs. definitive duties",
        "Anti-dumping certificates and exemption procedures",
        "Impact of AD duties on landed cost calculations",
      ],
      levelName: "Intermediate",
      levelTag: "Risk management",
      sortOrder: 5,
    },
    {
      moduleNum: "MOD-06",
      title: "VUCEM and Electronic Filings",
      level: "intermediate",
      durationMin: 55,
      tags: ["VUCEM", "COVE", "e-commerce", "digital", "SAT"],
      intro: "Master Mexico's Ventanilla Única platform for electronic document submission, COVE generation, and digital customs declarations.",
      lessons: [
        "VUCEM: Mexico's single trade window",
        "COVE (Comprobante de Valor Electrónico): creation and submission",
        "Digital signatures and e.firma requirements",
        "Electronic manifest and advance cargo information",
        "VUCEM integration APIs for automation",
        "Common VUCEM errors and resolution",
      ],
      levelName: "Intermediate",
      levelTag: "Digital skills",
      sortOrder: 6,
    },
    {
      moduleNum: "MOD-07",
      title: "Exception Management and Risk Control",
      level: "intermediate",
      durationMin: 60,
      tags: ["exceptions", "risk", "escalation", "compliance"],
      intro: "Build a systematic approach to identifying, classifying, and resolving import compliance exceptions before they become customs problems.",
      lessons: [
        "Exception taxonomy: Risk vs. Warning vs. Review",
        "SAT's automated risk scoring criteria",
        "MVE discrepancy response procedures",
        "Weight and quantity mismatch resolution",
        "Escalation workflows and compliance manager roles",
        "Documentation for exception resolution",
        "Building an exception reduction strategy",
      ],
      levelName: "Intermediate",
      levelTag: "Operations",
      sortOrder: 7,
    },
    {
      moduleNum: "MOD-08",
      title: "Rules of Origin and Free Trade Agreements",
      level: "intermediate",
      durationMin: 65,
      tags: ["origin", "USMCA", "FTA", "TLCUEM", "preferential"],
      intro: "Navigate Mexico's network of free trade agreements and learn how to correctly apply rules of origin to maximize duty savings.",
      lessons: [
        "Mexico's FTA network overview (20+ agreements)",
        "USMCA/T-MEC: rules of origin and certification",
        "Regional value content (RVC) calculation",
        "Tariff change criteria (TC) analysis",
        "Colombia-Mexico FTA: key provisions",
        "EU-Mexico TLCUEM: current and new generation",
        "Self-certification vs. third-party certification",
      ],
      levelName: "Intermediate",
      levelTag: "Savings opportunity",
      sortOrder: 8,
    },
    // Advanced
    {
      moduleNum: "MOD-09",
      title: "IMMEX Program Compliance",
      level: "advanced",
      durationMin: 75,
      tags: ["IMMEX", "maquiladora", "temporary import", "program"],
      intro: "Deep-dive into Mexico's IMMEX maquiladora program: authorization, compliance requirements, virtual operations, and control mechanisms.",
      lessons: [
        "IMMEX program structure and modalities",
        "Authorization requirements and SE registration",
        "Inventory control systems (SIRCE, Edicom)",
        "Virtual operations and transfer procedures",
        "USMCA compliance within IMMEX",
        "IMMEX audits: SAT's verification approach",
        "Program suspension risk factors",
        "IMMEX vs. definitiva: cost-benefit analysis",
      ],
      levelName: "Advanced",
      levelTag: "Specialist",
      sortOrder: 9,
    },
    {
      moduleNum: "MOD-10",
      title: "Audit Defense and SAT Verification",
      level: "advanced",
      durationMin: 80,
      tags: ["SAT audit", "verification", "defense", "penalties"],
      intro: "Prepare for and effectively respond to SAT customs audits, verification procedures, and administrative appeals.",
      lessons: [
        "SAT's customs audit triggers and risk indicators",
        "Verification of origin procedure",
        "Response to PAMA (Acta de Inicio de Procedimiento Administrativo)",
        "Reviewing and correcting pedimentos post-clearance",
        "Voluntary correction (autocorrección) procedures",
        "Calculating and minimizing customs penalties",
        "Administrative appeals (recurso de revocación)",
        "Preparing the compliance evidence package",
      ],
      levelName: "Advanced",
      levelTag: "Expert level",
      sortOrder: 10,
    },
    {
      moduleNum: "MOD-11",
      title: "Transfer Pricing for Customs Valuation",
      level: "advanced",
      durationMin: 70,
      tags: ["transfer pricing", "related parties", "OCDE", "customs value"],
      intro: "Master the intersection of transfer pricing and customs valuation for related-party transactions, including OCDE guidelines as applied in Mexico.",
      lessons: [
        "When transfer pricing intersects with customs valuation",
        "OECD arm's-length principle in customs context",
        "Price adjustment mechanisms for customs",
        "Mexican customs authority's TP documentation requirements",
        "Advance pricing agreements (APAs) for imports",
        "Case studies: related-party import valuation",
      ],
      levelName: "Advanced",
      levelTag: "Expert level",
      sortOrder: 11,
    },
    {
      moduleNum: "MOD-12",
      title: "Technology and AI in Trade Compliance",
      level: "advanced",
      durationMin: 45,
      tags: ["AI", "automation", "digitization", "RegTech"],
      intro: "Understand how AI and automation are reshaping trade compliance, and how to integrate technology into your compliance program.",
      lessons: [
        "AI document classification: how it works",
        "Confidence scoring and human-in-the-loop review",
        "ERP integration for compliance data",
        "VUCEM API automation strategies",
        "Building a compliance data warehouse",
        "SOC 2 and ISO 27001 for trade compliance systems",
      ],
      levelName: "Advanced",
      levelTag: "Future-ready",
      sortOrder: 12,
    },
  ];

  for (const lesson of lessons) {
    await prisma.academyLesson.create({ data: lesson });
  }

  // Glossary
  const glossaryTerms = [
    { term: "Pedimento", definition: "Mexico's official customs declaration document required for all commercial imports and exports. Contains HS codes, declared values, origin, regime, and broker information.", category: "Documents", relatedIds: [] },
    { term: "MVE", definition: "Minimum Value Estimate (Valor Estimado Mínimo) — SAT's reference price database for imported goods used to detect undervaluation. Mandatory comparison for all imports.", category: "Valuation", relatedIds: [] },
    { term: "VUCEM", definition: "Ventanilla Única de Comercio Exterior Mexicano — Mexico's single electronic window for all foreign trade document submissions and government interactions.", category: "Systems", relatedIds: [] },
    { term: "CFDI", definition: "Comprobante Fiscal Digital por Internet — Mexico's electronic tax invoice standard (version 4.0). Required for all taxable commercial transactions.", category: "Documents", relatedIds: [] },
    { term: "TIGIE", definition: "Tarifa del Impuesto General de Importación y Exportación — Mexico's tariff schedule based on the Harmonized System, specifying duty rates for all HS codes.", category: "Tariff", relatedIds: [] },
    { term: "IMMEX", definition: "Industria Manufacturera, Maquiladora y de Servicios de Exportación — Mexico's temporary import program for manufacturing and export operations.", category: "Programs", relatedIds: [] },
    { term: "Incoterm", definition: "International Commercial Terms — standardized trade terms (ICC) defining responsibilities for freight, insurance, and customs between buyer and seller.", category: "Trade Terms", relatedIds: [] },
    { term: "COO", definition: "Certificate of Origin — document certifying the country of manufacture of exported goods. Required to claim preferential tariff rates under FTAs.", category: "Documents", relatedIds: [] },
    { term: "USMCA", definition: "United States-Mexico-Canada Agreement (T-MEC in Mexico) — free trade agreement replacing NAFTA. Requires rules of origin compliance for preferential tariff rates.", category: "Trade Agreements", relatedIds: [] },
    { term: "Carta Porte", definition: "Waybill/transport document required under SAT regulations for the movement of goods within Mexico. Must be attached to CFDI since 2022.", category: "Documents", relatedIds: [] },
    { term: "Fracción Arancelaria", definition: "Mexico's 8-digit tariff classification code based on the Harmonized System. Determines duty rate, restrictions, and applicable regulations.", category: "Classification", relatedIds: [] },
    { term: "COVE", definition: "Comprobante de Valor Electrónico — electronic value document submitted through VUCEM containing declared value, quantity, and origin information.", category: "Systems", relatedIds: [] },
    { term: "Despacho Aduanal", definition: "Customs clearance process in Mexico, conducted by a licensed customs broker (agente aduanal) holding a valid SAT patent.", category: "Process", relatedIds: [] },
    { term: "Agente Aduanal", definition: "Licensed customs broker in Mexico, authorized by SAT to conduct import/export customs clearance. Required for commercial shipments above MXN 3,000.", category: "Parties", relatedIds: [] },
    { term: "IVA", definition: "Impuesto al Valor Agregado — Mexico's value-added tax of 16% applied to most imports. Additional IVA provisional payment may apply for certain goods.", category: "Taxes", relatedIds: [] },
    { term: "IEPS", definition: "Impuesto Especial sobre Producción y Servicios — Mexico's excise tax applied to specific categories including tobacco, alcohol, energy drinks, and certain imported goods.", category: "Taxes", relatedIds: [] },
    { term: "Régimen Aduanero", definition: "Customs regime determining the purpose and conditions of import/export. Common regimes: A1 (definitive import), IT (temporary import), D1 (definitive export).", category: "Customs", relatedIds: [] },
    { term: "Valoración Aduanera", definition: "Customs valuation — the process of determining the customs value of imported goods per GATT Valuation Agreement methods.", category: "Valuation", relatedIds: [] },
    { term: "Cuota Compensatoria", definition: "Countervailing or anti-dumping duty imposed on specific products from specific countries to offset unfair trade practices.", category: "Duties", relatedIds: [] },
    { term: "PAMA", definition: "Procedimiento Administrativo en Materia Aduanera — administrative customs procedure initiated when SAT detects a potential violation during or after customs clearance.", category: "Enforcement", relatedIds: [] },
    { term: "Patente Aduanal", definition: "Customs broker license number issued by SAT. Appears on all pedimentos. Required to practice as a licensed customs broker in Mexico.", category: "Compliance", relatedIds: [] },
    { term: "Glosa", definition: "SAT's post-clearance audit review of pedimentos and supporting documents. Can occur up to 5 years after customs clearance.", category: "Enforcement", relatedIds: [] },
    { term: "DTA", definition: "Derecho de Trámite Aduanero — customs processing fee charged per pedimento, calculated as a percentage of the customs value.", category: "Duties", relatedIds: [] },
    { term: "Rectificación", definition: "Amendment to a submitted pedimento. Classified as Type A (before clearance), Type B (after clearance), or Type C (during customs examination).", category: "Procedures", relatedIds: [] },
    { term: "Embargo Precautorio", definition: "Precautionary seizure of imported goods by SAT when a compliance violation is suspected. Goods are held pending resolution of the PAMA.", category: "Enforcement", relatedIds: [] },
    { term: "RFC", definition: "Registro Federal de Contribuyentes — Mexico's taxpayer identification number issued by SAT. Required for all commercial transactions and customs declarations.", category: "Compliance", relatedIds: [] },
    { term: "Autocorrección", definition: "Voluntary correction procedure allowing importers to amend pedimentos and pay outstanding duties with reduced penalties before SAT initiates an audit.", category: "Procedures", relatedIds: [] },
    { term: "NOM", definition: "Norma Oficial Mexicana — mandatory technical standard issued by Mexican government agencies. Many imported products must comply with applicable NOMs before customs clearance.", category: "Regulations", relatedIds: [] },
    { term: "Previo", definition: "Pre-clearance examination of goods at the bonded warehouse before pedimento submission. Common for first-time shipments or high-risk goods.", category: "Procedures", relatedIds: [] },
    { term: "Reconocimiento Aduanero", definition: "Physical or documentary customs examination of imported goods after pedimento submission, triggered by SAT's traffic light system (semáforo fiscal).", category: "Customs", relatedIds: [] },
  ];

  for (const term of glossaryTerms) {
    await prisma.glossaryTerm.create({ data: term });
  }

  // Sample assistant conversation
  const conv = await prisma.assistantConversation.create({
    data: { userId: demoUser.id, context: "Operations inbox" },
  });

  await prisma.assistantMessage.createMany({
    data: [
      {
        conversationId: conv.id,
        role: "user",
        content: "Why is NP-2026-001847 flagged as at risk?",
        relatedLessons: [],
        createdAt: daysAgo(1),
      },
      {
        conversationId: conv.id,
        role: "assistant",
        content: "Operation NP-2026-001847 (Lumitech Optics) is flagged **At Risk** due to a significant MVE discrepancy: the declared unit price of USD 147.40 is 23% below SAT's Minimum Value Estimate of USD 191.20 for HS 9002.11 lens assemblies. This may trigger a SAT value verification procedure.",
        relatedLessons: ["mod-04", "mod-07"],
        suggestedAction: "Request supplier price justification and attach transfer pricing study.",
        createdAt: daysAgo(1),
      },
    ],
  });

  console.log("✓ Database seeded successfully!");
  console.log("  - 7 operations created");
  console.log("  - 5 users created");
  console.log("  - 7 suppliers, 4 brokers");
  console.log("  - 14 integrations");
  console.log("  - 12 academy lessons");
  console.log("  - 30 glossary terms");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
