"use client";

import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import UserMobileDock from "@/app/component/UserMobileDock";

export default function UserLayoutShell({ children }) {
  const pathname = usePathname();
  const { status } = useSession();
  const hideDock = pathname?.startsWith("/user/auth");
  const showDock = !hideDock && status === "authenticated";

  return (
    <div className={showDock ? "pb-24 md:pb-0" : undefined}>
      {children}
      {showDock ? <UserMobileDock /> : null}
    </div>
  );
}
