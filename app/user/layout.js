export const metadata = {
  title: "User Area",
  description:
    "Your personal Vault workspace for saved papers, uploads, and profile management.",
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

export default function UserLayout({ children }) {
  return children;
}
