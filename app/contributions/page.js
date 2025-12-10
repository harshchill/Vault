"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { FiAward, FiStar, FiTrendingUp, FiUsers } from 'react-icons/fi';
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

  const badge = (rank) => {
    const styles = {
      1: 'bg-amber-100 text-amber-700 border-amber-200',
      2: 'bg-slate-100 text-slate-700 border-slate-200',
      3: 'bg-orange-100 text-orange-700 border-orange-200',
    };
    const Icon = rank === 1 ? FiAward : rank === 2 ? FiStar : FiTrendingUp;
    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full border ${styles[rank] || 'bg-slate-50 text-slate-600 border-slate-200'}`}>
        <Icon size={14} />
        #{rank}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-semibold text-slate-900">Top Contributors</h1>
        <div className="flex items-center gap-3">
          <div className="text-sm text-slate-600 hidden sm:flex items-center gap-2"><FiUsers /> Community Rankings</div>
          <Link href="/upload" className="button button-primary">Contribute</Link>
        </div>
      </div>

      {loading && (
        <div className="card p-6 text-slate-600">Loading contributions...</div>
      )}

      {error && (
        <div className="card p-6 text-red-700 bg-red-50 border border-red-200">{error}</div>
      )}

      {!loading && !error && (
        <div className="space-y-6">
          {/* Top 3 stacked */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {top3.map((c) => (
              <div key={c.email} className={`card p-5 flex flex-col items-center text-center gap-3 ${c.rank === 1 ? 'ring-2 ring-amber-300' : ''}`}>
                {badge(c.rank)}
                <div className="relative h-16 w-16">
                  {c.image ? (
                    <Image src={c.image} alt={c.firstName} fill className="rounded-full object-cover" />
                  ) : (
                    <div className="h-16 w-16 rounded-full bg-slate-200 grid place-items-center text-slate-600 text-xl">
                      {c.firstName?.[0]?.toUpperCase() || '?'}
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-medium text-slate-900">{c.firstName}</div>
                  <div className="text-sm text-slate-600">{c.count} papers</div>
                </div>
              </div>
            ))}
          </div>

          {/* Rest list */}
          <div className="card p-0 overflow-hidden">
            <ul className="divide-y divide-slate-100">
              {rest.map((c) => (
                <li key={c.email} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {badge(c.rank)}
                    <div className="relative h-10 w-10">
                      {c.image ? (
                        <Image src={c.image} alt={c.firstName} fill className="rounded-full object-cover" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-200 grid place-items-center text-slate-600">
                          {c.firstName?.[0]?.toUpperCase() || '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{c.firstName}</div>
                      <div className="text-xs text-slate-500">{c.email}</div>
                    </div>
                  </div>
                  <div className="text-sm text-slate-700"><span className="font-semibold">{c.count}</span> papers</div>
                </li>
              ))}
              {rest.length === 0 && data.length <= 3 && (
                <li className="p-4 text-slate-600">No more contributors yet.</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
