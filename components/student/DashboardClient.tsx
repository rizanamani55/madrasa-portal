"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  BookOpen,
  Megaphone,
  FileText,
  TrendingUp,
  ChevronRight,
  AlertCircle,
  Clock,
  ArrowUpRight,
  ClipboardList,
  Calendar,
  Sparkles,
} from "lucide-react";
import { Student, Announcement, Mark } from "@/lib/types";
import { formatDate, getGradeColor, getPriorityColor, truncate } from "@/lib/utils";
import type { Session } from "next-auth";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface QuickStat {
  label: string;
  value: number | string;
  icon: React.ElementType;
  href: string;
  color: string;
  bg: string;
  growth?: string;
  description: string;
}

interface Props {
  student: Student | undefined;
  announcements: Announcement[];
  recentMarks: Mark[];
  session: Session | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

export default function DashboardClient({
  student,
  announcements,
  recentMarks,
  session,
}: Props) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const firstName = student?.name?.split(" ")[0] ?? session?.user?.name?.split(" ")[0] ?? "Student";
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  // Calculate stats
  const getSubjectPercentage = (m: Mark) => {
    let obtained = 0;
    let max = 0;
    if (m.unitTest !== null && m.unitTest !== undefined) { obtained += m.unitTest; max += 100; }
    if (m.midterm !== null && m.midterm !== undefined) { obtained += m.midterm; max += 100; }
    if (m.finalExam !== null && m.finalExam !== undefined) { obtained += m.finalExam; max += 100; }
    return { obtained, max, pct: max > 0 ? Math.round((obtained / max) * 100) : 0 };
  };

  const totalObtained = recentMarks.reduce((s, m) => s + getSubjectPercentage(m).obtained, 0);
  const totalMax = recentMarks.reduce((s, m) => s + getSubjectPercentage(m).max, 0);
  const overallPct = totalMax > 0 ? Math.round((totalObtained / totalMax) * 100) : null;

  const stats: QuickStat[] = [
    {
      label: "Overall Score",
      value: overallPct !== null ? `${overallPct}%` : "—",
      icon: TrendingUp,
      href: "/results",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      growth: overallPct ? "↑ +1.2% this term" : undefined,
      description: "Average mark across subjects",
    },
    {
      label: "Exam Results",
      value: recentMarks.length,
      icon: FileText,
      href: "/results",
      color: "text-blue-500",
      bg: "bg-blue-500/10",
      growth: `${recentMarks.length} total entries`,
      description: "Published examination papers",
    },
    {
      label: "School Updates",
      value: announcements.length,
      icon: Megaphone,
      href: "/announcements",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      growth: "View school notices",
      description: "Announcements & events",
    },
  ];

