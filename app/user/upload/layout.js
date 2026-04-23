export const metadata = {
  title: "Upload Papers",
  description:
    "Upload and contribute exam papers to help expand the Vault community archive.",
  alternates: {
    canonical: "/user/upload",
  },
  openGraph: {
    title: "Upload Papers | Vault",
    description: "Contribute exam papers and support the student community.",
    url: "https://paper-vault.app/user/upload",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Upload Papers | Vault",
    description: "Contribute papers to the Vault community archive.",
    images: ["/twitter-image"],
  },
};

export default function UploadLayout({ children }) {
  return children;
}
