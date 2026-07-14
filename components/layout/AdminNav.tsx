"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  BarChart2,
  BookOpen,
  ClipboardList,
  Clock,
  Megaphone,
  RefreshCw,
  Settings as SettingsIcon,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainNav = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

const academicsNav = [
  { href: "/admin/students", icon: Users, label: "Students" },
  { href: "/admin/marks", icon: BarChart2, label: "Marks" },
];

const contentNav = [
  { href: "/admin/notes", icon: BookOpen, label: "Notes" },
  { href: "/admin/papers", icon: ClipboardList, label: "Question Papers" },
  { href: "/admin/announcements", icon: Megaphone, label: "Announcements" },
];

const managementNav = [
  { href: "/admin/timetable", icon: Clock, label: "Timetable" },
];

const systemNav = [
  { href: "/admin/sync", icon: RefreshCw, label: "Sync" },
  { href: "/admin/settings", icon: SettingsIcon, label: "Settings" },
];

interface Props {
  admin: {
    name?: string | null;
    email?: string | null;
  };
}

export default function AdminNav({ admin }: Props) {
  const pathname = usePathname();

  function NavGroup({ items, title }: { items: typeof mainNav, title?: string }) {
    return (
      <div className="space-y-1">
        {title && (
          <p className="px-3.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60 dark:text-zinc-500/70 mb-2">
            {title}
          </p>
        )}
        {items.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "sidebar-link-premium",
                isActive && "active"
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    );
  }

  return (
    <nav className="flex flex-col h-full bg-card dark:bg-zinc-930 border-r border-border-subtle w-72 sticky top-0">
      {/* Header Profile Card */}
      <div className="p-5 border-b border-border-subtle">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-emerald-550/10 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-550/20 flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-emerald-550 dark:text-emerald-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate">
              {admin.name ?? "Administrator"}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {admin.email ?? "admin@irshadulanam.com"}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation list */}
      <div className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
        <NavGroup items={mainNav} />
        <NavGroup items={academicsNav} title="Academics" />
        <NavGroup items={contentNav} title="Content" />
        <NavGroup items={managementNav} title="Management" />
        <NavGroup items={systemNav} title="System" />
      </div>

      {/* Logout pinned at bottom */}
      <div className="p-4 border-t border-border-subtle">
        <button
          onClick={() => signOut({ callbackUrl: `${window.location.origin}/` })}
          className="sidebar-link-premium w-full text-red-500 dark:text-red-400 hover:bg-red-500/10 hover:text-red-600 dark:hover:text-red-300 group"
        >
          <LogOut size={18} className="flex-shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </nav>
  );
}
