"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiLogOut, FiUser, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isDropdownOpen || isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen, isMobileMenuOpen]);

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-surface/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <Image src="/icon.png" alt="Vault" width={40} height={40} className="rounded-xl" />
          <span className="hidden sm:inline">Vault</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-700">
          {/* Admin button - only show if user is admin */}
          {status === "authenticated" && session?.user?.role === "admin" && (
            <Link href="/admin" className="hover:text-emerald-600 transition-colors">
              Admin
            </Link>
          )}
          
          <Link href="/papers" className="hover:text-emerald-600 transition-colors">
            Papers
          </Link>

          <Link href="/contributions" className="hover:text-emerald-600 transition-colors">
            Contributions
          </Link>

          {status === "authenticated" && (
            <Link href="/upload" className="hover:text-emerald-600 transition-colors">
              Upload
            </Link>
          )}
          
          {/* Conditional rendering based on session */}
          {status === "loading" ? (
            <div className="text-slate-400">Loading...</div>
          ) : status === "authenticated" && session ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-md shadow-emerald-200/50 transform transition-all hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2"
              >
                <span className="flex items-center gap-2">
                  <FiUser size={16} />
                  {session.user.name || session.user.email?.split("@")[0]}
                </span>
                <FiChevronDown 
                  size={16} 
                  className={`transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="p-2">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-slate-100">
                      <p className="text-sm font-semibold text-slate-900">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {session.user.email}
                      </p>
                      {session.user.role === "admin" && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-100 text-emerald-700">
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg group"
                    >
                      <FiLogOut 
                        size={18} 
                        className="group-hover:translate-x-0.5 transition-transform" 
                      />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/auth" 
              className="hover:text-emerald-600 transition-colors"
            >
              Login / Signup
            </Link>
          )}
        </nav>

        {/* Mobile Navigation */}
        <div className="md:hidden relative" ref={mobileMenuRef}>
          {status === "loading" ? (
            <div className="text-slate-400 text-sm">Loading...</div>
          ) : status === "authenticated" && session ? (
            // Mobile: Show user name as button (hamburger-like)
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-md shadow-emerald-200/50"
            >
              <span className="text-sm">
                {session.user.name || session.user.email?.split("@")[0]}
              </span>
              {isMobileMenuOpen ? (
                <FiX size={18} />
              ) : (
                <FiChevronDown 
                  size={18} 
                  className={`transition-transform duration-200 ${isMobileMenuOpen ? 'rotate-180' : ''}`}
                />
              )}
            </button>
          ) : (
            // Mobile: Show green hamburger icon when not logged in
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <FiX size={24} />
              ) : (
                <FiMenu size={24} />
              )}
            </button>
          )}

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-xl bg-white shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                {/* Navigation Links */}
                <div className="space-y-1">
                  {status === "authenticated" && session?.user?.role === "admin" && (
                    <Link
                      href="/admin"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  
                  <Link
                    href="/papers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    Papers
                  </Link>

                  <Link
                    href="/contributions"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                  >
                    Contributions
                  </Link>

                  {status === "authenticated" && (
                    <Link
                      href="/upload"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors"
                    >
                      Upload
                    </Link>
                  )}
                </div>

                {/* User Info (if authenticated) */}
                {status === "authenticated" && session && (
                  <>
                    <div className="px-4 py-3 border-t border-slate-100 mt-2">
                      <p className="text-sm font-semibold text-slate-900">
                        {session.user.name || "User"}
                      </p>
                      <p className="text-xs text-slate-500 truncate">
                        {session.user.email}
                      </p>
                      {session.user.role === "admin" && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded-md bg-emerald-100 text-emerald-700">
                          Admin
                        </span>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg group mt-2"
                    >
                      <FiLogOut 
                        size={18} 
                        className="group-hover:translate-x-0.5 transition-transform" 
                      />
                      <span>Sign Out</span>
                    </button>
                  </>
                )}

                {/* Login Link (if not authenticated) */}
                {status !== "authenticated" && (
                  <Link
                    href="/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors mt-2 text-center"
                  >
                    Login / Signup
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

