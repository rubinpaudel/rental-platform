# test-flows — Bruno API suite

End-to-end HTTP checks for the backend. Runnable two ways:

## In VSCode (interactive)

1. Install the **Bruno** extension (`bruno.bruno`).
2. Open this folder as a Bruno collection (`tools/test-flows/bruno`).
3. Select the **local** environment (top-right).
4. Run requests top-to-bottom, or "Run Collection".

The collection seeds unique emails per run, so it is re-runnable without
resetting the database. Better Auth uses a cookie session; Bruno's cookie jar
carries it between the ordered requests.

## Headless (CI / terminal)

```sh
pnpm stack:up                 # Postgres + MinIO + Mailpit
pnpm db:migrate               # apply identity schema
pnpm dev:api                  # or: node apps/api/dist/main.js
make test-flows               # runs the whole suite via @usebruno/cli
```

## What it covers (v1 Identity acceptance criteria)

- tenant + landlord sign-up via `/api/auth/sign-up/email`
- sign-in returns a session
- `GET /me` returns user + active org + role
- both roles get an auto-created organization (`/api/auth/organization/list`)
- landlord can invite a member (`/api/auth/organization/invite-member`)
- `@RequireRole('landlord')` → 403 for a tenant
- guarded route → 401 when unauthenticated

Verification mail is captured by Mailpit — open http://localhost:8025 to see
the messages Better Auth sends.
