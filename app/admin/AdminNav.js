"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, CheckCircle, ArrowLeft, Menu, X } from "lucide-react";
import { useState } from "react";

export default function AdminNav() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "Overview", href: "/admin", icon: LayoutDashboard },
    { name: "Users", href: "/admin/users", icon: Users },
    { name: "Papers", href: "/admin/papers", icon: FileText },
    { name: "Approvals", href: "/admin/approvals", icon: CheckCircle },
  ];

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <>
      {/* Mobile Top Navbar */}
      <div className="md:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">
          Vault <span className="text-[#00baa4]">Admin</span>
        </h2>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 text-gray-600 hover:text-gray-900 bg-gray-50 rounded-lg transition-colors"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Full-Screen Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-white pt-20 px-4 pb-6 overflow-y-auto animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className={`flex items-center gap-4 px-5 py-4 rounded-xl transition-all duration-200 font-semibold text-lg ${
                    isActive
                      ? "bg-[#00baa4]/10 text-[#00baa4]"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <Icon size={24} className={isActive ? "text-[#00baa4]" : "text-gray-400"} />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-6 mt-6 border-t border-gray-100">
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-4 px-5 py-4 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-semibold text-lg"
              >
                <ArrowLeft size={24} className="text-gray-400" />
                Back to Site
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 h-screen">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Vault <span className="text-[#00baa4]">Admin</span></h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  isActive
                    ? "bg-[#00baa4]/10 text-[#00baa4] shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} className={isActive ? "text-[#00baa4]" : "text-gray-400"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-100">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-colors font-medium"
          >
            <ArrowLeft size={20} />
            Back to Site
          </Link>
        </div>
      </aside>
    </>
  );
}
