# Vault

A student-first exam paper platform built with Next.js App Router.
Vault helps users discover, filter, read, and contribute previous semester papers through a clean UI, role-based workflows, and a moderated publishing pipeline.

## Project Snapshot

Vault is designed around four product pillars:

- Discovery: searchable and filterable paper library.
- Study: focused PDF reading experience.
- Contribution: authenticated uploads by students.
- Moderation: admin approval system for quality control.

It is not just a file listing app; it combines authentication, moderation, storage, leaderboard aggregation, profile personalization, and PWA capabilities in one cohesive workflow.

## Core Stack

- Framework: Next.js 16 (App Router)
- UI: React 19 + Tailwind CSS v4
- Auth: NextAuth (Google and GitHub providers)
- Database: MongoDB (Mongoose)
- File storage: Supabase Storage
- Email: Nodemailer + React Email
- Rate limiting: Upstash Redis + @upstash/ratelimit
- PDF rendering: react-pdf + pdfjs-dist
- PWA: @ducanh2912/next-pwa
- Runtime analytics: Vercel Analytics + Speed Insights

## User Flows

### 1) Visitor flow

1. Land on homepage and view recent approved papers.
2. Open library and browse by search + filters.
3. Try to open a paper.
4. Get login-required prompt.

### 2) Authenticated student flow

1. Sign in via Google/GitHub.
2. Access dashboard and profile.
3. Upload a PDF and metadata.
4. Submission is created as `pending`.
5. View approved papers and open PDF viewer.

### 3) Admin flow

1. Access `/admin` (role must be `admin`).
2. Review pending submissions.
3. Approve or reject each paper.
4. Approved papers become visible in public/user library and leaderboard aggregation.

## Route Map

### Public / common routes

- `/` - homepage with hero, features, and recent approved papers
- `/user/auth` - OAuth sign-in page
- `/user/papers` - paper discovery page (search + filters + pagination)
- `/user/contributions` - contributor leaderboard

### Auth-required routes

- `/user/dashboard` - personal stats and recent library activity
- `/user/profile` - editable profile details
- `/user/upload` - submit new paper PDF + metadata
- `/user/papers/[id]` - individual paper reader page

### Admin-only routes

- `/admin` - moderation dashboard (overview + approve/reject pending papers)

## API Surface

### Papers API: `/api/papers`

#### `GET /api/papers`

- Purpose: list papers with server-side filtering and pagination
- Default status filter: `approved`
- Supports query params:
  - `semester`, `year`, `institute`, `subject`, `specialization`, `program`, `id`
  - `status` (`approved|pending|rejected`)
  - `limit` (default 12, max 50), `offset`
- Protection:
  - Non-approved statuses require admin token
- Returns pagination metadata:
  - `count`, `total`, `limit`, `offset`, `hasMore`, `nextOffset`, `prevOffset`

#### `POST /api/papers`

- Purpose: create paper submission
- Requires authenticated user
- Rate limit policy: `paperUpload` (5 requests / 10 minutes per email)
- Required payload fields:
  - `institute`, `subject`, `semester`, `year`, `specialization`, `program`, `storageURL`, `storageFileName`
- Creates papers with defaults:
  - `status: pending`, `isExtracted: false`, `unlockCounts: 0`, `saveCounts: 0`

#### `PATCH /api/papers`

- Purpose: moderation update (`approved|pending|rejected`)
- Requires admin role
- Rate limit policy: `paperModeration` (30 requests / 10 minutes per admin email)
- Required payload:
  - `paperId`, `status`

### Smart search API: `/api/papers/search`

#### `GET /api/papers/search`

- Purpose: lightweight relevance-ranked search
- Rate limit policy: `paperSearch` (20 requests / 60 seconds per client IP)
- Query params:
  - `q` (min 2 chars), `limit` (default 20, max 50), optional `status` (default `approved`)
- Search fields:
  - `subject`, `program`, `specialization`
- Ranking strategy:
  - weighted relevance score via MongoDB aggregation

### Contributions API: `/api/contributions`

#### `GET /api/contributions`

- Purpose: leaderboard of contributors
- Logic:
  - aggregate approved papers by `uploaderID`
  - rank descending by contribution count
  - enrich with user identity fields (`name`, `email`, `image`)

### Auth API: `/api/auth/[...nextauth]`

- NextAuth route handling login callbacks/session/JWT
- Providers: Google and GitHub
- New-user behavior:
  - create user record with role `user`
  - send welcome email

## Data Model

### `User`

- `email` (required, unique)
- `name` (required)
- `role` (`user|admin`, default `user`)
- `image`
- `university`, `program`, `specialization`, `semester`
- `createdAt`

