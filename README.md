
# StudyVault — Minimal, beautiful exam-paper hub

A clean and efficient platform to organize, browse, and study previous semester papers. Focused UI. Smart filters. Secure access. Built with modern Next.js App Router and a tasteful emerald/teal aesthetic.

Demo locally: http://localhost:3000


## ✨ Highlights

- **Minimal exam archive** with a modern, responsive UI (`app/page.js`).
- **Smart filters** by semester, department, and program on `papers` page (`app/papers/page.js`).
- **Secure viewing** of PDFs with a custom `PdfViewer` (`app/component/pdfViewer.js`) and a gentle login gate (`LoginRequiredModal`).
- **Admin-only upload portal** to add new papers: uploads PDF to Supabase and metadata to MongoDB (`app/admin/page.js`).
- **Role‑based access control** powered by NextAuth + JWT + database role lookup (`app/api/auth/[...nextauth]/route.js`, `middleware.js`).
- **API routes** for creating and listing papers with validation (`app/api/papers/route.js`).
- **User uploads** page for authenticated users (`/upload`) that submits papers for admin review.
- **Contributions leaderboard** at `/contributions` aggregating approved uploads by user with avatars and ranks.


## 🧰 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, Tailwind CSS v4 with custom design tokens (`app/globals.css`)
- **Auth**: NextAuth (Google, GitHub providers)
- **Database**: MongoDB with Mongoose 9
- **Storage**: Supabase Storage (bucket: `Vault`) for PDFs
- **PDF Rendering**: react-pdf

See `package.json` for versions.


## 🏗️ App Architecture

- **Layout & Providers**
  - `app/layout.js` wraps pages with `SessionProvider` (`app/providers/SessionProvider.js`) and global `Navbar`.
  - Global styles and tokens in `app/globals.css` (cards, pills, buttons, grid, animations).

- **Core Pages**
  - `app/page.js`: Landing with hero, live recent papers, and CTAs.
  - `app/papers/page.js`: Library with filters and guarded “View paper” action.
  - `app/papers/[id]/page.js`: Auth-required PDF viewer page using `PdfViewer`.
  - `app/auth/page.js`: Sign in (Google/GitHub) and email UI.
  - `app/admin/page.js`: Admin upload workflow (Supabase + MongoDB) with validation.
  - `app/upload/page.js`: User upload (auth required) — submissions await admin approval.
  - `app/contributions/page.js`: Top contributors leaderboard (approved uploads only).

- **API & Data**
  - `app/api/papers/route.js`: REST-style POST (create) and GET (list with filters).
  - `app/api/contributions/route.js`: Aggregation for the leaderboard.
  - `models/paper.js`: Paper schema (title, subject, semester, year, department, program, url).
  - `models/user.js`: User schema (email, name, role: user|admin, image?).
  - `db/connectDb.js`: Mongoose connection (dbName: `Vault-project`).

- **Auth & Security**
  - `app/api/auth/[...nextauth]/route.js`: NextAuth providers + JWT callbacks. Role is read from Mongo on each request to stay fresh.
  - `middleware.js`: Protects `/admin` routes; only allows `role === 'admin'`.


## 🔐 Authentication & Roles

- Providers: Google and GitHub.
- On first sign-in, a `User` document is created with `role: 'user'`.
- To grant admin access, update the user in MongoDB and set `role` to `admin`.
- Middleware enforces admin access on `/admin` and redirects others to `/auth`.
- Profile images: we store `image` on the user when available and also populate session with `image` and `firstName`. We fall back to provider `avatar_url` if `image` is missing.


## 📦 Features You Built

- **Beautiful landing** with live “Recent papers” fed from `/api/papers`.
- **Filterable papers** view with semester/department/program filters (client-side, memoized) and clean cards with metadata.
- **Login required modal** when trying to view without a session.
- **Robust admin upload** flow:
  - Validates PDF type/size and required form fields.
  - Uploads file to Supabase bucket `Vault`.
  - Creates a paper entry in MongoDB with strict validation and enums.
- **PDF experience** tuned for study:
  - Responsive scaling.
  - Disabled context menu and interactions to reduce distractions.
  - Smooth loading states and error messaging.


