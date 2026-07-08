"use server";

import { auth } from "@/lib/auth/config";
import { supabase } from "@/lib/supabase/client";
import { studentSchema, StudentInput } from "@/lib/validations/schemas";
import { ApiResponse, Student } from "@/lib/types";

// ─── Get current student profile ─────────────────────────────
export async function getMyProfile(): Promise<ApiResponse<Student>> {
  try {
    const session = await auth();
    if (!session?.user?.admissionNumber) {
      return { success: false, error: "Not authenticated" };
    }

    const { data: student, error } = await supabase
      .from("students")
      .select("*")
      .eq("admission_number", session.user.admissionNumber)
      .single();

    if (error || !student) {
      return { success: false, error: "Student not found" };
    }

    return {
      success: true,
      data: {
        admissionNumber: student.admission_number,
        name: student.name,
        parentName: student.parent_name,
        grade: student.grade as any,
        phone: student.phone,
        status: student.status as any,
      },
    };
  } catch (err) {
    console.error("getMyProfile error:", err);
    return { success: false, error: "Failed to fetch profile" };
  }
}

// ─── Get all students (admin) ─────────────────────────────────
export async function fetchAllStudents(): Promise<ApiResponse<Student[]>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { data: students, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch students" };
    }

    const mapped = (students || []).map((s: any) => ({
      admissionNumber: s.admission_number,
      name: s.name,
      parentName: s.parent_name,
      grade: s.grade,
      phone: s.phone,
      status: s.status,
    }));

    return { success: true, data: mapped };
  } catch (err) {
    console.error("fetchAllStudents error:", err);
    return { success: false, error: "Failed to fetch students" };
  }
}

// ─── Create student (admin) ───────────────────────────────────
export async function addStudent(
  input: StudentInput
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = studentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const data = parsed.data;
    const { error } = await supabase.from("students").insert([
      {
        admission_number: data.admissionNumber,
        name: data.name,
        parent_name: data.parentName,
        grade: data.grade,
        phone: data.phone,
        status: data.status,
      },
    ]);

    if (error) {
      console.error(error);
      if (error.code === "23505") {
        return { success: false, error: "Admission number already exists" };
      }
      return { success: false, error: "Failed to add student" };
    }

    return { success: true, message: "Student added successfully" };
  } catch (err) {
    console.error("addStudent error:", err);
    return { success: false, error: "Failed to add student" };
  }
}

// ─── Update student (admin) ───────────────────────────────────
export async function editStudent(
  input: StudentInput
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const parsed = studentSchema.safeParse(input);
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error.issues[0]?.message ?? "Invalid input",
      };
    }

    const data = parsed.data;
    const { error } = await supabase
      .from("students")
      .update({
        name: data.name,
        parent_name: data.parentName,
        grade: data.grade,
        phone: data.phone,
        status: data.status,
        updated_at: new Date().toISOString(),
      })
      .eq("admission_number", data.admissionNumber);

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to update student" };
    }

    return { success: true, message: "Student updated successfully" };
  } catch (err) {
    console.error("editStudent error:", err);
    return { success: false, error: "Failed to update student" };
  }
}

// ─── Delete student (admin) ───────────────────────────────────
export async function removeStudent(
  admissionNumber: string
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase
      .from("students")
      .delete()
      .eq("admission_number", admissionNumber);

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to remove student" };
    }

    return { success: true, message: "Student removed successfully" };
  } catch (err) {
    console.error("removeStudent error:", err);
    return { success: false, error: "Failed to remove student" };
  }
}
