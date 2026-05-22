# Tier List

TierMaker-style full-stack app with persistent profiles and saved tier lists.

## Tech Stack

- Frontend: Next.js App Router + TypeScript + TailwindCSS
- Backend: Next.js API routes
- DB: PostgreSQL + Prisma ORM
- Auth: Clerk (Google)
- Storage: Cloudinary
- DnD: `@dnd-kit`

## MVP Features

- Clerk auth + per-user dashboard
- Create/edit/delete/duplicate tier lists
- Default tiers (`S, A, B, C, D`) + dynamic add/remove tiers
- Multi-image upload to Cloudinary
- Drag images between tiers and pool, reorder within rows
- Debounced autosave to database
- Public share link (`/share/:slug`) in read-only mode

## Project Structure

```txt
src/
  app/
    (app)/
      dashboard/page.tsx
      tier-lists/[id]/page.tsx
    api/
      tier-lists/
        route.ts
        [id]/route.ts
        [id]/duplicate/route.ts
        [id]/share/route.ts
      upload/signature/route.ts
    share/[slug]/page.tsx
  components/
    dashboard-grid.tsx
    tier-board.tsx
    tier-row.tsx
    draggable-item.tsx
  lib/
    auth.ts
    prisma.ts
    queries.ts
    tier-list.ts
  types/
    tier-list.ts
prisma/
  schema.prisma
middleware.ts
```

## Setup

1. Copy env file:

```bash
cp .env.example .env.local
```

1. Add your real values for Clerk / Cloudinary / PostgreSQL.
2. Generate Prisma client and run migration:

```bash
npm run prisma:generate
npm run prisma:migrate
```

1. Start app:

```bash
npm run dev
```

## Key API Routes

- `GET /api/tier-lists` - fetch current user's lists
- `POST /api/tier-lists` - create list
- `GET /api/tier-lists/:id` - fetch one list (owner only)
- `PATCH /api/tier-lists/:id` - autosave full state
- `DELETE /api/tier-lists/:id` - delete list
- `POST /api/tier-lists/:id/duplicate` - duplicate list
- `POST /api/tier-lists/:id/share` - enable share and return slug
- `POST /api/upload/signature` - signed Cloudinary upload metadata

