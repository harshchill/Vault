import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import Link from "next/link"
import {
  FiUpload,
  FiBookmark,
  FiFileText,
  FiAward,
  FiArrowRight,
  FiTrendingUp,
  FiHeart,
  FiSearch,
  FiHome,
} from "react-icons/fi"
import { getUserDashboardStats } from "@/app/actions/userActions"
import { LeaderboardBars } from "./_components/LeaderboardBars"

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata = {
  title: "Dashboard",
  description:
    "Track your uploads, saved papers, and activity in your personal Vault dashboard.",
  alternates: { canonical: "/user/dashboard" },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: { index: false, follow: false, noimageindex: true },
  },
  openGraph: {
    title: "Dashboard | Vault",
    description: "Your private Vault dashboard for papers, stats, and contributions.",
    url: "https://paper-vault.app/user/dashboard",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | Vault",
    description: "Private overview of your activity in Vault.",
    images: ["/twitter-image"],
  },
}

// ─── Constants ────────────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-teal-50 text-teal-800",
  "bg-blue-50 text-blue-800",
  "bg-amber-50 text-amber-800",
  "bg-purple-50 text-purple-800",
  "bg-rose-50 text-rose-800",
]

const RANK_MEDAL_STYLES = {
  1: "bg-amber-100 border-amber-200 text-amber-500",
  2: "bg-slate-100 border-slate-200 text-slate-400",
  3: "bg-amber-100/70 border-amber-200/70 text-amber-700",
}

const RANK_TEXT_COLORS = {
  1: "text-amber-500",
  2: "text-slate-400",
  3: "text-amber-700",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name = "?") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function formatCurrentMonthYear() {
  return new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(new Date())
}

// ─── Loading Skeleton ─────────────────────────────────────────────────────────

