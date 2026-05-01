import { getApprovedPapersForMatching, getPendingPapers } from "@/app/actions/adminActions";
import ApprovalsClient from "./ApprovalsClient";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Approve Papers | Admin Dashboard",
};

export default async function ApprovalsPage() {
  const session = await getServerSession(authoptions);
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const pendingPapers = await getPendingPapers();
  const approvedPapers = await getApprovedPapersForMatching();

  return (
    <ApprovalsClient
      initialPapers={pendingPapers}
      approvedPapers={approvedPapers}
    />
  );
}
