export const metadata = {
  title: "Sign In",
  description:
    "Sign in to Vault to save papers, upload contributions, and access your personal dashboard.",
  alternates: {
    canonical: "/user/auth",
  },
  openGraph: {
    title: "Sign In | Vault",
    description:
      "Access your Vault account to continue building your exam prep library.",
    url: "https://paper-vault.app/user/auth",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sign In | Vault",
    description: "Authenticate to access your Vault dashboard and saved papers.",
    images: ["/twitter-image"],
  },
};

export default function UserAuthLayout({ children }) {
  return children;
}
