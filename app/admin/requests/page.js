import { getOpenRequests, getRequestsForMatching } from "@/app/actions/adminActions";
import RequestsClient from "./RequestsClient";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Request Papers | Admin Dashboard",
};

export default async function RequestsPage() {
  const session = await getServerSession(authoptions);
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const openRequests = await getOpenRequests();
  const matchingRequests = await getRequestsForMatching();

  return (
    <RequestsClient
      initialRequests={openRequests}
      matchingRequests={matchingRequests}
    />
  );
}
