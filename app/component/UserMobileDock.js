"use client";

import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome,
  FiSearch,
  FiUpload,
  FiAward,
  FiUser,
} from "react-icons/fi";

const navItems = [
  {
    href: "/user/dashboard",
    label: "Home",
    icon: FiHome,
  },
  {
    href: "/user/papers",
    label: "Search",
    icon: FiSearch,
  },
  {
    href: "/user/upload",
    label: "Upload",
    icon: FiUpload,
    primary: true,
  },
  {
    href: "/user/contributions",
    label: "Contribute",
    icon: FiAward,
  },
  {
    href: "/user/menu",
    label: "Profile",
    icon: FiUser,
  },
];

const isActivePath = (pathname, href) => {
  if (!pathname) return false;
  if (pathname === href) return true;
  return pathname.startsWith(`${href}/`);
};

export default function UserMobileDock() {
  const pathname = usePathname();
  const isAuthRoute = pathname?.startsWith("/user/auth");

  if (typeof document === "undefined" || isAuthRoute) {
    return null;
  }

  return createPortal(
    <nav
      aria-label="Mobile navigation"
      className="md:hidden fixed left-3 right-3 bottom-3 z-50 rounded-3xl border border-slate-200 bg-white/95 backdrop-blur-xl shadow-xl shadow-slate-900/10 animate-in fade-in slide-in-from-bottom-4 duration-300"
    >
      <div className="grid grid-cols-5 items-end px-2 pb-2 pt-3">
        {navItems.map(({ href, label, icon: Icon, primary }) => {
          const isActive = isActivePath(pathname, href);

          if (primary) {
            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className="flex flex-col items-center gap-1 text-[11px] font-semibold text-slate-600"
              >
                <span
                  className={`-mt-7 flex h-14 w-14 items-center justify-center rounded-2xl shadow-lg transition-transform ${
                    isActive
                      ? "bg-linear-to-br from-emerald-500 to-teal-500 text-white"
                      : "bg-linear-to-br from-teal-500 to-emerald-400 text-white"
                  }`}
                >
                  <Icon size={22} />
                </span>
                <span className="text-teal-700">{label}</span>
              </Link>
            );
          }

          return (
            <Link
              key={href}
              href={href}
              aria-current={isActive ? "page" : undefined}
              className={`flex min-h-14 flex-col items-center justify-center gap-1 text-[11px] font-semibold transition-colors ${
                isActive
                  ? "text-teal-600"
                  : "text-slate-500 hover:text-teal-600"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>,
    document.body
  );
}
