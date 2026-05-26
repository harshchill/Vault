"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiInbox,
  FiChevronLeft,
  FiChevronRight,
  FiPlus,
  FiArrowUp,
} from "react-icons/fi";
import { getOpenRequestsForUpload, toggleRequestVote } from "@/app/actions/userActions";

export default function RequestQueuePanel({ onCreateRequest, refreshKey = 0 }) {
  const [requests, setRequests] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voteLoadingIds, setVoteLoadingIds] = useState(new Set());

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
    setLoading(false);
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchRequests(1);
  }, [refreshKey]);

  const handlePageChange = (nextPage) => {
    if (nextPage < 1 || nextPage > totalPages) return;
    fetchRequests(nextPage);
  };

  const handleVote = async (requestId) => {
    if (!requestId || voteLoadingIds.has(requestId)) return;
    setError(null);

    setVoteLoadingIds((prev) => {
      const next = new Set(prev);
      next.add(requestId);
      return next;
    });

    const result = await toggleRequestVote(requestId);

    if (!result?.success) {
      setError(result?.error || "Failed to update vote");
    } else {
      setRequests((prev) => {
        const next = prev.map((request) =>
          request._id === requestId
            ? {
                ...request,
                voteCount: result.voteCount,
                hasVoted: result.hasVoted,
              }
            : request
        );

        return next.sort((a, b) => {
          if (b.voteCount !== a.voteCount) return b.voteCount - a.voteCount;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
      });
    }

    setVoteLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(requestId);
      return next;
    });
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
            <FiInbox size={18} />
            <span className="text-xs font-semibold uppercase tracking-widest">Open Requests</span>
          </div>
          <h2 className="mt-2 text-xl font-semibold text-slate-900">What students are asking for</h2>
          <p className="mt-1 text-sm text-slate-500">
            Upload a matching paper to help the community faster.
          </p>
        </div>
        <button
          type="button"
          onClick={onCreateRequest}
          disabled={!onCreateRequest}
          className="group flex h-9 w-9 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 transition hover:border-emerald-300 hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
          aria-label="Create a request"
          title="Create a request"
        >
          <FiPlus size={16} className="transition group-hover:scale-110" />
        </button>
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
                <div className="mt-4 flex items-center justify-between">
                  <div className="h-6 w-28 rounded-full bg-slate-200 animate-pulse" />
                  <div className="h-8 w-20 rounded-full bg-slate-200 animate-pulse" />
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

        {!loading && !error && requests.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
            No open requests right now. Check back soon.
          </div>
        ) : null}

        {!loading && !error && requests.length > 0 ? (
          <ul className="grid gap-3 lg:grid-cols-2 ">
            {requests.map((request) => (
              <li
                key={request._id}
                className="rounded-2xl border border-slate-100 bg-white px-4 py-3 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-900 ">
                      {request.subject}
                    </p>
                     <p className="text-xs text-slate-500 mt-1 ">
                      {request.program}
                    </p>
                    <p className="text-xs text-slate-500 mt-1 ">
                      {request.specialization} 
                    </p> <p className="text-xs text-slate-500 mt-1 ">
                      {request.institute}
                    </p>
                   
                  </div>
                  <div className="flex flex-col items-start gap-2.5">
                    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/20">
                      Sem {request.semester} • {request.year}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleVote(request._id)}
                      disabled={request.isOwner || voteLoadingIds.has(request._id)}
                      aria-pressed={request.hasVoted}
                      className={`group flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500/20 ${
                        request.hasVoted
                          ? "border-emerald-200 bg-emerald-100/50 text-emerald-700 shadow-emerald-100"
                          : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50/50 hover:text-emerald-700"
                      } ${request.isOwner ? "cursor-not-allowed opacity-50 shadow-none" : ""}`}
                      title={
                        request.isOwner
                          ? "You cannot vote on your own request"
                          : request.hasVoted
                          ? "Remove vote"
                          : "Upvote"
                      }
                    >
                      <FiArrowUp
                        className={`text-sm transition-transform duration-200 ${
                          request.hasVoted
                            ? "text-emerald-600"
                            : "text-slate-400 group-hover:-translate-y-0.5 group-hover:text-emerald-600"
                        }`}
                      />
                      <span>Upvote</span>
                      <span
                        className={`ml-1 flex h-5 min-w-[20px] items-center justify-center rounded-full px-1.5 text-[10px] ${
                          request.hasVoted
                            ? "bg-emerald-200/80 text-emerald-800"
                            : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700"
                        }`}
                      >
                        {request.voteCount}
                      </span>
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <span>Page {page} of {totalPages}</span>
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
