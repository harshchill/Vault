import { isValidObjectId } from "mongoose";
import connectDB from "@/db/connectDb";
import Paper from "@/models/paper";

const baseUrl = "https://paper-vault.app";

const fallbackMetadata = {
  title: "Paper Viewer",
  description: "View an exam paper in Vault's paper reader.",
  alternates: {
    canonical: "/user/papers",
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
    title: "Paper Viewer | Vault",
    description: "Explore semester exam papers in Vault.",
    images: ["/opengraph-image"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Paper Viewer | Vault",
    description: "Explore semester exam papers in Vault.",
    images: ["/twitter-image"],
  },
};

export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  const paperId = resolvedParams?.id;

  if (!paperId || !isValidObjectId(paperId)) {
    return fallbackMetadata;
  }

  try {
    await connectDB();

    const paper = await Paper.findOne({ _id: paperId, status: "approved" })
      .select("subject semester year program specialization institute")
      .lean();

    if (!paper) {
      return fallbackMetadata;
    }

    const subject = paper.subject || "Exam";
    const semester = paper.semester ? `Semester ${paper.semester}` : "Semester paper";
    const year = paper.year ? String(paper.year) : "Past year";
    const institute = paper.institute ? ` | ${paper.institute}` : "";
    const program = paper.program ? ` for ${paper.program}` : "";
    const specialization = paper.specialization ? ` (${paper.specialization})` : "";
    const title = `${subject} ${semester} ${year}${institute}${specialization}`;
    const description = `Review ${subject} ${semester} ${year}${program}${specialization}${paper.institute ? ` from ${paper.institute}` : ""} on Vault.`;
    const canonicalPath = `/user/papers/${paperId}`;

    return {
      title,
      description,
      alternates: {
        canonical: canonicalPath,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large",
        },
      },
      openGraph: {
        title: `${title} | Vault`,
        description,
        url: `${baseUrl}${canonicalPath}`,
        images: ["/opengraph-image"],
      },
      twitter: {
        card: "summary_large_image",
        title: `${title} | Vault`,
        description,
        images: ["/twitter-image"],
      },
    };
  } catch {
    return fallbackMetadata;
  }
}

export default function PaperViewerLayout({ children }) {
  return children;
}
