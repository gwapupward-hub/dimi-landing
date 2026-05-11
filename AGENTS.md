# AGENTS.md

## Cursor Cloud specific instructions

### Overview

DIMI is a full-stack live collaborative music production platform (React + Express + tRPC + WebSocket) using pnpm as the package manager. A single Node.js process serves API, WebSocket, and Vite dev server on port 3000.

### Starting MySQL

MySQL must be running before the dev server can use the database. Start it with:

```bash
sudo mysqld --user=mysql &
```

The database `dimi` should already exist. If it doesn't:

```bash
sudo mysql -e "CREATE DATABASE IF NOT EXISTS dimi;"
sudo mysql -e "ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'; FLUSH PRIVILEGES;"
```

If socket permissions block non-root access after starting mysqld:

```bash
sudo chmod 755 /var/run/mysqld/
```

### Environment variables

The dev server needs at minimum:

```bash
export DATABASE_URL="mysql://root:password@localhost:3306/dimi"
export JWT_SECRET="dev-secret-key-for-testing"
```

### Common commands

| Task | Command |
|------|---------|
| Dev server | `pnpm dev` (runs Express+Vite on port 3000) |
| Type check | `pnpm check` |
| Tests | `pnpm test` (vitest) |
| Format | `pnpm format` (prettier --write) |
| Format check | `npx prettier --check .` |
| DB push schema | `DATABASE_URL=... npx drizzle-kit push` |

### Gotchas

- The app gracefully degrades without `DATABASE_URL` (returns empty arrays/nulls), so the server starts without MySQL but no features work properly.
- The `email.test.ts` test always fails without a valid `RESEND_API_KEY` secret. This is expected in development.
- After `pnpm install`, you must run `pnpm rebuild esbuild @tailwindcss/oxide` to ensure native binaries are available (build scripts are not auto-approved).
- The `pnpm.onlyBuiltDependencies` field in `package.json` allowlists native addon builds for esbuild, @tailwindcss/oxide, bufferutil, core-js, and utf-8-validate.
- `drizzle-kit push` (not `drizzle-kit migrate`) is the reliable way to sync the schema in dev — the `db:push` npm script runs generate+migrate which can fail on an empty DB.
- The tRPC router nests `dimi.waitlist.signup`, `dimi.sessions.*`, `dimi.creators.*` — not top-level.
