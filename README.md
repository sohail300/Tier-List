# Tier List

TierMaker-style full-stack app with persistent profiles and saved tier lists.

## Tech Stack

- Frontend: Next.js App Router + TypeScript + TailwindCSS
- Backend: Next.js API routes
- DB: Supabase (PostgreSQL) + Prisma ORM
- Auth: Auth.js (next-auth v5) with Google
- Storage: Supabase Storage
- DnD: `@dnd-kit`

## MVP Features

- Google sign-in (Auth.js) + per-user dashboard
- Create/edit/delete/duplicate tier lists
- Default tiers (`S, A, B, C, D`) + dynamic add/remove tiers
- Multi-image upload to Supabase Storage
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
      auth/[...nextauth]/route.ts
      tier-lists/
        route.ts
        [id]/route.ts
        [id]/duplicate/route.ts
        [id]/share/route.ts
      upload/route.ts
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
  auth.ts
  proxy.ts
prisma/
  schema.prisma
```

## Setup

1. Copy env file:

```bash
cp .env.example .env.local
```

1. Add your real values for Google OAuth / Supabase. Create a Google OAuth client at https://console.cloud.google.com/apis/credentials with redirect URI `<your-url>/api/auth/callback/google`, and generate `AUTH_SECRET` with `npx auth secret`.
2. In your Supabase project, create a public Storage bucket named `tier-list-uploads`.
3. Generate Prisma client and run migration:

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
- `POST /api/upload` - upload images to Supabase Storage, returns public URLs

