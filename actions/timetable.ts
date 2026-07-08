"use server";

import { auth } from "@/lib/auth/config";
import { supabase } from "@/lib/supabase/client";
import { ApiResponse, TimetablePeriod, Grade } from "@/lib/types";

export async function getMyTimetable(): Promise<ApiResponse<TimetablePeriod[]>> {
  try {
    const session = await auth();
    if (!session?.user?.grade) {
      return { success: false, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("timetables")
      .select("*")
      .eq("grade", session.user.grade)
      .order("day_of_week", { ascending: true })
      .order("period_number", { ascending: true });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch timetable" };
    }

    return { success: true, data: (data || []).map(mapTimetableFromDb) };
  } catch (err) {
    console.error("getMyTimetable error:", err);
    return { success: false, error: "Failed to fetch timetable" };
  }
}

export async function fetchAllTimetable(): Promise<ApiResponse<TimetablePeriod[]>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("timetables")
      .select("*")
      .order("grade", { ascending: true })
      .order("day_of_week", { ascending: true })
      .order("period_number", { ascending: true });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch timetable" };
    }

    return { success: true, data: (data || []).map(mapTimetableFromDb) };
  } catch (err) {
    console.error("fetchAllTimetable error:", err);
    return { success: false, error: "Failed to fetch timetable" };
  }
}

export async function addPeriod(
  period: Omit<TimetablePeriod, "id">
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("timetables").insert([
      {
        grade: period.grade,
        day_of_week: period.day,
        period_number: period.periodNumber,
        start_time: period.startTime,
        end_time: period.endTime,
        subject: period.subject,
        teacher: period.teacher || null,
        classroom: period.classroom || null,
        remarks: period.remarks || null,
      },
    ]);

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to add period" };
    }

    return { success: true, message: "Period added successfully" };
  } catch (err) {
    console.error("addPeriod error:", err);
    return { success: false, error: "Failed to add period" };
  }
}

export async function removePeriod(id: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("timetables").delete().eq("id", id);
    if (error) {
      console.error(error);
      return { success: false, error: "Failed to delete period" };
    }

    return { success: true, message: "Period deleted" };
  } catch (err) {
    console.error("removePeriod error:", err);
    return { success: false, error: "Failed to delete period" };
  }
}

function mapTimetableFromDb(row: any): TimetablePeriod {
  return {
    id: row.id,
    grade: row.grade,
    day: row.day_of_week,
    periodNumber: row.period_number,
    startTime: row.start_time,
    endTime: row.end_time,
    subject: row.subject,
    teacher: row.teacher || "",
    classroom: row.classroom || "",
    remarks: row.remarks || "",
  };
}
