import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a date string to a readable format
 */
export function formatDate(dateStr: string, locale = "en-IN"): string {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString(locale, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/**
 * Calculate percentage from obtained and max marks
 */
export function calcPercentage(obtained: number, max: number): number {
  if (max === 0) return 0;
  return Math.round((obtained / max) * 100 * 10) / 10;
}

/**
 * Get a Supabase storage file URL from a file path
 */
export function getSupabaseFileUrl(filePath: string): string {
  if (!filePath) return "";
  if (filePath.startsWith("http://") || filePath.startsWith("https://")) {
    return filePath;
  }
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://kujjdbhfeogzwyzberzv.supabase.co";
  return `${supabaseUrl}/storage/v1/object/public/documents/${filePath}`;
}

/**
 * Generate a unique ID with optional prefix
 */
export function generateId(prefix = ""): string {
  const timestamp = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 7);
  return prefix ? `${prefix}_${timestamp}${rand}` : `${timestamp}${rand}`;
}

/**
 * Get color classes for grade letter
 */
export function getGradeColor(grade: string): string {
  switch (grade) {
    case "A+":
      return "text-emerald-600 bg-emerald-50";
    case "A":
      return "text-emerald-500 bg-emerald-50";
    case "B+":
      return "text-blue-600 bg-blue-50";
    case "B":
      return "text-blue-500 bg-blue-50";
    case "C":
      return "text-amber-600 bg-amber-50";
    case "D":
      return "text-orange-600 bg-orange-50";
    case "F":
      return "text-red-600 bg-red-50";
    default:
      return "text-gray-600 bg-gray-50";
  }
}

/**
 * Get color classes for priority
 */
export function getPriorityColor(priority: string): string {
  switch (priority) {
    case "Urgent":
      return "text-red-600 bg-red-50 border-red-200";
    case "High":
      return "text-orange-600 bg-orange-50 border-orange-200";
    case "Medium":
      return "text-amber-600 bg-amber-50 border-amber-200";
    case "Low":
      return "text-emerald-600 bg-emerald-50 border-emerald-200";
    default:
      return "text-gray-600 bg-gray-50 border-gray-200";
  }
}

/**
 * Get color classes for announcement type
 */
export function getAnnouncementTypeColor(type: string): string {
  switch (type) {
    case "Holiday":
      return "text-green-700 bg-green-50";
    case "Exam":
      return "text-blue-700 bg-blue-50";
    case "Event":
      return "text-purple-700 bg-purple-50";
    case "Meeting":
      return "text-amber-700 bg-amber-50";
    case "Emergency":
      return "text-red-700 bg-red-50";
    default:
      return "text-gray-700 bg-gray-50";
  }
}

/**
 * Check if an announcement is still active (not expired)
 */
export function isAnnouncementActive(expiryDate?: string): boolean {
  if (!expiryDate) return true;
  return new Date(expiryDate) >= new Date();
}

/**
 * Get current academic year string e.g. "2025-2026"
 */
export function getCurrentAcademicYear(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-indexed
  // Academic year starts in June
  if (month >= 6) {
    return `${year}-${year + 1}`;
  }
  return `${year - 1}-${year}`;
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}
