"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FiFolder,
  FiBookOpen,
  FiBookmark,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiSearch,
  FiLoader,
  FiSliders,
  FiX,
} from "react-icons/fi";
import LoginRequiredModal from "../../component/LoginRequiredModal";
import PaperFiltersModal from "../../component/PaperFiltersModal";
import {
  getSavedPaperIds,
  savePaperForUser,
  unsavePaperForUser,
} from "@/app/actions/userActions";

const semesters = [
  "All semesters",
  "Semester 1",
  "Semester 2",
  "Semester 3",
  "Semester 4",
  "Semester 5",
  "Semester 6",
  "Semester 7",
  "Semester 8",
];

const defaultFilters = {
  semester: "All semesters",
  specialization: "All specializations",
  program: "All programs",
  year: "All years",
  institute: "All institutes",
};

export default function PapersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [limit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [savedPaperIds, setSavedPaperIds] = useState(new Set());
  const [saveLoadingIds, setSaveLoadingIds] = useState(new Set());

  const searchDebounceRef = useRef(null);
  const searchBoxRef = useRef(null);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);

    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    if (!query || query.trim().length < 2) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      setSearchLoading(false);
      return;
    }

    setSearchLoading(true);
    setShowSearchDropdown(true);

    searchDebounceRef.current = setTimeout(async () => {
      try {
        const params = new URLSearchParams();
        params.set("q", query.trim());
        params.set("limit", "10");

        const response = await fetch(`/api/papers/search?${params.toString()}`);
        const data = await response.json();

        if (response.ok && data.success && Array.isArray(data.papers)) {
          setSearchResults(data.papers);
        } else {
          setSearchResults([]);
        }
      } catch (searchErr) {
        console.error("Search error:", searchErr);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  }, []);

  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (filters.semester !== "All semesters") {
          const semesterNum = Number(filters.semester.replace("Semester ", ""));
          if (Number.isInteger(semesterNum)) {
            params.set("semester", String(semesterNum));
          }
        }

        if (filters.specialization !== "All specializations") {
          params.set("specialization", filters.specialization);
        }

        if (filters.program !== "All programs") {
          params.set("program", filters.program);
        }

        if (filters.year !== "All years") {
          params.set("year", filters.year);
        }

        if (filters.institute !== "All institutes") {
          params.set("institute", filters.institute);
        }

        params.set("limit", String(limit));
        params.set("offset", String(offset));

        const response = await fetch(`/api/papers?${params.toString()}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch papers");
        }

        if (data.success && Array.isArray(data.papers)) {
          setPapers(data.papers);
          setTotal(Number(data.total ?? 0));
          setHasMore(Boolean(data.hasMore));
        } else {
          setPapers([]);
          setTotal(0);
          setHasMore(false);
        }
      } catch (fetchErr) {
        console.error("Error fetching papers:", fetchErr);
        setError(fetchErr.message || "Failed to load papers. Please try again later.");
        setPapers([]);
        setTotal(0);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, [filters, limit, offset]);

  useEffect(() => {
    setOffset(0);
  }, [filters]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchBoxRef.current && !searchBoxRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const hydrateSavedState = async () => {
      if (status !== "authenticated" || !session?.user?.email) {
        if (mounted) {
          setSavedPaperIds(new Set());
        }
        return;
      }

      const result = await getSavedPaperIds(session.user.email);
      if (mounted && result?.success && Array.isArray(result.savedPaperIds)) {
        setSavedPaperIds(new Set(result.savedPaperIds));
      }
    };

    hydrateSavedState();

    return () => {
      mounted = false;
    };
  }, [status, session?.user?.email]);

  const current = useMemo(() => papers, [papers]);

  const programOptions = useMemo(() => {
    const set = new Set();
    papers.forEach((paper) => {
      if (paper.program) set.add(paper.program);
    });
    return ["All programs", ...Array.from(set).sort()];
  }, [papers]);

  const specializationOptions = useMemo(() => {
    const set = new Set();
    const programFilter =
      filters.program !== "All programs" ? filters.program : null;

    papers.forEach((paper) => {
      if (
        programFilter &&
        (paper.program || "").toLowerCase() !== programFilter.toLowerCase()
      ) {
        return;
      }
      if (paper.specialization) set.add(paper.specialization);
    });

    return ["All specializations", ...Array.from(set).sort()];
  }, [filters.program, papers]);

  const yearOptions = useMemo(() => {
    const set = new Set();
    papers.forEach((paper) => {
      if (paper.year) set.add(String(paper.year));
    });
    const sorted = Array.from(set).sort((a, b) => Number(b) - Number(a));
    return ["All years", ...sorted];
  }, [papers]);

  const instituteOptions = useMemo(() => {
    const set = new Set();
    papers.forEach((paper) => {
      if (paper.institute) set.add(paper.institute);
    });
    return ["All institutes", ...Array.from(set).sort()];
  }, [papers]);

  const handleViewPaper = (paperId) => {
    if (!paperId) return;
    router.push(`/user/papers/${paperId}`);
  };

  const handleToggleSave = async (paperId) => {
    if (!paperId) return;

    if (status === "loading") return;

    if (status === "unauthenticated" || !session?.user?.email) {
      setShowLoginModal(true);
      return;
    }

    if (saveLoadingIds.has(paperId)) return;

    const currentlySaved = savedPaperIds.has(paperId);

    setSaveLoadingIds((prev) => {
      const next = new Set(prev);
      next.add(paperId);
      return next;
    });

    setSavedPaperIds((prev) => {
      const next = new Set(prev);
      if (currentlySaved) {
        next.delete(paperId);
      } else {
        next.add(paperId);
      }
      return next;
    });

    const result = currentlySaved
      ? await unsavePaperForUser(session.user.email, paperId)
      : await savePaperForUser(session.user.email, paperId);

    if (!result?.success) {
      setSavedPaperIds((prev) => {
        const next = new Set(prev);
        if (currentlySaved) {
          next.add(paperId);
        } else {
          next.delete(paperId);
        }
        return next;
      });
    }

    setSaveLoadingIds((prev) => {
      const next = new Set(prev);
      next.delete(paperId);
      return next;
    });
  };

  const activeFilterCount = Object.entries(filters).filter(
    ([key, value]) => value !== defaultFilters[key]
  ).length;

  const noFilterApplied = activeFilterCount === 0;

  const handleApplyFilters = (nextFilters) => {
    const sanitizedFilters = {
      ...defaultFilters,
      ...nextFilters,
    };

    if (!specializationOptions.includes(sanitizedFilters.specialization)) {
      sanitizedFilters.specialization = "All specializations";
    }

    setFilters(sanitizedFilters);
  };

  const clearFilters = () => {
    setFilters(defaultFilters);
  };

  const filterSummary = [
    filters.semester,
    filters.program,
    filters.specialization,
    filters.year,
    filters.institute,
  ].filter((value, index) => value !== Object.values(defaultFilters)[index]);

  return (
    <>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        callbackUrl="/user/papers"
      />

      <div className="mx-auto max-w-6xl space-y-10 px-4 py-14">
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
              Previous semester papers
            </h1>
            <p className="max-w-2xl text-slate-600">
              Search quickly, open filters only when you need them, and keep the focus on the papers.
            </p>
          </div>

          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1" ref={searchBoxRef}>
              <div className="card flex items-center gap-3 p-4">
                <FiSearch className="shrink-0 text-emerald-600" size={20} />
                <input
                  type="text"
                  placeholder="Search by subject, program, or specialization..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowSearchDropdown(true);
                  }}
                  className="w-full bg-transparent text-sm font-medium text-slate-800 outline-none placeholder-slate-400"
                />
                {searchLoading ? (
                  <FiLoader className="shrink-0 animate-spin text-emerald-600" size={16} />
                ) : null}
              </div>

              {showSearchDropdown && searchResults.length > 0 ? (
                <div className="absolute top-full z-50 mt-2 max-h-96 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => {
                        router.push(`/user/papers/${result.id}`);
                        setShowSearchDropdown(false);
                        setSearchQuery("");
                      }}
                      className="w-full border-b border-slate-100 px-4 py-3 text-left transition hover:bg-emerald-50 last:border-b-0"
                    >
                      <p className="text-sm font-semibold text-slate-900">{result.subject}</p>
                      <p className="mt-0.5 text-xs text-slate-500">
                        {result.program} • Sem {result.semester} • {result.year}
                      </p>
                      {result.institute ? (
                        <p className="text-xs text-slate-400">{result.institute}</p>
                      ) : null}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="relative">
              <button
                type="button"
                onClick={() => setShowFiltersModal(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
              >
                <FiSliders size={18} />
                Filters
                {activeFilterCount > 0 ? (
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">
                    {activeFilterCount}
                  </span>
                ) : null}
              </button>

              {showFiltersModal ? (
                <PaperFiltersModal
                  onClose={() => setShowFiltersModal(false)}
                  filters={filters}
                  onApply={handleApplyFilters}
                  options={{
                    semesters,
                    specializations: specializationOptions,
                    programs: programOptions,
                    years: yearOptions,
                    institutes: instituteOptions,
                  }}
                />
              ) : null}
            </div>
          </div>

          {filterSummary.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              {filterSummary.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600"
                >
                  {item}
                </span>
              ))}
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
              >
                <FiX size={14} />
                Clear
              </button>
            </div>
          ) : null}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="h-8 w-8 animate-spin text-emerald-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <p className="text-slate-600">Loading papers...</p>
            </div>
          </div>
        ) : null}

        {!loading && error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center">
            <p className="font-medium text-red-800">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-white transition-colors hover:bg-red-700"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error && current.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-12 text-center">
            <FiBookOpen className="mx-auto mb-4 text-slate-400" size={48} />
            <p className="mb-2 text-lg font-medium text-slate-600">No papers found</p>
            <p className="text-sm text-slate-500">
              {noFilterApplied
                ? "Papers will appear here once they are uploaded."
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : null}

        {!loading && !error && current.length > 0 ? (
          <>
            <div className="text-sm text-slate-600">
              Showing {Math.min(total, offset + 1)}-{Math.min(total, offset + current.length)} of {total} {total === 1 ? "paper" : "papers"}
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {current.map((paper) => {
                const isSaved = savedPaperIds.has(paper.id);
                const saveLoading = saveLoadingIds.has(paper.id);

                return (
                  <div key={paper.id} className="card space-y-3 p-5 transition hover:border-emerald-200">
                    <div className="flex items-center justify-between">
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                          <FiFolder />
                        </span>
                        <div className="min-w-0 flex-1">
                          <p
                            className="max-w-45 overflow-hidden truncate font-semibold text-slate-900 md:max-w-xs"
                            title={paper.subject}
                          >
                            {paper.subject}
                          </p>
                          <p className="text-xs text-slate-500">Semester {paper.semester}</p>
                          {paper.program ? (
                            <p className="mt-0.5 text-xs text-slate-400">{paper.program}</p>
                          ) : null}
                          <div className="mt-1 flex flex-wrap items-center gap-2">
                            {paper.specialization ? (
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                {paper.specialization}
                              </span>
                            ) : null}
                            {paper.institute ? (
                              <span className="rounded bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                                {paper.institute}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <span className="ml-2 shrink-0 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                        {paper.year}
                      </span>
                    </div>

                    <div className="mt-4 flex items-center gap-2">
                      <button
                        onClick={() => handleViewPaper(paper.id)}
                        disabled={!paper.storageURL}
                        className="button button-primary flex flex-1 items-center justify-center gap-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <span>View paper</span>
                        <FiExternalLink size={16} />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleSave(paper.id)}
                        disabled={saveLoading}
                        aria-label={isSaved ? "Remove from saved" : "Save paper"}
                        title={isSaved ? "Remove from saved" : "Save paper"}
                        className={`flex h-10 w-10 items-center justify-center rounded-lg border transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                          isSaved
                            ? "border-emerald-200 bg-emerald-100 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {saveLoading ? (
                          <FiLoader className="animate-spin" size={16} />
                        ) : (
                          <FiBookmark size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Page {Math.floor(offset / limit) + 1} of {Math.max(1, Math.ceil(total / limit))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOffset(0)}
                  disabled={offset === 0 || loading}
                  className="button px-2 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="First page"
                  title="First page"
                >
                  <FiChevronsLeft />
                </button>
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0 || loading}
                  className="button px-2 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Previous page"
                  title="Previous page"
                >
                  <FiChevronLeft />
                </button>
                <button
                  onClick={() => {
                    if (hasMore) setOffset(offset + limit);
                  }}
                  disabled={!hasMore || loading}
                  className="button px-2 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Next page"
                  title="Next page"
                >
                  <FiChevronRight />
                </button>
                <button
                  onClick={() =>
                    setOffset(Math.max(0, (Math.ceil(total / limit) - 1) * limit))
                  }
                  disabled={(!hasMore && offset + limit >= total) || loading || total === 0}
                  className="button px-2 py-2 disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Last page"
                  title="Last page"
                >
                  <FiChevronsRight />
                </button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
