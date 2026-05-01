"use client";

import { useState, useEffect } from "react";
import { Search, Edit2, Trash2, X, AlertTriangle, FileText, ChevronLeft, ChevronRight } from "lucide-react";
import { updatePaper, deletePaper, getAllPapers } from "@/app/actions/adminActions";

export default function PapersClient({ initialData }) {
  const [papers, setPapers] = useState(initialData.papers);
  const [total, setTotal] = useState(initialData.total);
  const [page, setPage] = useState(initialData.page);
  const [totalPages, setTotalPages] = useState(initialData.totalPages);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  
  // Modals state
  const [editPaper, setEditPaper] = useState(null);
  const [deletePaperId, setDeletePaperId] = useState(null);

  // Debounced search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (page === 1) {
        fetchPapers(1, search);
      } else {
        setPage(1); // changing page will trigger the other effect
      }
    }, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  // Page change effect
  useEffect(() => {
    fetchPapers(page, search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchPapers = async (pageNum, searchStr) => {
    setIsFetching(true);
    try {
      const data = await getAllPapers(searchStr, pageNum, 10);
      setPapers(data.papers);
      setTotal(data.total);
      setPage(data.page);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Failed to fetch papers", error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updatePaper(editPaper._id, editPaper);
      setPapers(papers.map(p => p._id === updated._id ? { ...updated, uploaderID: p.uploaderID } : p));
      setEditPaper(null);
    } catch (error) {
      alert("Failed to update paper: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deletePaper(deletePaperId);
      setPapers(papers.filter(p => p._id !== deletePaperId));
      setDeletePaperId(null);
      // refetch to get correct pagination if needed
      fetchPapers(page, search);
    } catch (error) {
      alert("Failed to delete paper: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manage Papers</h1>
          <p className="text-gray-500 mt-1">View, edit, and manage approved papers in the Vault. ({total} total)</p>
        </div>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search papers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all w-full md:w-64 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden relative">
        {isFetching && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#00baa4]"></div>
          </div>
        )}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500 whitespace-nowrap">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4">Paper Details</th>
                <th className="px-6 py-4">University & Program</th>
                <th className="px-6 py-4">Uploader</th>
                <th className="px-6 py-4">Uploaded Date</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {papers.length > 0 ? (
                papers.map((paper) => (
                  <tr key={paper._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <FileText className="text-blue-500" size={20} />
                        <div>
                          <div className="font-bold text-gray-900">{paper.title || paper.subject}</div>
                          <div className="text-xs text-gray-500">Sem {paper.semester} • {paper.year}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{paper.institute}</div>
                      <div className="text-xs text-gray-500">{paper.program} • {paper.specialization}</div>
                    </td>
                    <td className="px-6 py-4">
                      {paper.uploaderID ? (
                        <div>
                          <div className="font-medium text-gray-900">{paper.uploaderID.name}</div>
                          <div className="text-xs text-gray-500">{paper.uploaderID.email}</div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unknown</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {paper.uploadedAt ? new Date(paper.uploadedAt).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {paper.storageURL && (
                          <a 
                            href={paper.storageURL} 
                            target="_blank" 
                            rel="noreferrer"
                            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="View PDF"
                          >
                            <FileText size={18} />
                          </a>
                        )}
                        <button 
                          onClick={() => setEditPaper(paper)}
                          className="p-1.5 text-gray-500 hover:text-[#00baa4] hover:bg-[#00baa4]/10 rounded-lg transition-colors"
                          title="Edit Paper"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => setDeletePaperId(paper._id)}
                          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Paper"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No papers found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <div className="flex gap-2">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              <button 
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-50 transition-colors"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editPaper && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-gray-900/40 backdrop-blur-sm flex justify-center items-start pt-10 sm:pt-20 px-4 pb-20">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-top-10 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 sticky top-0 z-10">
              <h3 className="text-lg font-bold text-gray-900">Edit Paper Details</h3>
              <button onClick={() => setEditPaper(null)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                  <input 
                    type="text" 
                    value={editPaper.subject || ""} 
                    onChange={(e) => setEditPaper({...editPaper, subject: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">University / Institute</label>
                  <input 
                    type="text" 
                    value={editPaper.institute || ""} 
                    onChange={(e) => setEditPaper({...editPaper, institute: e.target.value})}
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
                    onChange={(e) => setEditPaper({...editPaper, program: e.target.value})}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                  <input 
                    type="text" 
                    value={editPaper.specialization || ""} 
                    onChange={(e) => setEditPaper({...editPaper, specialization: e.target.value})}
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
                    onChange={(e) => setEditPaper({...editPaper, semester: parseInt(e.target.value) || 1})}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#00baa4]/20 focus:border-[#00baa4] transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input 
                    type="number" 
                    value={editPaper.year || ""} 
                    onChange={(e) => setEditPaper({...editPaper, year: parseInt(e.target.value) || 2024})}
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
                  disabled={loading}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#00baa4] rounded-xl hover:bg-[#009b89] transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
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
                  disabled={loading}
                  className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete Paper"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
