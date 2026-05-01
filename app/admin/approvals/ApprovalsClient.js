"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  CheckCircle,
  XCircle,
  User,
  Clock,
  Check,
  Edit2,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { approveRejectPaper, deletePaper, updatePaper } from "@/app/actions/adminActions";

const normalizeText = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const buildMatchKey = (paper, includeInstitute) => {
  const semester = paper?.semester ?? "";
  const year = paper?.year ?? "";
  const program = normalizeText(paper?.program);
  const specialization = normalizeText(paper?.specialization);
  const institute = includeInstitute ? normalizeText(paper?.institute) : "";

  if (!semester || !year || !program || !specialization) {
    return "";
  }

  if (includeInstitute && !institute) {
    return "";
  }

  return includeInstitute
    ? `${semester}|${year}|${program}|${specialization}|${institute}`
    : `${semester}|${year}|${program}|${specialization}`;
};

export default function ApprovalsClient({ initialPapers, approvedPapers }) {
  const [papers, setPapers] = useState(initialPapers);
  const [approvedList, setApprovedList] = useState(approvedPapers);
  const [selectedPaper, setSelectedPaper] = useState(null);
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [editPaper, setEditPaper] = useState(null);
  const [deletePaperId, setDeletePaperId] = useState(null);

  // Select the first paper by default if available and none selected
  useEffect(() => {
    if (!selectedPaper && papers.length > 0) {
      setSelectedPaper(papers[0]);
    }
  }, [papers, selectedPaper]);

  const approvedByBaseKey = useMemo(() => {
    const map = new Map();
    approvedList.forEach((paper) => {
      const key = buildMatchKey(paper, false);
      if (!key) return;
      const existing = map.get(key) || [];
      existing.push(paper);
      map.set(key, existing);
    });
    return map;
  }, [approvedList]);

  const approvedByRedKey = useMemo(() => {
    const map = new Map();
    approvedList.forEach((paper) => {
      const key = buildMatchKey(paper, true);
      if (!key) return;
      const existing = map.get(key) || [];
      existing.push(paper);
      map.set(key, existing);
    });
    return map;
  }, [approvedList]);

  const matchStats = useMemo(() => {
    const stats = new Map();
    papers.forEach((paper) => {
      const baseKey = buildMatchKey(paper, false);
      const redKey = buildMatchKey(paper, true);
      const redMatches = redKey ? approvedByRedKey.get(redKey) || [] : [];
      const baseMatches = baseKey ? approvedByBaseKey.get(baseKey) || [] : [];
      const moderateMatches = baseMatches.filter(
        (match) => !redMatches.some((red) => red._id === match._id)
      );
      stats.set(paper._id, { redMatches, moderateMatches });
    });
    return stats;
  }, [papers, approvedByBaseKey, approvedByRedKey]);

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

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editPaper) return;
    setModalLoading(true);
    try {
      const updated = await updatePaper(editPaper._id, editPaper);
      setApprovedList((prev) =>
        prev.map((paper) => (paper._id === updated._id ? { ...paper, ...updated } : paper))
      );
      setEditPaper(null);
    } catch (error) {
      alert("Failed to update paper: " + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deletePaperId) return;
    setModalLoading(true);
    try {
      await deletePaper(deletePaperId);
      setApprovedList((prev) => prev.filter((paper) => paper._id !== deletePaperId));
      setDeletePaperId(null);
    } catch (error) {
      alert("Failed to delete paper: " + error.message);
    } finally {
      setModalLoading(false);
    }
  };

  const selectedMatches = selectedPaper ? matchStats.get(selectedPaper._id) : null;

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
              {papers.map((paper) => {
                const match = matchStats.get(paper._id) || { redMatches: [], moderateMatches: [] };
                const hasRed = match.redMatches.length > 0;
                const hasModerate = match.moderateMatches.length > 0;
                return (
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
                        {(hasRed || hasModerate) && (
                          <div className="flex items-center gap-2 mt-2">
                            {hasRed && (
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200">
                                Red match
                              </span>
                            )}
                            {!hasRed && hasModerate && (
                              <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                Moderate match
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
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
                {selectedMatches && (selectedMatches.redMatches.length > 0 || selectedMatches.moderateMatches.length > 0) && (
                  <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-amber-500 mt-0.5" size={18} />
                      <div>
                        <p className="text-sm font-semibold text-amber-900">Potential duplicates found</p>
                        <p className="text-xs text-amber-700">
                          Moderate match: semester, year, program, specialization. Red match: includes institute.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-3">
                      {selectedMatches.redMatches.map((match) => (
                        <div key={match._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-red-200">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{match.title || match.subject}</p>
                            <p className="text-xs text-gray-500 truncate">{match.institute} • {match.program} • {match.specialization} • Sem {match.semester} • {match.year}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {match.storageURL && (
                              <a
                                href={match.storageURL}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View PDF"
                              >
                                <FileText size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => setEditPaper(match)}
                              className="p-1.5 text-gray-500 hover:text-[#00baa4] hover:bg-[#00baa4]/10 rounded-lg transition-colors"
                              title="Edit Paper"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setDeletePaperId(match._id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Paper"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                      {selectedMatches.moderateMatches.map((match) => (
                        <div key={match._id} className="flex items-center justify-between gap-3 p-3 rounded-xl bg-white border border-amber-200">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-gray-900 truncate">{match.title || match.subject}</p>
                            <p className="text-xs text-gray-500 truncate">{match.institute} • {match.program} • {match.specialization} • Sem {match.semester} • {match.year}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {match.storageURL && (
                              <a
                                href={match.storageURL}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="View PDF"
                              >
                                <FileText size={16} />
                              </a>
                            )}
                            <button
                              onClick={() => setEditPaper(match)}
                              className="p-1.5 text-gray-500 hover:text-[#00baa4] hover:bg-[#00baa4]/10 rounded-lg transition-colors"
                              title="Edit Paper"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => setDeletePaperId(match._id)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Paper"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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

      {/* Edit Modal */}
      {editPaper && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-gray-900/40 backdrop-blur-sm flex justify-center items-start pt-10 sm:pt-20 px-4 pb-20">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-top-10 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900">Edit Paper Details</h3>
              <button onClick={() => setEditPaper(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input
                    type="text"
                    value={editPaper.subject || ""}
                    onChange={(e) => setEditPaper({ ...editPaper, subject: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University / Institute</label>
                  <input
                    type="text"
                    value={editPaper.institute || ""}
                    onChange={(e) => setEditPaper({ ...editPaper, institute: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Program (e.g. B.Tech)</label>
                  <input
                    type="text"
                    value={editPaper.program || ""}
                    onChange={(e) => setEditPaper({ ...editPaper, program: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input
                    type="text"
                    value={editPaper.specialization || ""}
                    onChange={(e) => setEditPaper({ ...editPaper, specialization: e.target.value })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                  <input
                    type="number"
                    value={editPaper.semester || ""}
                    onChange={(e) => setEditPaper({ ...editPaper, semester: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={editPaper.year || ""}
                    onChange={(e) => setEditPaper({ ...editPaper, year: parseInt(e.target.value, 10) || 2024 })}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                  />
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditPaper(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={modalLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00baa4] rounded-xl hover:bg-[#009b89] transition-colors shadow-sm disabled:opacity-50"
                >
                  {modalLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deletePaperId && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-gray-900/40 backdrop-blur-sm flex justify-center items-start pt-20 px-4 pb-20">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in fade-in slide-in-from-top-10 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Paper?</h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this paper? This action cannot be undone and it will be removed from the Vault forever.
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletePaperId(null)}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={modalLoading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {modalLoading ? "Deleting..." : "Delete Paper"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
