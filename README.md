# rental-platform

Modular monolith for the rental platform. **v0 — scaffold only**: the rails are
laid (monorepo, NestJS, Drizzle/Postgres, S3, Railway). No domain code yet.

## Layout

```
apps/api              NestJS process — every bounded context becomes a module here
apps/web              Next.js landlord web app (v2a)
apps/mobile           Expo tenant mobile app (v2b)
packages/db           Drizzle client + migrations
packages/storage      StoragePort + S3StorageAdapter (ports & adapters)
packages/config       Zod-validated loadConfig()
packages/i18n         Shared translation keys (nl source of truth)
packages/ui           Shared web UI primitives (Tailwind)
packages/tsconfig     shared tsconfig base
packages/eslint-config shared ESLint flat config
infra/                docker-compose (Postgres + MinIO + Mailpit)
```

## Mobile app (Expo)

```sh
cd apps/mobile
cp .env.example .env.local     # point EXPO_PUBLIC_API_URL at your dev API
pnpm install                   # from the repo root, picks up the workspace
pnpm --filter @rental-platform/mobile start
```

On a physical device, set `EXPO_PUBLIC_API_URL` to your machine's LAN IP
(not `localhost`). The mobile app uses `plekje://` as its deep-link scheme;
that scheme is already in `AUTH_TRUSTED_ORIGINS` for the API.

## Local development

Requires Node 22+, pnpm 10+, Docker.

```sh
pnpm install
cp .env.example .env.local        # defaults already match the local stack
pnpm stack:up                     # Postgres + MinIO (S3) via Docker
pnpm dev                          # boots the API on API_PORT
curl localhost:4000/health        # { status: "ok", db: "ok", storage: "ok" }
```

### S3 emulation

Local S3 is **MinIO** (not LocalStack) — single small container, exact S3 API,
path-style addressing. The bucket from `S3_BUCKET` is auto-created on
`stack:up`. Prod uses real AWS S3 with the same `StoragePort`.

## Quality gates

```sh
pnpm lint
pnpm typecheck
pnpm build
```

## Deploy

`git push` to `main` triggers a Railway deploy (see `railway.toml`). Railway's
Postgres add-on injects `DATABASE_URL`; the remaining env vars are set as
Railway service variables. The deploy goes healthy only when `/health` is 200.