## 🔗 Routes Overview

- `/` — Landing page, stats, recent papers preview.
- `/auth` — Sign-in with Google/GitHub.
- `/papers` — Full library view with filters and guarded viewing.
- `/papers/[id]` — PDF viewer (requires login).
- `/admin` — Admin upload portal (requires admin role).
- `/upload` — User uploads (requires login, pending admin approval).
- `/contributions` — Top contributors leaderboard.


## 🧪 API Endpoints

Primary papers endpoints under `app/api/papers/route.js`.

- **GET /api/papers** — List papers (sorted by `createdAt` desc)
  - Query params: `semester`, `year`, `subject`, `department`, `program`
  - Returns: `{ success, count, papers: [{ id, title, subject, semester, year, department, program, url, createdAt }] }`

- **POST /api/papers** — Create paper
  - Body: `{ title, subject, semester (1–8), year (2000–2100), department ('CS'|'mining'|'cement'|'others'), program, url }`
  - Validation: required fields, enums, ranges.
  - Returns: `{ success, message, paper }` with created entity.

- **GET /api/contributions** — Leaderboard aggregation
  - Returns: `{ success, contributors: [{ rank, email, count, firstName, image }] }`


## 🗃️ Data Models

- `models/paper.js`
  - `title: String`
  - `subject: String`
  - `semester: Number (1–8)`
  - `year: Number`
  - `department: 'CS' | 'mining' | 'cement' | 'others'`
  - `program: String` (e.g., B.tech)
  - `url: String` (Supabase file URL)
  - `createdAt: Date`

- `models/user.js`
  - `email: String (unique)`
  - `name: String`
  - `role: 'user' | 'admin'`
  - `image?: String` (avatar URL from provider)


## ⚙️ Environment Variables

Create `.env.local` with:

```bash
# MongoDB
MONGODB_URI=...

# NextAuth
NEXTAUTH_SECRET=...
GITHUB_ID=...
GITHUB_SECRET=...
GOOGLE_ID=...
GOOGLE_SECRET=...

# Supabase (public for client upload)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

Notes:
- Create a Supabase Storage bucket named `Vault` and allow authenticated uploads.
- Ensure CORS/public access as appropriate for PDF viewing.
- If using `next/image` for provider avatars, ensure external domains are allowed in `next.config.mjs`:
  ```js
  export default {
    images: {
      domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com'],
    },
  };
  ```


## 🚀 Getting Started (Local)

1. Install deps
   ```bash
   npm install
   ```
2. Add environment variables to `.env.local` (see above).
3. Run dev server
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000

Admin access:
- Sign in once, then in MongoDB set your user’s `role` to `admin`.
- Navigate to `/admin` to upload PDFs.


## 🧭 Project Structure (key paths)

```
app/
  page.js                # Landing
  layout.js              # Root layout, providers, navbar
  globals.css            # Theme tokens & components
  auth/page.js           # Sign-in
  papers/page.js         # Library + filters
  papers/[id]/page.js    # PDF viewer
  admin/page.js          # Admin upload (guarded)
  api/
    papers/route.js      # GET/POST papers
    auth/[...nextauth]/route.js  # NextAuth
app/component/
  Navbar.js
  LoginRequiredModal.js
  pdfViewer.js
db/connectDb.js
models/paper.js
models/user.js
middleware.js            # Protects /admin
```


## 🎨 Design Details

- Custom components: `.card`, `.pill`, `.button`, gradient accents in `app/globals.css`.
- Subtle grid backgrounds, shadows, motion and hover states.
- Mobile‑first, responsive, and accessible.


## 📸 Screenshots (optional)

Add screenshots to `public/` and embed here:

```markdown
![Landing](public/landing.png)
![Papers](public/papers.png)
![Viewer](public/viewer.png)
![Admin](public/admin.png)
```


## 📄 License

Personal/portfolio project. Feel free to fork for learning purposes.


## 🙌 Credits

- Next.js, Tailwind CSS, NextAuth, Mongoose, Supabase, react-pdf.
- Geist font by Vercel.

