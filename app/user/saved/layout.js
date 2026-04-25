export const metadata = {
  title: "Saved Papers",
  description: "View and manage your saved papers in Vault.",
  alternates: {
    canonical: "/user/saved",
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
};

export default function SavedLayout({ children }) {
  return children;
}
