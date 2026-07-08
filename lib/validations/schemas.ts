import { z } from "zod";
import { GRADES } from "@/lib/constants/grades";

// Local copies as mutable arrays to satisfy Zod's enum overload
const EXAM_TYPES_MUT = [
  "First Term",
  "Second Term",
  "Third Term",
  "Annual",
  "Unit Test",
  "Model",
] as const;

const ANNOUNCEMENT_TYPES_MUT = [
  "Holiday",
  "Exam",
  "Event",
  "Meeting",
  "Emergency",
  "General",
] as const;

const ANNOUNCEMENT_PRIORITIES_MUT = [
  "Low",
  "Medium",
  "High",
  "Urgent",
] as const;

const GRADES_MUT = GRADES as unknown as [string, ...string[]];

// ─── Auth ────────────────────────────────────────────────────
export const admissionLoginSchema = z.object({
  admissionNumber: z
    .string()
    .min(1, "Admission number is required")
    .max(20, "Invalid admission number")
    .regex(/^[A-Za-z0-9\-\/]+$/, "Invalid admission number format"),
  name: z.string().min(2, "Name is required to login"),
});

export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ─── Student ────────────────────────────────────────────────
export const studentSchema = z.object({
  admissionNumber: z.string().min(1).max(20),
  name: z.string().min(2, "Name must be at least 2 characters"),
  parentName: z.string().min(2),
  grade: z.enum(GRADES_MUT),
  phone: z.string().regex(/^[0-9+\-\s]{10,15}$/, "Invalid phone number"),
  status: z.enum(["active", "inactive"]).default("active"),
});

// ─── Marks ──────────────────────────────────────────────────
export const markSchema = z.object({
  studentId: z.string().min(1),
  grade: z.enum(GRADES_MUT),
  subject: z.string().min(1),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, "Format: YYYY-YYYY"),
  unitTest: z.coerce.number().min(0).max(100).nullable().optional(),
  midterm: z.coerce.number().min(0).max(100).nullable().optional(),
  finalExam: z.coerce.number().min(0).max(100).nullable().optional(),
  remarks: z.string().optional(),
});

// ─── Notes ──────────────────────────────────────────────────
export const noteSchema = z.object({
  grade: z.enum(GRADES_MUT),
  subject: z.string().min(1),
  chapter: z.string().optional(),
  title: z.string().min(2, "Title is required"),
  description: z.string().optional(),
});

// ─── Question Paper ──────────────────────────────────────────
export const questionPaperSchema = z.object({
  grade: z.enum(GRADES_MUT),
  subject: z.string().min(1),
  examType: z.enum([...EXAM_TYPES_MUT] as unknown as [string, ...string[]]),
  academicYear: z.string().regex(/^\d{4}-\d{4}$/, "Format: YYYY-YYYY"),
  title: z.string().min(2, "Title is required"),
});

// ─── Timetable Period ────────────────────────────────────────
export const timetablePeriodSchema = z.object({
  grade: z.enum(GRADES_MUT),
  day: z.enum([
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ]),
  periodNumber: z.coerce.number().min(1).max(10),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "HH:MM format"),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "HH:MM format"),
  subject: z.string().min(1),
  teacher: z.string().optional(),
  classroom: z.string().optional(),
  remarks: z.string().optional(),
});

// ─── Announcement ────────────────────────────────────────────
export const announcementSchema = z.object({
  title: z.string().min(2, "Title is required"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  type: z.enum([...ANNOUNCEMENT_TYPES_MUT] as unknown as [string, ...string[]]),
  priority: z.enum([...ANNOUNCEMENT_PRIORITIES_MUT] as unknown as [string, ...string[]]),
  publishDate: z.string().min(1),
  expiryDate: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type AdmissionLoginInput = z.infer<typeof admissionLoginSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
export type StudentInput = z.infer<typeof studentSchema>;
export type MarkInput = z.infer<typeof markSchema>;
export type NoteInput = z.infer<typeof noteSchema>;
export type QuestionPaperInput = z.infer<typeof questionPaperSchema>;
export type TimetablePeriodInput = z.infer<typeof timetablePeriodSchema>;
export type AnnouncementInput = z.infer<typeof announcementSchema>;
