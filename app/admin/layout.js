export const metadata = {
  title: "Admin Dashboard",
  description:
    "Admin panel for Vault moderators to review paper submissions and manage quality.",
  alternates: {
    canonical: "/admin",
  },
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
  openGraph: {
    title: "Admin Dashboard | Vault",
    description:
      "Private administration area for reviewing and publishing exam papers.",
    url: "https://paper-vault.app/admin",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Admin Dashboard | Vault",
    description: "Private Vault administration workspace.",
    images: ["/twitter-image"],
  },
};

export default function AdminLayout({ children }) {
  return children;
}