  // Chart data format
  const chartData = recentMarks
    .map((m) => ({
      subject: m.subject.length > 10 ? `${m.subject.substring(0, 10)}...` : m.subject,
      score: getSubjectPercentage(m).pct,
    }))
    .reverse();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="relative overflow-hidden rounded-2xl pattern-bg p-6 lg:p-8 text-white border border-emerald-500/10 shadow-lg shadow-emerald-550/5"
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white/5 -translate-y-1/2 translate-x-1/2 blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-emerald-200 text-xs font-semibold uppercase tracking-wider">{greeting},</p>
            <h1 className="text-3xl font-extrabold mt-1 tracking-tight">{firstName} 👋</h1>
            <p className="text-emerald-100 text-sm mt-1.5 font-medium">
              Grade: <span className="font-bold text-white">{student?.grade}</span> · Admission No: <span className="font-mono text-white">{student?.admissionNumber}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/profile"
              className="px-4 py-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl text-sm font-semibold border border-white/10 transition-colors shadow-sm"
            >
              View Profile
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Stats Grid */}
      <motion.div variants={itemVariants}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className="card-premium p-5 flex items-start gap-4 hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className={`w-12 h-12 ${stat.bg} rounded-2xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="text-sm font-medium text-muted-foreground">{stat.label}</span>
                  <p className="text-3xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight mt-1 leading-tight">
                    {stat.value}
                  </p>
                  {stat.growth && (
                    <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block">
                      {stat.growth}
                    </span>
                  )}
                  <p className="text-xs text-muted-foreground mt-1.5">{stat.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </motion.div>

      {/* Analytics & Progression */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Chart */}
        <div className="lg:col-span-2 card-premium p-6 flex flex-col h-[380px]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                Academic Progress
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">Percentage scores across examinations</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-zinc-100 dark:bg-zinc-900 border border-border-subtle rounded-lg text-zinc-600 dark:text-zinc-400">
              Grade Score Progression
            </span>
          </div>

          <div className="flex-1 min-h-0 w-full">
            {mounted && chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-subtle)" />
                  <XAxis dataKey="subject" tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: "var(--text-muted)" }} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--bg-card)",
                      borderColor: "var(--border-subtle)",
                      borderRadius: "12px",
                      color: "var(--text-main)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#scoreColor)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                No scoring data available for chart rendering
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Panel */}
        <div className="card-premium p-6 flex flex-col h-[380px] overflow-y-auto">
          <h2 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            Quick Resources
          </h2>
          <p className="text-xs text-muted-foreground mb-4">Direct shortcuts to essential school files</p>
          <div className="space-y-2.5 flex-1">
            {[
              { href: "/notes", icon: BookOpen, label: "Browse Study Notes", desc: "Download PDF guides", color: "bg-emerald-500/10 text-emerald-500" },
              { href: "/papers", icon: ClipboardList, label: "Practice Papers", desc: "Past exam question banks", color: "bg-blue-500/10 text-blue-500" },
              { href: "/timetable", icon: Clock, label: "Class Timetable", desc: "View daily periods & timings", color: "bg-purple-500/10 text-purple-500" },
              { href: "/results", icon: FileText, label: "Detailed Results", desc: "Term scoring breakdowns", color: "bg-amber-500/10 text-amber-500" },
            ].map(({ href, icon: Icon, label, desc, color }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 border border-transparent hover:border-border-subtle transition-all group"
              >
                <div className={`w-9 h-9 ${color} rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-500 transition-colors">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Dynamic Activity / Announcements */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Notices */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-amber-500" />
              Recent Announcements
            </h2>
            <Link
              href="/announcements"
              className="text-xs text-emerald-500 hover:text-emerald-600 flex items-center gap-0.5 font-semibold"
            >
              View all <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {announcements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Megaphone className="w-10 h-10 text-zinc-300 dark:text-zinc-800 mb-3" />
              <p className="text-sm text-muted-foreground">No recent announcements</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.slice(0, 3).map((ann) => (
                <div
                  key={ann.id}
                  className={`p-4 rounded-xl border border-border-subtle bg-zinc-50/50 dark:bg-zinc-900/20 priority-${ann.priority.toLowerCase()}`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1.5">
                        {ann.priority === "Urgent" && (
                          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                        <h3 className="font-bold text-sm text-zinc-950 dark:text-zinc-50 truncate">
                          {ann.title}
                        </h3>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {truncate(ann.content, 140)}
                      </p>
                    </div>
                    <span className={`badge-premium flex-shrink-0 text-xxs ${getPriorityColor(ann.priority)}`}>
                      {ann.priority}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xxs text-muted-foreground mt-3 pt-3 border-t border-border-subtle/50">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(ann.publishDate)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Timetable Glance */}
        <div className="card-premium p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-purple-500" />
              Weekly Class Schedule
            </h2>
            <Link
              href="/timetable"
              className="text-xs text-emerald-500 hover:text-emerald-600 flex items-center gap-0.5 font-semibold"
            >
              Full Schedule <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex flex-col justify-center items-center py-10 text-center border border-dashed border-border-subtle rounded-2xl bg-zinc-50/30 dark:bg-zinc-900/10">
            <Clock className="w-10 h-10 text-purple-400 dark:text-purple-650/40 mb-3" />
            <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">Timetable Overview</p>
            <p className="text-xs text-muted-foreground max-w-xs mt-1.5">
              Click &lsquo;Full Schedule&rsquo; to view period timings, classroom assignments, and teachers.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
