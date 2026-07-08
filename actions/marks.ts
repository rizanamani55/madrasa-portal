"use server";

import { auth } from "@/lib/auth/config";
import { supabase } from "@/lib/supabase/client";
import { markSchema } from "@/lib/validations/schemas";
import { ApiResponse, Mark } from "@/lib/types";

// ─── Get marks for current student ────────────────────────────
export async function getMyMarks(): Promise<ApiResponse<Mark[]>> {
  try {
    const session = await auth();
    if (!session?.user?.admissionNumber) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: marks, error } = await supabase
      .from("marks")
      .select("*")
      .eq("student_id", session.user.admissionNumber);

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch results" };
    }

    const mapped = (marks || []).map(mapMarkFromDb);
    return { success: true, data: mapped };
  } catch (err) {
    console.error("getMyMarks error:", err);
    return { success: false, error: "Failed to fetch results" };
  }
}

// ─── Get marks for a specific student (admin) ─────────────────
export async function fetchMarksByStudent(
  admissionNumber: string
): Promise<ApiResponse<Mark[]>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { data: marks, error } = await supabase
      .from("marks")
      .select("*")
      .eq("student_id", admissionNumber);

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch marks" };
    }

    const mapped = (marks || []).map(mapMarkFromDb);
    return { success: true, data: mapped };
  } catch (err) {
    console.error("fetchMarksByStudent error:", err);
    return { success: false, error: "Failed to fetch marks" };
  }
}

// ─── Save multiple marks for a student (admin) ────────────────
export async function saveStudentMarks(
  admissionNumber: string,
  marksInput: Omit<Mark, "id">[]
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    // Upsert each mark
    const rows = marksInput.map((m) => {
      // Validate
      const parsed = markSchema.parse(m);
      return {
        student_id: parsed.studentId,
        subject: parsed.subject,
        grade: parsed.grade,
        academic_year: parsed.academicYear,
        unit_test: parsed.unitTest,
        midterm: parsed.midterm,
        final_exam: parsed.finalExam,
        remarks: parsed.remarks,
      };
    });

    // Supabase upsert requires the UNIQUE constraint on (student_id, subject, academic_year)
    const { error } = await supabase
      .from("marks")
      .upsert(rows, { onConflict: "student_id,subject,academic_year" });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to save marks" };
    }

    return { success: true, message: "Marks saved successfully" };
  } catch (err) {
    console.error("saveStudentMarks error:", err);
    return { success: false, error: "Invalid input or failed to save marks" };
  }
}

// Helper to map DB row to Mark type
function mapMarkFromDb(row: any): Mark {
  return {
    id: row.id,
    studentId: row.student_id,
    grade: row.grade,
    subject: row.subject,
    academicYear: row.academic_year,
    unitTest: row.unit_test,
    midterm: row.midterm,
    finalExam: row.final_exam,
    remarks: row.remarks,
  };
}
