export const metadata = {
  title: "Contributor Leaderboard",
  description:
    "See top student contributors who keep Vault's exam paper archive growing.",
  alternates: {
    canonical: "/user/contributions",
  },
  openGraph: {
    title: "Contributor Leaderboard | Vault",
    description:
      "Recognizing the contributors expanding Vault's academic paper library.",
    url: "https://paper-vault.app/user/contributions",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contributor Leaderboard | Vault",
    description: "Explore top contributors in the Vault community.",
    images: ["/twitter-image"],
  },
};

export default function ContributionsLayout({ children }) {
  return children;
}
