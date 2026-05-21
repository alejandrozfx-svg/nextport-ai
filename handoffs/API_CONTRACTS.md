# Nextport AI — API Contracts

All routes live under `/api/`. All responses are JSON. No auth required in current demo build.

---

## Operations

### `GET /api/operations`
List all operations.

**Query params:**
- `status` — filter by `risk | review | ready`
- `search` — full-text search across id, supplier name, pedimento, origin, destination

**Response:**
```json
{
  "operations": [
    {
      "id": "NP-2026-001847",
      "supplier": { "name": "Lumitech Optics Co., Ltd.", "shortName": "Lumitech" },
      "broker": { "name": "Aduanas Pacífico S.A." },
      "origin": "SZX",
      "destination": "MEX",
      "mode": "air",
      "incoterm": "CIF",
      "eta": "2026-05-24T00:00:00.000Z",
      "etaDelta": "+2d",
      "value": 184250,
      "currency": "USD",
      "status": "risk",
      "owner": { "name": "Alejandro Reyes", "initials": "AR" },
      "pedimento": "26  48  3654  0012847",
      "hsBucket": "HS 9002.11",
      "docCount": 6,
      "docsExpected": 6,
      "exceptionCount": 2
    }
  ]
}
```

---

### `GET /api/operations/[id]`
Full operation detail including all relations.

**Response:**
```json
{
  "operation": {
    "id": "NP-2026-001847",
    "supplier": { "name": "...", "shortName": "...", "country": "CN", "city": "Shenzhen" },
    "broker": { "name": "...", "patent": "3654" },
    "origin": "SZX",
    "destination": "MEX",
    "mode": "air",
    "incoterm": "CIF",
    "eta": "2026-05-24T00:00:00.000Z",
    "etaDelta": "+2d",
    "value": 184250,
    "currency": "USD",
    "pedimento": "26  48  3654  0012847",
    "hsBucket": "HS 9002.11",
    "status": "risk",
    "owner": { "name": "Alejandro Reyes", "initials": "AR", "role": "admin" },
    "documents": [
      {
        "id": "clx...",
        "type": "pedimento",
        "filename": "pedimento-NP001847.pdf",
        "status": "validated",
        "confidence": 0.91,
        "extractedFields": [
          { "fieldKey": "pedimentoNum", "label": "Pedimento Number", "value": "26  48  3654  0012847", "confidence": 0.98, "mismatch": false }
        ],
        "validationChecks": [
          { "checkName": "value_match", "passed": false, "detail": "Invoice value USD 184,250 vs pedimento USD 178,920" }
        ]
      }
    ],
    "exceptions": [
      {
        "id": "clx...",
        "kind": "risk",
        "title": "Invoice value vs pedimento mismatch",
        "detail": "...",
        "refs": ["Invoice §Total", "Pedimento §Valor en Aduana"],
        "fields": ["value"],
        "docs": ["invoice", "pedimento"],
        "resolved": false
      }
    ],
    "aiSummary": { "summary": "MVE discrepancy detected..." },
    "approvals": [
      { "id": "clx...", "action": "correction_requested", "note": "...", "createdAt": "...", "user": { "name": "Alejandro Reyes" } }
    ],
    "auditEvents": [
      { "id": "clx...", "actor": "system", "event": "document_classified", "detail": "...", "createdAt": "..." }
    ]
  }
}
```

---

### `POST /api/operations/[id]/approve`
Record an approval action.

**Body:**
```json
{
  "action": "approved | held | review | escalated | correction_requested | exported",
  "note": "Optional explanation"
}
```

**Response:**
```json
{
  "approval": { "id": "clx...", "action": "approved", "createdAt": "..." }
}
```

**Side effects:**
- Creates `Approval` record
- Creates `AuditEvent` record with actor = demo user

---

## Documents

### `GET /api/documents`
List all documents.

**Query params:**
- `type` — filter by doc type
- `operationId` — filter by operation
- `status` — filter by processing status

**Response:**
```json
{
  "documents": [
    {
      "id": "clx...",
      "operationId": "NP-2026-001847",
      "type": "pedimento",
      "filename": "pedimento-NP001847.pdf",
      "status": "validated",
      "confidence": 0.91,
      "source": "upload",
      "uploadedAt": "2026-05-21T09:14:00.000Z",
      "operation": { "id": "NP-2026-001847" },
      "extractedFieldCount": 12,
      "validationCheckCount": 5
    }
  ]
}
```

---

### `POST /api/documents/scan`
Simulate document scanning / upload pipeline.

