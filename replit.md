# Pfeifer Building Company

The public Pfeifer Building Company website for homeowners and commercial clients in Fayette and Coweta County, imported from `bosscon1/pfeifer-com`.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm --filter @workspace/pfeifer-website run dev` — run the imported website through its managed workflow
- `pnpm --filter @workspace/pfeifer-website run typecheck` — check the imported website
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)
- Website: React 19, TanStack Router/Start, Vite 8, Tailwind CSS 4

## Where things live

- `artifacts/pfeifer-website/` — imported website application
- `artifacts/pfeifer-website/src/routes/` — public and staff-admin pages
- `artifacts/pfeifer-website/public/` — images, videos, SEO files, and SiteGround PHP bridge
- `artifacts/pfeifer-website/migrations/` — imported database migrations
- `artifacts/api-server/` — shared Replit API service; currently separate from the imported app

## Architecture decisions

- Preserve the imported TanStack Start application rather than replacing it with the default React scaffold.
- Keep the SiteGround/PHP deployment bridge because the repository documents it as part of the live staff-admin workflow.
- Use Replit-managed `PORT` and `BASE_PATH` values for local preview compatibility.

## Product

- Browse residential and commercial construction services and location pages.
- View project galleries and calls to action for estimates and phone contact.
- Staff routes support gallery, site-setting, and contact administration when their configured backend is available.

## User preferences

- The GitHub repository is the requested starting point; preserve its content and behavior unless changes are requested.
- The old company site is a WordPress CMS site at `https://pfeiferbuild.com`. Do not touch, change, deploy to, or modify any website or WordPress code on that domain until the user explicitly says it is time to go live with the new company website currently in development from the GitHub-hosted codebase.
- Use the published site at `https://pfeiferbuild.com` only as a read-only guide for the canonical URL structure. Account for every URL published there in the development site through a matching page or intentional redirect to minimize broken links during the eventual transition.

## Gotchas

- The imported package must remain named `@workspace/pfeifer-website` so the managed workflow can target it.
- Do not restore the original hardcoded development port; the website must use Replit's `PORT`.
- Live staff admin depends on the repository's external PHP/MySQL setup described in `artifacts/pfeifer-website/README.md`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
