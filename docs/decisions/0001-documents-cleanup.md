# ADR 0001 · Documents page cleanup (Option A)

**Date:** 2026-05-23
**Status:** Accepted
**Page affected:** `/console/documents` (`src/components/documents/DocumentsPage.tsx`)
**Related files:** `src/lib/i18n.ts` (audit-pull keys)

---

## Context — why this happened

The `/console/documents` page accumulated **6 distinct product personalities** layered on top of each other across iterations:

1. A search/filter tool (toolbar + 7 filter selects)
2. A scenario-based workflow (5 audit playbooks)
3. A document inspector (always-on Evidence Viewer with PDF iframe)
4. A KPI dashboard (4-card metric strip)
5. An export-history log (Recent pulls)
6. A scan-document entry point (Scan button → modal)

At the same time it carried duplications and dishonesty:

- **Three places filtered by document type:** type chips, search box, drawer status. The user could not tell which controlled what.
- **Playbooks duplicated manual filters:** "SAT inquiry" = `period=30d + status=ready`, also reachable via the drawer. Both visible simultaneously made it look like there were 11 controls when there were 5.
- **KPI strip was decoration:** "Need review · 1" was not clickable. "With mismatches · 2" not clickable. Vanity counters.
- **Cards and Table both available:** Cards duplicated the table view with worse density.
- **Always-on Evidence Viewer ate 45% of horizontal:** when the job is *bulk pull for audit*, a single-PDF inspector should not own the screen.
- **Two of five playbooks did not do what they claimed:** "SOC 2 random sample" only set `sort=recent` (no actual sampling). "Supplier dispute" only set `sort=supplier` (the user still had to manually pick the supplier afterwards).
- **The "Recent pulls" history was theatre:** the `Re-export` button did nothing, the SHA was generated client-side from `Math.random()`, the demo data was pre-seeded so the log looked busy from the first visit.
- **Mentioned but undelivered crypto guarantees:** the success banner read "Tamper-evident manifest signed". The manifest was a plain JSON object with no signature, no certificate chain, no real hash. False compliance grade claim.
- **The "Scan Document" CTA in the top-right** redirected users away from the pull-evidence job into a separate upload flow that belongs to Operations or the global TopBar.

After every critique round the page accumulated more without removing anything. Net result: **~120 interactive elements visible at first paint**. Linear shows ~12 on a comparable issues page. Notion ~8.

## Decision

Execute **Option A: drastic cleanup in place** instead of Option B (kill the page and move the function into Operation Detail).

Reasons option B was deferred:
- B requires touching Sidebar nav, Operation Detail, creating a new `/audit-pull` page, removing this one. Bigger blast radius.
- B is more correct architecturally but the demo loses the "look how thoughtful the audit workflow is" surface.
- A is reversible. B is not.
- If A still feels broken after this cleanup, B is the next escalation.

## What changes

### Removed

| Element | Why |
|---|---|
| `view: "cards" \| "table"` state and the entire Cards JSX | Duplicate of table. Default was already table. Cards = visual noise. |
| KPI strip (4 metric cards: Documents · Need review · Avg confidence · With mismatches) | Three of the four were not clickable. The fourth (Documents count) is not a KPI. Replaced by inline status line in the header subtitle. |
| Type chips row (9 chips: All types · Pedimento · Factura · ...) | Duplicated by the Status / Type filter in the drawer. |
| Scan Document button + modal + scan state hooks | Belongs to Operations or the TopBar global Scan action. Wrong page. |
| Playbooks "SOC 2 random sample" and "Supplier dispute evidence" | Did not actually implement what their name claimed. Kept only the 3 honest ones (SAT inquiry, Quarterly review, QA hunt). |
| Always-on Evidence Viewer side panel | Converted to a modal that opens on row click. The audit-pull job is bulk selection, not single-doc inspection. |
| Recent pulls "Re-export" button | Did nothing. Removed entirely. |
| Demo-seeded recent pulls (4 fake historic entries) | Now starts empty. Pulls only appear after the user actually exports something in-session. |
| `view`, `expandedRow` state for cards | No longer needed. |

