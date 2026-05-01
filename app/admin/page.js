import { getAdminStats } from "@/app/actions/adminActions";
import DashboardClient from "./DashboardClient";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminDashboard() {
  const session = await getServerSession(authoptions);
  
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const initialData = await getAdminStats();

  return <DashboardClient initialData={initialData} />;
}
