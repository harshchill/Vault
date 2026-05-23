"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import {
  FiSave,
  FiUser,
  FiBook,
  FiAward,
  FiCheckCircle,
  FiMapPin,
} from "react-icons/fi";
import { updateUserProfile } from "@/app/actions/userActions";
import { UNIVERSITY_COURSES } from "@/lib/universityCourses";

export default function ProfileForm({ user }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [instituteOptions, setInstituteOptions] = useState([]);

  const programOptions = useMemo(
    () => Object.keys(UNIVERSITY_COURSES).sort((a, b) => a.localeCompare(b)),
    []
  );

  const hasProgram = Boolean(user.program && user.program.trim());
  const initialProgram = hasProgram
    ? programOptions.includes(user.program)
      ? user.program
      : "Other"
    : "";
  const initialCustomProgram = hasProgram && !programOptions.includes(user.program)
    ? user.program
    : "";
  const initialSpecializationOptions = initialProgram
    ? UNIVERSITY_COURSES[initialProgram] || []
    : [];
  const initialSpecialization = initialProgram
    ? initialSpecializationOptions.includes(user.specialization)
      ? user.specialization
      : user.specialization
        ? "Other"
        : ""
    : "";
  const initialCustomSpecialization = initialProgram
    ? initialSpecializationOptions.includes(user.specialization)
      ? ""
      : user.specialization || ""
    : "";

  const [program, setProgram] = useState(initialProgram);
  const [customProgram, setCustomProgram] = useState(initialCustomProgram);
  const [specialization, setSpecialization] = useState(initialSpecialization);
  const [customSpecialization, setCustomSpecialization] = useState(
    initialCustomSpecialization
  );
  const [institute, setInstitute] = useState(user.university || "");
  const [name, setName] = useState(user.name || "");

  const specializationOptions = useMemo(() => {
    if (!program) return [];
    const options = UNIVERSITY_COURSES[program] || [];
    return options.length ? [...options, "Other"] : ["Other"];
  }, [program]);

  const handleProgramChange = (event) => {
    const nextProgram = event.target.value;
    setProgram(nextProgram);
    setSpecialization(nextProgram === "Other" ? "Other" : "");
    setCustomSpecialization("");
  };

  useEffect(() => {
    const fetchInstitutes = async () => {
      try {
        const response = await fetch("/api/papers?distinct=institute");
        const data = await response.json();
        if (response.ok && data.success && Array.isArray(data.institutes)) {
          setInstituteOptions(data.institutes);
        }
      } catch (error) {
        console.error("Failed to fetch institute options:", error);
      }
    };

    fetchInstitutes();
  }, []);

  const resolvedProgram =
    program === "Other" ? customProgram.trim() : program || "";
  const resolvedSpecialization =
    specialization === "Other"
      ? customSpecialization.trim()
      : specialization || "";

  async function handleAction(formData) {
    setLoading(true);
    setMessage(null);
    const result = await updateUserProfile(user.email, formData);
    setMessage(result);
    setLoading(false);
  }

  return (
    <div className="card p-8 lg:p-10 max-w-2xl mx-auto shadow-2xl shadow-teal-500/10 border-t-4 border-t-teal-500 rounded-2xl relative overflow-hidden bg-white/60 backdrop-blur-3xl">
      <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-6 mb-10 relative z-10">
        <div className="w-24 h-24 sm:w-20 sm:h-20 shrink-0 rounded-full bg-linear-to-br from-teal-400 to-emerald-500 p-1 shadow-lg">
           <Image
             src={user.image || "/default-avatar.png"}
             alt="Avatar"
             width={96}
             height={96}
             loader={({ src }) => src}
             unoptimized
             className="w-full h-full rounded-full object-cover border-2 border-white"
           />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
          <p className="text-slate-500 font-medium">{user.email}</p>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider">{user.role}</span>
        </div>
      </div>

      <form action={handleAction} className="space-y-6 relative z-10">
        
        {message && (
          <div className={`p-4 rounded-xl flex items-center gap-3 font-medium ${message.success ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {message.success && <FiCheckCircle size={20} />}
            {message.message || message.error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiUser className="text-teal-500" /> Name
            </label>
            <input
              name="name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="e.g. Aashu Kumar"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiMapPin className="text-teal-500" /> Institute
            </label>
            <input
              name="university"
              value={institute}
              onChange={(event) => setInstitute(event.target.value)}
              placeholder="e.g. AKS University"
              list="profile-institutes"
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm"
            />
            <datalist id="profile-institutes">
              {instituteOptions.map((option) => (
                <option key={option} value={option} />
              ))}
            </datalist>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiAward className="text-teal-500" /> Program
            </label>
            <select
              value={program}
              onChange={handleProgramChange}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm appearance-none"
            >
              <option value="" disabled>
                Select program
              </option>
              {programOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>
            {program === "Other" ? (
              <input
                name="customProgram"
                value={customProgram}
                onChange={(event) => setCustomProgram(event.target.value)}
                placeholder="Enter your program"
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm"
              />
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiBook className="text-teal-500" /> Specialization
            </label>
            <select
              value={specialization}
              onChange={(event) => setSpecialization(event.target.value)}
              disabled={!program}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm appearance-none"
            >
              <option value="" disabled>
                {program ? "Select specialization" : "Select program first"}
              </option>
              {specializationOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            {specialization === "Other" ? (
              <input
                name="customSpecialization"
                value={customSpecialization}
                onChange={(event) => setCustomSpecialization(event.target.value)}
                placeholder="Enter your specialization"
                required
                suppressHydrationWarning
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm"
              />
            ) : null}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiAward className="text-teal-500" /> Semester
            </label>
            <select 
              name="semester" 
              defaultValue={user.semester || ""}
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm appearance-none"
            >
              <option value="" disabled>Select your semester</option>
              {[1,2,3,4,5,6,7,8,9,10].map(sem => (
                <option key={sem} value={sem}>Semester {sem}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-bold text-slate-700 flex items-center gap-2">
              <FiUser className="text-teal-500" /> Profile Picture URL
            </label>
            <input 
              name="image" 
              defaultValue={user.image}
              placeholder="e.g. https://github.com/aashu.png"
              suppressHydrationWarning
              className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-200 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <input type="hidden" name="program" value={resolvedProgram} />
        <input
          type="hidden"
          name="specialization"
          value={resolvedSpecialization}
        />

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <button 
            type="submit" 
            disabled={loading}
            suppressHydrationWarning
            className="button button-primary group min-w-35"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Spinner /> Saving...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                Save Changes <FiSave className="group-hover:translate-x-1 transition-transform"/>
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
