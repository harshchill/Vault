export const metadata = {
  title: "Paper Viewer",
  description: "View an exam paper securely in Vault's paper reader.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  alternates: {
    canonical: "/user/papers",
  },
  openGraph: {
    title: "Paper Viewer | Vault",
    description: "Securely view unlocked exam papers inside Vault.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paper Viewer | Vault",
    description: "Secure paper reading experience in Vault.",
    images: ["/twitter-image"],
  },
};

export default function PaperViewerLayout({ children }) {
  return children;
}
