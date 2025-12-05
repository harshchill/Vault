/* eslint-disable react/no-unescaped-entities */
"use client";

import { useMemo, useState } from "react";
import { FiFolder, FiFilter, FiClock, FiBookOpen } from "react-icons/fi";

const papers = [
  { id: 1, title: "Engineering ", semester: "Semester 1", year: "2024", type: "Mid" },
  { id: 2, title: "Physics Fundamentals", semester: "Semester 1", year: "2024", type: "End" },
  { id: 3, title: "Data Structures", semester: "Semester 3", year: "2023", type: "End" },
  { id: 4, title: "Digital Logic", semester: "Semester 2", year: "2023", type: "Mid" },
  { id: 5, title: "Algorithms", semester: "Semester 4", year: "2024", type: "End" },
  { id: 6, title: "Operating Systems", semester: "Semester 4", year: "2023", type: "End" },
  { id: 7, title: "Computer Networks", semester: "Semester 5", year: "2024", type: "Mid" },
  { id: 8, title: "Database Systems", semester: "Semester 5", year: "2023", type: "End" },
];

const semesters = ["All semesters", "Semester 1", "Semester 2", "Semester 3", "Semester 4", "Semester 5"];

export default function PapersPage() {
  const [selectedSemester, setSelectedSemester] = useState("All semesters");

  const filtered = useMemo(() => {
    if (selectedSemester === "All semesters") return papers;
    return papers.filter((p) => p.semester === selectedSemester);
  }, [selectedSemester]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 space-y-10">
      <div className="flex items-start justify-between gap-6 flex-wrap">
        <div className="space-y-2">
          <span className="pill">Browse collection</span>
          <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Previous semester papers</h1>
          <p className="text-slate-600">
            Filter by semester to quickly find what you need. This MVP keeps it light, clean, and focused.
          </p>
        </div>
        <div className="card p-4 w-full md:w-auto flex items-center gap-3">
          <FiFilter className="text-emerald-600" size={20} />
          <select
            value={selectedSemester}
            onChange={(e) => setSelectedSemester(e.target.value)}
            className="bg-transparent outline-none text-sm font-medium text-slate-800"
          >
            {semesters.map((sem) => (
              <option key={sem} value={sem}>
                {sem}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((paper) => (
          <div key={paper.id} className="card p-5 space-y-3 hover:border-emerald-200 transition">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="h-10 w-10 rounded-full bg-emerald-100 text-emerald-700 grid place-items-center">
                  <FiFolder />
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{paper.title}</p>
                  <p className="text-xs text-slate-500">{paper.semester}</p>
                </div>
              </div>
              <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                {paper.year} · {paper.type}
              </span>
            </div>

            <button className="button button-primary w-full mt-4 justify-center">View paper</button>
          </div>
        ))}
      </div>
    </div>
  );
}

