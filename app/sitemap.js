import connectDB from "@/db/connectDb";
import Paper from "@/models/paper";

const baseUrl = "https://paper-vault.app";

export const revalidate = 3600;

const staticRoutes = [
  { path: "/", changeFrequency: "daily", priority: 1 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.5 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.5 },
  { path: "/user/papers", changeFrequency: "daily", priority: 0.9 },
  { path: "/user/contributions", changeFrequency: "weekly", priority: 0.7 },
];

const toAbsoluteUrl = (path) => `${baseUrl}${path}`;

const getStaticEntries = () => {
  const now = new Date();

  return staticRoutes.map((route) => ({
    url: toAbsoluteUrl(route.path),
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
};

const getPaperEntries = async () => {
  await connectDB();

  const papers = await Paper.find({ status: "approved" })
    .select("_id uploadedAt")
    .sort({ uploadedAt: -1 })
    .lean();

  return papers.map((paper) => ({
    url: toAbsoluteUrl(`/user/papers/${paper._id}`),
    lastModified: paper.uploadedAt ? new Date(paper.uploadedAt) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }));
};

export default async function sitemap() {
  const entries = getStaticEntries();

  try {
    const paperEntries = await getPaperEntries();
    return [...entries, ...paperEntries];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap entries:", error);
    return entries;
  }
}
