"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiAward, FiStar, FiTrendingUp, FiUsers, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';

export default function ContributionsPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch('/api/contributions', { cache: 'no-store' });
        if (!res.ok) throw new Error('Unable to fetch contributions');
        const json = await res.json();
        if (active) {
          setData(json.contributors || []);
          setError(null);
        }
      } catch (e) {
        if (active) setError(e.message || 'Failed to load');
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

  // Rearrange top3 for podium: [2, 1, 3]
  const podiumOrder = [];
  if (top3[1]) podiumOrder.push(top3[1]);
  if (top3[0]) podiumOrder.push(top3[0]);
  if (top3[2]) podiumOrder.push(top3[2]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-12 pb-24 px-4 sm:px-6 lg:px-8">
      {/* Background blobs */}
      <div className="absolute top-0 right-[20%] w-125 h-125 bg-teal-400/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-[10%] w-100 h-100 bg-emerald-400/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-5xl mx-auto flex flex-col items-center animate-fade-in">
        
        <div className="text-center mb-16">
          <span className="pill mb-4 border border-teal-200"><FiUsers className="text-teal-600"/> Honor Roll</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight">Vault Leaderboard</h1>
          <p className="text-slate-500 mt-3 text-lg">Recognizing the architects of our community library.</p>
        </div>

        {loading && (
          <div className="h-40 flex items-center justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full" />
          </div>
        )}

        {error && (
          <div className="card p-6 border-red-500 text-red-500 bg-red-50 text-center font-medium max-w-md">
            {error}
          </div>
        )}

        {!loading && !error && data.length > 0 && (
          <>
            {/* Podium Section */}
            <div className="flex items-end justify-center w-full max-w-3xl mb-16 gap-2 sm:gap-6 preserve-3d">
              {podiumOrder.map((c, idx) => {
                 const isFirst = c.rank === 1;
                 const isSecond = c.rank === 2;
                 const podiumHeight = isFirst ? 'h-64 md:h-80' : isSecond ? 'h-48 md:h-60' : 'h-36 md:h-44';
                 const colorFrom = isFirst ? 'from-amber-400' : isSecond ? 'from-slate-400' : 'from-orange-400';
                 const colorTo = isFirst ? 'to-amber-600' : isSecond ? 'to-slate-600' : 'to-orange-600';
                 const Icon = isFirst ? FiAward : isSecond ? FiStar : FiTrendingUp;

                 return (
                  <div key={c.id || c.rank} className="flex flex-col items-center flex-1 transition-transform duration-500 hover:-translate-y-2 group">
                    <div className="relative mb-4 flex flex-col items-center z-10 w-full">
                       {/* Floating Crown / Icon */}
                       <div className={`mb-2 ${isFirst ? 'text-amber-500 animate-bounce' : isSecond ? 'text-slate-400' : 'text-orange-400'}`}>
                          <Icon size={isFirst ? 32 : 24} />
                       </div>
                       
                       <div className={`relative ${isFirst ? 'w-24 h-24' : 'w-16 h-16'} rounded-full ring-4 ${isFirst ? 'ring-amber-400/50' : isSecond ? 'ring-slate-300/50' : 'ring-orange-300/50'} shadow-xl bg-white mb-3`}>
                         <img src={c.image || "/default-avatar.png"} alt={c.firstName} className="w-full h-full object-cover rounded-full p-1" />
                         <div className={`absolute -bottom-3 -right-2 w-8 h-8 rounded-full bg-gradient-to-br ${colorFrom} ${colorTo} text-white font-bold flex items-center justify-center border-2 border-white shadow-md text-sm`}>
                            {c.rank}
                         </div>
                       </div>
                       <h3 className={`font-bold text-slate-800 ${isFirst ? 'text-xl' : 'text-sm'} text-center truncate w-full px-2 max-w-30`}>{c.firstName}</h3>
                       <p className={`font-medium ${isFirst ? 'text-amber-600' : 'text-slate-500'} text-xs mt-1 bg-white/50 px-2 py-0.5 rounded backdrop-blur-md`}>{c.count} papers</p>
                    </div>

                    {/* Podium Base */}
                    <div className={`w-full ${podiumHeight} bg-linear-to-b ${colorFrom} ${colorTo} rounded-t-2xl shadow-xl shadow-teal-500/10 flex items-start justify-center pt-6 opacity-90 group-hover:opacity-100 transition-opacity border-t border-white/20 relative overflow-hidden`}>
                       <div className="absolute inset-0 bg-white/10 opacity-50 mix-blend-overlay" />
                       <span className="text-white/40 font-black text-6xl tracking-tighter mix-blend-overlay">#{c.rank}</span>
                    </div>
                  </div>
                 )
              })}
            </div>

            {/* List Section */}
            {rest.length > 0 && (
              <div className="w-full max-w-4xl glass-panel p-2 shadow-xl shadow-teal-500/5 border-t-2 border-teal-500/20 rounded-3xl">
                <div className="p-4 px-6 border-b border-teal-500/10 flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-wider">
                   <span>Rank & Scholar</span>
                   <span>Contributions</span>
                </div>
                <div className="divide-y divide-teal-500/5">
                   {rest.map((c) => (
                      <div key={c.rank} className="flex items-center justify-between p-4 sm:px-6 hover:bg-white/50 transition-colors rounded-2xl group">
                         <div className="flex items-center gap-5">
                            <span className="text-slate-400 font-black text-xl w-8 text-right group-hover:text-teal-500 transition-colors">#{c.rank}</span>
                            <Image
                              src={c.image || "/default-avatar.png"}
                              alt={c.firstName}
                              width={48}
                              height={48}
                              loader={({ src }) => src}
                              unoptimized
                              className="w-12 h-12 rounded-full object-cover shadow-sm bg-white p-0.5"
                            />
                            <div>
                               <h4 className="font-bold text-slate-800 text-lg group-hover:text-teal-700 transition-colors">{c.firstName}</h4>
                               <p className="text-xs text-slate-500">{c.email || 'Top 1% Contributor'}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2 font-bold text-slate-700">
                            <span className="text-xl bg-teal-50 text-teal-700 px-3 py-1 rounded-xl">{c.count}</span>
                         </div>
                      </div>
                   ))}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-16 text-center">
            <Link href="/user/upload" className="button button-primary gap-3 py-4 px-8 shadow-xl text-lg group">
                Rise up the ranks <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
        </div>
      </div>
    </div>
  );
}
