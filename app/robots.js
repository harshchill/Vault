const baseUrl = "https://paper-vault.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/terms", "/privacy", "/user/papers", "/user/contributions"],
        disallow: [
          "/admin",
          "/api",
          "/user/auth",
          "/user/dashboard",
          "/user/profile",
          "/user/saved",
          "/user/upload",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