### Fixed

| Element | Change |
|---|---|
| Page header copy | "Bóveda de evidencia" → "Extraer evidencia" / "Pull evidence". Less aspirational, more orientational. Subtitle shortened. |
| "Export audit ZIP" label | Renamed to "Export audit manifest". The filename is `.json`, not `.zip`. No more lying. |
| Manifest SHA | Real Web Crypto API SHA-256 over the JSON manifest. Previous version was `Math.random()` hex segments dressed up as a hash. |
| Indicators (amber/red dots) | Visible legend rendered below the table, not buried in tooltips. |
| "Need review" + "Mismatches" KPIs | Replaced by clickable status chips in the header that toggle the corresponding filter. |
| Recent pulls list | Stays as informational read-only log. SHA-256 shown is the real one computed at export time. |

### Added

| Feature | Why |
|---|---|
| `?op=NP-XXXX-XXXXXX` URL-param reader | Deep-link from Operation Detail: arriving with `?op=NP-2026-001847` shows a breadcrumb "Pulling evidence for NP-2026-001847 · Lumitech" and pre-selects all of that operation's docs. |
| Breadcrumb bar (when `?op=` set) | Makes the contextual entry visually obvious + offers a Clear context CTA. |
| Indicator legend | Two-line legend under the toolbar: `● < 90% confidence field` and `● failed validation check`. |

## What stays

Pieces that survived the cleanup because they pull their weight:

- The advanced filters drawer (period, confidence, status, supplier, operation, source) — these are the real differentiator vs Operations.
- Full-text search (filename, supplier, operation, extracted field VALUES)
- Sort dropdown (recent, lowest confidence, supplier, status)
- Bulk select (checkbox per row, select-all in header)
- 3 audit playbooks (SAT inquiry, Quarterly review, Classifier QA hunt) — kept because they really do compose multi-filter presets in one click.
- Export-success banner with real SHA-256 + link to `/console/security` audit trail.
- Recent evidence pulls log (read-only now, no re-export button).
- The dense table layout (now the only view).

## Tradeoffs accepted

1. **Loses visual density on first paint.** Some demos liked the busy "look how much we can do" feel of the playbook cards + KPI strip + cards + viewer all visible. Now it looks like a focused tool.
2. **`/console/documents` no longer accepts new uploads.** The Scan flow lives elsewhere now. If a user lands here expecting to add a document, they have to navigate. Acceptable cost.
3. **Single-doc inspection now takes one extra click** (open modal). For audit pulls this is correct. For someone doing single-doc deep-dive it is slightly slower.

## Behavior contract for future agents

Anyone (Claude, Codex, human) modifying `DocumentsPage.tsx` should:

1. **Keep the page single-purpose: pull evidence + export.** If you want to add scanning, upload, classification QA workflows, etc., create a new route. Do not stuff them in here.
2. **Maintain the playbook discipline.** A playbook must actually apply a meaningful filter combination different from what one manual control does. If you add `SOC 2 sampling` back, implement the actual sampling — don't ship a placeholder.
3. **Maintain hash honesty.** The manifest SHA shown to the user must be a real cryptographic hash of the exported JSON. Use `crypto.subtle.digest("SHA-256", ...)`. Do not regenerate with `Math.random()`.
4. **Do not re-add the Evidence Viewer as always-on.** It is a modal on purpose. If you want a side panel back, justify with a real bulk-selection-with-preview workflow we don't have.
5. **`?op=` URL param contract:** if present and a valid operation ID, on mount the page must (a) display the breadcrumb, (b) pre-filter `operationFilter` to that op, (c) pre-select all docs of that op. Tests should cover this.
6. **Cards view stays dead.** If you bring it back, document why the table fails for the audit-pull job.
7. **Reference this ADR in your PR description** if your change touches the audit-pull flow.

## Open questions for option B (future)

If we ever revisit Option B (kill this page, move "Export evidence pack" into Operation Detail):

