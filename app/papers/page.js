/* eslint-disable react/no-unescaped-entities */
"use client";

/**
 * Papers Page Component
 * 
 * Displays a list of exam papers fetched from the database with semester filtering.
 * 
 * Features:
 * - Fetches papers from MongoDB via API
 * - Filters papers by semester (client-side)
 * - Displays paper metadata (title, subject, semester, year)
 * - Opens PDF files in new tab when "View paper" is clicked
 * 
 * @component
 * @returns {JSX.Element} Papers listing page with filtering
 */

import { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { FiFolder, FiFilter, FiClock, FiBookOpen, FiExternalLink } from "react-icons/fi";
import LoginRequiredModal from "../component/LoginRequiredModal";

// Semester options for the filter dropdown
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
  
  // State management
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState("All semesters");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Fetch papers from API on component mount
  useEffect(() => {
    const fetchPapers = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/papers');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch papers');
        }

        if (data.success && data.papers) {
          setPapers(data.papers);
        } else {
          setPapers([]);
        }
      } catch (err) {
        console.error('Error fetching papers:', err);
        setError(err.message || 'Failed to load papers. Please try again later.');
        setPapers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPapers();
  }, []);

  // Filter papers by selected semester
  const filtered = useMemo(() => {
    if (selectedSemester === "All semesters") {
      return papers;
    }

    // Extract semester number from "Semester X" format
    const semesterNum = parseInt(selectedSemester.replace('Semester ', ''), 10);
    
    return papers.filter((paper) => paper.semester === semesterNum);
  }, [papers, selectedSemester]);

  /**
   * Handles navigating to the paper view page
   * Checks if user is logged in before allowing access
   * @param {string} paperId - ID of the paper to view
   */
  const handleViewPaper = (paperId) => {
    if (!paperId) return;

    // Check if user is authenticated
    if (status === 'loading') {
      // Still checking authentication, wait a moment
      return;
    }

    if (status === 'unauthenticated' || !session) {
      // User is not logged in, show login modal
      setShowLoginModal(true);
      return;
    }

    // User is authenticated, proceed to view paper
    router.push(`/papers/${paperId}`);
  };

  return (
    <>
      {/* Login Required Modal */}
      <LoginRequiredModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />

      <div className="max-w-6xl mx-auto px-4 py-14 space-y-10">
      {/* Header Section */}
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <span className="pill">Browse collection</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Previous semester papers</h1>
          <p className="text-slate-600">
            Filter by semester to quickly find what you need. This MVP keeps it light, clean, and focused.
          </p>
        </div>
        
        {/* Semester Filter */}
        <div className="card p-4 w-full md:w-auto flex items-center gap-3">
          <FiFilter className="text-emerald-600" size={20} />
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            disabled={loading}
            className="bg-transparent outline-none text-sm font-medium text-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
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
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <p className="text-red-800 font-medium">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filtered.length === 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <FiBookOpen className="mx-auto text-slate-400 mb-4" size={48} />
          <p className="text-slate-600 text-lg font-medium mb-2">
            {selectedSemester === "All semesters" 
              ? "No papers found" 
              : `No papers found for ${selectedSemester}`}
          </p>
          <p className="text-slate-500 text-sm">
            {selectedSemester === "All semesters"
              ? "Papers will appear here once they are uploaded."
              : "Try selecting a different semester or check back later."}
          </p>
        </div>
      )}

      {/* Papers Grid */}
      {!loading && !error && filtered.length > 0 && (
        <>
          <div className="text-sm text-slate-600">
            Showing {filtered.length} {filtered.length === 1 ? 'paper' : 'papers'}
            {selectedSemester !== "All semesters" && ` for ${selectedSemester}`}
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((paper) => (
              <div 
                key={paper.id} 
                className="card p-5 space-y-3 hover:border-emerald-200 transition"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center shrink-0">
                      <FiFolder />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-900 truncate" title={paper.title}>
                        {paper.title}
                      </p>
                      <p className="text-xs text-slate-500">
                        Semester {paper.semester}
                      </p>
                      {paper.subject && (
                        <p className="text-xs text-slate-400 mt-0.5">
                          {paper.subject}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0 ml-2">
                    {paper.year}
                  </span>
                </div>

                <button 
                  onClick={() => handleViewPaper(paper.id)}
                  disabled={!paper.url}
                  className="button button-primary w-full mt-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <span>View paper</span>
                  <FiExternalLink size={16} />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
      </div>
    </>
  );
}

