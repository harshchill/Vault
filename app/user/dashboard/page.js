import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { FiUpload, FiBookmark, FiFileText, FiAward, FiArrowRight } from "react-icons/fi";
import { getUserDashboardStats } from "@/app/actions/userActions";

export const metadata = {
  title: "Dashboard",
  description:
    "Track your uploads, saved papers, and activity in your personal Vault dashboard.",
  alternates: {
    canonical: "/user/dashboard",
  },
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  openGraph: {
    title: "Dashboard | Vault",
    description:
      "Your private Vault dashboard for papers, stats, and contributions.",
    url: "https://paper-vault.app/user/dashboard",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dashboard | Vault",
    description: "Private overview of your activity in Vault.",
    images: ["/twitter-image"],
  },
};

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/user/auth");
  }

  const { success, stats, recentPapers, user, error } = await getUserDashboardStats(session.user.email);

  if (!success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">Error loading dashboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-10 animate-fade-in">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
          Welcome back, <span className="bg-linear-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">{session.user.name?.split(" ")[0] || "Scholar"}</span>
        </h1>
        <p className="text-slate-500 mt-2 text-lg">Here&apos;s a glimpse of your academic journey.</p>
      </div>

      {!user?.isProfileComplete && (
        <div className="mb-6 animate-fade-in delay-75">
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-amber-800 font-medium">
              Complete your profile to get a more personalized experience.
            </p>
            <Link
              href="/user/profile"
              className="inline-flex items-center gap-2 text-sm font-semibold text-amber-900 hover:text-amber-700"
            >
              Complete profile
              <FiArrowRight />
            </Link>
          </div>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 animate-fade-in delay-100">
        
        {/* Uploads Stat Card */}
        <div className="card p-5 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-teal-100/50 rounded-full blur-2xl group-hover:bg-teal-200/50 transition-colors" />
          <div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mb-4 md:mb-6 shadow-sm border border-teal-100">
              <FiUpload size={20} className="md:w-6 md:h-6" />
            </div>
            <h3 className="text-slate-500 font-medium tracking-wide text-xs md:text-sm uppercase">Total Uploads</h3>
          </div>
          <p className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 md:mt-4">{stats.totalUploaded}</p>
        </div>

        {/* Saves Stat Card */}
        <div className="card p-5 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/50 transition-colors" />
          <div>
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 md:mb-6 shadow-sm border border-emerald-100">
              <FiBookmark size={20} className="md:w-6 md:h-6" />
            </div>
            <h3 className="text-slate-500 font-medium tracking-wide text-xs md:text-sm uppercase">Saved Papers</h3>
          </div>
          <p className="text-4xl md:text-5xl font-extrabold text-slate-800 mt-2 md:mt-4">{stats.totalSaved}</p>
        </div>

        {/* Promo Banner Card (Spans wide on mobile, 1 col on md) */}
        <div className="col-span-2 md:col-span-1 card p-6 md:p-8 bg-slate-900 border-slate-800  flex flex-col justify-center relative overflow-hidden group shadow-2xl">
          <div className="absolute inset-0 bg-grid-pattern opacity-10 mix-blend-overlay" />
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-teal-500/30 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700 pointer-events-none" />
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-3xl group-hover:scale-150 transition-all duration-700 pointer-events-none" />
          
          <div className="relative z-10">
            <div className="inline-block px-3 py-1 bg-teal-500/20 border border-teal-500/30 rounded-full text-teal-400 text-[10px] md:text-[10px] font-black uppercase tracking-wider mb-2 md:mb-3">Community Call</div>
            <h3 className="text-2xl md:text-3xl text-slate-900 font-extrabold mb-2">Got old papers?</h3>
            <p className=" text-slate-600 text-xs md:text-sm mb-4 md:mb-6 max-w-55">Help out your juniors and climb the contribution leaderboard.</p>
            <Link href="/user/upload" className="inline-flex items-center gap-2 px-5 py-2.5 md:px-6 md:py-3 bg-teal-500 text-white rounded-xl font-extrabold hover:bg-teal-400 transition-all shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:-translate-y-1 text-xs md:text-sm border border-teal-400 w-fit">
              Upload Now
              <FiArrowRight />
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Papers Glimpse Section */}
      <div className="mt-12 animate-fade-in delay-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FiAward className="text-teal-500" /> Community Library
          </h2>
          <Link href="/user/papers" className="text-teal-600 text-sm font-semibold hover:text-teal-700 flex items-center gap-1 group">
            Browse all <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {recentPapers?.length > 0 ? (
            recentPapers.map((paper, idx) => (
              <Link key={paper.id} href={`/user/papers/${paper.id}`} className="card p-5 hover:border-teal-300 group block relative">
                 <div className="absolute top-0 left-0 w-1 h-full bg-teal-400 rounded-l-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
                 <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center mb-4 group-hover:bg-teal-50 group-hover:text-teal-600 transition-colors">
                    <FiFileText size={20} />
                 </div>
                 <h4 className="font-bold text-slate-800 text-base line-clamp-2 mb-1 group-hover:text-teal-700 transition-colors">{paper.subject}</h4>
                 <div className="flex items-center justify-between text-xs text-slate-500 mt-4">
                    <span>Sem {paper.semester}</span>
                    <span className="bg-slate-100 px-2 py-1 rounded-md font-medium text-slate-600">{paper.year}</span>
                 </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl">
              No recent papers available yet.
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