**Body:**
```json
{
  "operationId": "NP-2026-001847",
  "files": ["invoice-new.pdf", "packing-list-v2.pdf"]
}
```

**Response:**
```json
{
  "jobId": "scan_1234567890",
  "documents": [
    { "id": "clx...", "filename": "invoice-new.pdf", "status": "uploaded" }
  ],
  "message": "Processing started. Documents will be classified within 30 seconds."
}
```

---

## Integrations

### `GET /api/integrations`
List all integrations.

**Response:**
```json
{
  "integrations": [
    {
      "id": "clx...",
      "name": "SAT · VUCEM",
      "slug": "sat-vucem",
      "category": "Government",
      "status": "connected",
      "lastSyncAt": "2026-05-21T08:00:00.000Z",
      "syncHealth": "healthy",
      "dataTypes": ["pedimento", "declaracion_valor", "cove"]
    }
  ]
}
```

---

### `POST /api/integrations/[id]/sync`
Simulate a manual sync for an integration.

**Body:** (empty)

**Response:**
```json
{
  "integration": {
    "id": "clx...",
    "status": "connected",
    "lastSyncAt": "2026-05-21T12:34:56.000Z",
    "syncHealth": "healthy"
  }
}
```

---

## Intelligence

### `GET /api/intelligence`
Aggregate analytics data.

**Response:**
```json
{
  "kpis": {
    "documentsClassified": 42,
    "fieldsExtracted": 387,
    "validationsRun": 210,
    "avgConfidence": 0.89,
    "operationsAtRisk": 2,
    "missingDocuments": 3
  },
  "operationsByStatus": [
    { "status": "risk", "count": 2 },
    { "status": "review", "count": 2 },
    { "status": "ready", "count": 3 }
  ],
  "topExceptionOperations": [
    { "id": "NP-2026-001847", "supplier": "Lumitech", "exceptionCount": 3 }
  ]
}
```

---

## Audit

### `GET /api/audit`
Paginated audit trail.

**Query params:**
- `page` — default 1
- `limit` — default 20
- `operationId` — filter by operation

**Response:**
```json
{
  "events": [
    {
      "id": "clx...",
      "actor": "system",
      "event": "document_classified",
      "detail": "Pedimento classified with 91% confidence",
      "operationId": "NP-2026-001847",
      "createdAt": "2026-05-21T09:14:00.000Z"
    }
  ],
  "total": 127,
  "page": 1,
  "pages": 7
}
```

---

## Academy

### `GET /api/academy`
List all lessons with optional progress.

**Query params:**
- `level` — filter by `beginner | intermediate | advanced`
- `tag` — filter by tag

**Response:**
```json
{
  "lessons": [
    {
      "id": "clx...",
      "moduleNum": "01",
      "title": "What is an import operation?",
      "level": "beginner",
      "durationMin": 22,
      "tags": ["Operations", "Documents"],
      "intro": "...",
      "levelName": "Fundamentals",
      "progress": null
    }
  ]
}
```

---

### `POST /api/academy/[lessonId]/progress`
Mark lesson as started or completed.

**Body:**
```json
{
  "completed": true,
  "userId": "clx..."
}
```

**Response:**
```json
{
  "progress": {
    "id": "clx...",
    "lessonId": "clx...",
    "completed": true,
    "doneAt": "2026-05-21T12:00:00.000Z"
  }
}
```

---

## Assistant

### `POST /api/assistant`
Send a message to Nextport Tutor.

**Body:**
```json
{
  "message": "What is MVE?",
  "context": "NP-2026-001847",
  "conversationId": "clx..."
}
```

**Response:**
```json
{
  "response": "MVE (Manifestación de Valor) is the customs valuation declaration...",
  "relatedLessons": ["mod-08"],
  "suggestedAction": "Review Module 08: Manifestación de Valor"
}
```

**Current implementation:** Mock responses from `src/lib/mock-ai.ts`. Response is deterministic based on keyword matching. `conversationId` creates a new conversation if not provided.

---

## Seed

### `POST /api/seed`
Re-run the database seed (dev only).

**Response:**
```json
{ "message": "Seeded successfully" }
```

**Warning:** Deletes all existing data before seeding. Only callable in development.

---

## Validation rules (Zod)

Located in `src/lib/validations.ts`:

- `approveSchema` — `{ action: z.enum([...]), note: z.string().optional() }`
- `assistantSchema` — `{ message: z.string().min(1).max(2000), context: z.string().optional(), conversationId: z.string().optional() }`
- `scanSchema` — `{ operationId: z.string(), files: z.array(z.string()).min(1).max(20) }`
