# Nextport AI — Developer Handoff

This document is the source of truth for any developer (human or AI agent) picking up work on this codebase.

## Architecture overview

```
nextport-ai/
├── src/
│   ├── app/                  Next.js 15 App Router
│   │   ├── page.tsx          Public landing page (/ route)
│   │   ├── layout.tsx        Root HTML layout
│   │   ├── globals.css       Design system CSS (vars, glass, animations)
│   │   ├── console/          Protected console shell
│   │   │   ├── layout.tsx    Sidebar + TopBar shell
│   │   │   ├── operations/   Inbox + [id] detail
│   │   │   ├── documents/    Document library
│   │   │   ├── intelligence/ Analytics / charts
│   │   │   ├── integrations/ Third-party connections
│   │   │   ├── security/     Audit trail & RBAC
│   │   │   ├── academy/      Training modules + [lessonId]
│   │   │   └── settings/     Account / workspace config
│   │   └── api/              REST API routes (all server-side)
│   ├── components/           React components, grouped by domain
│   ├── lib/                  Utilities (db, mock-ai, i18n, utils)
│   └── types/                Shared TypeScript types
├── prisma/
│   ├── schema.prisma         16-model Postgres schema
│   └── seed.ts               Demo data seed (7 ops, 14 integrations, 12 lessons)
├── handoffs/                 THIS directory
├── .env                      Local env (not committed)
├── .env.example              Template for new deployments
└── README.md                 User-facing setup guide
```

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, React 19) |
| Language | TypeScript strict |
| Styling | Tailwind CSS v3 + CSS custom properties |
| Icons | lucide-react |
| Animations | framer-motion (sparingly) |
| ORM | Prisma 6 |
| Database | PostgreSQL (Neon / Vercel Postgres compatible) |
| Charts | Recharts |
| UI Primitives | Radix UI |
| Auth | localStorage demo auth (demo@nextport.ai / demo123) |

## How to run locally

```bash
# 1. Install deps
cd nextport-ai
npm install

# 2. Set up env
cp .env.example .env
# Edit .env — set DATABASE_URL to a real PostgreSQL connection

# 3. Push schema
npx prisma db push

# 4. Seed demo data
npm run db:seed

# 5. Start dev server
npm run dev
# → http://localhost:3000
```

**Demo credentials:** `demo@nextport.ai` / `demo123`

## Database models

16 Prisma models:
- `User`, `Workspace` — single-user workspace model
- `Supplier`, `CustomsBroker` — trade parties
- `Operation` — core entity (7 in seed)
- `Document`, `ExtractedField`, `ValidationCheck` — document intelligence
- `Exception` — AI-detected risk flags
- `AISummary` — per-operation AI summary
- `Approval`, `AuditEvent` — human-in-the-loop trail
- `Integration` — third-party connection status (14 in seed)
- `AcademyLesson`, `AcademyProgress` — training modules
- `GlossaryTerm` — trade compliance glossary
- `AssistantConversation`, `AssistantMessage` — AI tutor history

## Current implementation status

### Done
- Landing page (EN/ES/ZH, sign-in flow, trust badges)
- Console shell (sidebar + top bar)
- Operations inbox (stats, flow strip, filter tabs, search, table)
- Operation detail (3-column: docs list, doc preview, exceptions/approval)
- Document library with scan modal + simulated pipeline
- Integrations page with sync simulation
- Intelligence page with Recharts charts
- Security & Audit (role matrix, audit trail, SOC 2 badges)
- Academy dashboard + lesson detail + progress tracking
- Nextport Tutor AI panel (mock responses, 10+ topic patterns)
- All 14 API routes
- Prisma schema (16 models)
- Full seed data (7 operations, all docs, exceptions, audit events)
- README.md

### Pending / known gaps
- No real authentication — demo auth via localStorage only
- Nextport Tutor uses mock responses only (no real AI API)
- Document "preview" is a placeholder, not real PDF rendering
- Academy progress requires user session (currently uses hardcoded userId)
- Settings page is a placeholder with form shells
- i18n strings are EN-only in components (structure ready, strings need wiring)
- No email notifications
- No real file upload (scan modal simulates the pipeline)

## Known risks

1. **No auth session** — all API routes return data without auth checks. Add middleware before production.
2. **Mock AI** — `src/lib/mock-ai.ts` has pattern-matched responses. Wire in Claude API before launch.
3. **No real PDF** — DocPreview renders a styled placeholder. Add react-pdf or PDF.js.
4. **docsExpected hardcoded to 6** — Operations API returns `docsExpected: 6`. Should come from DB.

## How Codex should contribute

1. **Read this file first.** Understand the architecture before editing.
2. **Check `CODEX_TASKS.md`** for specific tasks to pick up.
3. **Don't change Prisma schema** without updating seed.ts and all affected API routes.
4. **Don't change CSS variable names** — they are referenced everywhere.
5. **Keep components small** — no component should exceed 300 lines.
6. **Add loading + empty states** to every data-fetching component.
7. **Test the build** after every change: `npm run build`.

## File naming conventions

- Pages: `page.tsx` (Next.js App Router convention)
- Components: `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Types: `index.ts` in `src/types/`

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `NEXTAUTH_SECRET` | No (future) | Auth secret |
| `NEXTAUTH_URL` | No (future) | App URL |
| `DEMO_USER_EMAIL` | No | Defaults to demo@nextport.ai |
| `DEMO_USER_PASSWORD` | No | Defaults to demo123 |
