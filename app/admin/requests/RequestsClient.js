"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  Trash2,
  XCircle,
  User,
  AlertTriangle,
  Check,
} from "lucide-react";
import {
  deleteRequest,
  updateRequestStatus,
} from "@/app/actions/adminActions";

const normalizeText = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

const buildMatchKey = (request, includeInstitute) => {
  const semester = request?.semester ?? "";
  const year = request?.year ?? "";
  const program = normalizeText(request?.program);
  const specialization = normalizeText(request?.specialization);
  const institute = includeInstitute ? normalizeText(request?.institute) : "";

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

export default function RequestsClient({ initialRequests, matchingRequests }) {
  const [requests, setRequests] = useState(initialRequests);
  const [matchSource, setMatchSource] = useState(matchingRequests);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedRequest && requests.length > 0) {
      setSelectedRequest(requests[0]);
    }
  }, [requests, selectedRequest]);

  const matchingByBaseKey = useMemo(() => {
    const map = new Map();
    matchSource.forEach((request) => {
      const key = buildMatchKey(request, false);
      if (!key) return;
      const existing = map.get(key) || [];
      existing.push(request);
      map.set(key, existing);
    });
    return map;
  }, [matchSource]);

  const matchingByRedKey = useMemo(() => {
    const map = new Map();
    matchSource.forEach((request) => {
      const key = buildMatchKey(request, true);
      if (!key) return;
      const existing = map.get(key) || [];
      existing.push(request);
      map.set(key, existing);
    });
    return map;
  }, [matchSource]);

  const matchStats = useMemo(() => {
    const stats = new Map();
    requests.forEach((request) => {
      const baseKey = buildMatchKey(request, false);
      const redKey = buildMatchKey(request, true);
      const redMatches = redKey ? matchingByRedKey.get(redKey) || [] : [];
      const baseMatches = baseKey ? matchingByBaseKey.get(baseKey) || [] : [];
      const filteredRed = redMatches.filter(
        (match) => String(match._id) !== String(request._id)
      );
      const filteredBase = baseMatches.filter(
        (match) => String(match._id) !== String(request._id)
      );
      const moderateMatches = filteredBase.filter(
        (match) => !filteredRed.some((red) => red._id === match._id)
      );
      stats.set(request._id, { redMatches: filteredRed, moderateMatches });
    });
    return stats;
  }, [requests, matchingByBaseKey, matchingByRedKey]);

  const handleStatusChange = async (status) => {
    if (!selectedRequest) return;
    setLoading(true);
    try {
      await updateRequestStatus(selectedRequest._id, status);
      const remaining = requests.filter((req) => req._id !== selectedRequest._id);
      setRequests(remaining);
      setSelectedRequest(remaining.length > 0 ? remaining[0] : null);
      setMatchSource((prev) =>
        prev.map((req) =>
          req._id === selectedRequest._id ? { ...req, status } : req
        )
      );
    } catch (error) {
      alert(`Failed to update request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedRequest) return;
    const confirmed = window.confirm("Delete this request? This cannot be undone.");
    if (!confirmed) return;
    setLoading(true);
    try {
      await deleteRequest(selectedRequest._id);
      const remaining = requests.filter((req) => req._id !== selectedRequest._id);
      setRequests(remaining);
      setSelectedRequest(remaining.length > 0 ? remaining[0] : null);
      setMatchSource((prev) =>
        prev.filter((req) => req._id !== selectedRequest._id)
      );
    } catch (error) {
      alert(`Failed to delete request: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const selectedMatches = selectedRequest
    ? matchStats.get(selectedRequest._id)
    : null;

  return (
    <div className="h-full flex flex-col space-y-4 md:space-y-6 md:h-[calc(100vh-8rem)]">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Paper Requests</h1>
        <p className="text-gray-500 mt-1">Review what students are asking for and mark updates.</p>
      </div>

      {requests.length === 0 ? (
        <div className="flex-1 bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
            <Check className="text-emerald-500" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">No open requests</h2>
          <p className="text-gray-500">New requests will appear here once users submit them.</p>
        </div>
      ) : (
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          <div className="w-full lg:w-1/3 flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <h3 className="font-semibold text-gray-900">Open Requests ({requests.length})</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2 max-h-[300px] lg:max-h-full">
              {requests.map((request) => {
                const match = matchStats.get(request._id) || { redMatches: [], moderateMatches: [] };
                const hasRed = match.redMatches.length > 0;
                const hasModerate = match.moderateMatches.length > 0;
                return (
                  <button
                    key={request._id}
                    onClick={() => setSelectedRequest(request)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedRequest?._id === request._id
                        ? "bg-[#00baa4]/10 border-[#00baa4]/20 border"
                        : "bg-white border-transparent border hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 h-9 w-9 shrink-0 rounded-full flex items-center justify-center ${
                        selectedRequest?._id === request._id
                          ? "bg-[#00baa4]/15 text-[#00baa4]"
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        <Clock size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold truncate ${selectedRequest?._id === request._id ? "text-[#00baa4]" : "text-gray-900"}`}>
                          {request.subject}
                        </p>
                        <p className="text-xs text-gray-500 truncate mt-1">
                          {request.program} • Sem {request.semester} • {request.year}
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

          {selectedRequest && (
            <div className="w-full lg:w-2/3 flex flex-col bg-white rounded-2xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] border border-gray-100 overflow-hidden min-h-[500px] lg:min-h-0">
              <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-50/50">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedRequest.subject}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm text-gray-600">
                    <span className="flex items-center gap-1.5"><span className="font-medium text-gray-900">Institute:</span> {selectedRequest.institute}</span>
                    <span className="flex items-center gap-1.5"><span className="font-medium text-gray-900">Program:</span> {selectedRequest.program} - {selectedRequest.specialization}</span>
                    <span className="flex items-center gap-1.5"><span className="font-medium text-gray-900">Year:</span> {selectedRequest.year}</span>
                    <span className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" />
                      {selectedRequest.requesterId?.name || "Unknown"}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} className="text-gray-400" />
                      {selectedRequest.createdAt ? new Date(selectedRequest.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <div className="mt-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Email:</span> {selectedRequest.requesterEmail}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleStatusChange("rejected")}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-red-600 border border-red-200 hover:bg-red-50 hover:border-red-300 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50"
                  >
                    <XCircle size={18} />
                    Reject
                  </button>
                  <button
                    onClick={() => handleStatusChange("fulfilled")}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-[#00baa4] text-white hover:bg-[#009b89] rounded-xl font-medium transition-all shadow-[0_4px_14px_0_rgba(0,186,164,0.39)] disabled:opacity-50"
                  >
                    <CheckCircle size={18} />
                    Fulfill
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 rounded-xl font-medium transition-all shadow-sm disabled:opacity-50"
                  >
                    <Trash2 size={18} />
                    Delete
                  </button>
                </div>
              </div>

              <div className="flex-1 bg-gray-100 p-4">
                {selectedMatches && (selectedMatches.redMatches.length > 0 || selectedMatches.moderateMatches.length > 0) && (
                  <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="text-amber-500 mt-0.5" size={18} />
                      <div>
                        <h3 className="text-sm font-semibold text-amber-800">Potential duplicates found</h3>
                        <p className="text-sm text-amber-700 mt-1">
                          This request matches other requests on semester, year, program, and specialization.
                        </p>
                        <div className="mt-3 space-y-1 text-sm text-amber-700">
                          {selectedMatches.redMatches.length > 0 && (
                            <div>
                              <span className="font-semibold">Red matches:</span> {selectedMatches.redMatches.length}
                            </div>
                          )}
                          {selectedMatches.moderateMatches.length > 0 && (
                            <div>
                              <span className="font-semibold">Moderate matches:</span> {selectedMatches.moderateMatches.length}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
