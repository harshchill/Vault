import Link from "next/link";
import { isValidObjectId } from "mongoose";
import { notFound } from "next/navigation";
import {
  FiArrowLeft,
  FiBook,
  FiCalendar,
  FiFileText,
} from "react-icons/fi";
import connectDB from "@/db/connectDb";
import Paper from "@/models/paper";
import PaperViewerGate from "@/app/component/PaperViewerGate";

const baseUrl = "https://paper-vault.app";

async function getPaperById(paperId) {
  if (!paperId || !isValidObjectId(paperId)) {
    return null;
  }

  await connectDB();

  const paper = await Paper.findOne({ _id: paperId, status: "approved" })
    .select("subject institute program specialization semester year uploadedAt")
    .lean();

  if (!paper) {
    return null;
  }

  return {
    id: paper._id.toString(),
    subject: paper.subject,
    institute: paper.institute,
    program: paper.program,
    specialization: paper.specialization,
    semester: paper.semester,
    year: paper.year,
    uploadedAt: paper.uploadedAt,
  };
}

function buildStructuredData(paper) {
  const name = [
    paper.subject,
    paper.institute,
    paper.program,
    paper.specialization,
    paper.semester ? `Semester ${paper.semester}` : null,
    paper.year ? String(paper.year) : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name,
    description: `${paper.subject} paper for ${paper.institute || "students"}, ${paper.program || "academic program"}, Semester ${paper.semester}, ${paper.year}.`,
    provider: {
      "@type": "Organization",
      name: "Vault",
      url: baseUrl,
    },
    educationalLevel: paper.program,
    about: [paper.subject, paper.specialization, paper.institute].filter(Boolean),
    datePublished: paper.uploadedAt,
    url: `${baseUrl}/user/papers/${paper.id}`,
    isAccessibleForFree: false,
  };
}

function DetailChip({ children, tone = "slate" }) {
  const tones = {
    emerald: "bg-emerald-50 text-emerald-700",
    teal: "bg-teal-50 text-teal-700",
    slate: "bg-slate-100 text-slate-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-sm font-medium ${tones[tone]}`}>
      {children}
    </span>
  );
}

export default async function PaperViewPage({ params }) {
  const resolvedParams = await params;
  const paper = await getPaperById(resolvedParams?.id);

  if (!paper) {
    notFound();
  }

  const structuredData = buildStructuredData(paper);

  return (
    <div className="min-h-screen bg-gray-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-5">
          <Link
            href="/user/papers"
            className="mb-5 inline-flex items-center gap-2 text-slate-600 transition-colors hover:text-slate-900"
          >
            <FiArrowLeft size={20} />
            <span className="font-medium">Back to Papers</span>
          </Link>

          <div className="space-y-4">
            <div className="space-y-2">
              <span className="pill">Public paper page</span>
              <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
                {paper.subject}
              </h1>
              <p className="max-w-3xl text-slate-600">
                Browse the paper details before signing in. The PDF viewer unlocks after login.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 text-slate-700">
                <FiFileText className="text-emerald-600" size={18} />
                <span className="font-medium">{paper.subject}</span>
              </div>

              {paper.institute ? (
                <div className="flex items-center gap-2 text-slate-700">
                  <FiBook className="text-emerald-600" size={18} />
                  <span>{paper.institute}</span>
                </div>
              ) : null}

              <div className="flex items-center gap-2 text-slate-700">
                <FiCalendar className="text-emerald-600" size={18} />
                <span>{paper.year}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <DetailChip tone="slate">Semester {paper.semester}</DetailChip>
              {paper.program ? <DetailChip tone="teal">{paper.program}</DetailChip> : null}
              {paper.specialization ? (
                <DetailChip tone="emerald">{paper.specialization}</DetailChip>
              ) : null}
              {paper.institute ? <DetailChip>{paper.institute}</DetailChip> : null}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Institute
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {paper.institute || "Not specified"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Program
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {paper.program || "Not specified"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Specialization
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {paper.specialization || "Not specified"}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Session
                </p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  Semester {paper.semester} • {paper.year}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6">
        <PaperViewerGate paperId={paper.id} paperTitle={paper.subject} />
      </div>
    </div>
  );
}