### `Paper`

- `uploaderID` (ObjectId ref -> User)
- `institute`, `subject`, `program`, `specialization`
- `semester`, `year`
- `status` (`approved|pending|rejected`, default `pending`)
- `isExtracted` (default `false`)
- `storageFileName`, `storageURL`
- `unlockCounts`, `saveCounts`
- `uploadedAt`

Indexes include:

- `{ status: 1, uploadedAt: -1 }`
- `{ uploaderID: 1, status: 1 }`
- `{ specialization: 1, program: 1, semester: 1, year: 1, status: 1 }`

### `SavedPaper`

- `userId` (ref User)
- `paperId` (ref Paper)
- `savedAt`
- unique composite index `{ userId: 1, paperId: 1 }`

### `UnlockedPaper`

- `userId` (ref User)
- `paperId` (ref Paper)
- `unlockedAt`
- unique composite index `{ userId: 1, paperId: 1 }`

## Authentication and Authorization

- OAuth providers: Google + GitHub
- Session strategy: JWT via NextAuth
- Role attached to token and session (`session.user.role`)
- Middleware protection for `/admin` in `proxy.js`
- API-level admin enforcement for moderation endpoints
- UI-level role guards in admin and navbar

## Upload and Moderation Pipeline

1. User uploads PDF from `/user/upload`.
2. Frontend validates file type and size (PDF, <= 10MB).
3. File uploads to Supabase bucket `Vault`.
4. Public URL is generated from Supabase.
5. Metadata is posted to `POST /api/papers`.
6. Record is stored with status `pending`.
7. Admin reviews and updates status with `PATCH /api/papers`.

## PDF Experience

- PDF worker copied to `/public/pdf.worker.min.js` during build
- `react-pdf` renders all pages in custom viewer
- Responsive page-width calculation
- Right-click and text/annotation layers are disabled in viewer UI

## Search and Discovery

Library page combines:

- Server-side filtering by structured fields
- Client-side control state for filters and pagination
- Debounced smart search against `/api/papers/search`
- Result cards with subject, semester, year, program, specialization, institute

## PWA and Offline Behavior

- PWA integration through `@ducanh2912/next-pwa`
- Service worker emitted into `public/`
- Runtime cache rule for Supabase PDF URLs:
  - strategy: `CacheFirst`
  - cache: `vault-papers-cache`
  - max entries: 50
  - max age: 30 days
- Manifest configured at `public/manifest.json`

## SEO and Metadata

The app includes:

- Global metadata in root layout
- Open Graph image route (`/opengraph-image`)
- Twitter image route (`/twitter-image`)
- Robots config with restricted crawling of `/admin` and `/user`
- Sitemap route for canonical homepage

## Environment Variables

Create `.env.local` with values for:

```bash
# Database
MONGODB_URI=

# NextAuth
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GITHUB_ID=
GITHUB_SECRET=
GOOGLE_ID=
GOOGLE_SECRET=

# Email
EMAIL_USER=
EMAIL_PASS=

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Upstash Redis (rate limiting)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

## Local Development

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Production commands:

```bash
npm run build
npm start
```

## Key Project Structure

```text
app/
  layout.js                    # root shell, metadata, providers
  page.js                      # homepage
  providers/SessionProvider.js
  component/                   # shared UI components
  user/
    auth/
    dashboard/
    papers/
    profile/
    upload/
    contributions/
  admin/
  api/
    auth/[...nextauth]/route.js
    papers/route.js
    papers/search/route.js
    contributions/route.js

models/
  user.js
  paper.js
  savedPaper.js
  unlockedPaper.js

db/
  connectDb.js

lib/
  rateLimit.js
  nodemailer.js
  renderEmail.js

proxy.js                       # admin route guard
next.config.mjs                # PWA + pdf worker + image config
```

## Security Notes

Implemented:

- Authentication required for uploads
- Role checks for admin routes and moderation API
- Rate limiting on upload, moderation, and search endpoints
- Input normalization and ObjectId validation on API

Recommended hardening for production:

- Add explicit payload length limits for paper metadata fields
- Add rate limiting for generic paper listing endpoint
- Add audit logs for moderation actions
- Consider private signed URLs for stricter PDF access control
- Keep secrets out of repository and rotate keys if ever exposed

## Known Implementation Quirks

- Middleware currently redirects unauthenticated admin access to `/auth`, while sign-in UI lives at `/user/auth`; this is worth normalizing for consistency.
- `renderEmail.js` helper exists but current auth route uses `@react-email/render` directly.
- `robots.js` disallows all `/user/` paths, including public pages under that segment.

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

No explicit license file is present in this repository. Add one if you plan public distribution.
