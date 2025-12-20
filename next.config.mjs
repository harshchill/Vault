// next.config.mjs
import withPWAInit from "@ducanh2912/next-pwa";
import path from "path";
import CopyPlugin from "copy-webpack-plugin";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 1. Configure PWA (workboxOptions goes HERE)
const withPWA = withPWAInit({
  dest: "public",
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  reloadOnOnline: true,
  swcMinify: true,
  disable: process.env.NODE_ENV === "development",
  // MOVED: This belongs here, not in nextConfig
  workboxOptions: {
    disableDevLogs: true,
    runtimeCaching: [
      {
        // Cache Supabase PDFs for offline reading
        urlPattern: /^https:\/\/.*supabase\.co\/.*\.pdf$/,
        handler: "CacheFirst",
        options: {
          cacheName: "vault-papers-cache",
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
          },
        },
      },
    ],
  },
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // 2. Configure Webpack for PDF Worker
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    // Find the worker file in the specific version we just installed
    const pdfWorkerPath = path.join(
      __dirname,
      "node_modules/pdfjs-dist/build/pdf.worker.min.js"
    );

    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: pdfWorkerPath,
            to: path.join(__dirname, "public", "pdf.worker.min.js"),
          },
        ],
      })
    );

    return config;
  },
  
  // 3. Images Config
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
};

export default withPWA(nextConfig);