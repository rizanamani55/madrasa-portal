import { Metadata } from "next";
import { getAdminStats } from "@/actions/dashboard";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";

export const metadata: Metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  let stats;
  console.log("Rendering Admin Dashboard Page");
  try {
    stats = await getAdminStats();
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
  }

  return <AdminDashboardClient stats={stats} />;
}
