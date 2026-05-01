import AdminNav from "./AdminNav";

export const metadata = {
  title: "Admin Dashboard | Vault",
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
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row pb-20 md:pb-0">
      <AdminNav />
      <main className="flex-1 w-full overflow-x-hidden md:h-screen md:overflow-y-auto">
        <div className="max-w-7xl mx-auto p-4 md:p-8 pt-6 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  );
}
