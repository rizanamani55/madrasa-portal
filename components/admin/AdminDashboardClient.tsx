"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Users,
  BookOpen,
  ClipboardList,
  Megaphone,
  TrendingUp,
  Activity,
  Plus,
  RefreshCw,
  Clock,
  ArrowUpRight,
  TrendingDown,
  Sparkles,
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Stats {
  totalStudents: number;
  activeStudents: number;
  totalNotes: number;
  totalPapers: number;
  totalAnnouncements: number;
  recentActivity: Array<{ id: string; action: string; details: string; timestamp: string }>;
  gradeData: Array<{ grade: string; students: number }>;
}

interface Props {
  stats: Stats;
  trackerStats?: {
    completedToday: number;
    pendingToday: number;
    quranPagesToday: number;
    avgCompletionRate: number;
    topStudents: { admissionNumber: string, name: string, score: number }[];
  };
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function AdminDashboardClient({ stats, trackerStats }: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const statCards = [
    {
      label: "Total Students",
      value: stats.totalStudents,
      sub: `${stats.activeStudents} active students`,
      growth: "",
      isPositive: true,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      href: "/admin/students",
    },
    {
      label: "Study Notes",
      value: stats.totalNotes,
      sub: "Revision materials",
      growth: "",
      isPositive: true,
      icon: BookOpen,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      href: "/admin/notes",
    },
    {
      label: "Question Papers",
      value: stats.totalPapers,
      sub: "Past exams",
      growth: "All grades covered",
      isPositive: true,
      icon: ClipboardList,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
      href: "/admin/papers",
    },
    {
      label: "Announcements",
      value: stats.totalAnnouncements,
      sub: "Published updates",
      growth: "Active notices",
      isPositive: true,
      icon: Megaphone,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      href: "/admin/announcements",
    },
  ];

  const quickActions = [
    { label: "Add Student", href: "/admin/students", icon: Users, color: "text-blue-500 bg-blue-500/10" },
    { label: "Enter Marks", href: "/admin/marks", icon: TrendingUp, color: "text-emerald-500 bg-emerald-500/10" },
    { label: "Upload Notes", href: "/admin/notes", icon: BookOpen, color: "text-amber-500 bg-amber-500/10" },
    { label: "Add Question Paper", href: "/admin/papers", icon: ClipboardList, color: "text-purple-500 bg-purple-500/10" },
    { label: "Create Timetable", href: "/admin/timetable", icon: Clock, color: "text-rose-500 bg-rose-500/10" },
    { label: "New Announcement", href: "/admin/announcements", icon: Megaphone, color: "text-pink-500 bg-pink-500/10" },
    { label: "Sync Sheets", href: "/admin/sync", icon: RefreshCw, color: "text-zinc-500 bg-zinc-500/10" },
  ];

  // Visual chart representation data
  const resourceData = [
    { name: "Notes", value: stats.totalNotes, color: "#10b981" },
    { name: "Papers", value: stats.totalPapers, color: "#a855f7" },
    { name: "Notices", value: stats.totalAnnouncements, color: "#f59e0b" },
  ];

  const gradeData = stats.gradeData || [];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Stat Cards Row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} href={card.href} className="card-premium p-5 flex flex-col justify-between hover:-translate-y-1 transition-all cursor-pointer">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{card.label}</span>
                  <div className={`w-9 h-9 ${card.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{card.value}</p>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border-subtle">
                <span className="text-xs text-muted-foreground">{card.sub}</span>
                {card.growth && <span className="text-xxs font-bold text-emerald-600 dark:text-emerald-400">{card.growth}</span>}
              </div>
            </Link>
          );
        })}
      </motion.div>

      {/* Admin Tracker Widget */}
      {trackerStats && (
        <motion.div variants={itemVariants} className="card-premium p-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-emerald-500/10 rounded-xl">
                <Activity className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">Prayer Tracker Overview (Today)</h3>
                <p className="text-sm text-zinc-500">Live monitoring of today's student submissions</p>
              </div>
            </div>
            <Link 
              href="/admin/tracker" 
              className="mt-4 md:mt-0 flex items-center gap-2 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 text-sm font-semibold rounded-xl transition-colors shadow-sm"
            >
              Manage Trackers
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900/30">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">Completed Today</p>
              <p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{trackerStats.completedToday}</p>
            </div>
            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 border border-amber-100 dark:border-amber-900/30">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">Pending Update</p>
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">{trackerStats.pendingToday}</p>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-900/30">
              <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Quran Pages Today</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{trackerStats.quranPagesToday}</p>
            </div>
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-900/30">
              <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Avg Completion Rate</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{trackerStats.avgCompletionRate}%</p>
            </div>
          </div>

          {trackerStats.topStudents && trackerStats.topStudents.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Top 10 Students (This Month)</p>
              <div className="flex flex-wrap gap-2">
                {trackerStats.topStudents.map((stu, i) => (
                  <div key={stu.admissionNumber} className="flex items-center gap-2 px-3 py-1.5 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">#{i + 1}</span>
                    <span className="font-medium text-zinc-900 dark:text-zinc-100 truncate max-w-[120px]">{stu.name}</span>
                    <span className="text-xs text-zinc-500">({stu.score} pts)</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Analytics Charts Section */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student Enrollment Chart */}
        <div className="lg:col-span-2 card-premium p-6 h-[360px] flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-zinc-50">Student Enrollment</h2>
              <p className="text-xs text-muted-foreground">Class strength distributed across grades</p>
            </div>
            <span className="text-xxs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-900 border border-border-subtle rounded-lg text-zinc-600 dark:text-zinc-400">
              Grade Strength Chart
            </span>
          </div>
          <div className="flex-1 min-h-0 w-full">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={gradeData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="grade" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-subtle)",
                      borderRadius: "12px",
                      color: "var(--text-main)",
                    }}
                  />
                  <Bar dataKey="students" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={38} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Loading chart...</div>
            )}
          </div>
        </div>

        {/* Resources Allocation Pie */}
        <div className="card-premium p-6 h-[360px] flex flex-col">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-50">Resource Allocation</h2>
          <p className="text-xs text-muted-foreground mb-4">Notes, Papers, and Notices composition</p>
          <div className="flex-1 min-h-0 w-full relative flex items-center justify-center">
            {mounted ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={resourceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {resourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-subtle)",
                      borderRadius: "12px",
                      color: "var(--text-main)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">Loading...</div>
            )}
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-2xl font-black text-zinc-900 dark:text-zinc-50">
                {stats.totalNotes + stats.totalPapers + stats.totalAnnouncements || 0}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">Files</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 text-center">
            {resourceData.map((d) => (
              <div key={d.name} className="flex flex-col items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                  <span className="text-[10px] font-semibold text-muted-foreground">{d.name}</span>
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Row 3 - Timelines, Actions */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions Card */}
        <div className="lg:col-span-1 card-premium p-6">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1.5 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-500" />
            Quick Actions
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Common administrative workflow triggers</p>
          <div className="space-y-2">
            {quickActions.map(({ label, href, icon: Icon, color }) => (
              <Link
                key={label}
                href={href}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-border-subtle transition-all group"
              >
                <div className={`w-8.5 h-8.5 ${color} rounded-lg flex items-center justify-center transition-colors group-hover:scale-105`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 group-hover:text-emerald-500 transition-colors">
                  {label}
                </span>
                <ArrowUpRight className="w-4 h-4 ml-auto text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>

        {/* Audit Activity timeline */}
        <div className="lg:col-span-2 card-premium p-6 flex flex-col">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1.5 flex items-center gap-2">
            <Activity className="w-5 h-5 text-purple-500" />
            System Audit Log
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Latest administrative actions log</p>

          {stats.recentActivity.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
              <Activity className="w-10 h-10 text-zinc-300 dark:text-zinc-800 mb-3 animate-pulse" />
              <p className="text-sm text-muted-foreground">No recent actions logged</p>
            </div>
          ) : (
            <div className="space-y-4 flex-1">
              {stats.recentActivity.slice(0, 4).map((log, index) => (
                <div key={log.id} className="relative flex items-start gap-4">
                  {/* Timeline bullet */}
                  <div className="flex flex-col items-center flex-shrink-0 mt-1">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-950 z-10" />
                    {index < stats.recentActivity.length - 1 && (
                      <div className="w-0.5 bg-border-subtle absolute h-full top-3" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0 bg-zinc-50/50 dark:bg-zinc-900/10 border border-border-subtle p-3 rounded-xl">
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-tight">
                      {log.details}
                    </p>
                    <div className="flex items-center gap-3 text-xxs text-muted-foreground mt-2">
                      <span className="font-semibold text-emerald-600 dark:text-emerald-400 capitalize">
                        {log.action}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(log.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
