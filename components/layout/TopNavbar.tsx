"use client";

import { useTheme } from "@/components/providers/ThemeProvider";
import { Sun, Moon, Bell, Search, Plus, Sparkles, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import MobileNav from "./MobileNav";

interface Props {
  role: "student" | "admin";
  user: {
    name?: string | null;
    email?: string | null;
    admissionNumber?: string;
    grade?: string;
  };
}

export default function TopNavbar({ role, user }: Props) {
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();

  // Create simple breadcrumbs
  const pathParts = pathname.split("/").filter(Boolean);
  const pageTitle = pathParts[pathParts.length - 1] 
    ? pathParts[pathParts.length - 1].charAt(0).toUpperCase() + pathParts[pathParts.length - 1].slice(1)
    : "Dashboard";

  return (
    <header className="sticky top-0 z-40 w-full h-[72px] bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md border-b border-border-subtle px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Left breadcrumb info */}
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <div className="lg:hidden">
          <MobileNav role={role} user={user} />
        </div>
        
        <div className="hidden sm:block">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span>Portal</span>
            <span>/</span>
            {pathParts.map((part, i) => (
              <span key={part} className="flex items-center gap-1.5 capitalize">
                {part}
                {i < pathParts.length - 1 && <span>/</span>}
              </span>
            ))}
          </div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-zinc-50 tracking-tight leading-tight mt-0.5">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right utilities */}
      <div className="flex items-center gap-3.5">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search dashboard... (Press ⌘K)"
            className="w-64 pl-9 pr-3 py-1.5 text-sm bg-zinc-100 dark:bg-zinc-900 border border-transparent focus:border-border-subtle rounded-xl outline-none transition-all focus:w-80"
          />
        </div>

        {/* Theme Toggler */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl hover:bg-border-subtle text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button className="p-2 rounded-xl hover:bg-border-subtle text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors">
            <Bell size={18} />
          </button>
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-zinc-950" />
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-3.5 pl-2 border-l border-border-subtle">
          <div className="w-9 h-9 bg-emerald-550/10 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-550/20 text-emerald-550 dark:text-emerald-400 font-bold text-sm">
            {user.name?.charAt(0) ?? "U"}
          </div>
          <div className="hidden lg:block min-w-0 text-left">
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-muted-foreground truncate leading-none mt-0.5">
              {role === "admin" ? "Staff" : user.grade}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
