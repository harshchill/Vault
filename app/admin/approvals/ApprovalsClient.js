"use client";

import { useState } from "react";
import { FileText, CheckCircle, XCircle, User, Clock, Check } from "lucide-react";
import { approveRejectPaper } from "@/app/actions/adminActions";

export default function ApprovalsClient({ initialPapers }) {
  const [papers, setPapers] = useState(initialPapers);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [loading, setLoading] = useState(false);

  // Select the first paper by default if available and none selected
  if (!selectedPaper && papers.length > 0) {
    setSelectedPaper(papers[0]);
  }

  const handleAction = async (status) => {
    if (!selectedPaper) return;
    setLoading(true);
    try {
      await approveRejectPaper(selectedPaper._id, status);
      const remaining = papers.filter(p => p._id !== selectedPaper._id);
      setPapers(remaining);
      setSelectedPaper(remaining.length > 0 ? remaining[0] : null);
    } catch (error) {
      alert(`Failed to ${status} paper: ` + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6 md:h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Review Submissions</h1>
        <p className="text-gray-500 mt-1">Review, approve or reject pending exam papers.</p>
      </div>

      {papers.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Check className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">You&apos;re all caught up!</h2>
          <p className="text-gray-500">There are no pending papers waiting for your review.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Sidebar List */}
          <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Pending Queue ({papers.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] lg:max-h-full">
              {papers.map((paper) => (
                <button
                  key={paper._id}
                  onClick={() => setSelectedPaper(paper)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedPaper?._id === paper._id
                      ? "bg-[#00baa4]/10 border-[#00baa4]/20 border"
                      : "bg-white border-transparent border hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <FileText className={`mt-0.5 shrink-0 ${selectedPaper?._id === paper._id ? 'text-[#00baa4]' : 'text-gray-400'}`} size={18} />
                    <div className="min-w-0 flex-1">
                      <p className={`font-semibold truncate ${selectedPaper?._id === paper._id ? 'text-[#00baa4]' : 'text-gray-900'}`}>
                        {paper.title || paper.subject}
                      </p>
                      <p className="text-xs text-gray-500 truncate mt-1">
                        {paper.institute} • Sem {paper.semester}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Preview & Action Panel */}
          {selectedPaper && (
            <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden min-h-[500px] lg:min-h-0">
              
              {/* Paper Details Header */}
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedPaper.title || selectedPaper.subject}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5"><span className="font-medium text-gray-900">Institute:</span> {selectedPaper.institute}</span>
                    <span className="flex items-center gap-1.5"><span className="font-medium text-gray-900">Program:</span> {selectedPaper.program} - {selectedPaper.specialization}</span>
                    <span className="flex items-center gap-1.5"><span className="font-medium text-gray-900">Year:</span> {selectedPaper.year}</span>
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-400"/>
                      {selectedPaper.uploaderID?.name || 'Unknown'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400"/>
                      {new Date(selectedPaper.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleAction("rejected")}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction("approved")}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00baa4] text-white hover:bg-[#009b89] rounded-xl font-medium transition-all shadow-[0_4px_14px_0_rgba(0,186,164,0.39)] disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Approve
                  </button>
                </div>
              </div>

              {/* PDF Preview */}
              <div className="flex-1 bg-gray-100 p-4">
                <iframe 
                  src={`${selectedPaper.storageURL}#toolbar=0&view=FitH`} 
                  className="w-full h-full rounded-xl shadow-sm border border-gray-200 bg-white"
                  title="PDF Preview"
                />
              </div>

            </div>
          )}
        </div>
      )}
    </div>
  );
}
