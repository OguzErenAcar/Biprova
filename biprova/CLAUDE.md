# Biprova - Developer Guide

> **Project vision & business context:** `util/biprova-whiteboard.html`
> Read this first to understand what Biprova is and why decisions were made.

## Project Overview
Biprova ("bir projem var" = "I have a project") — a platform where people find teammates for their projects.
Users share needs (not ideas), others apply for specific roles, and when all roles are filled the team forms automatically.
Turkey-focused, 24h activation rule.

## Stack
- **Framework:** Next.js 15 (App Router)
- **Database/Auth:** Supabase (PostgreSQL + Auth + Realtime)
- **Styling:** Tailwind CSS + shadcn/ui (Radix UI)
- **Language:** TypeScript
- **Email:** Resend
- **Deploy:** Vercel
- **Mobile:** Capacitor (web-first, mobile build via Capacitor)

## Critical Business Rules
- **Idea privacy** — only needs are shown publicly; idea details shared privately after team forms
- **24h rule** — once all roles are filled, leader has 24h to start or the team dissolves
- **Team bar** — progress bar fills as each role is taken; completes → team auto-created
- **Team posts only** — individuals cannot post; only formed teams can share posts

## Layout
- **Web:** fixed left sidebar, content on the right
- **Mobile:** bottom tab bar — Home | Teams | Create Project (center) | News | Profile
- Capacitor handles mobile build from the web app

## Database Tables (live in Supabase)
- `users` — id, email, name, city, is_remote, skills, avatar_url, linkedin_url, badge
- `projects` — id, creator_id, title, description, city, is_remote, category, status
- `project_roles` — id, project_id, role_name, is_filled, filled_by
- `applications` — id, project_id, user_id, role_id, note, status
- `teams` — id, project_id, leader_id, status, formed_at, deadline, kickoff_at
- `team_members` — id, team_id, user_id, role_id
- `messages` — id, team_id, sender_id, content
- `notifications` — id, user_id, type, payload, is_read
- `waitlist` — id, email

## Next.js 15
- `cookies()` and `headers()` are async — always use `await`
- Server Components are default, only add `'use client'` for interactivity
- Use Server Actions for mutations, don't open a separate API route

## Supabase
- Use `createServerClient()` in Server Components (@supabase/ssr)
- Use `createBrowserClient()` in Client Components (@supabase/ssr)
- Use `getUser()` for authentication — `getSession()` is unreliable server-side
- Enable RLS on all tables — never bypass
- Never use `select('*')` — always list columns explicitly
- Add `.limit()` to every query
- Supabase Realtime is used for team chat (messages table)

## Data Access
- Call Supabase directly inside Server Actions — no Repository layer
- Extract shared queries to `queries.ts` only when the same query is used across multiple actions

## Code Style
- No `console.log` in production code
- Validate all inputs with Zod
- Prefer `interface` over `type` (for shapes that can be extended)
- TypeScript strict mode — no `any`
- Immutable patterns — never mutate objects, use spread operator

## Project Structure
```
app/
  (marketing)/      ← landing, intro, waitlist
  dashboard/        ← protected area
    projects/       ← project feed, project detail
    teams/          ← team chat, 24h timer
    posts/          ← team posts
    news/           ← news feed
    profile/        ← user profile

features/           ← business logic per feature
  projects/
    components/
    actions.ts
    types.ts
  applications/
    components/
    actions.ts
    types.ts
  teams/
    components/
    actions.ts
    types.ts

components/
  ui/               ← shadcn primitives
  shared/           ← cross-feature components

lib/
  supabase/         ← client.ts, server.ts, middleware helpers
  utils.ts
```

## Dev Commands
```bash
cd biprova
npm run dev       # Start dev server
npm run build     # Build for production
npm run lint      # Lint
```

## Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=        # server-side only, never expose to client
NEXT_PUBLIC_APP_URL=http://localhost:3000
RESEND_API_KEY=
```
