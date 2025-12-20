'use client';

import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';

// 1. Configure the worker (Essential for Next.js)
// This tells the library where to find the code that processes PDFs
if (typeof window !== "undefined") {
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";
} 
// Optional: specific styles for react-pdf to prevent layout shifts
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

export default function PdfViewer({ url }) {
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageWidth, setPageWidth] = useState(800);

  // Callback when PDF loads successfully
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setLoading(false);
    setError(null);
  }

  // Callback when PDF fails to load
  function onDocumentLoadError(error) {
    console.error('PDF load error:', error);
    setError('Failed to load PDF. Please check if the file exists and is accessible.');
    setLoading(false);
  }

  if (!url) {
    return (
      <div className="flex items-center justify-center p-8 text-red-600">
        <p>No PDF URL provided</p>
      </div>
    );
  }

  // Calculate responsive width based on viewport
  useEffect(() => {
    const calculateWidth = () => {
      if (typeof window !== 'undefined') {
        // Get viewport width minus padding (16px on mobile, 32px on desktop)
        const padding = window.innerWidth < 768 ? 32 : 64;
        const maxWidth = 800;
        const calculatedWidth = Math.min(maxWidth, window.innerWidth - padding);
        setPageWidth(calculatedWidth);
      }
    };

    calculateWidth();
    window.addEventListener('resize', calculateWidth);
    return () => window.removeEventListener('resize', calculateWidth);
  }, []);

  return (
    <div 
      className="flex flex-col items-center bg-gray-100 p-2 sm:p-4 md:p-8 select-none min-h-screen w-full overflow-x-hidden"
      // 2. Disable Right Click (Context Menu)
      onContextMenu={(e) => e.preventDefault()}
    >
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <svg 
              className="animate-spin h-8 w-8 text-emerald-600" 
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
            <p className="text-slate-600">Loading PDF...</p>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}

      <div className="w-full max-w-full overflow-x-hidden">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={null}
          error={null}
          className="w-full"
        >
          {/* 3. Loop to render all pages */}
          {numPages && Array.from(new Array(numPages), (el, index) => (
            <div 
              key={`page_${index + 1}`} 
              className="mb-4 w-full flex justify-center overflow-x-auto"
            >
              <div className="w-full max-w-full flex justify-center">
                <Page 
                  pageNumber={index + 1} 
                  renderTextLayer={false} // Disable text selection (optional since yours is scanned)
                  renderAnnotationLayer={false} // Disable links/annotations
                  width={pageWidth}
                  className="max-w-full h-auto"
                  scale={1}
                />
              </div>
            </div>
          ))}
        </Document>
      </div>
      
      {/* 4. Overlay to prevent drag-and-drop (Extra security) */}
      <style jsx global>{`
        .react-pdf__Page {
          margin: 0 auto;
          display: flex;
          justify-content: center;
        }
        .react-pdf__Page canvas {
          pointer-events: none; /* Disables clicking/dragging the image */
          max-width: 100%;
          height: auto;
        }
        .react-pdf__Page__canvas {
          max-width: 100% !important;
          height: auto !important;
        }
      `}</style>
    </div>
  );
}