- The bulk multi-operation pull case (SAT inquiry over Q1) still needs a home. Either `/console/audit-pull` (new minimal page) or a "Pull across operations" action inside Security's audit trail tab.
- Recent pulls log naturally moves into `/console/security` as a tab. Security already owns the audit trail concept.
- Sidebar loses one entry.

When B is executed, this ADR should be linked from the new ADR as the precursor that made it obvious.

---

## Execution log

**Iteration 1 (2026-05-23) — initial cleanup, the "honesty pass":**

- Slimmed `PLAYBOOKS` from 5 to 3 (removed `soc2` and `supplier` — they were fake)
- Removed demo-seeded `DEMO_RECENT_PULLS` — list starts empty
- Replaced `generateManifestSha()` (Math.random) with `computeManifestSha()` using Web Crypto SHA-256
- `handleExportZip` is now async, computes real hash over the manifest before download
- Added i18n keys: `pullEvidence*`, `pullContext*`, `pullLegend*`, `pullChip*`, `pullViewer*`, `pullExport*`

**Iteration 2 (2026-05-23) — Codex/Claude synthesized P0 plan executed:**

The entire `export function DocumentsPage` JSX was rewritten from scratch (the file went from ~1700 lines to ~1320). All the deletions listed above were enacted in this rewrite:

| Item from P0 plan | How it was executed |
|---|---|
| Default view = table, no Cards | Removed `view` state and the entire Cards JSX block |
| Type chips row removed | Type is now a select inside the filters drawer |
| Scan Document button removed | Removed Scan button + scan modal + scan state hooks (`scanOpen`, `scanFilename`, `scanOpId`, `scanning`, `handleScan`) |
| EvidenceViewer → modal | Added `viewerDocId` state. Row click on the type/filename cell sets it. Renders an absolute-positioned overlay with the viewer inside, click outside or X to close |
| Recent pulls section removed | Section deleted from the page. Future agent: move into `/console/security` as a tab |
| KPI strip → status line + 2 chips | Counts collapsed into the PageHeader subtitle. "Need review" and "With mismatches" became clickable filter chips below the header |
| Playbooks → 3 chips in a row | Was 5 cards. Now a single row of pill chips with the icon + title; `descKey` shown in `title` tooltip |
| Export label honesty | Button now says `Export audit manifest (N)`. The downloaded file is `nextport-audit-{ts}.json` (matches reality) |
| Indicator legend visible | Two-row legend rendered between table and empty-state, with amber/red dots and i18n labels |
| Deep-link `?op=NP-XXX` | `useSearchParams()` reads `op` param. On match: pre-filters operation + pre-selects all docs. Renders a brand-soft breadcrumb at the top with operation id + supplier + Clear context link |
| Page wrapped in `<Suspense>` | `src/app/console/documents/page.tsx` now wraps `DocumentsPage` in `<Suspense fallback={null}>` because `useSearchParams` requires it under static prerendering |

**Lines of code:** ~1708 → ~1320 (-388 lines net, after writing the new clean component)
**Bundle:** `/console/documents` 12.7 KB → 10.6 KB
**Visible interactive elements at first paint:** ~120 → ~25

## Behavior contract for future agents — UPDATED

The original "Behavior contract" §7 items still apply. Adding these enforcement points after iteration 2:

8. **Do not re-add the Scan Document button to this page.** It lives in the global TopBar (`onScan` prop wired via `ConsoleShell`).
9. **Recent pulls section was REMOVED, not just hidden.** If you want it back, propose a new ADR explaining the user job it solves. Default position: it belongs in `/console/security` as an `Evidence exports` tab.
10. **The Evidence Viewer modal pattern is non-negotiable.** Selecting docs (checkbox) and inspecting one (row click) are two different jobs. Do not regress to an always-on side panel.
11. **The 3 KPI cards strip is GONE.** If you want metrics back, make them clickable chips that filter the table. Never decorative.
12. **Filter chips for `pullChipNeedsReview` and `pullChipMismatches` are clickable** and toggle the corresponding filter. Maintain that behavior.
13. **`?op=` deep-link contract:** verify it still works after any refactor. There are no tests yet — add some if you touch the `useEffect` that reads `searchParams`.

---

