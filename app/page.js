"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  FiBookOpen,
  FiSearch,
  FiZap,
  FiArrowRight,
  FiFolder,
  FiLock,
} from "react-icons/fi";
import dynamic from "next/dynamic";

import ContributionsPage from "./user/contributions/page";

const Silk = dynamic(() => import("./component/Silk"), { ssr: false });

export default function Home() {
  const { data: session, status } = useSession();
  const [recentPapers, setRecentPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, recent: 0 });

  useEffect(() => {
    const fetchRecentPapers = async () => {
      try {
        const response = await fetch("/api/papers?limit=4&offset=0");
        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.papers)) {
          setRecentPapers(data.papers);
          setStats({
            total: Number(data.total ?? data.papers.length ?? 0),
            recent: data.papers.length,
          });
        }
      } catch (err) {
        console.error("Error fetching papers:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentPapers();
  }, []);

  const isAuthenticated = status === "authenticated" && session;

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-teal-100 selection:text-teal-900">
      {/* 
        HERO SECTION
      */}
      <section className="relative pt-16 pb-20 md:pt-20 md:pb-32 overflow-hidden flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 z-0 bg-[#fafaf9]"></div>

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white flex flex-col items-center justify-center">
            <span className="text-[#0d542b] mb-4 drop-shadow-sm">Vault</span>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-x-3 gap-y-1 flex-wrap text-center">
              <span className="text-[#194b14]">Master your exams</span>
              <span className="inline-grid h-[1.2em] overflow-hidden align-bottom text-[#008236]">
                <span className="flex flex-col animate-[text-slide_6s_ease-in-out_infinite]">
                  <span className="h-[1.2em] font-(family-name:--font-playfair) italic tracking-normal px-2 inline-flex items-center justify-center">
                    faster.
                  </span>
                  <span className="h-[1.2em] font-(family-name:--font-playfair) italic tracking-normal px-2 inline-flex items-center justify-center">
                    smarter.
                  </span>
                  <span className="h-[1.2em] font-(family-name:--font-playfair) italic tracking-normal px-2 inline-flex items-center justify-center">
                    better.
                  </span>
                  <span className="h-[1.2em] font-(family-name:--font-playfair) italic tracking-normal px-2 inline-flex items-center justify-center">
                    faster.
                  </span>
                </span>
              </span>
            </div>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 font-light max-w-2xl mx-auto leading-relaxed">
            A minimalist archive of past papers, intelligently organized so you
            can focus on what actually matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            {isAuthenticated ? (
              <>
                <Link
                  href="/user/dashboard"
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-slate-900 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-linear-to-b from-transparent via-transparent to-black" />
                  <span className="relative flex items-center gap-2">
                    Go to dashboard{" "}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
                <Link
                  href="/user/papers"
                  className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-slate-900 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
                >
                  <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-linear-to-b from-transparent via-transparent to-black" />
                  <span className="relative flex items-center gap-2">
                    Go to library{" "}
                    <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </>
            ) : (
              <Link
                href="/user/papers"
                className="group relative inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-slate-900 rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-xl hover:shadow-slate-900/10 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:ring-offset-2"
              >
                <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-linear-to-b from-transparent via-transparent to-black" />
                <span className="relative flex items-center gap-2">
                  Go to library{" "}
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            )}

            <Link
              href="#features"
              className="px-8 py-3.5 text-base font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              How it works
            </Link>
          </div>
        </div>
      </section>

      {/* 
        FEATURES SECTION (Minimal Bento Grid)
      */}
      <section
        id="features"
        className="py-24 bg-slate-50/50 border-y border-slate-100"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-16 md:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Everything you need. Nothing you don&apos;t.
            </h2>
            <p className="mt-4 text-lg text-slate-500">
              We stripped away the clutter to give you a pure, undistracted
              study environment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Bento Box 1: Large Feature */}
            <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <FiBookOpen size={120} className="text-teal-600 rotate-12" />
              </div>
              <div className="h-12 w-12 rounded-2xl bg-teal-50 text-teal-600 grid place-items-center mb-6">
                <FiBookOpen size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">
                The Single Hub
              </h3>
              <p className="text-slate-500 text-lg leading-relaxed max-w-md">
                Browse every past paper without digging through obscure shared
                drives or WhatsApp groups. We&apos;ve consolidated the entire
                archive into one pristine interface.
              </p>
            </div>

            {/* Bento Box 2: Small Feature */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="h-12 w-12 rounded-2xl bg-indigo-50 text-indigo-600 grid place-items-center mb-6">
                <FiSearch size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Instant Search
              </h3>
              <p className="text-slate-500 leading-relaxed">
                Filter instantly by semester, subject, or year. Find what you
                need in milliseconds.
              </p>
            </div>

            {/* Bento Box 3: Small Feature */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
              <div className="h-12 w-12 rounded-2xl bg-amber-50 text-amber-600 grid place-items-center mb-6">
                <FiZap size={24} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                Distraction Free
              </h3>
              <p className="text-slate-500 leading-relaxed">
                A clean, minimal typography-focused design. No ads, no popups,
                just you and your study material.
              </p>
            </div>

            {/* Bento Box 4: Medium/Wide Feature with Stats */}
            <div className="md:col-span-2 bg-slate-900 rounded-3xl p-8 border border-slate-800 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-md text-white flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold mb-2">Constantly Growing</h3>
                <p className="text-slate-400 max-w-md">
                  The community contributes daily. Verify your papers, earn
                  platform coins, and top the leaderboard.
                </p>
              </div>
              <div className="mt-8 flex gap-8">
                <div>
                  <p className="text-4xl font-bold text-teal-400">
                    {stats.total > 0
                      ? `${Math.min(stats.total, 999)}${stats.total > 999 ? "+" : ""}`
                      : "∞"}
                  </p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">
                    Verified Papers
                  </p>
                </div>
                <div>
                  <p className="text-4xl font-bold text-white">24/7</p>
                  <p className="text-sm text-slate-500 font-medium uppercase tracking-wider mt-1">
                    Availability
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 
        RECENT ADDITIONS
        A clean list design
      */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10 border-b border-slate-100 pb-4">
            <h2 className="text-2xl font-bold text-slate-900">
              Recently added
            </h2>
            <Link
              href="/user/papers"
              className="text-sm font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 transition-colors"
            >
              View all <FiArrowRight />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin h-6 w-6 border-2 border-slate-300 border-t-teal-600 rounded-full" />
            </div>
          ) : recentPapers.length > 0 ? (
            <div className="space-y-4">
              {recentPapers.map((paper) => (
                <Link
                  key={paper.id}
                  href={
                    isAuthenticated ? `/user/papers/${paper.id}` : "/user/auth"
                  }
                  className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-2xl border border-slate-100 hover:border-teal-100 hover:bg-teal-50/30 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-teal-100 group-hover:text-teal-600 transition-colors">
                      <FiFolder size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {paper.subject}
                      </h4>
                      <p className="text-sm text-slate-500 mt-0.5">
                        Sem {paper.semester}{" "}
                        {paper.program && (
                          <span className="mx-1.5 text-slate-300">•</span>
                        )}{" "}
                        {paper.program}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 sm:mt-0 flex items-center gap-3">
                    <span className="px-3 py-1 rounded-md bg-slate-50 text-slate-600 text-sm font-medium border border-slate-100 group-hover:border-teal-100 transition-colors">
                      {paper.year}
                    </span>
                    {!isAuthenticated && (
                      <span className="text-slate-300 group-hover:text-teal-400 transition-colors">
                        <FiLock size={16} />
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 border border-dashed border-slate-200 rounded-3xl">
              <FiBookOpen className="mx-auto mb-3 opacity-50" size={32} />
              <p>No recent papers available.</p>
            </div>
          )}
        </div>
      </section>
      <ContributionsPage />
    </div>
  );
}
