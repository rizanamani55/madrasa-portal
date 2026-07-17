import { Metadata } from "next";
import { getAdminStats } from "@/actions/dashboard";
import { getAdminTrackerStats } from "@/actions/tracker";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  let stats;
  let trackerStats;
  console.log("Rendering Admin Dashboard Page");
  try {
    const [statsRes, trackerRes] = await Promise.all([
      getAdminStats(),
      getAdminTrackerStats()
    ]);
    stats = statsRes;
    trackerStats = trackerRes?.data;
  } catch (err) {
    console.error("Failed to load admin stats:", err);
    stats = {
      totalStudents: 0,
      activeStudents: 0,
      totalNotes: 0,
      totalPapers: 0,
      totalAnnouncements: 0,
      recentActivity: [],
      gradeData: [],
    };
    trackerStats = { completedToday: 0, pendingToday: 0, quranPagesToday: 0, avgCompletionRate: 0, topStudents: [] };
  }

  return <AdminDashboardClient stats={stats} trackerStats={trackerStats} />;
}
