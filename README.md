# Vault

**Vault** is a community-driven exam paper sharing platform where students can discover, upload, and save previous semester papers. Built with Next.js and deployed on Vercel.

🔗 **Live Demo:** [paper-vault.app](https://paper-vault.app)

## What This App Does

- 🔐 **OAuth Authentication** – Sign in with GitHub or Google (no passwords stored)
- 🔍 **Smart Paper Discovery** – Browse with filtering by semester, year, subject, program, and more
- 📤 **Paper Uploads** – Authenticated users can submit PDFs (moderated before publication)
- ✅ **Admin Moderation** – Approve/reject submissions before they appear publicly
- 💾 **Saved Papers Library** – Bookmark papers for quick access
- 🏆 **Leaderboard** – Recognition for top contributors
- 📱 **PWA & Offline Support** – Install as an app; PDFs cache for offline reading
- 📜 **Legal Pages** – Terms and privacy policy included

## Tech Stack

| Category | Technology |
|----------|-----------|
| **Frontend** | Next.js 16 App Router, React 19, Tailwind CSS v4 |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | MongoDB + Mongoose ODM |
| **Storage** | Supabase Storage (PDF uploads) |
| **Authentication** | NextAuth 4.24 (JWT sessions, GitHub/Google OAuth) |
| **Email** | Resend + React Email |
| **Rate Limiting** | Upstash Redis + @upstash/ratelimit |
| **PDF Viewer** | react-pdf + pdfjs-dist |
| **Charts** | Recharts 3.8 |
| **PWA** | @ducanh2912/next-pwa |
| **Analytics** | Vercel Analytics + Speed Insights |
| **Deployment** | Vercel |
| **Linting** | ESLint 9 + Prettier |

## Architecture Summary

### Frontend Layer

- **Landing Page** (`app/page.js`) – Hero section with 3D animation and recent papers
- **User Routes** (`app/user/*`) – Paper browsing, upload, dashboard, profile, saved papers, leaderboard
- **Admin Routes** (`app/admin/*`) – Moderation dashboard for approving/rejecting submissions
- **Shared Components** – Navbar, Footer, Session Provider in `app/layout.js`

### Backend Layer

- **OAuth & Auth** (`app/api/auth/[...nextauth]/route.js`) – NextAuth configuration, user bootstrap, welcome emails
- **Papers API** (`app/api/papers/route.js`) – GET (list), POST (upload), PATCH (moderation)
- **Search API** (`app/api/papers/search/route.js`) – Weighted relevance search
- **Contributions API** (`app/api/contributions/route.js`) – Leaderboard aggregation
- **Rate Limiting** (`lib/rateLimit.js`) – Per-endpoint policies via Upstash Redis

### Data Layer

- **MongoDB Collections:**
  - `User` – Profiles, roles, university info
  - `Paper` – Submissions, status (pending/approved/rejected), PDF metadata
  - `SavedPaper` – User bookmarks (indexed for fast access)
  - `UnlockedPaper` – Access tracking (prepared for future features)

### Security & Access Control

- **Route Protection** – `/admin/*` routes protected by `proxy.js` middleware
- **API Authentication** – NextAuth JWT tokens required for user actions
- **Rate Limiting** – Policy-based limits (paperUpload: 5/10m, paperModeration: 30/10m, etc.)
- **CORS & CSRF** – Inherited from NextAuth defaults

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

## Deployment

### Vercel Deployment

Vault is optimized for **Vercel**, the platform built by the Next.js creators.

**Current Deployment:** [paper-vault.app](https://paper-vault.app)

**Deploy Your Own:**

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Set environment variables in Vercel project settings (copy from `.env.local`)
4. Click "Deploy" — Vercel auto-detects Next.js and builds/deploys automatically

**Build Settings (auto-configured):**
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

**Performance Optimizations:**
- Vercel Edge Network – Global CDN for fast content delivery
- Serverless Functions – API routes scale automatically
- Analytics – Vercel Analytics + Speed Insights pre-integrated
- PWA – Service workers cached in production

### Environment Variables on Vercel

1. Go to Project Settings → Environment Variables
2. Add all variables from `.env.example` (mark secrets as "Sensitive")
3. Public variables (prefixed with `NEXT_PUBLIC_`) are safe to expose
4. Secret variables are only available during build and API routes

**Example Vercel env setup:**
```
NEXTAUTH_SECRET = ••••••••••••••
NEXTAUTH_URL = https://your-domain.com
MONGODB_URI = mongodb+srv://••••••••••••
```

## Getting Started

### Prerequisites

- **Node.js** 18 or higher
- **npm** 9+ or **pnpm** 8+
- **Git**
- A GitHub or Google account (for OAuth testing)

### Local Development Setup

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/vault.git
cd vault
```

#### 2. Install Dependencies

```bash
npm install
```

#### 3. Set Up Environment Variables

Copy the example environment file and fill in your credentials:

```bash
cp .env.example .env.local
```

Then edit `.env.local` and configure:

**Authentication (NextAuth + OAuth):**
- Generate `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Set `NEXTAUTH_URL=http://localhost:3000` (for local development)
- Create GitHub OAuth app at [github.com/settings/developers](https://github.com/settings/developers)
- Create Google OAuth app at [console.cloud.google.com/apis/credentials](https://console.cloud.google.com/apis/credentials)
- Redirect URI for both: `http://localhost:3000/api/auth/callback/[provider]`

**Database (MongoDB):**
- Sign up for free at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Create a cluster and database named `Vault-project`
- Copy connection string to `MONGODB_URI`

**File Storage (Supabase):**
- Sign up at [supabase.com](https://supabase.com)
- Create a project and storage bucket named `papers`
- Copy Project URL to `NEXT_PUBLIC_SUPABASE_URL`
- Copy Anon Key to `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Copy Service Role Key to `SUPABASE_SERVICE_ROLE_KEY`

**Rate Limiting (Upstash Redis):**
- Sign up at [console.upstash.com](https://console.upstash.com)
- Create a Redis database (free tier available)
- Copy REST URL to `UPSTASH_REDIS_REST_URL`
- Copy REST Token to `UPSTASH_REDIS_REST_TOKEN`

**Email (Resend):**
- Sign up at [resend.com](https://resend.com)
- Create API key and copy to `RESEND_API_KEY`
- Set `RESEND_FROM_EMAIL=Vault <onboarding@resend.dev>` (or your verified domain)

#### 4. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

The dev server auto-reloads on code changes.

#### 5. Build & Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

### Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| **MongoDB connection fails** | Check connection string in `.env.local`; verify IP whitelist in Atlas |
| **Supabase upload fails** | Verify bucket exists and service role key is correct |
| **OAuth redirect fails** | Ensure `NEXTAUTH_URL` matches your domain and OAuth redirect URI is registered |
| **Rate limiting inactive** | Upstash Redis is optional in dev; tests gracefully fall back |
| **ESLint errors** | Run `npm run lint -- --fix` to auto-fix most issues |

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
proxy.js
next.config.mjs
```

## Current Known Gaps

- `proxy.js` redirects unauthenticated `/admin` users to `/auth`, while UI sign-in route is `/user/auth`.
- Admin UI currently references `paper.title` in places, but paper API payload uses `subject`.
- `lib/renderEmail.js` exists but current auth flow uses `@react-email/render` directly.

## Admin Access

### Granting Admin Privileges

New users are created with role `user` by default. To grant admin access:

1. **Sign up and log in** to create your user document in MongoDB
2. **Access MongoDB Atlas** and find your user record in the `Vault-project` database
3. **Update the user document** and set `"role": "admin"`
4. **Reload the app** – you now have access to `/admin`

### Admin Capabilities

- **Moderation Dashboard** (`/admin`) – View pending submissions
- **Approve/Reject Papers** – Transition `pending` → `approved` or `rejected`
- **View All Statuses** – Filter papers by status (pending, approved, rejected)

## Contributing

We welcome contributions! Whether it's bug fixes, features, documentation, or design improvements, your help makes Vault better.

**Getting started:**
1. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for our development workflow
2. See [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) for community guidelines
3. Check [GitHub Issues](https://github.com/yourusername/vault/issues) for ideas
4. Fork the repo and create a feature branch (`fix/`, `feat/`, `docs/` prefixes)

**Key guidelines:**
- Follow ESLint rules (`npm run lint -- --fix`)
- Use conventional commits (`feat:`, `fix:`, `docs:`, etc.)
- Keep commits atomic and descriptive
- Test locally before submitting PR
- No hardcoded secrets or env vars

**Report security issues privately** to harshmahto02@gmail.com (do not open public issues).

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

This project is licensed under the **MIT License**. See [LICENSE](./LICENSE) for details.

## Support & Questions

- 📖 **Documentation** – Check the README sections above
- 💬 **GitHub Issues** – [Report bugs or request features](https://github.com/yourusername/vault/issues)
- 💭 **GitHub Discussions** – [Ask questions and share ideas](https://github.com/yourusername/vault/discussions)
- 📧 **Email** – harshmahto02@gmail.com

---

**Made with ❤️ for students by students.**
