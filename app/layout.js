import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "./providers/SessionProvider";
import { Analytics } from '@vercel/analytics/next';
import Navbar from "./component/Navbar";

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
          <SessionProvider>
            <Navbar />
            <main>
              {children}
              <Analytics />
            </main>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
