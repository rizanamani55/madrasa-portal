// Application route constants

export const ROUTES = {
  // Public
  HOME: "/",
  LOGIN: "/login",
  ADMIN_LOGIN: "/admin/login",

  // Student routes
  STUDENT: {
    DASHBOARD: "/dashboard",
    PROFILE: "/profile",
    RESULTS: "/results",
    NOTES: "/notes",
    PAPERS: "/papers",
    TIMETABLE: "/timetable",
    ANNOUNCEMENTS: "/announcements",
    DOWNLOADS: "/downloads",
  },

  // Admin routes
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    STUDENTS: "/admin/students",
    MARKS: "/admin/marks",
    NOTES: "/admin/notes",
    PAPERS: "/admin/papers",
    TIMETABLE: "/admin/timetable",
    ANNOUNCEMENTS: "/admin/announcements",
    SYNC: "/admin/sync",
    SETTINGS: "/admin/settings",
  },
} as const;

// Protected route prefixes
export const STUDENT_ROUTES = [
  "/dashboard",
  "/profile",
  "/results",
  "/notes",
  "/papers",
  "/timetable",
  "/announcements",
  "/downloads",
];

export const ADMIN_ROUTES = ["/admin"];

// Public routes (no auth required)
export const PUBLIC_ROUTES = ["/", "/login", "/admin/login"];
