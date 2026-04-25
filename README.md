# Vault

Vault is a Next.js 16 exam paper platform where students can discover and read previous semester papers, upload new papers, save favorites, and contribute to a moderated community library.

## What This App Does

- OAuth authentication via Google/GitHub.
- Public paper discovery with filtering, pagination, and smart search.
- Authenticated paper uploads to Supabase Storage.
- Admin moderation (`pending -> approved/rejected`) before publication.
- Saved papers library per user.
- Contribution leaderboard based on approved uploads.
- PWA support with offline PDF caching strategy.
- Legal pages: `/terms` and `/privacy`.

## Tech Stack

- Next.js 16 App Router + React 19
- Tailwind CSS v4
- NextAuth (JWT session strategy)
- MongoDB + Mongoose
- Supabase Storage
- Upstash Redis + `@upstash/ratelimit`
- Nodemailer + React Email
- `react-pdf` + `pdfjs-dist`
- `@ducanh2912/next-pwa`
- Vercel Analytics + Speed Insights

## Architecture Summary

### Frontend

- `app/page.js` is the landing page.
- `app/user/*` contains user-facing product pages (auth, papers, upload, dashboard, profile, saved, contributions).
- `app/admin/page.js` contains admin moderation UI.
- Shared shell (navbar/footer/metadata/providers) lives in `app/layout.js`.

### Backend

- `app/api/auth/[...nextauth]/route.js` handles OAuth, JWT/session callbacks, user bootstrap, and welcome email.
- `app/api/papers/route.js` handles paper CRUD-like workflow (list, create, moderation status update).
- `app/api/papers/search/route.js` handles weighted relevance search.
- `app/api/contributions/route.js` serves leaderboard aggregation.

### Data Layer

- `db/connectDb.js` opens MongoDB connection.
- Models in `models/`:
  - `User`
  - `Paper`
  - `SavedPaper`
  - `UnlockedPaper` (model exists; currently not actively used by page flows)

### Security/Access

- Admin route protection is done in `proxy.js` for `/admin/:path*`.
- API-level role checks enforce admin-only status access/moderation.
- Rate limiting policies are centralized in `lib/rateLimit.js`.

## Route Map

### Public routes

- `/` home
- `/terms` terms and conditions
- `/privacy` privacy policy
- `/user/auth` login/signup
- `/user/papers` paper browsing
- `/user/contributions` leaderboard

### Mostly auth-required routes

- `/user/dashboard`
- `/user/profile`
- `/user/upload`
- `/user/saved`
- `/user/papers/[id]` (intended for signed-in users; currently not server-blocked)

### Admin-only routes

- `/admin`

## API Surface

### `GET /api/papers`

- Lists papers with filters and pagination.
- Default `status=approved`.
- Supports: `semester`, `year`, `institute`, `subject`, `specialization`, `program`, `id`, `status`, `limit`, `offset`.
- `status != approved` requires admin.

### `POST /api/papers`

- Creates a paper submission.
- Requires authenticated user token.
- Enforces rate limit policy: `paperUpload` (`5 / 10m` per user email).
- New records default to `status: pending`.

### `PATCH /api/papers`

- Updates paper status.
- Requires admin token.
- Enforces rate limit policy: `paperModeration` (`30 / 10m` per admin email).

### `GET /api/papers/search`

- Smart search on `subject`, `program`, `specialization`.
- Enforces rate limit policy: `paperSearch` (`20 / 60s` per client IP).
- Weighted relevance ranking via Mongo aggregation.

### `GET /api/contributions`

- Aggregates approved paper count by uploader.
- Returns ranked leaderboard with user identity fields.

## Data Models

### `User`

- `email` (unique, required)
- `name` (required)
- `role` (`user | admin`, default `user`)
- `image`
- `university`, `program`, `specialization`, `semester`
- `createdAt`

### `Paper`

- `uploaderID` (`User` ref, required)
- `institute`, `subject`, `program`, `specialization` (required)
- `semester`, `year` (required)
- `status` (`approved | pending | rejected`, default `pending`)
- `storageFileName`, `storageURL`
- `isExtracted`, `unlockCounts`, `saveCounts`, `uploadedAt`
- indexes:
  - `{ status: 1, uploadedAt: -1 }`
  - `{ uploaderID: 1, status: 1 }`
  - `{ specialization: 1, program: 1, semester: 1, year: 1, status: 1 }`

### `SavedPaper`

- `userId`, `paperId`, `savedAt`
- unique index on `{ userId, paperId }`

### `UnlockedPaper`

- `userId`, `paperId`, `unlockedAt`
- unique index on `{ userId, paperId }`

## SEO, Legal, and Discovery

- Global metadata is defined in `app/layout.js`.
- OpenGraph image route: `/opengraph-image`
- Twitter image route: `/twitter-image`
- Robots policy in `app/robots.js`
- Sitemap generation in `app/sitemap.js` includes:
  - static public routes (`/`, `/terms`, `/privacy`, `/user/papers`, `/user/contributions`)
  - dynamic approved paper detail pages (`/user/papers/:id`)

## PWA and PDF Behavior

- PWA is configured in `next.config.mjs` with `@ducanh2912/next-pwa`.
- Service worker and workbox assets are emitted to `public/`.
- Supabase-hosted PDF files are runtime-cached with `CacheFirst`.
- `pdf.worker.min.js` is copied at build time and used by `react-pdf`.

## Environment Variables

Create `.env.local`:

```bash
# MongoDB
MONGODB_URI=

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=
GITHUB_ID=
GITHUB_SECRET=

# Email (welcome mail)
EMAIL_USER=
EMAIL_PASS=

# Supabase (client upload path uses public anon key)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Upstash rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Notes:

- Without Upstash vars in local dev, rate limit checks fall back gracefully.
- Keep all secrets out of git and rotate immediately if exposed.

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

### Production build

```bash
npm run build
npm run start
```

## Admin Bootstrapping

New users are created with role `user` by default.
To grant admin access, update the user document in MongoDB and set:

```json
{ "role": "admin" }
```

Admin access gates:

- route-level guard in `proxy.js`
- API-level role checks in `PATCH /api/papers` and non-approved status access

## Project Structure

```text
app/
  api/
    auth/[...nextauth]/route.js
    papers/route.js
    papers/search/route.js
    contributions/route.js
  admin/
  user/
  component/
  providers/
  layout.js
  page.js
  robots.js
  sitemap.js
  terms/page.js
  privacy/page.js

models/
  user.js
  paper.js
  savedPaper.js
  unlockedPaper.js

db/connectDb.js
lib/rateLimit.js
lib/nodemailer.js
proxy.js
next.config.mjs
```

## Current Known Gaps

- `proxy.js` redirects unauthenticated `/admin` users to `/auth`, while UI sign-in route is `/user/auth`.
- Admin UI currently references `paper.title` in places, but paper API payload uses `subject`.
- `lib/renderEmail.js` exists but current auth flow uses `@react-email/render` directly.

## Scripts

```json
{
  "dev": "next dev --webpack",
  "build": "next build --webpack",
  "start": "next start",
  "lint": "eslint"
}
```

## License

No license file is currently present. Add one before public distribution.
