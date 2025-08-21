import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Enforce admin role via Clerk metadata
  const role =
    (user.publicMetadata as any)?.role || (user.privateMetadata as any)?.role;
  const isAdmin = role === "admin";
  if (!isAdmin) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
