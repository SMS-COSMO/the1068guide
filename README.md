<p align="center">
  <a href="https://guide.the1068.pictures/" target="_blank" rel="noopener noreferrer">
    <img width="500" src="https://github.com/SMS-COSMO/the1068guide/assets/49156174/1cf0ab43-440e-4116-afa5-8ab4c5231ec5" alt="the1068guide logo">
  </a>
</p>

<p align="center">
A guidebook for SMS freshmen.
</p>

<p align="center">
  <a href="https://nuxt.com"><img src="https://img.shields.io/badge/Nuxt-4-00DC82?logo=nuxt.js" alt="Nuxt"></a>
  <a href="https://vercel.com"><img src="https://img.shields.io/badge/Hosted%20on-Vercel-000?logo=vercel" alt="Vercel"></a>
  <a href="https://github.com/SMS-COSMO/the1068guide/pulls"><img src="https://img.shields.io/badge/PRs-welcome-blue.svg" alt="PRs Welcome"></a>
  <a href="https://stats.uptimerobot.com/AGNLNIrGM6"><img src="https://img.shields.io/uptimerobot/ratio/m797091495-a3ff7259d931a7c6d5420ed7" alt="Uptime"></a>
</p>

## Usage

### As an end user

Visit [the website](https://guide.the1068.pictures/) to read the guide.

### As an editor

Log in at [/admin](https://guide.the1068.pictures/admin). There is one shared editor password. The browser stores a sealed session cookie, not the password.

## Stack

- [Nuxt 4](https://nuxt.com/) on [Vercel](https://vercel.com/)
- [Turso](https://turso.tech/) libSQL, accessed with [Drizzle ORM](https://orm.drizzle.team/)
- [nuxt-auth-utils](https://github.com/atinux/nuxt-auth-utils) sealed sessions and scrypt password hashing
- [shadcn-vue](https://www.shadcn-vue.com/) (reka-ui) and Tailwind CSS
- [tRPC](https://trpc.io/)

Public pages that do not read the database (`/`, `/login`, `/new`) are prerendered. Category pages (`/life`, `/study`, `/intl`, `/tips`) use Vercel ISR for one hour. Search loads `/api/guides` in the browser only after the dialog opens. That response comes from the same server cache as the category data, and approving or editing a post clears it immediately. The CDN copy of a category page can stay stale until the ISR window ends.

## Local setup

Requires Node.js 22.22.3 or newer and pnpm 10.

```bash
pnpm install
cp .env.example .env
ADMIN_PASSWORD='choose-a-password' pnpm auth:hash
```

Put the printed hash in `.env` as `NUXT_ADMIN_PASSWORD_HASH`. A local libSQL file (`file:./data/local.db`) is created on first run. Then:

```bash
pnpm db:migrate
pnpm dev
```

`pnpm dev` also applies migrations in development. Production does not migrate on boot.

### Scripts

| Script | Purpose |
| --- | --- |
| `pnpm dev` | Dev server |
| `pnpm build` | Production build |
| `pnpm preview` | Preview the production build |
| `pnpm lint` | Lint |
| `pnpm typecheck` | Typecheck |
| `pnpm db:generate` | Generate a Drizzle migration from `server/database/schema.ts` |
| `pnpm db:migrate` | Apply migrations to `NUXT_TURSO_DATABASE_URL` |
| `pnpm auth:hash` | Print a scrypt hash for `NUXT_ADMIN_PASSWORD_HASH` |

## Environment variables

Set these in Vercel for Production and Preview. They are read at runtime through Nuxt `runtimeConfig` (`NUXT_` prefix). `NUXT_TURSO_DATABASE_URL` must also be available at build time if you later prerender the category pages.

| Name | Required | Purpose |
| --- | --- | --- |
| `NUXT_TURSO_DATABASE_URL` | Yes in production | `libsql://...turso.io`, or `file:./data/local.db` locally |
| `NUXT_TURSO_AUTH_TOKEN` | Yes for Turso | Database token. Empty for a local file |
| `NUXT_SESSION_PASSWORD` | Yes in production | 32+ characters. Seals the session cookie. Dev generates one into `.env` |
| `NUXT_ADMIN_PASSWORD_HASH` | Yes | scrypt hash from `pnpm auth:hash`. Not the plaintext password |

`NUXT_ADMIN_PASSWORD` is not a supported variable. The old plaintext `ADMIN_PASSWORD` is no longer read.

## Deploying to Vercel

This repo no longer uses NuxtHub or Cloudflare bindings. Do not add a D1 binding.

1. Import the GitHub repository as a Vercel project. Framework preset: **Nuxt**. Leave the build command as `pnpm build` (or the default `nuxt build`) and the install command as `pnpm install`. Node.js 22.x.
2. Add the environment variables above to Production and Preview.
3. Run `pnpm db:migrate` once against the Turso database (see below) before pointing traffic at the deployment.
4. In Vercel project settings → Domains, add `guide.the1068.pictures`.
5. At the DNS host, point the hostname at Vercel (CNAME to `cname.vercel-dns.com`, or the A record Vercel shows). Remove the Cloudflare Pages custom domain only after the Vercel deployment answers correctly.

Vercel sets `VERCEL=1` during the build, and Nuxt selects the Vercel Nitro preset from that. No `vercel.json` is required.

## Database

The only application table is `guidebook` (reviewed and pending posts). `login_attempts` stores rate-limit rows for editor login and public submissions. Both are SQLite, so the existing D1 data can move to Turso without a dialect change.

Create a database and token:

```bash
turso db create the1068guide
turso db show the1068guide --url
turso db tokens create the1068guide
```

Use the URL as `NUXT_TURSO_DATABASE_URL` and the token as `NUXT_TURSO_AUTH_TOKEN`, then apply the schema:

```bash
pnpm db:migrate
```

### Moving data from Cloudflare D1

1. Export the remote D1 database. The database name is the NuxtHub database for this project (commonly `the1068guide` or the name shown in the Cloudflare dashboard):

   ```bash
   npx wrangler d1 export <D1_DATABASE_NAME> --remote --output d1.sql
   ```

2. Apply this repo's migrations to the empty Turso database (`pnpm db:migrate`). That creates `guidebook` and `login_attempts`. `0000` uses `CREATE TABLE IF NOT EXISTS`, so it is safe if the import already created `guidebook`.
3. Copy rows, not the `CREATE TABLE`, out of `d1.sql`. Keep the `INSERT INTO guidebook` statements (and `sqlite_sequence` if you need the same ids). Import them:

   ```bash
   turso db shell the1068guide < guidebook-inserts.sql
   ```

4. Confirm `select count(*) from guidebook;` matches the D1 export before switching DNS.

Pending posts (`is_reviewed = 0`) come across with the table. Readers only see rows with `is_reviewed = 1`.

## Authentication

Editors share one password. The site does not have per-person accounts, so OAuth is not wired up. `nuxt-auth-utils` is a better fit for that model:

- The password is checked with scrypt (`verifyPassword`) against `NUXT_ADMIN_PASSWORD_HASH`.
- A successful login sets an httpOnly, `SameSite=Lax` cookie sealed with `NUXT_SESSION_PASSWORD`. It expires after 7 days. The password is not stored in the browser.
- Admin tRPC procedures require that session. The password is not sent again.
- Login is limited to 8 failures per 15 minutes per IP. Submissions are limited to 10 per hour per IP. Both counters live in `login_attempts`, so they apply across serverless instances.
- State-changing requests that include an `Origin` must match the request host.

Generate a new hash whenever the editor password changes, update `NUXT_ADMIN_PASSWORD_HASH`, and redeploy. Existing sessions stay valid until they expire or the editor logs out; changing `NUXT_SESSION_PASSWORD` invalidates them immediately.

## Contributors

<a href="https://github.com/sms-cosmo/the1068guide/graphs/contributors">
  <img alt="Contributors" src="https://contrib.rocks/image?repo=sms-cosmo/the1068guide" />
</a>

## License

[GPL v3](./LICENSE) &copy; 2024 the1068guide contributors
