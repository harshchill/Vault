import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import SessionProvider from "./providers/SessionProvider";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Navbar from "./component/Navbar";
import Footer from "./component/Footer";

const baseUrl = "https://paper-vault.app";

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vault",
    url: baseUrl,
    logo: `${baseUrl}/icon-192x192.png`,
    sameAs: [baseUrl],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Vault",
    url: baseUrl,
    inLanguage: "en",
    potentialAction: {
      "@type": "SearchAction",
      target: `${baseUrl}/user/papers?subject={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  },
];

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
  metadataBase: new URL(baseUrl),
  title: {
    default: "Vault | Exam Paper Hub",
    template: "%s | Vault",
  },
  description:
    "Vault helps students discover, organize, and share past semester exam papers in one clean, fast academic library.",
  keywords: [
    "exam papers",
    "past papers",
    "university exams",
    "study materials",
    "question papers",
    "semester papers",
    "past sem papers",
    "sem papers",
    "AKS University previous semester papers",
    "AKS University exam sem papers",
  ],
  applicationName: "Vault",
  creator: "Vault",
  publisher: "Vault",
  category: "education",
  manifest: "/manifest.json",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/icon-192x192.png", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Vault",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: baseUrl,
    siteName: "Vault",
    title: "Vault | Exam Paper Hub",
    description:
      "Find previous year and semester papers faster with Vault's organized academic archive.",
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Vault - Exam Paper Hub",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vault | Exam Paper Hub",
    description:
      "Discover and manage past semester papers in Vault's clean, student-first archive.",
    images: ["/twitter-image"],
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
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
            />
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
