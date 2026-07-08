"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  LayoutDashboard,
  User,
  FileText,
  BookOpen,
  ClipboardList,
  Clock,
  Megaphone,
  Download,
  LogOut,
  GraduationCap,
  Users,
  BarChart2,
  RefreshCw,
  Settings,
} from "lucide-react";

const studentItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/profile", icon: User, label: "My Profile" },
  { href: "/results", icon: FileText, label: "Results" },
  { href: "/notes", icon: BookOpen, label: "Notes" },
  { href: "/papers", icon: ClipboardList, label: "Question Papers" },
  { href: "/timetable", icon: Clock, label: "Timetable" },
  { href: "/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/downloads", icon: Download, label: "Downloads" },
];

const adminItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/students", icon: Users, label: "Students" },
  { href: "/admin/marks", icon: BarChart2, label: "Marks" },
  { href: "/admin/notes", icon: BookOpen, label: "Notes" },
  { href: "/admin/papers", icon: ClipboardList, label: "Question Papers" },
  { href: "/admin/timetable", icon: Clock, label: "Timetable" },
  { href: "/admin/announcements", icon: Megaphone, label: "Announcements" },
  { href: "/admin/sync", icon: RefreshCw, label: "Sync" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

interface Props {
  role: "student" | "admin";
  user: {
    name?: string | null;
    admissionNumber?: string;
    grade?: string;
    email?: string | null;
  };
}

export default function MobileNav({ role, user }: Props) {
  const [open, setOpen] = useState(false);
  const items = role === "student" ? studentItems : adminItems;
  const logoutUrl = role === "student" ? "/" : "/admin/login";

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-2 rounded-xl text-muted-foreground hover:bg-border-subtle hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
        aria-label="Open menu"
      >
        <Menu className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/60 z-50 backdrop-blur-sm"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-card dark:bg-zinc-930 z-50 shadow-2xl flex flex-col border-r border-border-subtle"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-emerald-550/15 dark:bg-emerald-500/15 rounded-lg flex items-center justify-center border border-emerald-550/20">
                    <GraduationCap className="w-4 h-4 text-emerald-500" />
                  </div>
                  <span className="font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    IAM Portal
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:bg-border-subtle"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Info */}
              <div className="px-5 py-4 bg-emerald-500/5 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-emerald-550/10 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-550/20 text-emerald-550 dark:text-emerald-400 font-bold text-sm">
                    {user.name?.charAt(0) ?? "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-zinc-900 dark:text-zinc-100 text-xs truncate">
                      {user.name ?? "User"}
                    </p>
                    <p className="text-muted-foreground text-xxs truncate">
                      {role === "student"
                        ? `${user.admissionNumber} · ${user.grade}`
                        : user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links scrollable area */}
              <div className="flex-1 py-4 px-3 overflow-y-auto space-y-1">
                {items.map(({ href, icon: Icon, label }) => (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    className="sidebar-link-premium"
                  >
                    <Icon size={18} className="flex-shrink-0" />
                    <span>{label}</span>
                  </Link>
                ))}
              </div>

              {/* Logout */}
              <div className="p-4 border-t border-border-subtle">
                <button
                  onClick={() => {
                    setOpen(false);
                    signOut({ callbackUrl: logoutUrl });
                  }}
                  className="sidebar-link-premium w-full text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300"
                >
                  <LogOut size={18} className="flex-shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
