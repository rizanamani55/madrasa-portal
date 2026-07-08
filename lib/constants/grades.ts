import { Grade } from "@/lib/types";

// ─── Supported Grades ────────────────────────────────────────
export const GRADES: Grade[] = [
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 10", // Grade 9 intentionally excluded
];

// ─── Subjects per Grade ──────────────────────────────────────
export const SUBJECTS_BY_GRADE: Record<Grade, string[]> = {
  "Grade 1": ["Arabic", "Bala Padangal"],
  "Grade 2": ["Arabic", "Balapadam", "Quran Hifdh", "Tharjam"],
  "Grade 3": [
    "Quran Hifdh",
    "Arabic",
    "Karmam",
    "Viswasam Swabhavam",
    "Tharjama Tajweed",
    "Charithram",
  ],
  "Grade 4": [
    "Quran Hifdh",
    "Arabic",
    "Karmam",
    "Tarjam Tajweed",
    "Viswasam Swabhavam",
    "Charithram",
  ],
  "Grade 5": [
    "Quran Hifdh",
    "Arabic",
    "Karmam",
    "Tarjam Tajweed",
    "Viswasam",
    "Swabhavam",
    "Charithram",
  ],
  "Grade 6": [
    "Quran Hifdh",
    "Arabic",
    "Karmam",
    "Tarjam Tajweed",
    "Viswasam",
    "Swabhavam",
    "Charithram",
  ],
  "Grade 7": [
    "Quran Hifdh",
    "Arabic",
    "Karmam",
    "Tarjam Tajweed",
    "Viswasam",
    "Swabhavam",
    "Charithram",
  ],
  "Grade 8": [
    "Quran Hifdh",
    "Arabic",
    "Quran Padam",
    "Samskaram",
    "Anushtanam",
  ],
  "Grade 10": ["Quran Padam", "Hadees Padam", "Samoohya Padam"],
};

// ─── Exam Types ──────────────────────────────────────────────
export const EXAM_TYPES = [
  "First Term",
  "Second Term",
  "Third Term",
  "Annual",
  "Unit Test",
  "Model",
] as const;

// ─── Days of Week ────────────────────────────────────────────
export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

// ─── Grade letter calculation ────────────────────────────────
export function calculateGradeLetter(percentage: number): string {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
}

// ─── Announcement Types ──────────────────────────────────────
export const ANNOUNCEMENT_TYPES = [
  "Holiday",
  "Exam",
  "Event",
  "Meeting",
  "Emergency",
  "General",
] as const;

export const ANNOUNCEMENT_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Urgent",
] as const;
