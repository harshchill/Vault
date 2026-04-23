import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { getUserProfile } from "@/app/actions/userActions";
import ProfileForm from "./ProfileForm";

export const metadata = {
  title: "Profile | StudyVault",
  description: "Manage your StudyVault profile. Update your university, program, specialization, and other personal information.",
};

export default async function ProfilePage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/user/auth");
  }

  const { success, user, error } = await getUserProfile(session.user.email);

  if (!success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-red-500 font-medium">Error loading profile: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-[85vh] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Your Identity</h1>
          <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">Update your academic details to personalize your experience on Vault.</p>
        </div>

        <ProfileForm user={user} />
      </div>
    </div>
  );
}
