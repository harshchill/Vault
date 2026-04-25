"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { FiUpload, FiFileText } from 'react-icons/fi';

// Program → Specialization map
const UNIVERSITY_COURSES = {
  "B.Tech": [
    "Computer Science & Engineering (CSE)",
    "CSE (AI & Data Science)",
    "CSE (Cyber Security)",
    "AI & Machine Learning",
    "Mining Engineering",
    "Civil Engineering",
    "Mechanical Engineering",
    "Electrical Engineering",
    "Cement Technology",
    "Ceramics & Cement Technology",
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
    "Computer Science and Engineering",
    "Mining Engineering",
    "Mechanical Engineering",
    "Agricultural Engineering",
    "Biotechnology"
  ],
  "Polytechnic Diploma": [
    "Computer Science And Engineering",
    "Mining Engineering",
    "Mine Surveying",
    "Civil Engineering",
    "Electrical Engineering",
    "Mechanical Engineering",
    "Cement Technology",
    "Food Technology",
    "Agricultural Engineering",
    "Fashion Design"
  ],
  "Polytechnic Diploma (Lateral Entry)": [
    "Civil Engineering",
    "Electrical Engineering",
    "Cement Technology",
    "Agricultural Engineering"
  ],
  "BCA": [
    "BCA (Hons)",
    "BCA (Hons) AI & Machine Learning"
  ],
  "MCA": [
    "Master of Computer Applications"
  ],
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
    "Math in Biology",
    "Seed Technology"
  ],
  "M.Sc.": [
    "Computer Science",
    "Food Technology",
    "Biotechnology",
    "Microbiology",
    "Environmental Science",
    "Chemistry",
    "Physics",
    "Mathematics",
    "Yoga Science",
    "Agriculture (Agronomy)",
    "Agriculture (Soil Science)",
    "Agriculture (Genetics)",
    "Agriculture (Plant Pathology)",
    "Agriculture (Fruit Science)",
    "Agriculture (Chemistry)"
  ],
  "Management": [
    "BBA (Hons)",
    "BBA (Tourism & Hotel Mgmt)",
    "MBA (General)",
    "MBA (Logistics & Supply Chain Management)",
    "MBA (Production & Operation Management)",
    "MBA (Executive)",
    "MBA (Retail Management)",
    "MBA (Human Resource Management)",
    "MBA (Information Technology & Systems Management)",
    "MBA (Marketing)",
    "MBA (Rural Management)",
    "MBA (Banking & Insurance)",
    "MBA (Finance)",
    "MBA (Tourism And Hospitality Management)",
    "MBA (Agri-Business Management)"
  ],
  "Commerce": [
    "B.Com (Computer Application)",
    "B.Com (Economics)",
    "B.Com (Financial Mgmt)",
    "B.Com (Hons)",
    "B.Com (Corporate Accounting Practice - CAP)",
    "B.Com (Corporate Secretarial Practice - CSP)",
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
    "M.Sc. Soil Science",
    "M.Sc. Plant Pathology",
    "M.Sc. Fruit Science",
    "M.Sc. Agriculture Chemistry"
  ],
  "B.A. (Bachelor of Arts)": [
    "Computer Applications",
    "Economics",
    "English Literature",
    "Fashion Design",
    "History",
    "Political Science",
    "Public Administration",
    "Sociology"
  ],
  "M.A. (Master of Arts)": [
    "Public Administration",
    "Political Science",
    "Economics",
    "Yoga Science"
  ],
  "Law": [
    "LLB",
    "BBA LLB",
    "BA LLB",
    "B.Com LLB",
    "LLM"
  ],
  "Education": [
    "B.Ed",
    "Ph.D in Education"
  ],
  "Paramedical": [
    "Bachelor of Medical Laboratory Technology (BMLT)",
    "Bachelor of Physiotherapy (B.P.T.)"
  ],
  "Design": [
    "B.Des (Design)"
  ],
  "PG Diploma": [
    "PGDCA",
    "PG Diploma in Cyber Security and Digital Forensics"
  ],
  "Ph.D": [
    "Mining Engineering",
    "Mathematics",
    "Management",
    "Education"
  ]
};

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const [formData, setFormData] = useState({
    institute: '',
    subject: '',
    semester: '1',
    year: new Date().getFullYear(),
    specialization: '',
    program: 'B.Tech',
    customSpecialization: '',
  });
  const [specializationOptions, setSpecializationOptions] = useState([]);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Require authentication
  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated' || !session) {
      router.push('/user/auth?callbackUrl=/user/upload');
    }
  }, [status, session, router]);

  // Initialize Supabase client
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError('Supabase configuration missing. Please check environment variables.');
      return;
    }

    try {
      const client = createClient(supabaseUrl, supabaseKey);
      setSupabase(client);
    } catch (err) {
      setError('Failed to initialize Supabase client: ' + err.message);
    }
  }, []);

  // Update specialization options when program changes
  useEffect(() => {
    const options = UNIVERSITY_COURSES[formData.program] || [];
    setSpecializationOptions([...options, 'Other']);
    // Reset specialization when program changes
    setFormData((prev) => ({ ...prev, specialization: '', customSpecialization: '' }));
  }, [formData.program]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
  };

  const handleProgramChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, program: value }));
  };

  const handleSpecializationChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, specialization: value, customSpecialization: '' }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file only.');
      setFile(null);
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 10MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    if (error) setError(null);
  };

  const parseSemester = (semesterStr) => {
    const match = semesterStr.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return num >= 1 && num <= 8 ? num : 1;
    }
    return 1;
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!file) {
      setError('Please select a PDF file to upload.');
      return;
    }

    if (!supabase) {
      setError('Supabase client not initialized. Please refresh the page.');
      return;
    }

    const specValue = formData.specialization === 'Other' ? formData.customSpecialization.trim() : formData.specialization;
    if (!formData.institute.trim() || !formData.subject.trim() || !specValue || !formData.program.trim()) {
      setError('Please fill in all required fields including institute, subject, specialization, and program.');
      return;
    }

    setLoading(true);

    try {
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const bucketName = 'Vault';

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filename, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw new Error(`Supabase upload failed: ${uploadError.message}`);

      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);

      if (!publicUrl) throw new Error('Failed to generate public URL for uploaded file.');

      const semesterNum = parseSemester(formData.semester);
      const yearNum = parseInt(formData.year, 10);

      const response = await fetch('/api/papers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          institute: formData.institute.trim(),
          subject: formData.subject.trim(),
          semester: semesterNum,
          year: yearNum,
          specialization: specValue,
          program: formData.program.trim(),
          storageURL: publicUrl,
          storageFileName: filename
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Failed to save paper. Status: ${response.status}`);
      }

      setSuccess(`Paper "${formData.subject}" uploaded! It will be visible after admin approval.`);

      setFormData({ institute: '', subject: '', semester: '1', year: new Date().getFullYear(), specialization: '', program: 'B.Tech', customSpecialization: '' });
      setFile(null);
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen grid place-items-center">
        <div className="text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden py-12 px-4 sm:px-6 lg:px-8">
      <div className="absolute top-20 right-20 w-[400px] h-[400px] bg-teal-400/10 rounded-full blur-3xl -z-10" />

      <div className="max-w-3xl mx-auto relative z-10 animate-fade-in">
        <div className="mb-10 text-center">
          <span className="pill mb-4 border border-teal-200 text-teal-700 font-black"><FiUpload /> Contribution Zone</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 tracking-tight mb-2">Drop a Paper</h1>
          <p className="text-slate-500 text-lg">Leave a legacy. Submit past year papers for the community.</p>
        </div>

        <div className="glass-panel p-8 sm:p-10 shadow-2xl shadow-teal-500/10 border-t-4 border-t-teal-500 rounded-3xl relative overflow-hidden bg-white/80 backdrop-blur-3xl">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 font-medium rounded-xl flex items-center justify-between">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-teal-50 border border-teal-200 text-teal-700 font-bold rounded-xl shadow-sm shadow-teal-500/10 flex items-center gap-3">
              <span className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-teal-600">✓</span>
              {success}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className={`relative p-10 rounded-[24px] border-2 border-dashed flex flex-col items-center justify-center transition-all bg-white/50 group ${file ? 'border-teal-400 bg-teal-50/50 shadow-inner' : 'border-slate-300 hover:border-teal-300 hover:bg-slate-50'}`}>
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-transform group-hover:-translate-y-2 ${file ? 'bg-gradient-to-br from-teal-400 to-emerald-500 text-white shadow-teal-500/30' : 'bg-slate-100 text-slate-400 group-hover:bg-teal-50 group-hover:text-teal-500'}`}>
                 <FiFileText size={32} />
              </div>
              <label className="block text-center cursor-pointer w-full h-full absolute inset-0 z-10 flex flex-col items-center justify-center pt-32">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  disabled={loading}
                  className="hidden"
                />
              </label>
              <div className="text-center pointer-events-none relative z-0 mt-8">
                {file ? (
                  <>
                    <span className="text-teal-700 font-extrabold text-lg block mb-2">{file.name}</span>
                    <span className="text-teal-600 text-sm font-bold px-3 py-1 bg-teal-100/60 rounded-lg">
                       {(file.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-slate-800 font-extrabold text-xl block mb-2">Click or drag PDF here</span>
                    <span className="text-slate-400 font-medium">Strictly .pdf format, maximum 10MB</span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Institute <span className="text-teal-500">*</span>
                </label>
                <input
                  name="institute"
                  type="text"
                  required
                  value={formData.institute}
                  onChange={handleChange}
                  placeholder="e.g. AKS University"
                  disabled={loading}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm font-medium text-slate-800"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Paper Title <span className="text-teal-500">*</span>
                </label>
                <input
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Advanced Data Structures Finals"
                  disabled={loading}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm font-medium text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Year <span className="text-teal-500">*</span>
                </label>
                <input
                  name="year"
                  type="number"
                  required
                  min="2000"
                  max="2100"
                  value={formData.year}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm font-medium text-slate-800"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Semester <span className="text-teal-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="semester"
                    value={formData.semester}
                    onChange={handleChange}
                    disabled={loading}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm font-medium text-slate-800 appearance-none pr-10"
                  >
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <option key={num} value={num.toString()}>Semester {num}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" fillRule="evenodd"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Program <span className="text-teal-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="program"
                    value={formData.program}
                    onChange={handleProgramChange}
                    disabled={loading}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm font-medium text-slate-800 appearance-none pr-10"
                  >
                    {Object.keys(UNIVERSITY_COURSES).map((prog) => (
                      <option key={prog} value={prog}>{prog}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Specialization <span className="text-teal-500">*</span>
                </label>
                <div className="relative">
                  <select
                    name="specialization"
                    value={formData.specialization}
                    onChange={handleSpecializationChange}
                    disabled={loading || specializationOptions.length === 0}
                    className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm font-medium text-slate-800 appearance-none pr-10"
                  >
                    <option value="" disabled>Select specialization...</option>
                    {specializationOptions.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-slate-400">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"></path></svg>
                  </div>
                </div>

                {formData.specialization === 'Other' && (
                  <input
                    type="text"
                    name="customSpecialization"
                    value={formData.customSpecialization}
                    onChange={handleChange}
                    placeholder="Type custom specialization"
                    className="mt-3 w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white/50 focus:bg-white focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 outline-none transition-all shadow-sm font-medium text-slate-800 animate-fade-in"
                  />
                )}
              </div>
            </div>

            <div className="pt-6 mt-4">
              <button
                type="submit"
                disabled={loading || !supabase}
                className="button button-primary w-full py-4 text-lg font-bold group disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center gap-3 justify-center">
                    <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Uploading & Encrypting...
                  </span>
                ) : (
                  <span className="flex items-center gap-3 justify-center">
                    <FiUpload size={22} className="group-hover:-translate-y-1 transition-transform" /> Transmit to Vault
                  </span>
                )}
              </button>
            </div>
            
            <p className="text-center text-xs font-semibold text-slate-400 mt-4 tracking-wide uppercase">
              Submissions require admin approval before listing.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
