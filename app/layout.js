import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SessionProvider from "./providers/SessionProvider";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata = {
  title: "StudyVault | Exam Paper Hub",
  description: "StudyVault is the ultimate hub for students to access and share past semester exam papers. Browse, unlock, and download from the largest collection of university papers.",
  keywords: "exam papers, past papers, university exams, study materials",
  manifest: "/manifest.json", 
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vault",
  },
  openGraph: {
    type: "website",
    url: "https://studyvault.com",
    title: "StudyVault | Exam Paper Hub",
    description: "Access past semester exam papers from universities worldwide.",
  },
};

export const viewport = {
  themeColor: "#059669",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased`}
      >
        <div className="min-h-screen bg-surface text-slate-900">
          <SessionProvider>
            <Navbar />
            <main>
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            <Footer />
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}
