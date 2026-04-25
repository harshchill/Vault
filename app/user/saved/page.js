import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { FiBookmark, FiExternalLink, FiTrash2 } from "react-icons/fi";
import { getSavedPapers, unsavePaperForUser } from "@/app/actions/userActions";

export default async function SavedPapersPage() {
  const session = await getServerSession();

  if (!session?.user?.email) {
    redirect("/user/auth");
  }

  async function handleUnsave(formData) {
    "use server";

    const paperId = formData.get("paperId");
    if (!paperId) return;

    await unsavePaperForUser(session.user.email, String(paperId));
    revalidatePath("/user/saved");
    revalidatePath("/user/papers");
    revalidatePath("/user/dashboard");
  }

  const { success, papers, error } = await getSavedPapers(session.user.email);

  if (!success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-red-500 font-medium">Error loading saved papers: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-14 space-y-8">
      <div className="space-y-2">
        <span className="pill">Your collection</span>
        <h1 className="text-3xl md:text-4xl font-semibold text-slate-900">Saved papers</h1>
        <p className="text-slate-600">Quick access to everything you bookmarked.</p>
      </div>

      {papers.length === 0 ? (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-12 text-center">
          <FiBookmark className="mx-auto text-slate-400 mb-4" size={40} />
          <p className="text-slate-700 text-lg font-medium mb-2">No saved papers yet</p>
          <p className="text-slate-500 text-sm mb-5">
            Save papers from the papers page and they will appear here.
          </p>
          <Link href="/user/papers" className="button button-primary inline-flex items-center gap-2">
            Browse papers
            <FiExternalLink size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {papers.map((paper) => (
            <div key={paper.id} className="card p-5 space-y-4 hover:border-emerald-200 transition">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 truncate" title={paper.subject}>
                    {paper.subject}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Semester {paper.semester}</p>
                  {paper.program ? (
                    <p className="text-xs text-slate-400 mt-0.5">{paper.program}</p>
                  ) : null}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    {paper.specialization ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {paper.specialization}
                      </span>
                    ) : null}
                    {paper.institute ? (
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {paper.institute}
                      </span>
                    ) : null}
                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100">
                      {paper.year}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href={`/user/papers/${paper.id}`}
                  className="button button-primary flex-1 justify-center inline-flex items-center gap-2"
                >
                  <span>Read paper</span>
                  <FiExternalLink size={16} />
                </Link>

                <form action={handleUnsave}>
                  <input type="hidden" name="paperId" value={paper.id} />
                  <button
                    type="submit"
                    className="h-10 w-10 rounded-lg border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors flex items-center justify-center"
                    aria-label="Remove from saved"
                    title="Remove from saved"
                  >
                    <FiTrash2 size={16} />
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
