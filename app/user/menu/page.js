import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import MenuClient from "./MenuClient";

export const metadata = {
  title: "Account",
  description:
    "Quick access to your saved papers, profile, and account actions.",
  alternates: {
    canonical: "/user/menu",
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
};

export default async function MenuPage() {
  const session = await getServerSession();
  if (!session?.user) {
    redirect("/user/auth");
  }

  return <MenuClient user={session.user} />;
}
