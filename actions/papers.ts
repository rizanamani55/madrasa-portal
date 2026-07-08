"use server";

import { auth } from "@/lib/auth/config";
import { supabase } from "@/lib/supabase/client";
import { ApiResponse, QuestionPaper, Grade } from "@/lib/types";

export async function getMyPapers(): Promise<ApiResponse<QuestionPaper[]>> {
  try {
    const session = await auth();
    if (!session?.user?.grade) {
      return { success: false, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("question_papers")
      .select("*")
      .eq("grade", session.user.grade)
      .order("upload_date", { ascending: false });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch question papers" };
    }

    return { success: true, data: (data || []).map(mapPaperFromDb) };
  } catch (err) {
    console.error("getMyPapers error:", err);
    return { success: false, error: "Failed to fetch question papers" };
  }
}

export async function fetchAllPapers(): Promise<ApiResponse<QuestionPaper[]>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("question_papers")
      .select("*")
      .order("upload_date", { ascending: false });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch papers" };
    }

    return { success: true, data: (data || []).map(mapPaperFromDb) };
  } catch (err) {
    console.error("fetchAllPapers error:", err);
    return { success: false, error: "Failed to fetch papers" };
  }
}

export async function addPaper(
  paper: Omit<QuestionPaper, "id">,
  uploadedBy: string
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("question_papers").insert([
      {
        grade: paper.grade,
        subject: paper.subject,
        exam_type: paper.examType,
        academic_year: paper.academicYear,
        title: paper.title,
        file_id: paper.fileId,
        file_name: paper.fileName,
        upload_date: paper.uploadDate || new Date().toISOString(),
        uploaded_by: uploadedBy,
      },
    ]);

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to add paper" };
    }

    return { success: true, message: "Paper added successfully" };
  } catch (err) {
    console.error("addPaper error:", err);
    return { success: false, error: "Failed to add paper" };
  }
}

export async function removePaper(id: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("question_papers").delete().eq("id", id);
    if (error) {
      console.error(error);
      return { success: false, error: "Failed to delete paper" };
    }

    return { success: true, message: "Paper deleted" };
  } catch (err) {
    console.error("removePaper error:", err);
    return { success: false, error: "Failed to delete paper" };
  }
}

function mapPaperFromDb(row: any): QuestionPaper {
  return {
    id: row.id,
    grade: row.grade,
    subject: row.subject,
    examType: row.exam_type,
    academicYear: row.academic_year,
    title: row.title,
    fileId: row.file_id,
    fileName: row.file_name,
    uploadDate: row.upload_date,
    uploadedBy: row.uploaded_by,
  };
}
