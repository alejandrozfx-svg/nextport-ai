# Nextport AI — Codex Task Breakdown

Each task below is scoped, self-contained and safe to pick up independently. Read `README.md` first.

---

## Priority 1 — Core completeness

### TASK-01: Wire docsExpected from database
**File:** `src/app/api/operations/route.ts`
**Problem:** `docsExpected` is hardcoded to `6` for all operations.
**Fix:** Add a `docsExpected` field to the `Operation` model in Prisma schema, update seed.ts to set it per operation (7 for ops with COO, 6 for standard, 5 for land shipments), and return it from the API.
**Owner hint:** Claude or Codex
**Effort:** ~1h

### TASK-02: Add PDF preview component
**File:** `src/components/operation-detail/DocPreview.tsx`
**Problem:** DocPreview renders a placeholder div. It should render a simulated document visual.
**Fix:** Build a styled component that looks like a real document for each doc type (pedimento, invoice, BL, packing list, MVE). Use monospace text blocks and table-like layouts to simulate document structure. No real PDF needed — just convincing visuals.
**Owner hint:** Codex
**Effort:** ~3h

### TASK-03: Fix Academy progress userId
**Files:** `src/app/api/academy/[lessonId]/progress/route.ts`, `src/app/console/academy/[lessonId]/page.tsx`
**Problem:** Progress API uses hardcoded userId because there's no auth session.
**Fix:** Store userId in localStorage on sign-in (already done in landing page). Read it in the API route via a custom header or query param until real auth is added.
**Owner hint:** Codex
**Effort:** ~45min

### TASK-04: Empty states for all list views
**Files:** Operations inbox, Documents page, Academy catalog, Integrations page
**Problem:** Some lists show nothing if API returns empty array, with no visual feedback.
**Fix:** Add empty state components with an icon, a heading and a CTA button. Follow the existing glass-panel style.
**Owner hint:** Codex
**Effort:** ~2h

---

## Priority 2 — Richer data

### TASK-05: Expand seed data — more Academy lessons
**File:** `prisma/seed.ts`
**Problem:** Only modules 1-6 are seeded. Design specifies modules 7-14 (Mexico compliance, governance, advanced scenarios).
**Fix:** Add the following module titles to the seed:
- Module 07: Pedimento basics (intermediate, 32 min)
- Module 08: MVE — Manifestación de Valor (intermediate, 26 min)
- Module 09: VUCEM workflow (intermediate, 28 min)
- Module 10: HS code classification and NOM compliance (advanced, 35 min)
- Module 11: Supplier exception trends (advanced, 22 min)
- Module 12: AI confidence and governance (advanced, 30 min)
**Owner hint:** Codex
**Effort:** ~1h

### TASK-06: Expand mock AI responses
**File:** `src/lib/mock-ai.ts`
**Problem:** Only 10 topic patterns are mapped. Missing: NOM compliance, VUCEM, anti-dumping, fracción arancelaria, IMMEX.
**Fix:** Add 10 additional response patterns with realistic, practical answers and link them to specific lesson IDs.
**Owner hint:** Codex
**Effort:** ~1.5h

### TASK-07: Add audit events to seed
**File:** `prisma/seed.ts`
**Problem:** Audit events in seed are minimal (2-3 per operation). Security & Audit page needs richer history.
**Fix:** Add 30+ audit events spread over 30 days covering: document uploads, classifications, field extractions, exceptions raised, approvals, integration syncs, and user actions. Vary actors between all 5 users.
**Owner hint:** Codex
**Effort:** ~1.5h

### TASK-08: Add glossary terms seed
**File:** `prisma/seed.ts`
**Problem:** Verify at least 30 glossary terms are seeded. Categories should be: Documents, Compliance, Trade, Logistics, AI.
**Fix:** Review and expand if needed. Each term needs: term, definition (2-3 sentences), category, relatedIds array.
**Owner hint:** Codex
**Effort:** ~1h

---

## Priority 3 — Polish & QA

### TASK-09: Responsive layout fixes
**Files:** All console pages
**Problem:** Layout uses fixed 240px sidebar and assumes 1280px+ viewport. Smaller screens may break.
**Fix:** Add a collapsible mobile sidebar. Use `md:` breakpoint. Show hamburger menu on mobile. Keep sidebar always-visible on desktop (≥1024px).
**Owner hint:** Codex
**Effort:** ~3h

### TASK-10: Integration sync simulation improvements
**File:** `src/components/integrations/IntegrationsPage.tsx`, `src/app/api/integrations/[id]/sync/route.ts`
**Problem:** Sync button updates `lastSyncAt` but the UI doesn't show a loading state or success feedback.
**Fix:** Add a loading spinner on the sync button, a success toast (use a simple CSS animation), and update the sync health indicator optimistically before the API responds.
**Owner hint:** Codex
**Effort:** ~1.5h

### TASK-11: Add "Export audit package" action
**File:** `src/components/operation-detail/ApprovalRail.tsx`
**Problem:** Export button exists but doesn't do anything meaningful.
**Fix:** On click, generate a JSON blob of the operation data (id, supplier, documents, extracted fields, exceptions, approval log) and trigger a browser download as `audit-{operationId}.json`. Also create an AuditEvent record via the API.
**Owner hint:** Codex
**Effort:** ~1h

### TASK-12: Intelligence page chart improvements
**File:** `src/components/intelligence/IntelligencePage.tsx`
**Problem:** Charts use static demo data, not API data.
**Fix:** Update `/api/intelligence/route.ts` to return real aggregated counts from Prisma. Wire the component to fetch from that endpoint. Add a loading skeleton for each chart.
**Owner hint:** Claude or Codex
**Effort:** ~2h

---

## Priority 4 — Future (Later)

### TASK-13: Real authentication
Add next-auth with Prisma adapter. Email/password credentials provider. Protect all `/console/*` routes with middleware. Keep demo@nextport.ai / demo123 working.
**Owner hint:** Claude
**Effort:** ~4h

### TASK-14: Wire Claude API for Nextport Tutor
Replace mock-ai.ts with a real Claude API call. Use claude-sonnet-4-6 model. Add system prompt with trade compliance context. Use streaming for better UX. Store full conversation in AssistantMessage table.
**Owner hint:** Claude
**Effort:** ~3h

### TASK-15: Real file upload
Replace scan modal simulation with real file upload. Store files in Vercel Blob or S3. Extract metadata from filename. Create Document records immediately on upload.
**Owner hint:** Claude
**Effort:** ~4h

### TASK-16: Vercel deployment checklist
- Verify `prisma generate` runs in `postinstall`
- Add `DATABASE_URL` to Vercel env
- Confirm build output is stable
- Add `vercel.json` only if needed for rewrites
- Document deployment steps in README
**Owner hint:** Codex
**Effort:** ~1h
