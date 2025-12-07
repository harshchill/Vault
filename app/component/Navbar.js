"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-surface/80 border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-lg"
        >
          <span className="h-10 w-10 rounded-xl bg-emerald-600 text-white grid place-items-center shadow-sm shadow-emerald-200">
            V
          </span>
          <span>Vault</span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          {/* Admin button - only show if user is admin */}
          {status === "authenticated" && session?.user?.role === "admin" && (
            <Link href="/admin" className="hover:text-emerald-600">
              Admin
            </Link>
          )}
          
          <Link href="/papers" className="hover:text-emerald-600">
            Papers
          </Link>
          
          {/* Conditional rendering based on session */}
          {status === "loading" ? (
            <div className="text-slate-400">Loading...</div>
          ) : status === "authenticated" && session ? (
            <div className="flex items-center gap-2">
              <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold shadow-md shadow-emerald-200/50 transform transition-all hover:scale-105">
                Welcome! {session.user.name || session.user.email?.split("@")[0]}
              </span>
            </div>
          ) : (
            <Link href="/auth" className="hover:text-emerald-600">
              Login / Signup
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

