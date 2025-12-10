"use client";
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { FiUpload, FiFileText } from 'react-icons/fi';

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [supabase, setSupabase] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    semester: '1',
    year: new Date().getFullYear(),
    department: 'CS',
    program: 'B.tech',
  });
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Require authentication
  useEffect(() => {
    if (status === 'loading') return;
    if (status !== 'authenticated' || !session) {
      router.push('/auth?callbackUrl=/upload');
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError(null);
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

    if (!formData.title.trim() || !formData.subject.trim() || !formData.department || !formData.program.trim()) {
      setError('Please fill in all required fields including department and program.');
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
          title: formData.title.trim(),
          subject: formData.subject.trim(),
          semester: semesterNum,
          year: yearNum,
          department: formData.department,
          program: formData.program.trim(),
          url: publicUrl,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error occurred' }));
        throw new Error(errorData.error || `Failed to save paper. Status: ${response.status}`);
      }

      setSuccess(`Paper "${formData.title}" uploaded! It will be visible after admin approval.`);

      setFormData({ title: '', subject: '', semester: '1', year: new Date().getFullYear(), department: 'CS', program: 'B.tech' });
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Paper</h1>
          <p className="text-gray-600">Submit your paper for admin review and approval.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">{success}</p>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {file ? (
                  <span className="text-emerald-600">{file.name}</span>
                ) : (
                  "Click to select PDF Document"
                )}
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                disabled={loading}
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {file && (
                <p className="text-xs text-gray-500 mt-2">Size: {(file.size / 1024 / 1024).toFixed(2)} MB</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                Paper Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Data Structures Mid-Term"
                disabled={loading}
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Subject Code <span className="text-red-500">*</span>
                </label>
                <input
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. CS101"
                  disabled={loading}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Year <span className="text-red-500">*</span>
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
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Semester <span className="text-red-500">*</span>
                </label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  disabled={loading}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {[1,2,3,4,5,6,7,8].map(num => (
                    <option key={num} value={num.toString()}>Semester {num}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Department <span className="text-red-500">*</span>
                </label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={loading}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="CS">CS</option>
                  <option value="mining">Mining</option>
                  <option value="cement">Cement</option>
                  <option value="others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wide mb-1">
                  Program <span className="text-red-500">*</span>
                </label>
                <select
                  name="program"
                  value={formData.program}
                  onChange={handleChange}
                  disabled={loading}
                  className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="B.tech">B.tech</option>
                  <option value="BE">BE</option>
                  <option value="BSc">BSc</option>
                  <option value="M.tech">M.tech</option>
                  <option value="ME">ME</option>
                  <option value="MSc">MSc</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !supabase}
              className={`w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition-all transform hover:scale-[1.02] ${
                loading || !supabase ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <FiUpload /> Upload Paper
                </>
              )}
            </button>

            <p className="text-xs text-gray-500 text-center mt-4">* Required fields. Maximum file size: 10MB</p>
          </form>
        </div>

        <div className="mt-6 text-xs text-slate-500 flex items-center gap-2">
          <FiFileText /> Submissions require admin approval before appearing in the Papers list.
        </div>
      </div>
    </div>
  );
}