export function DashboardSkeleton() {
  const SKELETON_COUNT = 5

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-pulse">
      <div className="mb-8">
        <div className="h-8 w-64 bg-slate-100 rounded-xl mb-3" />
        <div className="h-4 w-48 bg-slate-100 rounded-xl" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-5">
        {[0, 1].map((i) => (
          <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-5 md:p-8">
            <div className="h-11 w-11 bg-slate-100 rounded-xl mb-6" />
            <div className="h-3 w-24 bg-slate-100 rounded-xl mb-4" />
            <div className="h-9 w-16 bg-slate-100 rounded-xl" />
          </div>
        ))}
        {[0, 1].map((i) => (
          <div key={i} className="bg-slate-800 rounded-2xl p-5 md:p-8">
            <div className="h-5 w-28 bg-slate-700 rounded-xl mb-5" />
            <div className="h-7 w-32 bg-slate-700 rounded-xl mb-3" />
            <div className="h-3 w-full bg-slate-700 rounded-xl mb-5" />
            <div className="h-9 w-28 bg-slate-700 rounded-xl" />
          </div>
        ))}
      </div>

      <div className="mt-10 bg-white border border-slate-200/60 rounded-2xl overflow-hidden p-5">
        <div className="h-5 w-40 bg-slate-100 rounded-xl mb-4" />
        {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 py-3">
            <div className="w-8 h-8 rounded-full bg-slate-100" />
            <div className="flex-1">
              <div className="h-3 w-28 bg-slate-100 rounded-xl mb-2" />
              <div className="h-2.5 w-20 bg-slate-100 rounded-xl" />
            </div>
            <div className="h-1.5 w-20 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>

      {["Papers for you", "Community Library"].map((label) => (
        <div key={label} className="mt-10">
          <div className="h-5 w-40 bg-slate-100 rounded-xl mb-5" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
              <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-5">
                <div className="w-9 h-9 bg-slate-100 rounded-xl mb-3" />
                <div className="h-3 w-full bg-slate-100 rounded-xl mb-2" />
                <div className="h-3 w-3/4 bg-slate-100 rounded-xl mb-5" />
                <div className="flex justify-between">
                  <div className="h-3 w-14 bg-slate-100 rounded-xl" />
                  <div className="h-3 w-12 bg-slate-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────

function SectionHeader({ icon, title, subtitle, href, linkLabel = "Browse all" }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
      <h2 className="text-lg sm:text-xl font-bold text-slate-800 flex flex-wrap items-center gap-2">
        {icon}
        {title}
        {subtitle && (
          <span className="text-slate-400 text-sm font-normal">{subtitle}</span>
        )}
      </h2>
      {href && (
        <Link
          href={href}
          className="text-teal-600 text-sm font-semibold hover:text-teal-700 inline-flex items-center gap-1 group w-fit"
        >
          {linkLabel}
          <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
        </Link>
      )}
    </div>
  )
}

function PaperCard({ paper, showYear = false, showAccent = true }) {
  return (
    <Link
      href={`/user/papers/${paper.id}`}
      className="card p-4 sm:p-5 hover:border-teal-300 group block relative transition-all duration-150 hover:-translate-y-0.5"
    >
      {showAccent && (
        <div className="absolute top-0 left-0 w-1 h-full bg-teal-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
      <div className="w-9 h-9 rounded-xl bg-slate-50 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors mb-3 flex items-center justify-center">
        <FiFileText size={16} />
      </div>
      <h4 className="font-bold text-sm text-slate-800 line-clamp-2 mb-1 group-hover:text-teal-700 transition-colors">
        {paper.subject}
      </h4>
      <div className="flex items-center justify-between text-xs text-slate-400 mt-3">
        <span>Sem {paper.semester}</span>
        {showYear ? (
          <span className="bg-slate-100 px-2 py-0.5 rounded-md font-medium text-slate-500">
            {paper.year}
          </span>
        ) : (
          <span className="flex items-center gap-1">
            <FiBookmark size={10} /> {paper.saveCount}
          </span>
        )}
      </div>
    </Link>
  )
}

// ─── Stat Cards ───────────────────────────────────────────────────────────────

function StatCard({ icon, label, value, glowClass, iconClass }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/60 p-4 sm:p-5 md:p-8 flex flex-col justify-between relative overflow-hidden group min-h-36 sm:min-h-44">
      <div
        className={`absolute -right-6 -top-6 w-32 h-32 rounded-full blur-2xl pointer-events-none transition-colors ${glowClass}`}
      />
      <div>
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center mb-4 md:mb-6 shadow-sm border ${iconClass}`}
        >
          {icon}
        </div>
        <h3 className="text-xs uppercase tracking-wide text-slate-500 font-medium">{label}</h3>
      </div>
      <p className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-800 mt-3">
        {value}
      </p>
    </div>
  )
}

function CTACard({ pill, pillClass, heading, sub, btnText, btnHref, ghost = false }) {
  const pillStyles =
    pillClass === "emerald"
      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
      : "bg-teal-500/15 border-teal-500/30 text-teal-300"

  const btnStyles = ghost
    ? "bg-transparent border-teal-500/40 text-teal-400 hover:bg-teal-500/10"
    : "bg-teal-500 border-teal-400 text-white hover:bg-teal-400"

  return (
    <div className="col-span-2 md:col-span-1 bg-slate-900 border border-slate-800 rounded-2xl p-5 md:p-8 flex flex-col justify-between relative overflow-hidden group shadow-xl min-h-40 sm:min-h-44">
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700 pointer-events-none" />
      <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/15 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700 pointer-events-none" />
      <div className="relative z-10">
        <span className={`inline-flex rounded-full border px-3 py-1 text-[10px] font-black uppercase tracking-wide mb-3 ${pillStyles}`}>
          {pill}
        </span>
        <h3 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-100 mb-2">{heading}</h3>
        <p className="text-xs text-slate-400 leading-relaxed mb-4">{sub}</p>
      </div>
      <Link
        href={btnHref}
        className={`relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-xl font-extrabold text-xs transition-all border w-fit ${btnStyles}`}
      >
        {btnText} <FiArrowRight />
      </Link>
    </div>
  )
}

// ─── Leaderboard ──────────────────────────────────────────────────────────────

function MedalIcon() {
  return (
    <svg viewBox="0 0 20 20" className="w-3 h-3 fill-current" aria-hidden="true">
      <path d="m10 1.8 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8L10 1.8Z" />
    </svg>
  )
}

function LeaderboardRow({ entry, index, maxCount, isCurrentUser = false }) {
  const rankTextColor = RANK_TEXT_COLORS[entry.rank] ?? "text-slate-400"
  const barWidth = Math.round((entry.uploadCount / maxCount) * 100)

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 py-3 px-3 sm:px-5 border-b border-slate-100 last:border-b-0 ${
        isCurrentUser ? "mx-3 my-2 rounded-xl bg-teal-50/60 border border-teal-100" : ""
      }`}
    >
      <div className={`w-4 sm:w-5 text-center text-sm font-bold ${rankTextColor}`}>
        {entry.rank}
      </div>

      {entry.rank <= 3 && !isCurrentUser ? (
        <div className={`hidden sm:flex w-5 h-5 rounded-full items-center justify-center border ${RANK_MEDAL_STYLES[entry.rank]}`}>
          <MedalIcon />
        </div>
      ) : (
        <div className="hidden sm:block w-5" />
      )}

      <div
        className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
          isCurrentUser ? "bg-teal-100 text-teal-800" : AVATAR_COLORS[index % AVATAR_COLORS.length]
        }`}
      >
        {getInitials(entry.name)}
      </div>

      <div className="flex-1 min-w-0">
        {isCurrentUser ? (
          <>
            <p className="text-sm font-semibold text-slate-800 truncate">
              You{" "}
              <span className="bg-teal-100 text-teal-700 text-[10px] font-black px-1.5 py-0.5 rounded ml-1.5">
                YOU
              </span>
            </p>
            <p className="text-xs text-teal-500 truncate">
              {entry.branch || "Start contributing"}
              {entry.semester ? ` Sem ${entry.semester}` : ""}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-slate-800 truncate">{entry.name}</p>
            <p className="text-xs text-slate-400 truncate">
              {entry.branch}
              {entry.semester ? ` Sem ${entry.semester}` : ""}
            </p>
          </>
        )}
      </div>

      <LeaderboardBars bars={[{ width: barWidth, delay: index * 80 }]} />
      <div className="text-sm font-bold text-teal-600 w-7 sm:w-8 text-right">{entry.uploadCount}</div>
    </div>
  )
}

function LeaderboardSection({ leaderboard, currentUserRank }) {
  const maxCount = leaderboard[0]?.uploadCount ?? 1
  const currentUser = leaderboard.find((e) => e.isCurrentUser)
  const userAbove = leaderboard.find((e) => e.rank === (currentUser?.rank ?? 0) - 1)
  const uploadsToNextRank = userAbove
    ? userAbove.uploadCount - (currentUser?.uploadCount ?? 0) + 1
    : 0

  function getMotivationText() {
    if (currentUserRank === 1) return "You're the top contributor this month!"
    if (uploadsToNextRank > 0)
      return `Upload ${uploadsToNextRank} more paper${uploadsToNextRank !== 1 ? "s" : ""} to reach #${currentUserRank - 1}`
    return "Upload papers to appear on the leaderboard"
  }

  return (
    <div className="mt-10 animate-fade-in [animation-delay:200ms]">
      <SectionHeader
        icon={<FiTrendingUp className="text-teal-500" />}
        title="Top contributors"
        subtitle={formatCurrentMonthYear()}
      />
      <div className="bg-white rounded-2xl border border-slate-200/60 overflow-hidden">
        {leaderboard.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">No leaderboard data available yet.</div>
        ) : (
          leaderboard.map((entry, index) => (
            <LeaderboardRow
              key={entry.userId}
              entry={entry}
              index={index}
              maxCount={maxCount}
              isCurrentUser={entry.isCurrentUser}
            />
          ))
        )}

        <div className="px-4 sm:px-5 py-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-xs text-slate-400">{getMotivationText()}</p>
          <Link
            href="/user/upload"
            className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-700 transition-colors"
          >
            Upload <FiArrowRight />
          </Link>
        </div>
      </div>
    </div>
  )
}

// ─── Paper Sections ───────────────────────────────────────────────────────────

function EmptyState({ icon, title, description, actionLabel, actionHref }) {
  return (
    <div className="col-span-full py-14 flex flex-col items-center text-center border-2 border-dashed border-slate-200 rounded-2xl">
      <div className="w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-500 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-base font-bold text-slate-800 mb-1">{title}</h3>
      <p className="text-sm text-slate-400 max-w-xs mb-5 leading-relaxed">{description}</p>
      <Link
        href={actionHref}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors"
      >
        {actionLabel} <FiArrowRight size={14} />
      </Link>
    </div>
  )
}

function PapersForYou({ papers, userSemester, userBranch }) {
  const semLabel = userSemester || "?"
  const branchLabel = userBranch || "Your branch"

  return (
    <div className="mt-10 animate-fade-in [animation-delay:300ms]">
      <SectionHeader
        icon={<FiHeart className="text-teal-500" />}
        title="Papers for you"
        subtitle={`- Sem ${semLabel} / ${branchLabel}`}
        href="/user/papers"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {papers.length === 0 ? (
          <EmptyState
            icon={<FiSearch size={22} />}
            title="No papers found for your semester yet"
            description={`Be the first to upload one for Sem ${semLabel} / ${branchLabel}.`}
            actionLabel="Upload a paper"
            actionHref="/user/upload"
          />
        ) : (
          papers.map((paper) => <PaperCard key={paper.id} paper={paper} />)
        )}
      </div>
    </div>
  )
}

function CommunityLibrary({ papers }) {
  return (
    <div className="mt-10 animate-fade-in [animation-delay:400ms]">
      <SectionHeader
        icon={<FiAward className="text-teal-500" />}
        title="Community Library"
        href="/user/papers"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {papers.length === 0 ? (
          <EmptyState
            icon={<FiUpload size={22} />}
            title="No papers available yet"
            description="Share your old papers and help fellow students find useful material."
            actionLabel="Upload your first paper"
            actionHref="/user/upload"
          />
        ) : (
          papers.map((paper) => <PaperCard key={paper.id} paper={paper} showYear showAccent={false} />)
        )}
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function MobileQuickNav() {
  const items = [
    { href: "/user/dashboard", label: "Home", icon: <FiHome size={17} /> },
    { href: "/user/upload", label: "Upload", icon: <FiUpload size={17} /> },
    { href: "/user/papers", label: "Papers", icon: <FiFileText size={17} /> },
    { href: "/user/saved", label: "Saved", icon: <FiBookmark size={17} /> },
  ]

  return (
    <nav
      aria-label="Dashboard quick navigation"
      className="md:hidden fixed left-3 right-3 bottom-3 z-40 rounded-2xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-900/10"
    >
      <div className="grid grid-cols-4">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-bold text-slate-500 transition-colors hover:text-teal-600 focus:text-teal-600"
          >
            <span className={item.label === "Upload" ? "text-teal-600" : ""}>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default async function DashboardPage() {
  const session = await getServerSession()
  if (!session?.user) redirect("/user/auth")

  const { success, stats, recentPapers, user, leaderboard, papersForYou, error } =
    await getUserDashboardStats(session.user.email)

  if (!success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">Error loading dashboard: {error}</p>
      </div>
    )
  }

  const firstName = session.user.name?.split(" ")[0] ?? "Scholar"
  const currentUserRank = leaderboard?.find((e) => e.isCurrentUser)?.rank ?? null

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10 pb-24 md:pb-10">

      {/* Header */}
      <div className="mb-6 sm:mb-8 animate-fade-in">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
            {firstName}
          </span>
        </h1>
        <p className="text-slate-500 mt-2 text-base sm:text-lg">Here&apos;s a glimpse of your academic journey.</p>
      </div>

      {/* Profile completion banner */}
      {!user?.isProfileComplete && (
        <div className="mb-6 animate-fade-in [animation-delay:75ms]">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-amber-800 font-medium">
              Complete your profile to get a more personalized experience.
            </p>
            <Link
              href="/user/profile"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-700"
            >
              Complete profile <FiArrowRight />
            </Link>
          </div>
        </div>
      )}

      {/* Stats + CTAs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 animate-fade-in [animation-delay:100ms]">
        <StatCard
          icon={<FiUpload size={18} />}
          label="Total Uploads"
          value={stats.totalUploaded}
          glowClass="bg-teal-100/50 group-hover:bg-teal-200/50"
          iconClass="bg-teal-50 text-teal-600 border-teal-100"
        />
        <StatCard
          icon={<FiBookmark size={18} />}
          label="Saved Papers"
          value={stats.totalSaved}
          glowClass="bg-emerald-100/50 group-hover:bg-emerald-200/50"
          iconClass="bg-emerald-50 text-emerald-600 border-emerald-100"
        />
        <CTACard
          pill="Community Call"
          pillClass="teal"
          heading="Got old papers?"
          sub="Help out your juniors and climb the contribution leaderboard."
          btnText="Upload Now"
          btnHref="/user/upload"
        />
        <CTACard
          pill="Community"
          pillClass="emerald"
          heading="Find papers?"
          sub="Explore the community library and discover papers for your semester."
          btnText="Browse Library"
          btnHref="/user/papers"
          ghost
        />
      </div>

      <LeaderboardSection leaderboard={leaderboard ?? []} currentUserRank={currentUserRank} />
      <PapersForYou papers={papersForYou ?? []} userSemester={user?.semester} userBranch={user?.branch} />
      <CommunityLibrary papers={recentPapers ?? []} />
      <MobileQuickNav />
    </div>
  )
}
