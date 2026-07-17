import { Metadata } from "next";
import { getMyTracker } from "@/actions/tracker";
import { auth } from "@/lib/auth/config";
import TrackerTable from "@/components/tracker/TrackerTable";
import { redirect } from "next/navigation";

export const metadata: Metadata = { title: "Prayer & Quran Tracker" };

export default async function StudentTrackerPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const res = await getMyTracker(month, year);
  const data = res.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">Prayer & Quran Tracker</h1>
          <p className="text-zinc-500 text-sm mt-1">
            Track your daily prayers and Quran reading progress.
          </p>
        </div>
      </div>

      <TrackerTable 
        initialData={data}
        month={month}
        year={year}
        studentName={session.user.name || "Student"}
        admissionNumber={session.user.admissionNumber || ""}
        grade={session.user.grade || ""}
        readonly={false}
      />
    </div>
  );
}
