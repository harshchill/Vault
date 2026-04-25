"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  FiFolder,
  FiFilter,
  FiBookOpen,
  FiBookmark,
  FiExternalLink,
  FiChevronLeft,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronsRight,
  FiSearch,
  FiLoader,
} from "react-icons/fi";
import LoginRequiredModal from "../../component/LoginRequiredModal";
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

export default function PapersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedSemester, setSelectedSemester] = useState("All semesters");
  const [selectedSpecialization, setSelectedSpecialization] = useState("All specializations");
  const [selectedProgram, setSelectedProgram] = useState("All programs");
  const [selectedYear, setSelectedYear] = useState("All years");
  const [selectedInstitute, setSelectedInstitute] = useState("All institutes");

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const [limit] = useState(12);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
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

        if (selectedSemester !== "All semesters") {
          const semesterNum = Number(selectedSemester.replace("Semester ", ""));
          if (Number.isInteger(semesterNum)) {
            params.set("semester", String(semesterNum));
          }
        }

        if (selectedSpecialization !== "All specializations") {
          params.set("specialization", selectedSpecialization);
        }

        if (selectedProgram !== "All programs") {
          params.set("program", selectedProgram);
        }

        if (selectedYear !== "All years") {
          params.set("year", selectedYear);
        }

        if (selectedInstitute !== "All institutes") {
          params.set("institute", selectedInstitute);
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
  }, [
    selectedSemester,
    selectedSpecialization,
    selectedProgram,
    selectedYear,
    selectedInstitute,
    limit,
    offset,
  ]);

  useEffect(() => {
    setOffset(0);
  }, [
    selectedSemester,
    selectedSpecialization,
    selectedProgram,
    selectedYear,
    selectedInstitute,
  ]);

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
    papers.forEach((p) => {
      if (p.program) set.add(p.program);
    });
    return ["All programs", ...Array.from(set).sort()];
  }, [papers]);

  const specializationOptions = useMemo(() => {
    const set = new Set();
    const programFilter = selectedProgram !== "All programs" ? selectedProgram : null;

    papers.forEach((p) => {
      if (
        programFilter &&
        (p.program || "").toLowerCase() !== programFilter.toLowerCase()
      ) {
        return;
      }
      if (p.specialization) set.add(p.specialization);
    });

    return ["All specializations", ...Array.from(set).sort()];
  }, [papers, selectedProgram]);

  const yearOptions = useMemo(() => {
    const set = new Set();
    papers.forEach((p) => {
      if (p.year) set.add(String(p.year));
    });
    const sorted = Array.from(set).sort((a, b) => Number(b) - Number(a));
    return ["All years", ...sorted];
  }, [papers]);

  const instituteOptions = useMemo(() => {
    const set = new Set();
    papers.forEach((p) => {
      if (p.institute) set.add(p.institute);
    });
    return ["All institutes", ...Array.from(set).sort()];
  }, [papers]);

  useEffect(() => {
    if (!specializationOptions.includes(selectedSpecialization)) {
      setSelectedSpecialization("All specializations");
    }
  }, [specializationOptions, selectedSpecialization]);

  const handleViewPaper = (paperId) => {
    if (!paperId) return;

    if (status === "loading") return;

    if (status === "unauthenticated" || !session) {
      setShowLoginModal(true);
      return;
    }

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

  const noFilterApplied =
    selectedSemester === "All semesters" &&
    selectedSpecialization === "All specializations" &&
    selectedProgram === "All programs" &&
    selectedYear === "All years" &&
    selectedInstitute === "All institutes";

  return (
    <>
      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
      />

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-10">
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="pill">Browse collection</span>
            <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">
              Previous semester papers
            </h1>
            <p className="text-slate-600">
              Use smart search and filters to quickly find what you need.
            </p>
          </div>

          <div className="relative" ref={searchBoxRef}>
            <div className="card p-4 flex items-center gap-3">
              <FiSearch className="text-emerald-600 shrink-0" size={20} />
              <input
                type="text"
                placeholder="Search by subject, program, or specialization..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowSearchDropdown(true);
                }}
                className="bg-transparent outline-none text-sm font-medium text-slate-800 w-full placeholder-slate-400"
              />
              {searchLoading ? (
                <FiLoader className="text-emerald-600 animate-spin shrink-0" size={16} />
              ) : null}
            </div>

            {showSearchDropdown && searchResults.length > 0 ? (
              <div className="absolute top-full mt-2 w-full bg-white border border-slate-200 rounded-xl shadow-lg z-50 max-h-96 overflow-y-auto">
                {searchResults.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => {
                      router.push(`/user/papers/${result.id}`);
                      setShowSearchDropdown(false);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-emerald-50 border-b border-slate-100 last:border-b-0 transition"
                  >
                    <p className="font-semibold text-slate-900 text-sm">{result.subject}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
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

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="card p-4 flex items-center gap-3">
              <FiFilter className="text-emerald-600 shrink-0" size={20} />
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                disabled={loading}
                className="bg-transparent outline-none text-sm font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {semesters.map((sem) => (
                  <option key={sem} value={sem}>
                    {sem}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <FiFilter className="text-emerald-600 shrink-0" size={20} />
              <select
                value={selectedSpecialization}
                onChange={(e) => setSelectedSpecialization(e.target.value)}
                disabled={loading}
                className="bg-transparent outline-none text-sm font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {specializationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <FiFilter className="text-emerald-600 shrink-0" size={20} />
              <select
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={loading}
                className="bg-transparent outline-none text-sm font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {programOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <FiFilter className="text-emerald-600 shrink-0" size={20} />
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={loading}
                className="bg-transparent outline-none text-sm font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {yearOptions.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            <div className="card p-4 flex items-center gap-3">
              <FiFilter className="text-emerald-600 shrink-0" size={20} />
              <select
                value={selectedInstitute}
                onChange={(e) => setSelectedInstitute(e.target.value)}
                disabled={loading}
                className="bg-transparent outline-none text-sm font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed w-full"
              >
                {instituteOptions.map((inst) => (
                  <option key={inst} value={inst}>
                    {inst}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center gap-4">
              <svg
                className="animate-spin h-8 w-8 text-emerald-600"
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
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-800 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Retry
            </button>
          </div>
        ) : null}

        {!loading && !error && current.length === 0 ? (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
            <FiBookOpen className="mx-auto text-slate-400 mb-4" size={48} />
            <p className="text-slate-600 text-lg font-medium mb-2">No papers found</p>
            <p className="text-slate-500 text-sm">
              {noFilterApplied
                ? "Papers will appear here once they are uploaded."
                : "Try adjusting your filters or search query."}
            </p>
          </div>
        ) : null}

        {!loading && !error && current.length > 0 ? (
          <>
            <div className="text-sm text-slate-600">
              Showing {Math.min(total, offset + 1)}–{Math.min(total, offset + current.length)} of {total} {total === 1 ? "paper" : "papers"}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {current.map((paper) => {
                const isSaved = savedPaperIds.has(paper.id);
                const saveLoading = saveLoadingIds.has(paper.id);

                return (
                <div key={paper.id} className="card p-5 space-y-3 hover:border-emerald-200 transition">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center shrink-0">
                        <FiFolder />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900 truncate max-w-45 md:max-w-xs overflow-hidden" title={paper.subject}>
                          {paper.subject}
                        </p>
                        <p className="text-xs text-slate-500">Semester {paper.semester}</p>
                        {paper.program ? (
                          <p className="text-xs text-slate-400 mt-0.5">{paper.program}</p>
                        ) : null}
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          {paper.specialization ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {paper.specialization}
                            </span>
                          ) : null}
                          {paper.institute ? (
                            <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {paper.institute}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0 ml-2">
                      {paper.year}
                    </span>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <button
                      onClick={() => handleViewPaper(paper.id)}
                      disabled={!paper.storageURL}
                      className="button button-primary flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
                      className={`h-10 w-10 rounded-lg border flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                        isSaved
                          ? "bg-emerald-100 border-emerald-200 text-emerald-700"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
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
              );})}
            </div>

            <div className="flex items-center justify-between mt-6">
              <div className="text-xs text-slate-500">
                Page {Math.floor(offset / limit) + 1} of {Math.max(1, Math.ceil(total / limit))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setOffset(0)}
                  disabled={offset === 0 || loading}
                  className="button px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="First page"
                  title="First page"
                >
                  <FiChevronsLeft />
                </button>
                <button
                  onClick={() => setOffset(Math.max(0, offset - limit))}
                  disabled={offset === 0 || loading}
                  className="button px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="button px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Next page"
                  title="Next page"
                >
                  <FiChevronRight />
                </button>
                <button
                  onClick={() => setOffset(Math.max(0, (Math.ceil(total / limit) - 1) * limit))}
                  disabled={(!hasMore && offset + limit >= total) || loading || total === 0}
                  className="button px-2 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
