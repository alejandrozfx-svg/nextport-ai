# Nextport AI — Import Compliance Control Tower

AI-powered control tower for Mexican import operations and trade compliance. Classify documents, detect exceptions, and get pedimento-ready with AI-assisted review at every stage.

## Live URLs

- **GitHub repository:** https://github.com/alejandrozfx-svg/nextport-ai
- **Production deployment:** https://nextport-ai.vercel.app
- **Vercel deployment URL:** https://nextport-4e5de4k0c-alejandrozfx-6580s-projects.vercel.app

## Tech Stack

- **Next.js 15** (App Router, TypeScript, React 19)
- **Tailwind CSS v3** — dark design system with CSS custom properties
- **Prisma ORM + PostgreSQL** (Neon/Vercel Postgres compatible)
- **Recharts** — analytics charts
- **Framer Motion** — micro-animations
- **Radix UI** — accessible primitives
- **Lucide React** — icons

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up database
Copy `.env.example` to `.env` and update `DATABASE_URL`:
```bash
cp .env.example .env
```

For a free cloud database, use [Neon](https://neon.tech) or [Vercel Postgres](https://vercel.com/storage/postgres).

### 3. Push schema and seed
```bash
npm run db:push
npm run db:seed
```

### 4. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Demo credentials:** `demo@nextport.ai` / `demo123`

## Project Structure

```
src/
  app/                    Next.js App Router pages
    console/              Protected console shell
      operations/         Operations inbox + detail
      documents/          Document library
      intelligence/       Analytics & charts
      integrations/       Third-party connections
      security/           Audit trail & roles
      academy/            Training modules
      settings/           Account settings
    api/                  REST API routes
  components/             React components
    layout/               Sidebar, TopBar, ConsoleShell
    operations/           Inbox, rows, stats
    operation-detail/     Detail view components
    documents/            Document library
    integrations/         Integration cards
    intelligence/         Charts, KPIs
    security/             Audit trail
    academy/              Lessons, tutor
    assistant/            AI chat panel
    ui/                   Shared UI primitives
  lib/                    Utilities and services
  types/                  TypeScript types
prisma/
  schema.prisma           Database schema
  seed.ts                 Demo data seed
handoffs/                 Developer documentation
```

## Design System

All colors are CSS custom properties on `:root`. Key tokens:

| Variable | Value | Use |
|----------|-------|-----|
| `--bg` | `#0A0D12` | Page background |
| `--bg-2` | `#0F1318` | Sidebar, cards |
| `--brand` | `oklch(0.78 0.09 235)` | Steel blue |
| `--risk` | `oklch(0.70 0.16 25)` | Alert red |
| `--warn` | `oklch(0.82 0.14 78)` | Amber |
| `--ok` | `oklch(0.78 0.13 155)` | Green |

Fonts: **Instrument Serif** (headings), **Geist** (UI), **JetBrains Mono** (IDs/codes)

## Demo Data

The seed creates 7 operations across 3 risk levels:

| ID | Supplier | Status | Value |
|----|----------|--------|-------|
| NP-2026-001847 | Lumitech Optics | At Risk | USD 184,250 |
| NP-2026-001846 | TaegukChem | Needs Review | USD 62,400 |
| NP-2026-001845 | Hannover Präzision | Ready | EUR 312,880 |
| NP-2026-001844 | Vértice Componentes | Ready | USD 41,200 |
| NP-2026-001843 | Aero Plastics | Needs Review | USD 96,780 |
| NP-2026-001842 | Osaka Bearings | At Risk | USD 28,950 |
| NP-2026-001841 | Bogotá Textiles | Ready | USD 18,420 |

## Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # ESLint
npm run db:generate  # Regenerate Prisma client
npm run db:push      # Push schema to DB
npm run db:seed      # Seed demo data
npm run db:migrate   # Run migrations
```

## Deployment

1. Deploy to Vercel: `vercel --prod`
2. Create a Postgres database in Vercel Storage or connect Neon/Supabase
3. Set `DATABASE_URL`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` in Vercel
4. Run `npm run db:push` against production DB
5. Run `npm run db:seed` for demo data

## License

Private — Nextport AI © 2026
