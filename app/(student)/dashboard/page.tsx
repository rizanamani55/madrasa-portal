import { auth } from "@/lib/auth/config";
import { getMyProfile } from "@/actions/student";
import { getPublicAnnouncements } from "@/actions/announcements";
import { getMyMarks } from "@/actions/marks";

import { Metadata } from "next";
import { calcPercentage } from "@/lib/utils";
import DashboardClient from "@/components/student/DashboardClient";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await auth();

  const [profileRes, announcementsRes, marksRes] = await Promise.all([
    getMyProfile(),
    getPublicAnnouncements(),
    getMyMarks(),
  ]);

  const student = profileRes.data;
  const announcements = announcementsRes.data ?? [];
  const marks = marksRes.data ?? [];

  // Calculate overall performance
  const totalObtained = marks.reduce((s, m) => {
    return s + (m.unitTest || 0) + (m.midterm || 0) + (m.finalExam || 0);
  }, 0);
  const totalMax = marks.reduce((s, m) => {
    return s + (m.unitTest !== null && m.unitTest !== undefined ? 100 : 0)
             + (m.midterm !== null && m.midterm !== undefined ? 100 : 0)
             + (m.finalExam !== null && m.finalExam !== undefined ? 100 : 0);
  }, 0);
  const overallPct = totalMax > 0 ? calcPercentage(totalObtained, totalMax) : null;

  return (
    <DashboardClient
      student={student}
      announcements={announcements}
      recentMarks={marks.slice(0, 5)}
      session={session}
    />
  );
}
