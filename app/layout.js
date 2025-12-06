import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import SessionProvider from "./providers/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "StudyVault | Exam Paper Hub",
  description: "Minimal hub for students to browse past semester papers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen bg-surface text-slate-900">
          <header className="sticky top-0 z-20 backdrop-blur bg-surface/80 border-b border-slate-200">
            <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2 font-semibold text-lg"
              >
                <span className="h-10 w-10 rounded-xl bg-emerald-600 text-white grid place-items-center shadow-sm shadow-emerald-200">
                  SV
                </span>
                <span>StudyVault</span>
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
              <Link href="/admin" className="hover:text-emerald-600">
                  Admin
                </Link>
                <Link href="/papers" className="hover:text-emerald-600">
                  Papers
                </Link>
                <Link href="/auth" className="hover:text-emerald-600">
                  Login / Signup
                </Link>
              </nav>
            </div>
          </header>
          <main>
            <SessionProvider>{children}</SessionProvider>
          </main>
        </div>
      </body>
    </html>
  );
}
