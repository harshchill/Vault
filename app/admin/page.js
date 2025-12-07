"use client";
/**
 * Admin Upload Page
 * 
 * This page allows administrators to upload exam papers to the vault system.
 * 
 * Features:
 * - Upload PDF files to Supabase storage
 * - Save paper metadata to MongoDB database
 * - Form validation and error handling
 * - Loading states and user feedback
 * - Admin-only access protection
 * 
 * Requirements:
 * - Environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
 * - Supabase storage bucket named "Vault" must exist
 * - MongoDB connection configured
 * - User must have admin role
 * 
 * @component
 * @returns {JSX.Element} Admin upload form component
 */

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

export default function AdminUpload() {
  const { data: session, status } = useSession();
  const router = useRouter();
  // State management
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

  const [isAuthorized, setIsAuthorized] = useState(false);

  // Check authentication and admin role
  useEffect(() => {
    if (status === 'loading') return; // Still checking authentication
    
    if (status === 'unauthenticated' || !session) {
      router.push('/auth?callbackUrl=/admin');
      return;
    }
    
    if (session.user?.role !== 'admin') {
      setError('Access denied. Admin privileges required.');
      setTimeout(() => {
        router.push('/');
      }, 2000);
      return;
    }
    
    // User is authenticated and is admin
    setIsAuthorized(true);
  }, [session, status, router]);

  // Initialize Supabase client on component mount
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

  /**
   * Handles form input changes
   * @param {Event} e - Change event from input element
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when user starts typing
    if (error) setError(null);
  };

  /**
   * Handles file selection
   * @param {Event} e - Change event from file input
   */
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) {
      setFile(null);
      return;
    }

    // Validate file type
    if (selectedFile.type !== 'application/pdf') {
      setError('Please select a PDF file only.');
      setFile(null);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (selectedFile.size > maxSize) {
      setError('File size must be less than 10MB.');
      setFile(null);
      return;
    }

    setFile(selectedFile);
    if (error) setError(null);
  };

  /**
   * Converts semester string to number
   * Handles formats like "1", "1st Sem", "Semester 1", etc.
   * @param {string} semesterStr - Semester string from form
   * @returns {number} Semester number (1-8)
   */
  const parseSemester = (semesterStr) => {
    // Extract first number from string
    const match = semesterStr.match(/\d+/);
    if (match) {
      const num = parseInt(match[0], 10);
      return num >= 1 && num <= 8 ? num : 1;
    }
    return 1; // Default to 1 if parsing fails
  };

  /**
   * Handles form submission and file upload
   * @param {Event} e - Submit event from form
   */
  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validation
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
    
    // Validate department
    const validDepartments = ['CS', 'mining', 'cement', 'others'];
    if (!validDepartments.includes(formData.department)) {
      setError(`Invalid department. Must be one of: ${validDepartments.join(', ')}`);
      return;
    }

    setLoading(true);

    try {
      // --- STEP 1: Upload file to Supabase Storage ---
      const filename = `${Date.now()}-${file.name.replace(/\s/g, '_')}`;
      const bucketName = 'Vault'; // Storage bucket name
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filename, file, {
          cacheControl: '3600',
          upsert: false // Prevent overwriting existing files
        });

      if (uploadError) {
        throw new Error(`Supabase upload failed: ${uploadError.message}`);
      }

      // --- STEP 2: Get Public URL from Supabase Storage ---
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filename);

      if (!publicUrl) {
        throw new Error('Failed to generate public URL for uploaded file.');
      }

      console.log('File uploaded successfully to:', publicUrl);

      // --- STEP 3: Save paper metadata to MongoDB via API ---
      const semesterNum = parseSemester(formData.semester);
      const yearNum = parseInt(formData.year, 10);

      const response = await fetch('/api/papers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
        throw new Error(errorData.error || `Failed to save paper to database. Status: ${response.status}`);
      }
      
      const result = await response.json();

      // Success!
      setSuccess(`Paper "${formData.title}" uploaded successfully!`);
      console.log('Paper saved to database:', result.paper);

      // Reset form
      setFormData({ 
        title: '', 
        subject: '', 
        semester: '1', 
        year: new Date().getFullYear(),
        department: 'CS',
        program: 'B.tech',
      });
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

    } catch (error) {
      console.error('Upload error:', error);
      // Provide user-friendly error messages
      let errorMessage = 'Upload failed. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error instanceof TypeError && error.message.includes('fetch')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.name === 'ValidationError') {
        errorMessage = 'Validation error. Please check all fields and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show loading state while checking authentication
  if (status === 'loading' || !isAuthorized) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200 text-center">
          <div className="flex flex-col items-center gap-4">
            <svg 
              className="animate-spin h-8 w-8 text-indigo-600" 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24"
            >
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-gray-600">Verifying access...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error if access denied
  if (error && error.includes('Access denied')) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-red-200">
          <div className="text-center">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to home page...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
        {/* Header */}
        <div className="mb-6 border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Upload Panel</h1>
          <p className="text-sm text-gray-500 mt-1">
            Upload scanned exam papers to the secure vault.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}
        
        {/* Upload Form */}
        <form onSubmit={handleUpload} className="space-y-4">
          {/* File Input */}
          <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {file ? (
                <span className="text-indigo-600">{file.name}</span>
              ) : (
                "Click to select PDF Document"
              )}
            </label>
            <input 
              type="file" 
              accept=".pdf"
              onChange={handleFileChange}
              disabled={loading}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {file && (
              <p className="text-xs text-gray-500 mt-2">
                Size: {(file.size / 1024 / 1024).toFixed(2)} MB
              </p>
            )}
          </div>

          {/* Paper Title Input */}
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
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
            />
          </div>

          {/* Subject and Year Grid */}
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
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
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
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed" 
              />
            </div>
          </div>

          {/* Semester, Department, and Program Grid */}
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
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={num.toString()}>
                    Semester {num}
                  </option>
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
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2.5 border bg-gray-50 focus:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading || !supabase}
            className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-medium text-white transition-all transform hover:scale-[1.02] ${
              loading || !supabase
                ? 'bg-indigo-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {loading ? (
              <>
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Uploading...
              </>
            ) : (
              'Upload Paper'
            )}
          </button>

          {/* Info Note */}
          <p className="text-xs text-gray-500 text-center mt-4">
            * Required fields. Maximum file size: 10MB
          </p>
        </form>
      </div>
    </div>
  );
}