"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { FiLoader, FiLock, FiLogIn } from "react-icons/fi";
import { getPaperPdfUrl } from "@/app/actions/userActions";
import PdfViewer from "./pdfViewer";

export default function PaperViewerGate({ paperId, paperTitle }) {
  const { data: session, status } = useSession();
  const [pdfUrl, setPdfUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loadingPdf, setLoadingPdf] = useState(false);

  const callbackUrl = useMemo(() => `/user/papers/${paperId}`, [paperId]);

  useEffect(() => {
    let active = true;

    const unlockPaper = async () => {
      if (status !== "authenticated" || !session?.user || !paperId) {
        setPdfUrl(null);
        setError(null);
        setLoadingPdf(false);
        return;
      }

      setLoadingPdf(true);
      setError(null);

      const result = await getPaperPdfUrl(paperId);

      if (!active) {
        return;
      }

      if (result?.success && result.url) {
        setPdfUrl(result.url);
      } else {
        setPdfUrl(null);
        setError(result?.error || "Failed to unlock this paper.");
      }

      setLoadingPdf(false);
    };

    unlockPaper();

    return () => {
      active = false;
    };
  }, [paperId, session, status]);

  if (status === "authenticated") {
    if (loadingPdf) {
      return (
        <div className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
          <div className="flex min-h-[70vh] items-center justify-center bg-gray-100 p-8">
            <div className="flex flex-col items-center gap-4 text-center">
              <FiLoader className="animate-spin text-emerald-600" size={30} />
              <p className="font-medium text-slate-700">Unlocking your paper...</p>
            </div>
          </div>
        </div>
      );
    }

    if (pdfUrl) {
      return (
        <div className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
          <PdfViewer url={pdfUrl} />
        </div>
      );
    }

    return (
      <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-red-50 p-8 text-center">
        <p className="mb-2 text-lg font-medium text-red-800">
          {error || "Unable to load this paper right now."}
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden rounded-lg bg-white shadow-lg">
      <div className="relative min-h-[70vh] bg-gray-100 p-4 sm:p-6 md:p-8">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="flex h-full flex-col items-center gap-4 overflow-hidden px-4 py-8">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-[320px] w-full max-w-[800px] rounded-xl border border-slate-200 bg-white opacity-80 shadow-sm blur-[6px]"
              />
            ))}
          </div>
        </div>

        <div className="absolute inset-0 bg-white/40 backdrop-blur-md" />

        <div className="relative z-10 flex min-h-[70vh] items-center justify-center">
          <div className="max-w-lg rounded-3xl border border-emerald-100 bg-white/92 p-8 text-center shadow-2xl shadow-emerald-100/50">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <FiLock size={28} />
            </div>

            <h2 className="text-2xl font-semibold text-slate-900">
              Login to view the full paper
            </h2>

            <p className="mt-3 text-slate-600">
              The paper details stay public for search engines and students, but the PDF viewer unlocks only after login.
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {paperTitle
                ? `Continue to open "${paperTitle}" in the viewer.`
                : "Continue to open this paper in the viewer."}
            </p>

            <div className="mt-6 flex justify-center">
              <Link
                href={`/user/auth?callbackUrl=${encodeURIComponent(callbackUrl)}`}
                className="button button-primary"
              >
                <FiLogIn size={18} />
                Login to Continue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
