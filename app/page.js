"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FiBookOpen, FiSearch, FiZap, FiTrendingUp, FiArrowRight, FiFolder, FiClock } from "react-icons/fi";

export default function Home() {
  const { data: session, status } = useSession();
  const [recentPapers, setRecentPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recent: 0 });

  // Fetch recent papers
  useEffect(() => {
    const fetchRecentPapers = async () => {
      try {
        const response = await fetch('/api/papers');
        const data = await response.json();
        
        if (data.success && data.papers) {
          const papers = data.papers.slice(0, 3); // Get 3 most recent
          setRecentPapers(papers);
          setStats({ total: data.papers.length, recent: papers.length });
        }
      } catch (err) {
        console.error('Error fetching papers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPapers();
  }, []);

  const isAuthenticated = status === "authenticated" && session;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-teal-50">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] -z-0" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-26 md:py-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-3 animate-fade-in">
              <div className="space-y-3">
                <span className="pill inline-flex items-center gap-2">
                  <FiZap className="text-emerald-600" size={16} />
                  Minimal exam archive
                </span>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-slate-900 tracking-tight">
                  All your past semester papers in one{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    clean space
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed max-w-xl">
                  StudyVault keeps previous exam papers organized with quick filters,
                  so you spend time practicing, not searching.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/papers" 
                  className="button button-primary group"
                >
                  Explore papers
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" size={18} />
                </Link>
                <Link href="/upload" className="button button-ghost">
                  Contribute
                </Link>
                <Link href="/contributions" className="button button-ghost">
                  Leaderboard
                </Link>
                {!isAuthenticated ? (
                  <Link href="/auth" className="button button-ghost">
                    Login / Signup
                  </Link>
                ) : (
                  <Link href="/papers" className="button button-ghost">
                    My Papers
                  </Link>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-3 group">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white grid place-items-center font-bold text-lg shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                    {stats.total > 0 ? `${Math.min(stats.total, 999)}${stats.total > 999 ? '+' : ''}` : '∞'}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Verified papers</p>
                    <p className="text-sm text-slate-500">Ready to study</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 group">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white grid place-items-center font-bold text-lg shadow-lg shadow-emerald-200 group-hover:scale-110 transition-transform">
                    <FiTrendingUp size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900">Growing library</p>
                    <p className="text-sm text-slate-500">Updated regularly</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Recent Papers Card */}
            <div className="relative">
              <div className="card p-8 space-y-6 shadow-2xl border-2 border-emerald-100/50 bg-white/80 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-slate-500 font-medium mb-1">Quick peek</p>
                    <h3 className="text-2xl font-bold text-slate-900">Recent papers</h3>
                  </div>
                  <span className="pill">Live data</span>
                </div>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin h-6 w-6 border-2 border-emerald-600 border-t-transparent rounded-full" />
                  </div>
                ) : recentPapers.length > 0 ? (
                  <div className="space-y-3">
                    {recentPapers.map((paper, idx) => (
                      <Link
                        key={paper.id}
                        href={isAuthenticated ? `/papers/${paper.id}` : "/auth"}
                        className="block p-4 rounded-xl border-2 border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all group bg-gradient-to-r from-white to-emerald-50/30"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="h-10 w-10 rounded-lg bg-emerald-100 text-emerald-700 grid place-items-center shrink-0 group-hover:bg-emerald-200 transition-colors">
                              <FiFolder size={18} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-semibold text-slate-900 truncate group-hover:text-emerald-700 transition-colors">
                                {paper.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <p className="text-sm text-slate-500">Semester {paper.semester}</p>
                                {paper.subject && (
                                  <>
                                    <span className="text-slate-300">•</span>
                                    <p className="text-sm text-slate-500 truncate">{paper.subject}</p>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          <span className="text-xs px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 font-medium shrink-0 ml-2">
                            {paper.year}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-slate-500">
                    <FiBookOpen className="mx-auto mb-2 text-slate-400" size={32} />
                    <p className="text-sm">No papers available yet</p>
                  </div>
                )}
                
                <Link
                  href="/papers"
                  className="block w-full text-center py-3 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-semibold transition-colors group"
                >
                  View all papers
                  <FiArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" size={16} />
                </Link>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -z-10 -top-4 -right-4 h-32 w-32 bg-emerald-200/30 rounded-full blur-3xl" />
              <div className="absolute -z-10 -bottom-4 -left-4 h-24 w-24 bg-teal-200/30 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <span className="pill mb-4 inline-block">Why StudyVault?</span>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Everything you need to{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              study smarter
            </span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            A focused platform designed to help you find and study past papers efficiently.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: <FiBookOpen className="text-emerald-600" size={28} />,
              title: "Single hub",
              desc: "Browse every paper without digging through folders or drives. Everything in one organized place.",
              gradient: "from-emerald-50 to-teal-50",
            },
            {
              icon: <FiSearch className="text-emerald-600" size={28} />,
              title: "Smart filters",
              desc: "Filter by semester, subject, or year to jump straight to what you need. No more endless scrolling.",
              gradient: "from-teal-50 to-emerald-50",
            },
            {
              icon: <FiZap className="text-emerald-600" size={28} />,
              title: "Study friendly",
              desc: "Minimal layout, light theme, and green accents that keep focus on content. Built for productivity.",
              gradient: "from-emerald-50 to-teal-50",
            },
          ].map((item, idx) => (
            <div
              key={item.title}
              className="card p-8 space-y-4 hover:shadow-xl transition-all duration-300 group border-2 border-transparent hover:border-emerald-200"
            >
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${item.gradient} grid place-items-center group-hover:scale-110 transition-transform shadow-lg`}>
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Conditional based on auth */}
      {!isAuthenticated ? (
        <section className="bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 text-white py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold leading-tight">
              Ready to revise smarter?
            </h2>
            <p className="text-xl text-emerald-50 max-w-2xl mx-auto">
              Create your account and start browsing a clean library of past papers.
              Join thousands of students already using StudyVault.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/auth" className="px-8 py-4 bg-white text-emerald-600 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:shadow-2xl hover:scale-105 inline-flex items-center gap-2">
                Join StudyVault
                <FiArrowRight size={20} />
              </Link>
              <Link href="/papers" className="px-8 py-4 bg-emerald-700/30 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-emerald-700/50 transition-all border-2 border-white/20">
                View collection
              </Link>
              <Link href="/upload" className="px-8 py-4 bg-emerald-700/30 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-emerald-700/50 transition-all border-2 border-white/20">
                Contribute
              </Link>
              <Link href="/contributions" className="px-8 py-4 bg-emerald-700/30 backdrop-blur-sm text-white rounded-xl font-bold hover:bg-emerald-700/50 transition-all border-2 border-white/20">
                Leaderboard
              </Link>
            </div>
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-br from-slate-50 to-emerald-50 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
            <div className="inline-block">
              <span className="pill bg-white border-2 border-emerald-200">
                Welcome back, {session.user?.name || session.user?.email?.split("@")[0]}!
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-tight">
              Continue your study journey
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Pick up where you left off. Browse papers, filter by semester, and ace your exams.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/papers" className="button button-primary inline-flex items-center gap-2">
                Browse Papers
                <FiArrowRight size={20} />
              </Link>
              <Link href="/upload" className="button button-ghost">Contribute</Link>
              <Link href="/contributions" className="button button-ghost">Leaderboard</Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