**Files changed in this iteration:**
- `src/components/documents/DocumentsPage.tsx` (major rewrite of the component, helpers untouched)
- `src/lib/i18n.ts` (added pullEvidence* + audit playbook keys, removed fake playbook keys are tolerated as dead code for now)
- `src/app/console/documents/page.tsx` (wrapped in `<Suspense>` for `useSearchParams`)
- `docs/decisions/0001-documents-cleanup.md` (this file — updated with execution log)

---

**Iteration 3 (2026-05-23) — P1 smart additions, synthesized from Claude + Codex audits:**

P0 removed the noise. P1 adds the intelligence that justifies why this page deserves a sidebar slot.

| Item | What it does | Where |
|---|---|---|
| Playbook preview count | Each playbook chip now shows a small count badge — "how many docs would I see if I clicked this?" — computed live from the dataset via `previewPlaybookCount()`. The chip's title attribute also includes the description + count for accessibility. | Playbook chip row |
| Per-doc purpose label | Each table row now carries a small uppercase pill next to the type name: "Audit ready" / "Needs review" / "Mismatch" / "Low confidence". Derived from check failures + field mismatches + field confidence + status via `getDocPurpose()`. This is the killer detail Codex flagged — the doc's *role* in the audit story, not just its status. | Table doc cell |
| Confidence explanation | EvidenceViewer field rows now show a one-line WHY beneath the percentage. e.g. "High: pattern match + cross-doc validation passed" / "Low: pattern partial, manual review recommended" / "Conflict detected with companion document". Heuristic via `explainFieldConfidence()`. | EvidenceViewer field list |
| Selection state transformation | When `selectedIds.size > 0`, the playbook chip row is hidden. Playbooks are starting points; once the user is in "select and review" mode, they are noise. | DocumentsPage main render |
| Review package modal | Clicking the Export button no longer downloads immediately. It opens a modal showing what is going into the manifest: total docs, ops covered, avg confidence (color-graded), failed checks count, breakdown by type, date range. User clicks "Export now" to confirm or "Back to selection" to cancel. Gives the user a real "I'm sure" moment before triggering audit-grade output. | Bottom of DocumentsPage |
| Deep-link from Operation Detail | New "Export evidence pack" button in the operation detail page action bar — routes to `/console/documents?op={op.id}`. The `?op=` param handler from P0 picks it up: pre-filters operation, pre-selects all docs, shows breadcrumb. End-to-end integration from Operations to Documents to audit export is now functional. | `src/components/operation-detail/OperationDetail.tsx` |

### Behavior contract additions (iteration 3)

14. **Playbook chips MUST show their count.** If you add a playbook, run it through `previewPlaybookCount()` so the user sees what they get without committing. Chips without counts are forbidden — they were one of the original sins of the audit-pull page.
15. **Per-doc purpose label MUST be visible in the table.** It is the single most useful UI signal for distinguishing "audit ready" docs from "needs review" docs from "mismatch" docs without opening the row. Do not hide it behind hover.
16. **Confidence explanation MUST appear in EvidenceViewer.** Showing "97.4%" alone is decoration; showing "97.4% — High: pattern match + cross-doc validation passed" is product. Maintain `explainFieldConfidence()` — make it smarter (real model reasoning) but never less informative.
17. **The Review Package modal is the export gate.** Do not bypass it with a direct download. The pause is the feature — it forces the user to acknowledge what they are about to certify.
18. **Operations → Documents deep-link is part of the contract.** Removing the "Export evidence pack" button from `OperationDetail` requires a new ADR. The job is "starting from an operation, get an audit pack" — that integration is non-negotiable.

### Files changed in iteration 3

- `src/components/documents/DocumentsPage.tsx` (helpers + UI for all 5 P1 items)
- `src/components/operation-detail/OperationDetail.tsx` (Export evidence pack button)
- `src/lib/i18n.ts` (P1 keys: `playbookPreviewDocs`, `purpose*`, `confidence*`, `reviewPackage*`, `exportEvidencePack`)
- `docs/decisions/0001-documents-cleanup.md` (this file — iteration 3 log)
