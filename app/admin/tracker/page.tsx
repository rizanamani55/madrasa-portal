import { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import AdminTrackerClient from "@/components/admin/tracker/AdminTrackerClient";

export const metadata: Metadata = { title: "Admin - Prayer Tracker" };

export default async function AdminTrackerPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Prayer & Quran Tracker Management</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Review, edit, and lock students' daily trackers.
          </p>
        </div>
      </div>

      <AdminTrackerClient />
    </div>
  );
}
