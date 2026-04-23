const baseUrl = "https://paper-vault.app";

export default function sitemap() {
  return [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
