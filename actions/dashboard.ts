"use server";

import { supabase } from "@/lib/supabase/client";
import { GRADES } from "@/lib/constants/grades";

export async function getAdminStats() {
  try {
    const [
      { data: allStudents },
      { count: activeStudents },
      { count: totalNotes },
      { count: totalPapers },
      { count: totalAnnouncements },
      { data: recentActivity },
    ] = await Promise.all([
      supabase.from("students").select("grade, status"),
      supabase.from("students").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("notes").select("*", { count: "exact", head: true }),
      supabase.from("question_papers").select("*", { count: "exact", head: true }),
      supabase.from("announcements").select("*", { count: "exact", head: true }),
      supabase.from("audit_logs").select("*").order("timestamp", { ascending: false }).limit(10),
    ]);

    // Compute student distribution by grade
    const gradeData = GRADES.map((grade) => {
      const count = allStudents?.filter((s) => s.grade === grade && s.status === "active").length || 0;
      return { grade, students: count };
    });

    return {
      totalStudents: allStudents?.length || 0,
      activeStudents: activeStudents || 0,
      totalNotes: totalNotes || 0,
      totalPapers: totalPapers || 0,
      totalAnnouncements: totalAnnouncements || 0,
      recentActivity: recentActivity || [],
      gradeData,
    };
  } catch (err) {
    console.error("getAdminStats error:", err);
    return {
      totalStudents: 0,
      activeStudents: 0,
      totalNotes: 0,
      totalPapers: 0,
      totalAnnouncements: 0,
      recentActivity: [],
      gradeData: GRADES.map(grade => ({ grade, students: 0 })),
    };
  }
}
