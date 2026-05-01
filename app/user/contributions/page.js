"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FiAward, FiStar, FiTrendingUp, FiArrowRight } from "react-icons/fi";
import Link from "next/link";

export default function ContributionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch("/api/contributions", { cache: "no-store" });
        if (!res.ok) throw new Error("Unable to fetch contributions");
        const json = await res.json();
        if (active) {
          setData(json.contributors || []);
          setError(null);
        }
      } catch (e) {
        if (active) setError(e.message || "Failed to load");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const top3 = data.slice(0, 3);
  const rest = data.slice(3);

  const podiumOrder = [];
  if (top3[1]) podiumOrder.push(top3[1]);
  if (top3[0]) podiumOrder.push(top3[0]);
  if (top3[2]) podiumOrder.push(top3[2]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-background px-4 pb-24 pt-12 sm:px-6 lg:px-8">
      <div className="absolute top-0 right-[20%] -z-10 h-125 w-125 rounded-full bg-teal-400/10 blur-3xl" />
      <div className="absolute bottom-0 left-[10%] -z-10 h-100 w-100 rounded-full bg-emerald-400/10 blur-3xl" />

      <div className="mx-auto flex max-w-5xl flex-col items-center animate-fade-in">
        <div className="mb-16 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-800 md:text-5xl">
            Vault Leaderboard
          </h1>
          <p className="mt-3 text-lg text-slate-500">
            Recognizing the architects of our community library.
          </p>
        </div>

        {loading && (
          <div className="flex h-40 items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent" />
          </div>
        )}

        {error && (
          <div className="card max-w-md border-red-500 bg-red-50 p-6 text-center font-medium text-red-500">
            {error}
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <>
            <div className="preserve-3d mb-16 flex w-full max-w-3xl items-end justify-center gap-2 sm:gap-6">
              {podiumOrder.map((contributor) => {
                const isFirst = contributor.rank === 1;
                const isSecond = contributor.rank === 2;
                const podiumHeight = isFirst
                  ? "h-64 md:h-80"
                  : isSecond
                    ? "h-48 md:h-60"
                    : "h-36 md:h-44";
                const colorFrom = isFirst
                  ? "from-amber-400"
                  : isSecond
                    ? "from-slate-400"
                    : "from-orange-400";
                const colorTo = isFirst
                  ? "to-amber-600"
                  : isSecond
                    ? "to-slate-600"
                    : "to-orange-600";
                const Icon = isFirst ? FiAward : isSecond ? FiStar : FiTrendingUp;

                return (
                  <div
                    key={contributor.id || contributor.rank}
                    className="group flex flex-1 flex-col items-center transition-transform duration-500 hover:-translate-y-2"
                  >
                    <div className="relative z-10 mb-4 flex w-full flex-col items-center">
                      <div
                        className={`mb-2 ${
                          isFirst
                            ? "animate-bounce text-amber-500"
                            : isSecond
                              ? "text-slate-400"
                              : "text-orange-400"
                        }`}
                      >
                        <Icon size={isFirst ? 32 : 24} />
                      </div>

                      <div
                        className={`relative mb-3 overflow-hidden rounded-full bg-white shadow-xl ring-4 ${
                          isFirst
                            ? "h-24 w-24 ring-amber-400/50"
                            : isSecond
                              ? "h-16 w-16 ring-slate-300/50"
                              : "h-16 w-16 ring-orange-300/50"
                        }`}
                      >
                        <Image
                          src={contributor.image || "/default-avatar.png"}
                          alt={contributor.name}
                          fill
                          loader={({ src }) => src}
                          unoptimized
                          className="rounded-full object-cover p-1"
                        />
                        <div
                          className={`absolute -bottom-3 -right-2 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br ${colorFrom} ${colorTo} text-sm font-bold text-white shadow-md`}
                        >
                          {contributor.rank}
                        </div>
                      </div>
                      <h3
                        className={`w-full max-w-30 truncate px-2 text-center font-bold text-slate-800 ${
                          isFirst ? "text-xl" : "text-sm"
                        }`}
                      >
                        {contributor.name}
                      </h3>
                      <p
                        className={`mt-1 rounded bg-white/50 px-2 py-0.5 text-xs font-medium backdrop-blur-md ${
                          isFirst ? "text-amber-600" : "text-slate-500"
                        }`}
                      >
                        {contributor.count} papers
                      </p>
                    </div>

                    <div
                      className={`relative w-full overflow-hidden rounded-t-2xl border-t border-white/20 bg-linear-to-b ${colorFrom} ${colorTo} ${podiumHeight} flex items-start justify-center pt-6 opacity-90 shadow-xl shadow-teal-500/10 transition-opacity group-hover:opacity-100`}
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-50 mix-blend-overlay" />
                      <span className="text-6xl font-black tracking-tighter text-white/40 mix-blend-overlay">
                        #{contributor.rank}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {rest.length > 0 && (
              <div className="glass-panel w-full max-w-4xl rounded-3xl border-t-2 border-teal-500/20 p-2 shadow-xl shadow-teal-500/5">
                <div className="flex items-center justify-between border-b border-teal-500/10 p-4 px-6 text-sm font-bold uppercase tracking-wider text-slate-400">
                  <span>Rank & Scholar</span>
                  <span>Contributions</span>
                </div>
                <div className="divide-y divide-teal-500/5">
                  {rest.map((contributor) => (
                    <div
                      key={contributor.rank}
                      className="group flex items-center justify-between rounded-2xl p-4 transition-colors hover:bg-white/50 sm:px-6"
                    >
                      <div className="flex items-center gap-5">
                        <span className="w-8 text-right text-xl font-black text-slate-400 transition-colors group-hover:text-teal-500">
                          #{contributor.rank}
                        </span>
                        <Image
                          src={contributor.image || "/default-avatar.png"}
                          alt={contributor.name}
                          width={48}
                          height={48}
                          loader={({ src }) => src}
                          unoptimized
                          className="h-12 w-12 rounded-full bg-white p-0.5 object-cover shadow-sm"
                        />
                        <div>
                          <h4 className="text-lg font-bold text-slate-800 transition-colors group-hover:text-teal-700">
                            {contributor.name}
                          </h4>
                          <p className="text-xs text-slate-500">Community contributor</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 font-bold text-slate-700">
                        <span className="rounded-xl bg-teal-50 px-3 py-1 text-xl text-teal-700">
                          {contributor.count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-16 text-center">
          <Link
            href="/user/upload"
            className="button button-primary group gap-3 px-8 py-4 text-lg shadow-xl"
          >
            Rise up the ranks{" "}
            <FiArrowRight className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </div>
  );
}
