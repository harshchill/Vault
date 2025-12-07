"use client";

/**
 * Login Required Modal Component
 * 
 * A gentle popup modal that appears when a user tries to access
 * protected content without being logged in.
 * 
 * Features:
 * - Smooth fade-in animation
 * - Backdrop overlay
 * - Close button (X)
 * - Login button that navigates to auth page
 * - Click outside to close
 * 
 * @component
 * @param {boolean} isOpen - Whether the modal is visible
 * @param {function} onClose - Function to call when modal should close
 * @returns {JSX.Element} Login required modal
 */

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiX, FiLogIn, FiLock } from 'react-icons/fi';

export default function LoginRequiredModal({ isOpen, onClose }) {
  const router = useRouter();

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // Don't render if not open
  if (!isOpen) return null;

  /**
   * Handles navigation to login page
   */
  const handleLogin = () => {
    router.push('/auth');
  };

  /**
   * Handles backdrop click to close modal
   */
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fadeIn" />

      {/* Modal content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full p-6 md:p-8 animate-slideUp">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <FiX size={24} />
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="h-16 w-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <FiLock className="text-emerald-600" size={32} />
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-semibold text-slate-900">
            Login Required
          </h2>
          
          <p className="text-slate-600 leading-relaxed">
            You need to be logged in to view exam papers.
          </p>
          
          <p className="text-sm text-slate-500">
            Don't worry, it will just take a moment to log in!
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={handleLogin}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium shadow-sm hover:shadow-md"
            >
              <FiLogIn size={18} />
              <span>Go to Login</span>
            </button>
            
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors font-medium"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

