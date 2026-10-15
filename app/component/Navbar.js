"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { FiLogOut, FiUser, FiChevronDown, FiMenu, FiX } from "react-icons/fi";
import Image from "next/image";

// Desktop nav links ka common style
const navLink = "text-[#586661] hover:text-[#0a9a69] transition-colors";

// Logged-in user ka green pill button
const userBtn =
  "flex items-center gap-2 rounded-full bg-[#0a9a69] text-white font-semibold shadow-[0_8px_20px_rgba(10,154,105,0.28)] transition-all hover:-translate-y-0.5 hover:bg-[#088459] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a9a69] focus-visible:ring-offset-2";

export default function Navbar() {
  const { data: session, status } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Scroll par navbar ko halka glass look do
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target)
      ) {
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
    <header
      className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${
        isScrolled
          ? "bg-white/70 backdrop-blur-xl border-[#dbe7e0] shadow-[0_4px_20px_rgba(10,154,105,0.06)]"
          : "bg-transparent border-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 font-semibold text-xl text-[#1d2d27]"
        >
          <Image
            src="/icon.png"
            alt="Vault"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="hidden sm:inline tracking-tight">Vault</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
          {/* Admin button - only show if user is admin */}
          {status === "authenticated" && session?.user?.role === "admin" && (
            <Link href="/admin" className={navLink}>
              Admin
            </Link>
          )}

          <Link href="/user/papers" className={navLink}>
            Papers
          </Link>

          <Link href="/user/contributions" className={navLink}>
            Contributions
          </Link>

          {status === "authenticated" && (
            <Link href="/user/upload" className={navLink}>
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
                className={`${userBtn} px-5 py-2.5`}
              >
                <span className="flex items-center gap-2">
                  <FiUser size={16} />
                  {session.user.name || session.user.email?.split("@")[0]}
                </span>
                <FiChevronDown
                  size={16}
                  className={`transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-xl shadow-emerald-900/5 border border-[#dbe7e0] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
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

                    {/* Feature Links */}
                    <Link
                      href="/user/dashboard"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/user/profile"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/user/saved"
                      className="block px-4 py-2 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] transition-colors"
                    >
                      Saved Papers
                    </Link>

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
              href="/user/auth"
              className="inline-flex items-center justify-center rounded-full border border-[#c9e9db] bg-white px-7 py-3 text-base font-semibold text-[#0a9a69] shadow-[0_6px_20px_rgba(10,154,105,0.12)] transition-all duration-300 hover:bg-[#0a9a69] hover:text-white hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(10,154,105,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0a9a69] focus-visible:ring-offset-2"
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
              className={`${userBtn} px-4 py-2`}
            >
              <span className="text-sm">
                {session.user.name || session.user.email?.split("@")[0]}
              </span>
              {isMobileMenuOpen ? (
                <FiX size={18} />
              ) : (
                <FiChevronDown
                  size={18}
                  className={`transition-transform duration-200 ${isMobileMenuOpen ? "rotate-180" : ""}`}
                />
              )}
            </button>
          ) : (
            // Mobile: Show green hamburger icon when not logged in
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full text-[#0a9a69] bg-white/70 border border-[#dbe7e0] hover:bg-white transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          )}

          {/* Mobile Menu Dropdown */}
          {isMobileMenuOpen && (
            <div className="absolute right-0 mt-3 w-64 rounded-2xl bg-white shadow-xl shadow-emerald-900/5 border border-[#dbe7e0] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="p-2">
                {status === "authenticated" && session && (
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
                )}

                {/* Navigation Links */}
                <div className="mt-2 space-y-1">
                  {status === "authenticated" &&
                    session?.user?.role === "admin" && (
                      <Link
                        href="/admin"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] rounded-lg transition-colors"
                      >
                        Admin
                      </Link>
                    )}

                  <Link
                    href="/user/papers"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] rounded-lg transition-colors"
                  >
                    Papers
                  </Link>

                  <Link
                    href="/user/contributions"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] rounded-lg transition-colors"
                  >
                    Contributions
                  </Link>

                  {status === "authenticated" && (
                    <Link
                      href="/user/upload"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] rounded-lg transition-colors"
                    >
                      Upload
                    </Link>
                  )}
                </div>

                {status === "authenticated" && session && (
                  <>
                    <Link
                      href="/user/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="mt-2 block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] rounded-lg transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/user/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] rounded-lg transition-colors"
                    >
                      Profile
                    </Link>
                    <Link
                      href="/user/saved"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block px-4 py-3 text-sm font-medium text-slate-700 hover:bg-[#eaf7f1] hover:text-[#0a9a69] rounded-lg transition-colors"
                    >
                      Saved Papers
                    </Link>

                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handleSignOut();
                      }}
                      className="mt-2 w-full flex items-center gap-3 px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 transition-colors rounded-lg group"
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
                    href="/user/auth"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 text-sm font-semibold text-[#0a9a69] hover:bg-[#eaf7f1] rounded-lg transition-colors mt-2 text-center"
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
