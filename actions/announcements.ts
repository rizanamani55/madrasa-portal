"use server";

import { auth } from "@/lib/auth/config";
import { supabase } from "@/lib/supabase/client";
import { ApiResponse, Announcement } from "@/lib/types";

export async function getPublicAnnouncements(): Promise<ApiResponse<Announcement[]>> {
  try {
    const now = new Date().toISOString();
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .eq("is_active", true)
      // For expiryDate, we either need it to be null, or greater than now
      // This is a bit tricky with simple eq, let's fetch active and filter locally for simplicity since data is small
      .order("publish_date", { ascending: false });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch announcements" };
    }

    const currentNow = new Date();
    const valid = data.filter((a: any) => {
      if (!a.expiry_date) return true;
      return new Date(a.expiry_date) >= currentNow;
    });

    const mapped = valid.map(mapAnnouncementFromDb);
    return { success: true, data: mapped };
  } catch (err) {
    console.error("getPublicAnnouncements error:", err);
    return { success: false, error: "Failed to fetch announcements" };
  }
}

export async function fetchAllAnnouncements(): Promise<ApiResponse<Announcement[]>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("publish_date", { ascending: false });

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to fetch announcements" };
    }

    return { success: true, data: data.map(mapAnnouncementFromDb) };
  } catch (err) {
    console.error("fetchAllAnnouncements error:", err);
    return { success: false, error: "Failed to fetch announcements" };
  }
}

export async function publishAnnouncement(
  announcement: Omit<Announcement, "id">
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const publishedBy = session.user.name ?? "admin";
    
    const { error } = await supabase.from("announcements").insert([
      {
        title: announcement.title,
        content: announcement.content,
        type: announcement.type,
        priority: announcement.priority,
        is_active: announcement.isActive,
        publish_date: announcement.publishDate,
        expiry_date: announcement.expiryDate || null,
        published_by: publishedBy,
      },
    ]);

    if (error) {
      console.error(error);
      return { success: false, error: "Failed to publish announcement" };
    }

    return { success: true, message: "Announcement published" };
  } catch (err) {
    console.error("publishAnnouncement error:", err);
    return { success: false, error: "Failed to publish announcement" };
  }
}

export async function removeAnnouncement(
  id: string
): Promise<ApiResponse<void>> {
  try {
    const session = await auth();
    if (session?.user?.role !== "admin") {
      return { success: false, error: "Unauthorized" };
    }

    const { error } = await supabase.from("announcements").delete().eq("id", id);
    
    if (error) {
      console.error(error);
      return { success: false, error: "Failed to remove announcement" };
    }

    return { success: true, message: "Announcement removed" };
  } catch (err) {
    console.error("removeAnnouncement error:", err);
    return { success: false, error: "Failed to remove announcement" };
  }
}

function mapAnnouncementFromDb(row: any): Announcement {
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    type: row.type,
    priority: row.priority,
    publishDate: row.publish_date,
    expiryDate: row.expiry_date,
    publishedBy: row.published_by,
    isActive: row.is_active,
  };
}
