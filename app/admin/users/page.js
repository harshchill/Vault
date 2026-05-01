import { getAllUsers } from "@/app/actions/adminActions";
import UsersClient from "./UsersClient";
import { getServerSession } from "next-auth";
import { authoptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Manage Users | Admin Dashboard",
};

export default async function UsersPage() {
  const session = await getServerSession(authoptions);
  if (!session || session.user.role !== "admin") {
    redirect("/");
  }

  const initialData = await getAllUsers("", 1, 10);

  return <UsersClient initialData={initialData} />;
}
