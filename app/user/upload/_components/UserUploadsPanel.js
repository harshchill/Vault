"use client";

import { useEffect, useMemo, useState } from "react";
import { FiFileText, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { getUserUploadsWithStatus } from "@/app/actions/userActions";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  rejected: "bg-red-100 text-red-700",
};

export default function UserUploadsPanel() {
  const [uploads, setUploads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUploads = async (nextPage) => {
    setLoading(true);
    setError(null);
    const result = await getUserUploadsWithStatus(nextPage, 6);
    if (!result?.success) {
      setError(result?.error || "Failed to load uploads");
      setLoading(false);
      return;
    }

    setUploads(result.uploads || []);
    setPage(result.page || 1);
    setTotalPages(result.totalPages || 1);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUploads(1);
  }, []);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    fetchUploads(nextPage);
  };

  const skeletonCards = useMemo(
    () => Array.from({ length: 6 }, (_, index) => ({ id: `skeleton-${index}` })),
    []
  );

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-emerald-500/5 backdrop-blur lg:p-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <FiFileText size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">Your Uploads</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">Track your submissions</h2>
          <p className="mt-1 text-sm text-slate-500">
            See which papers are approved, pending, or rejected.
          </p>
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="grid gap-3 lg:grid-cols-2">
            {skeletonCards.map((item) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-4 shadow-sm"
              >
                <div className="h-4 w-3/5 rounded bg-slate-200 animate-pulse" />
                <div className="mt-3 h-3 w-2/5 rounded bg-slate-200 animate-pulse" />
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-6 w-28 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-6 w-20 rounded-full bg-slate-200 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error && uploads.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No uploads yet. Start by uploading a paper above.
          </div>
        ) : null}

        {!loading && !error && uploads.length > 0 ? (
          <ul className="grid gap-3 lg:grid-cols-2">
            {uploads.map((upload) => (
              <li
                key={upload._id}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{upload.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {upload.program} • {upload.institute}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      Sem {upload.semester} • {upload.year}
                    </span>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusStyles[upload.status] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {upload.status}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <span>
          Page {page} of {totalPages}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || loading}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            type="button"
            onClick={() => handlePageChange(page + 1)}
            disabled={page >= totalPages || loading}
            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-slate-600 transition hover:border-emerald-200 hover:text-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
