"use client";

/**
 * Paper View Page
 * 
 * Displays a single exam paper PDF using the custom PdfViewer component.
 * Fetches paper data from the database and renders the PDF as images.
 * 
 * Features:
 * - Fetches paper metadata from API
 * - Renders PDF using react-pdf (custom viewer)
 * - Displays paper information (title, subject, semester, year)
 * - Navigation back to papers list
 * - Loading and error states
 * 
 * Route: /papers/[id]
 * 
 * @component
 * @returns {JSX.Element} PDF viewer page
 */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FiArrowLeft, FiDownload, FiFileText, FiCalendar, FiBook } from 'react-icons/fi';
import PdfViewer from '../../component/pdfViewer';

export default function PaperViewPage() {
  const params = useParams();
  const router = useRouter();
  const paperId = params.id;

  // State management
  const [paper, setPaper] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch paper data from API
  useEffect(() => {
    const fetchPaper = async () => {
      if (!paperId) {
        setError('Paper ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch all papers and find the one with matching ID
        const response = await fetch('/api/papers');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch paper');
        }

        if (data.papers && Array.isArray(data.papers)) {
          const foundPaper = data.papers.find((p) => p.id === paperId);
          
          if (foundPaper) {
            setPaper(foundPaper);
          } else {
            setError('Paper not found. It may have been removed or the ID is invalid.');
          }
        } else {
          setError('Invalid response format from server.');
        }
      } catch (err) {
        console.error('Error fetching paper:', err);
        setError(err.message || 'Failed to load paper. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPaper();
  }, [paperId]);

  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with paper info and navigation */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          {/* Back button and title */}
          <div className="flex items-center gap-4 mb-4">
            <button
              onClick={() => router.push('/papers')}
              className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <FiArrowLeft size={20} />
              <span className="font-medium">Back to Papers</span>
            </button>
          </div>

          {/* Paper metadata */}
          {paper && (
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <FiFileText className="text-emerald-600" size={18} />
                <span className="font-semibold text-lg">{paper.title}</span>
              </div>
              
              {paper.subject && (
                <div className="flex items-center gap-2 text-slate-600">
                  <FiBook size={16} />
                  <span>{paper.subject}</span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-slate-600">
                <span>Semester {paper.semester}</span>
              </div>
              
              {(paper.specialization || paper.department) && (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-700 text-xs font-medium">
                    {paper.specialization || paper.department}
                  </span>
                </div>
              )}
              
              {paper.program && (
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="px-2 py-1 rounded bg-teal-50 text-teal-700 text-xs font-medium">
                    {paper.program}
                  </span>
                </div>
              )}
              
              <div className="flex items-center gap-2 text-slate-600">
                <FiCalendar size={16} />
                <span>{paper.year}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content area */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Loading state */}
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
              <p className="text-slate-600">Loading paper...</p>
            </div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <p className="text-red-800 font-medium text-lg mb-2">{error}</p>
            <button
              onClick={() => router.push('/papers')}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back to Papers
            </button>
          </div>
        )}

        {/* PDF Viewer */}
        {paper && paper.url && !loading && (
          <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full">
            <PdfViewer url={paper.url} />
          </div>
        )}

        {/* No URL error */}
        {paper && !paper.url && !loading && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-8 text-center max-w-2xl mx-auto">
            <p className="text-yellow-800 font-medium">
              This paper does not have a PDF URL available.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

