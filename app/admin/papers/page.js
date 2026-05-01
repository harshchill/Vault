import { getAllPapers } from "@/app/actions/adminActions";
import PapersClient from "./PapersClient";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Papers | Admin Dashboard",
};

export default async function PapersPage() {
  const session = await getServerSession(authoptions);
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const initialData = await getAllPapers("", 1, 10);

  return <PapersClient initialData={initialData} />;
}
