"use client";

import { useEffect, useState } from "react";
import { FiInbox, FiChevronLeft, FiChevronRight, FiLoader } from "react-icons/fi";
import { getOpenRequestsForUpload } from "@/app/actions/userActions";

export default function RequestQueuePanel() {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRequests = async (nextPage) => {
    setLoading(true);
    setError(null);
    const result = await getOpenRequestsForUpload(nextPage, 6);
    if (!result?.success) {
      setError(result?.error || "Failed to load requests");
      setLoading(false);
      return;
    }

    setRequests(result.requests || []);
    setPage(result.page || 1);
    setTotalPages(result.totalPages || 1);
    setTotal(result.total || 0);
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests(1);
  }, []);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    fetchRequests(nextPage);
  };

  return (
    <section className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-lg shadow-emerald-500/5 backdrop-blur">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-700">
            <FiInbox size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">Open Requests</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">What students are asking for</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload a matching paper to help the community faster.
          </p>
        </div>
        <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          {total} open
        </div>
      </div>

      <div className="mt-5 space-y-3">
        {loading ? (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <FiLoader className="animate-spin" /> Loading requests...
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        {!loading && !error && requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No open requests right now. Check back soon.
          </div>
        ) : null}

        {!loading && !error && requests.length > 0 ? (
          <ul className="space-y-3">
            {requests.map((request) => (
              <li
                key={request._id}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-semibold text-slate-900">{request.subject}</p>
                    <p className="text-xs text-slate-500 mt-1">
                      {request.program} • {request.institute}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Sem {request.semester} • {request.year}
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
