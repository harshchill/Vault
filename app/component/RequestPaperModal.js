"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { FiSend, FiX } from "react-icons/fi";
import { UNIVERSITY_COURSES } from "@/lib/universityCourses";
import { createPaperRequest } from "@/app/actions/userActions";

const semesterOptions = Array.from({ length: 8 }, (_, index) => index + 1);

const buildYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear; year >= 2000; year -= 1) {
    years.push(year);
  }
  return years;
};

export default function RequestPaperModal({
  isOpen,
  onClose,
  initialSubject = "",
  onSuccess,
}) {
  const titleId = useId();
  const descriptionId = useId();
  const programOptions = useMemo(() => Object.keys(UNIVERSITY_COURSES), []);
  const yearOptions = useMemo(() => buildYearOptions(), []);

  const [formData, setFormData] = useState({
    institute: "",
    subject: initialSubject,
    program: programOptions[0] || "",
    specialization: "",
    semester: "1",
    year: String(new Date().getFullYear()),
  });
  const specializationOptions = useMemo(
    () => UNIVERSITY_COURSES[formData.program] || [],
    [formData.program]
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
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
  }, [isOpen, onClose]);

  if (!isOpen || typeof document === "undefined") {
    return null;
  }

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleProgramChange = (event) => {
    const { value } = event.target;
    setFormData((prev) => ({
      ...prev,
      program: value,
      specialization: "",
    }));
    if (error) setError(null);
    if (success) setSuccess(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (
      !formData.institute.trim() ||
      !formData.subject.trim() ||
      !formData.program ||
      !formData.specialization ||
      !formData.semester ||
      !formData.year
    ) {
      setError("Please fill in all the fields before submitting.");
      return;
    }

    setLoading(true);
    const result = await createPaperRequest({
      institute: formData.institute.trim(),
      subject: formData.subject.trim(),
      program: formData.program,
      specialization: formData.specialization,
      semester: Number(formData.semester),
      year: Number(formData.year),
    });

    if (!result?.success) {
      setError(result?.error || "Failed to submit request. Please try again.");
      setLoading(false);
      return;
    }

    setSuccess("Request submitted. We will notify uploaders to help you soon.");
    if (onSuccess) {
      onSuccess(result.request);
    }
    setFormData((prev) => ({
      ...prev,
      institute: "",
      subject: "",
      specialization: "",
      semester: "1",
      year: String(new Date().getFullYear()),
    }));
    setLoading(false);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/35 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="mx-auto flex min-h-full w-full max-w-5xl items-end justify-center p-3 sm:p-6 md:items-start md:pt-12">
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          className="w-full max-w-2xl rounded-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:p-6 md:p-8"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="text-sm font-semibold uppercase tracking-wide text-emerald-700">
                Request a paper
              </span>
              <h2 id={titleId} className="mt-2 text-2xl font-semibold text-slate-900 sm:text-3xl">
                Tell us what you need
              </h2>
              <p id={descriptionId} className="mt-1 text-sm text-slate-500 sm:text-base">
                Share the paper details and we will surface the request to uploaders.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close request modal"
              className="rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            >
              <FiX size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Program</span>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleProgramChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                >
                  {programOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Specialization</span>
                <select
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                >
                  <option value="">Select specialization</option>
                  {specializationOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Semester</span>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                >
                  {semesterOptions.map((option) => (
                    <option key={option} value={String(option)}>
                      Semester {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2">
                <span className="text-sm font-medium text-slate-700">Year</span>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                >
                  {yearOptions.map((option) => (
                    <option key={option} value={String(option)}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Institute</span>
                <input
                  name="institute"
                  value={formData.institute}
                  onChange={handleChange}
                  placeholder="Enter institute name"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                />
              </label>

              <label className="space-y-2 md:col-span-2">
                <span className="text-sm font-medium text-slate-700">Subject</span>
                <input
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Data Structures"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-emerald-400 focus:bg-white"
                />
              </label>
            </div>

            {error ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            ) : null}

            {success ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={onClose}
                className="button button-ghost"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="button button-primary"
              >
                <FiSend size={16} />
                {loading ? "Submitting..." : "Submit request"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
