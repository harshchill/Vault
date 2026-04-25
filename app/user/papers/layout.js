export const metadata = {
  title: "Paper Library",
  description:
    "Browse Vault's exam paper collection with filters for semester, year, program, and specialization.",
  alternates: {
    canonical: "/user/papers",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  openGraph: {
    title: "Paper Library | Vault",
    description:
      "Use smart filters and search to quickly find the papers you need.",
    url: "https://paper-vault.app/user/papers",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paper Library | Vault",
    description: "Find previous semester papers quickly in Vault.",
    images: ["/twitter-image"],
  },
};

export default function PapersLayout({ children }) {
  return children;
}
