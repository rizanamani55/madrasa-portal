import { Metadata } from "next";
import { getMyProfile } from "@/actions/student";
import { formatDate } from "@/lib/utils";
import {
  User,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Hash,
  Users,
  AlertCircle,
} from "lucide-react";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const res = await getMyProfile();
  const student = res.data;

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="w-12 h-12 text-zinc-350 dark:text-zinc-700 mb-4 animate-pulse" />
        <p className="text-zinc-650 dark:text-zinc-350 font-bold">Unable to load profile</p>
        <p className="text-xs text-muted-foreground mt-1">Please refresh the page to reload personal records.</p>
      </div>
    );
  }

  const fields = [
    { label: "Admission Number", value: student.admissionNumber, icon: Hash },
    { label: "Full Name", value: student.name, icon: User },
    { label: "Parent's Name", value: student.parentName, icon: Users },
    { label: "Grade", value: student.grade, icon: GraduationCap },
    { label: "Phone", value: student.phone, icon: Phone },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header Profile card */}
      <div className="card-premium p-6 lg:p-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-6 border-b border-border-subtle">
          <div className="w-20 h-20 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-2xl flex items-center justify-center border-2 border-emerald-550/20 flex-shrink-0 text-3xl font-extrabold text-emerald-550 dark:text-emerald-400">
            {student.name.charAt(0).toUpperCase()}
          </div>

          <div className="text-center sm:text-left">
            <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-zinc-50 tracking-tight">{student.name}</h2>
            <p className="text-emerald-550 dark:text-emerald-400 font-bold text-sm mt-0.5">{student.grade}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Admission: <span className="font-mono">{student.admissionNumber}</span>
            </p>
            <span
              className={`badge-premium mt-3 text-xxs font-bold ${
                student.status === "active"
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              ● {student.status === "active" ? "Active Student" : "Inactive"}
            </span>
          </div>
        </div>

        {/* Fields list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
          {fields.map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="flex items-start gap-3.5 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 border border-border-subtle hover:border-emerald-500/20 transition-colors group"
            >
              <div className="w-9 h-9 bg-card border border-border-subtle rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                <Icon className="w-4.5 h-4.5 text-emerald-550 dark:text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {label}
                </span>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 truncate mt-0.5 leading-snug">
                  {value || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
