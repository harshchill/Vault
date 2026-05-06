"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import {
  FiBookmark,
  FiUser,
  FiLogOut,
  FiShield,
} from "react-icons/fi";

export default function MenuClient({ user }) {
  return (
    <div className="min-h-[85vh] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">
        <div className="card border border-slate-200 bg-white/70 p-6 shadow-2xl shadow-emerald-500/10 backdrop-blur-2xl sm:p-8">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-2 border-white bg-slate-100 shadow-lg">
              <Image
                src={user.image || "/default-avatar.png"}
                alt={user.name || "Profile"}
                width={80}
                height={80}
                loader={({ src }) => src}
                unoptimized
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{user.name || "Your Account"}</h1>
              <p className="text-sm text-slate-500">{user.email}</p>
              {user.role === "admin" ? (
                <span className="mt-2 inline-flex rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
                  Admin
                </span>
              ) : null}
            </div>
          </div>

          <div className="mt-8 space-y-2">
            <MenuLink
              href="/user/saved"
              icon={<FiBookmark size={18} />}
              label="Saved Papers"
            />
            <MenuLink
              href="/user/profile"
              icon={<FiUser size={18} />}
              label="Profile"
            />
            {user.role === "admin" ? (
              <MenuLink
                href="/admin"
                icon={<FiShield size={18} />}
                label="Admin"
              />
            ) : null}
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-3 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-left text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-100"
            >
              <FiLogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function MenuLink({ href, icon, label }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:text-emerald-600"
    >
      <span className="text-emerald-500">{icon}</span>
      {label}
    </Link>
  );
}
