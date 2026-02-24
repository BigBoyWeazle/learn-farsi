import { auth } from "@/auth";
import { redirect } from "next/navigation";
import AdminSeedClient from "./seed-client";

export default async function AdminSeedPage() {
  const session = await auth();

  if (!session?.user?.email || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect("/dashboard");
  }

  return <AdminSeedClient />;
}
