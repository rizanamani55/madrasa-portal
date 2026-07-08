// ============================================================
// Shared TypeScript types for Irshadul Anam Madrasa Portal
// ============================================================

export type UserRole = "student" | "admin";

// ─── Student ────────────────────────────────────────────────
export interface Student {
  admissionNumber: string;
  name: string;
  parentName: string;
  grade: Grade;
  phone: string;
  status: "active" | "inactive";
}

// ─── Grade ──────────────────────────────────────────────────
export type Grade =
  | "Grade 1"
  | "Grade 2"
  | "Grade 3"
  | "Grade 4"
  | "Grade 5"
  | "Grade 6"
  | "Grade 7"
  | "Grade 8"
  | "Grade 10";

// ─── Marks ──────────────────────────────────────────────────
export type ExamType =
  | "First Term"
  | "Second Term"
  | "Third Term"
  | "Annual"
  | "Unit Test"
  | "Model";

export interface Mark {
  id: string;
  studentId: string; // was admissionNumber
  grade: Grade;
  subject: string;
  academicYear: string;
  unitTest?: number | null;
  midterm?: number | null;
  finalExam?: number | null;
  remarks?: string;
}

// ─── Notes ──────────────────────────────────────────────────
export interface Note {
  id: string;
  grade: Grade;
  subject: string;
  chapter?: string;
  title: string;
  description?: string;
  fileId: string;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
}

// ─── Question Papers ────────────────────────────────────────
export interface QuestionPaper {
  id: string;
  grade: Grade;
  subject: string;
  examType: ExamType;
  academicYear: string;
  title: string;
  fileId: string;
  fileName: string;
  uploadDate: string;
  uploadedBy: string;
}

// ─── Timetable ──────────────────────────────────────────────
export type DayOfWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export interface TimetablePeriod {
  id: string;
  grade: Grade;
  day: DayOfWeek;
  periodNumber: number;
  startTime: string;
  endTime: string;
  subject: string;
  teacher?: string;
  classroom?: string;
  remarks?: string;
}

// ─── Announcements ──────────────────────────────────────────
export type AnnouncementType =
  | "Holiday"
  | "Exam"
  | "Event"
  | "Meeting"
  | "Emergency"
  | "General";

export type AnnouncementPriority = "Low" | "Medium" | "High" | "Urgent";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: AnnouncementType;
  priority: AnnouncementPriority;
  publishDate: string;
  expiryDate?: string;
  publishedBy: string;
  isActive: boolean;
}

// ─── Audit Log ──────────────────────────────────────────────
export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  performedBy: string;
  details: string;
}

// ─── API Response ────────────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// ─── Dashboard Stats (Admin) ─────────────────────────────────
export interface AdminStats {
  totalStudents: number;
  activeStudents: number;
  totalNotes: number;
  totalPapers: number;
  totalAnnouncements: number;
  recentActivity: AuditLog[];
}

// ─── Session extension for NextAuth ──────────────────────────
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: UserRole;
      admissionNumber?: string;
      grade?: Grade;
    };
  }

  interface User {
    role: UserRole;
    admissionNumber?: string;
    grade?: Grade;
  }
}
