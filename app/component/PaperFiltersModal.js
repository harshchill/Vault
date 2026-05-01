"use client";

import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { FiFilter, FiRotateCcw, FiX } from "react-icons/fi";

const EMPTY_FILTERS = {
  semester: "All semesters",
  specialization: "All specializations",
  program: "All programs",
  year: "All years",
  institute: "All institutes",
};

export default function PaperFiltersModal({
  onClose,
  filters,
  options,
  onApply,
}) {
  const [draftFilters, setDraftFilters] = useState(filters);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const updateFilter = (key, value) => {
    setDraftFilters((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const handleApply = () => {
    onApply(draftFilters);
    onClose();
  };

  const handleReset = () => {
    setDraftFilters(EMPTY_FILTERS);
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className="mx-auto flex min-h-full w-full max-w-5xl items-end justify-center p-3 sm:p-6 md:items-start md:pt-12"
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="w-full max-w-3xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6 md:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-700">
                <FiFilter size={18} />
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Filters
                </span>
              </div>
              <h2 id={titleId} className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Refine your paper search
              </h2>
              <p id={descriptionId} className="mt-1 max-w-2xl text-sm text-slate-500 sm:text-base">
                Choose the paper details you want to narrow down, then apply everything at once.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Semester</span>
              <select
                value={draftFilters.semester}
                onChange={(event) => updateFilter("semester", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                {options.semesters.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Year</span>
              <select
                value={draftFilters.year}
                onChange={(event) => updateFilter("year", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                {options.years.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Program</span>
              <select
                value={draftFilters.program}
                onChange={(event) => updateFilter("program", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                {options.programs.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2">
              <span className="text-sm font-medium text-slate-700">Specialization</span>
              <select
                value={draftFilters.specialization}
                onChange={(event) => updateFilter("specialization", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                {options.specializations.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-2 md:col-span-2">
              <span className="text-sm font-medium text-slate-700">Institute</span>
              <select
                value={draftFilters.institute}
                onChange={(event) => updateFilter("institute", event.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
              >
                {options.institutes.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-8 flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={handleReset}
              className="button button-ghost"
            >
              <FiRotateCcw size={16} />
              Reset
            </button>
            <button
              type="button"
              onClick={handleApply}
              className="button button-primary"
            >
              Apply filters
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
