"use server";

import { auth } from "@/lib/auth/config";
import { supabase } from "@/lib/supabase/client";
import { ApiResponse, Note, Grade } from "@/lib/types";

export async function getMyNotes(): Promise<ApiResponse<Note[]>> {
  try {
    const session = await auth();
    if (!session?.user?.grade) {
      return { success: false, error: "Not authenticated" };
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .eq("grade", session.user.grade)
      .order("upload_date", { ascending: false });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch notes" };
    }

    return { success: true, data: (data || []).map(mapNoteFromDb) };
  } catch (err) {
    console.error("getMyNotes error:", err);
    return { success: false, error: "Failed to fetch notes" };
  }
}

export async function fetchAllNotes(): Promise<ApiResponse<Note[]>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("notes")
      .select("*")
      .order("upload_date", { ascending: false });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch notes" };
    }

    return { success: true, data: (data || []).map(mapNoteFromDb) };
  } catch (err) {
    console.error("fetchAllNotes error:", err);
    return { success: false, error: "Failed to fetch notes" };
  }
}

export async function addNote(
  note: Omit<Note, "id">,
  uploadedBy: string
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("notes").insert([
      {
        grade: note.grade,
        subject: note.subject,
        title: note.title,
        description: note.description,
        file_id: note.fileId,
        file_name: note.fileName,
        upload_date: note.uploadDate || new Date().toISOString(),
        uploaded_by: uploadedBy,
      },
    ]);

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to add note" };
    }

    return { success: true, message: "Note added successfully" };
  } catch (err) {
    console.error("addNote error:", err);
    return { success: false, error: "Failed to add note" };
  }
}

export async function removeNote(id: string): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("notes").delete().eq("id", id);
    if (error) {
      console.error(error);
      return { success: false, error: "Failed to delete note" };
    }

    return { success: true, message: "Note deleted" };
  } catch (err) {
    console.error("removeNote error:", err);
    return { success: false, error: "Failed to delete note" };
  }
}

function mapNoteFromDb(row: any): Note {
  return {
    id: row.id,
    grade: row.grade,
    subject: row.subject,
    chapter: row.chapter || "",
    title: row.title,
    description: row.description || "",
    fileId: row.file_id,
    fileName: row.file_name,
    uploadDate: row.upload_date,
    uploadedBy: row.uploaded_by,
  };
}
