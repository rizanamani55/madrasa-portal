"use server";

import { auth } from "@/lib/auth/config";
import { supabase } from "@/lib/supabase/client";
import { trackerRecordSchema, TrackerRecordInput } from "@/lib/validations/schemas";
import { ApiResponse, PrayerQuranRecord } from "@/lib/types";
import { revalidatePath } from "next/cache";

// Helper to check authentication
async function getSession() {
  const session = await auth();
  if (!session?.user) {
    throw new Error("Not authenticated");
  }
  return session;
}

// ─── STUDENT: Get monthly tracker ─────────────────────────────
export async function getMyTracker(month: number, year: number): Promise<ApiResponse<PrayerQuranRecord[]>> {
  try {
    const session = await getSession();
    const studentId = session.user.admissionNumber;
    if (!studentId) return { success: false, error: "Not a student" };

    const { data, error } = await supabase
      .from("prayer_quran_tracker")
      .select("*")
      .eq("student_id", studentId)
      .eq("month", month)
      .eq("year", year)
      .order("day", { ascending: true });

    if (error) throw error;

    // Convert snake_case to camelCase
    const formatted: PrayerQuranRecord[] = (data || []).map(record => ({
      id: record.id,
      studentId: record.student_id,
      month: record.month,
      year: record.year,
      day: record.day,
      subh: record.subh,
      duhr: record.duhr,
      asr: record.asr,
      magrib: record.magrib,
      isha: record.isha,
      prayerMarks: record.prayer_marks,
      quranPages: record.quran_pages,
      quranMarks: record.quran_marks,
      locked: record.locked,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }));

    return { success: true, data: formatted };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── STUDENT: Upsert daily record ─────────────────────────────
export async function upsertTrackerDay(input: TrackerRecordInput): Promise<ApiResponse<PrayerQuranRecord>> {
  try {
    const session = await getSession();
    const studentId = session.user.admissionNumber;
    if (!studentId) return { success: false, error: "Not a student" };

    // Validate input
    const parsed = trackerRecordSchema.parse({
      ...input,
      studentId, // enforce current student
    });

    // Check if locked
    const { data: existing } = await supabase
      .from("prayer_quran_tracker")
      .select("locked")
      .eq("student_id", studentId)
      .eq("month", parsed.month)
      .eq("year", parsed.year)
      .eq("day", parsed.day)
      .maybeSingle();

    if (existing?.locked) {
      return { success: false, error: "This tracker is locked by the admin" };
    }

    // Calculate marks
    const prayerMarks = parsed.prayerMarks;
    const quranMarks = parsed.quranPages * 5;

    // Upsert
    const { data, error } = await supabase
      .from("prayer_quran_tracker")
      .upsert({
        student_id: studentId,
        month: parsed.month,
        year: parsed.year,
        day: parsed.day,
        subh: parsed.subh,
        duhr: parsed.duhr,
        asr: parsed.asr,
        magrib: parsed.magrib,
        isha: parsed.isha,
        prayer_marks: prayerMarks,
        quran_pages: parsed.quranPages,
        quran_marks: quranMarks,
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'student_id,month,year,day'
      })
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/tracker");
    revalidatePath("/dashboard");

    return { 
      success: true, 
      data: {
        id: data.id,
        studentId: data.student_id,
        month: data.month,
        year: data.year,
        day: data.day,
        subh: data.subh,
        duhr: data.duhr,
        asr: data.asr,
        magrib: data.magrib,
        isha: data.isha,
        prayerMarks: data.prayer_marks,
        quranPages: data.quran_pages,
        quranMarks: data.quran_marks,
        locked: data.locked,
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── ADMIN: Get trackers by filter ─────────────────────────────
export async function getAdminTrackers(filters: { grade?: string, month: number, year: number, studentId?: string }): Promise<ApiResponse<PrayerQuranRecord[]>> {
  try {
    const session = await getSession();
    if (session.user.role !== "admin") return { success: false, error: "Unauthorized" };

    let query = supabase
      .from("prayer_quran_tracker")
      .select("*, students!inner(grade, name)")
      .eq("month", filters.month)
      .eq("year", filters.year);

    if (filters.grade) {
      query = query.eq("students.grade", filters.grade);
    }
    if (filters.studentId) {
      query = query.eq("student_id", filters.studentId);
    }

    const { data, error } = await query;
    if (error) throw error;

    const formatted: PrayerQuranRecord[] = (data || []).map(record => ({
      id: record.id,
      studentId: record.student_id,
      month: record.month,
      year: record.year,
      day: record.day,
      subh: record.subh,
      duhr: record.duhr,
      asr: record.asr,
      magrib: record.magrib,
      isha: record.isha,
      prayerMarks: record.prayer_marks,
      quranPages: record.quran_pages,
      quranMarks: record.quran_marks,
      locked: record.locked,
      createdAt: record.created_at,
      updatedAt: record.updated_at
    }));

    return { success: true, data: formatted };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── ADMIN: Lock/Unlock Month ─────────────────────────────
export async function setTrackerLock(studentId: string, month: number, year: number, locked: boolean): Promise<ApiResponse<void>> {
  try {
    const session = await getSession();
    if (session.user.role !== "admin") return { success: false, error: "Unauthorized" };

    const { error } = await supabase
      .from("prayer_quran_tracker")
      .update({ locked })
      .eq("student_id", studentId)
      .eq("month", month)
      .eq("year", year);

    if (error) throw error;

    revalidatePath("/admin/tracker");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── Dashboard Stats ─────────────────────────────
export async function getStudentTrackerStats(): Promise<ApiResponse<{
  prayerCompleted: number;
  totalPrayersRequired: number;
  quranPages: number;
  prayerMarks: number;
  quranMarks: number;
}>> {
  try {
    const session = await getSession();
    const studentId = session.user.admissionNumber;
    if (!studentId) return { success: false, error: "Not a student" };

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const { data, error } = await supabase
      .from("prayer_quran_tracker")
      .select("*")
      .eq("student_id", studentId)
      .eq("month", currentMonth)
      .eq("year", currentYear);

    if (error) throw error;

    // Total required is days passed in the month * 5
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const daysPassed = now.getDate();
    const totalPrayersRequired = daysPassed * 5;

    let prayerCompleted = 0;
    let quranPages = 0;
    let prayerMarks = 0;
    let quranMarks = 0;

    data?.forEach(record => {
      prayerCompleted += record.prayer_marks; // each completed is 1 mark
      quranPages += record.quran_pages;
      prayerMarks += record.prayer_marks;
      quranMarks += record.quran_marks;
    });

    return {
      success: true,
      data: {
        prayerCompleted,
        totalPrayersRequired,
        quranPages,
        prayerMarks,
        quranMarks
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

// ─── ADMIN: Dashboard Stats ─────────────────────────────
export async function getAdminTrackerStats(): Promise<ApiResponse<{
  completedToday: number;
  pendingToday: number;
  quranPagesToday: number;
  avgCompletionRate: number;
  topStudents: { admissionNumber: string, name: string, score: number }[];
}>> {
  try {
    const session = await getSession();
    if (session.user.role !== "admin") return { success: false, error: "Unauthorized" };

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const day = now.getDate();

    const { data: allStudents, error: stuErr } = await supabase.from("students").select("admission_number, name");
    if (stuErr) throw stuErr;

    const { data: trackers, error: trErr } = await supabase
      .from("prayer_quran_tracker")
      .select("*")
      .eq("month", month)
      .eq("year", year);
    if (trErr) throw trErr;

    let quranPagesToday = 0;
    let completedToday = 0;
    const studentScores: Record<string, { name: string, score: number }> = {};
    const todayTrackers = trackers.filter(t => t.day === day);

    // Initialize scores
    allStudents.forEach(s => {
      studentScores[s.admission_number] = { name: s.name, score: 0 };
    });

    trackers.forEach(t => {
      const score = (t.prayer_marks || 0) + (t.quran_marks || 0);
      if (studentScores[t.student_id]) {
        studentScores[t.student_id].score += score;
      }
      
      if (t.day === day) {
        quranPagesToday += (t.quran_pages || 0);
        if (t.prayer_marks === 5) {
          completedToday++;
        }
      }
    });

    const actualCompletedToday = todayTrackers.length;
    const actualPendingToday = allStudents.length - actualCompletedToday;

    const daysPassed = now.getDate();
    const totalPossiblePrayers = allStudents.length * daysPassed * 5;
    const totalPrayersDone = trackers.reduce((acc, t) => acc + (t.prayer_marks || 0), 0);
    const avgCompletionRate = totalPossiblePrayers > 0 ? Math.round((totalPrayersDone / totalPossiblePrayers) * 100) : 0;

    const topStudents = Object.entries(studentScores)
      .map(([id, data]) => ({ admissionNumber: id, name: data.name, score: data.score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    return {
      success: true,
      data: {
        completedToday: actualCompletedToday,
        pendingToday: actualPendingToday,
        quranPagesToday,
        avgCompletionRate,
        topStudents
      }
    };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
