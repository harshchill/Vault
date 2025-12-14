"use client";
/**
 * Admin Dashboard Page
 * 
 * This page provides a dashboard for administrators with two main sections:
 * 1. Upload - Upload exam papers to the vault system
 * 2. Approval - Review and approve/reject pending papers
 * 
 * Features:
 * - Tabbed interface for easy navigation
 * - Upload PDF files to Supabase storage
 * - Save paper metadata to MongoDB database
 * - View and approve/reject pending papers
 * - Form validation and error handling
 * - Loading states and user feedback
 * - Admin-only access protection
 * 
 * @component
 * @returns {JSX.Element} Admin dashboard component
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FiTrendingUp, FiCheckCircle, FiXCircle, FiFileText, FiClock, FiUser } from 'react-icons/fi';

const UNIVERSITY_COURSES = {
  "B.Tech": [
    "CSE",
    "CSE (AI & Data Science)",
    "CSE (Cyber Security)",
    "AI & Machine Learning (IBM)",
    "Mining Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Cement Technology",
    "Agricultural Engineering",
    "Food Technology",
    "Biotechnology"
  ],
  "B.Tech (Lateral Entry)": [
    "CSE",
    "Civil Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Mining Engineering",
    "Cement Technology",
    "Food Technology",
    "Agricultural Engineering"
  ],
  "M.Tech": [
    "Computer Science",
    "Mining Engineering",
    "Mechanical Engineering",
    "Agricultural Engineering",
    "Biotechnology"
  ],
  "Polytechnic Diploma": [
    "Computer Science",
    "Mining Engineering",
    "Mine Surveying",
    "Civil Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Cement Technology",
    "Food Technology",
    "Agricultural Engineering"
  ],
  "BCA": [
    "BCA (Hons)",
    "BCA (Hons) AI & Machine Learning"
  ],
  "MCA": ["Master of Computer Applications"],
  "B.Sc.": [
    "Computer Science (CS)",
    "Information Technology (IT) Hons",
    "Agriculture (Hons)",
    "Horticulture (Hons)",
    "Food Technology",
    "Biotechnology (Hons)",
    "Microbiology",
    "Geology",
    "Math (Hons)",
    "Biology",
    "Seed Technology"
  ],
  "M.Sc.": [
    "Computer Science",
    "Food Technology",
    "Biotechnology",
    "Microbiology",
    "Environment",
    "Chemistry",
    "Physics",
    "Mathematics",
    "Yoga Science",
    "Agriculture (Agronomy)",
    "Agriculture (Soil Science)",
    "Agriculture (Genetics)"
  ],
  "Management": [
    "BBA (Hons)",
    "BBA (Tourism & Hotel Mgmt)",
    "MBA (General)",
    "MBA (Logistics & Supply Chain)",
    "MBA (Production & Operation)",
    "MBA (Executive)"
  ],
  "Commerce": [
    "B.Com (Computer Application)",
    "B.Com (Economics)",
    "B.Com (Financial Mgmt)",
    "B.Com (Hons)",
    "M.Com"
  ],
  "Pharmacy": [
    "D.Pharma",
    "B.Pharma",
    "M.Pharma (Pharmaceutics)",
    "M.Pharma (Pharmaceutical Chemistry)"
  ],
  "Agriculture": [
      "B.Sc. (Hons) Agriculture",
      "B.Tech Agricultural Engg",
      "M.Sc. Agronomy",
      "M.Sc. Soil Science"
  ]
};

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // General state
  const [error, setError] = useState(null);

  // Approval component state
  const [pendingPapers, setPendingPapers] = useState([]);
  const [loadingPapers, setLoadingPapers] = useState(false);
  const [approvalError, setApprovalError] = useState(null);

  const [isAuthorized, setIsAuthorized] = useState(false);

  // Overview stats
  const [totalPapers, setTotalPapers] = useState(0);
  const [recentPapers, setRecentPapers] = useState([]);
  const [loadingStats, setLoadingStats] = useState(false);

  // Check authentication and admin role
  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated' || !session) {
      router.push('/auth?callbackUrl=/admin');
      return;
    }
    
    if (session.user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }
    
    setIsAuthorized(true);
  }, [session, status, router]);

  // Fetch overview stats when authorized
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoadingStats(true);
        const response = await fetch('/api/papers');
        const data = await response.json();
        if (response.ok && data?.papers) {
          setTotalPapers(data.papers.length || 0);
          setRecentPapers(data.papers.slice(0, 5));
        }
      } catch (e) {
        // Non-blocking error
      } finally {
        setLoadingStats(false);
      }
    };

    if (isAuthorized) {
      fetchStats();
      // Also preload pending for overview badge
      fetchPendingPapers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized]);

  // Fetch pending papers when approval tab is active
  useEffect(() => {
    if (activeTab === 'approval' && isAuthorized) {
      fetchPendingPapers();
    }
  }, [activeTab, isAuthorized]);

  // Fetch pending papers
  const fetchPendingPapers = async () => {
    try {
      setLoadingPapers(true);
      setApprovalError(null);

      const response = await fetch('/api/papers?unapproved=true');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch pending papers');
      }

      if (data.success && data.papers) {
        setPendingPapers(data.papers);
      } else {
        setPendingPapers([]);
      }
    } catch (err) {
      console.error('Error fetching pending papers:', err);
      setApprovalError(err.message || 'Failed to load pending papers.');
      setPendingPapers([]);
    } finally {
      setLoadingPapers(false);
    }
  };

  // Handle approval/rejection
  const handleApproval = async (paperId, approved) => {
    try {
      setApprovalError(null);

      const response = await fetch('/api/papers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paperId: paperId,
          adminApproved: approved,
        }),
      });
      

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Failed to ${approved ? 'approve' : 'reject'} paper.`);
      }

      // Refresh the pending papers list
      await fetchPendingPapers();
    } catch (err) {
      console.error('Error updating paper approval:', err);
      setApprovalError(err.message || `Failed to ${approved ? 'approve' : 'reject'} paper.`);
    }
  };

  // Note: Upload functionality has been removed from Admin. Use public Upload page instead.

  // Show loading state while checking authentication
  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200 text-center">
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
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if access denied
  if (error && error.includes('Access denied')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-red-200">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage papers and review pending submissions</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'overview'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiTrendingUp size={18} />
                <span>Overview</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('approval')}
              className={`flex-1 px-6 py-4 text-sm font-semibold transition-colors ${
                activeTab === 'approval'
                  ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50'
                  : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <FiCheckCircle size={18} />
                <span>Approve Papers</span>
                {pendingPapers.length > 0 && (
                  <span className="ml-1 px-2 py-0.5 text-xs font-bold rounded-full bg-emerald-600 text-white">
                    {pendingPapers.length}
                  </span>
                )}
              </div>
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-5">
                    <p className="text-sm text-emerald-700 font-medium">Total Papers</p>
                    <p className="mt-2 text-3xl font-bold text-emerald-900">{loadingStats ? '—' : totalPapers}</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-xl p-5">
                    <p className="text-sm text-amber-700 font-medium">Pending Approvals</p>
                    <p className="mt-2 text-3xl font-bold text-amber-900">{loadingPapers ? '—' : pendingPapers.length}</p>
                  </div>
                  <div className="bg-sky-50 border border-sky-100 rounded-xl p-5">
                    <p className="text-sm text-sky-700 font-medium">Admins Online</p>
                    <p className="mt-2 text-3xl font-bold text-sky-900">1</p>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Recent Papers</h3>
                    <span className="text-sm text-gray-500">Latest 5</span>
                  </div>
                  {loadingStats ? (
                    <div className="flex items-center justify-center py-10 text-gray-500">Loading...</div>
                  ) : recentPapers.length === 0 ? (
                    <div className="text-gray-500 text-sm">No papers found.</div>
                  ) : (
                    <div className="space-y-3">
                      {recentPapers.map((paper) => (
                        <div key={paper.id} className="flex items-center justify-between gap-3 p-3 rounded-lg border border-gray-200 bg-white">
                          <div className="flex items-center gap-3 min-w-0">
                            <FiFileText className="text-emerald-600 shrink-0" size={18} />
                            <div className="min-w-0">
                              <p className="font-medium text-gray-900 truncate">{paper.title}</p>
                              <p className="text-xs text-gray-500">Sem {paper.semester} • {paper.year}</p>
                            </div>
                          </div>
                          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">{paper.program || '—'}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Approval Tab */}
            {activeTab === 'approval' && (
              <div>
                {approvalError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{approvalError}</p>
                  </div>
                )}

                {loadingPapers ? (
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
                      <p className="text-gray-600">Loading pending papers...</p>
                    </div>
                  </div>
                ) : pendingPapers.length === 0 ? (
                  <div className="text-center py-20">
                    <FiCheckCircle className="mx-auto text-gray-400 mb-4" size={48} />
                    <p className="text-gray-600 text-lg font-medium mb-2">No pending papers</p>
                    <p className="text-gray-500 text-sm">All papers have been reviewed.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 mb-4">
                      {pendingPapers.length} {pendingPapers.length === 1 ? 'paper' : 'papers'} pending approval
                    </div>
                    {pendingPapers.map((paper) => (
                      <div 
                        key={paper.id} 
                        className="bg-gray-50 border border-gray-200 rounded-lg p-5 hover:border-emerald-200 transition"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <FiFileText className="text-emerald-600 shrink-0" size={20} />
                              <h3 className="font-semibold text-gray-900">{paper.title}</h3>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600 mb-3">
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Subject:</span>
                                <span>{paper.subject}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Semester:</span>
                                <span>{paper.semester}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Year:</span>
                                <span>{paper.year}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="font-medium">Specialization:</span>
                                <span>{paper.specialization || paper.department}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <FiUser size={14} />
                                <span>{paper.uploadedBy}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <FiClock size={14} />
                                <span>{new Date(paper.createdAt).toLocaleDateString()}</span>
                              </div>
                            </div>
                            {paper.url && (
                              <a
                                href={paper.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 mt-3 text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                              >
                                <FiFileText size={14} />
                                View PDF
                              </a>
                            )}
                          </div>
                          <div className="flex flex-col gap-2 shrink-0">
                            <button
                              onClick={() => handleApproval(paper.id, true)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                            >
                              <FiCheckCircle size={16} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleApproval(paper.id, false)}
                              className="flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                            >
                              <FiXCircle size={16} />
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
