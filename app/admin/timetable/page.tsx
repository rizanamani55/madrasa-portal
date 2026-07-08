"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Clock, X, Loader2, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { TimetablePeriod } from "@/lib/types";
import { GRADES, SUBJECTS_BY_GRADE, DAYS_OF_WEEK } from "@/lib/constants/grades";
import { fetchAllTimetable, addPeriod, removePeriod } from "@/actions/timetable";

const DAY_COLORS: Record<string, string> = {
  Monday: "bg-blue-500/10 text-blue-650 dark:text-blue-400 border-b border-border-subtle",
  Tuesday: "bg-purple-500/10 text-purple-650 dark:text-purple-400 border-b border-border-subtle",
  Wednesday: "bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border-b border-border-subtle",
  Thursday: "bg-amber-500/10 text-amber-650 dark:text-amber-400 border-b border-border-subtle",
  Friday: "bg-rose-500/10 text-rose-650 dark:text-rose-400 border-b border-border-subtle",
  Saturday: "bg-zinc-500/10 text-zinc-650 dark:text-zinc-400 border-b border-border-subtle",
  Sunday: "bg-orange-500/10 text-orange-650 dark:text-orange-400 border-b border-border-subtle",
};

export default function AdminTimetablePage() {
  const [periods, setPeriods] = useState<TimetablePeriod[]>([]);
  const [gradeFilter, setGradeFilter] = useState<string>("Grade 1");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => { loadTimetable(); }, []);

  async function loadTimetable() {
    const res = await fetchAllTimetable();
    if (res.success) setPeriods(res.data ?? []);
  }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = periods
    .filter((p) => p.grade === gradeFilter)
    .sort((a, b) => {
      const days = [...DAYS_OF_WEEK];
      const dayDiff = days.indexOf(a.day as typeof DAYS_OF_WEEK[number]) - days.indexOf(b.day as typeof DAYS_OF_WEEK[number]);
      return dayDiff !== 0 ? dayDiff : a.periodNumber - b.periodNumber;
    });

  const days = DAYS_OF_WEEK.filter((d) => filtered.some((p) => p.day === d));

  async function handleDelete(id: string) {
    if (!confirm("Delete this period?")) return;
    startTransition(async () => {
      const res = await removePeriod(id);
      if (res.success) { await loadTimetable(); showToast("success", "Period deleted successfully"); }
      else showToast("error", res.error ?? "Failed");
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Timetable Planner</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Manage weekly class periods schedule</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium-primary">
          <Plus className="w-4 h-4" />Add Period
        </button>
      </div>

      {/* Grade tabs */}
      <div className="flex gap-2 flex-wrap bg-zinc-100/50 dark:bg-zinc-900/10 p-1.5 rounded-2xl border border-border-subtle">
        {GRADES.map((g) => (
          <button
            key={g}
            onClick={() => setGradeFilter(g)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${gradeFilter === g ? "bg-emerald-500 text-white shadow-sm" : "text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-50"}`}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Timetable planner */}
      {filtered.length === 0 ? (
        <div className="card-premium flex flex-col items-center justify-center py-20 text-center border-dashed">
          <Clock className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">No scheduled periods for {gradeFilter}</p>
          <button onClick={() => setShowForm(true)} className="mt-4 btn-premium-primary text-xs">
            <Plus className="w-4 h-4" />Add Period
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {days.map((day) => {
            const dayPeriods = filtered.filter((p) => p.day === day);
            return (
              <div key={day} className="card-premium overflow-hidden">
                <div className={`px-5 py-3.5 ${DAY_COLORS[day] ?? "bg-zinc-50 text-zinc-800"} flex items-center justify-between font-bold`}>
                  <span className="flex items-center gap-2 text-sm"><Clock className="w-4.5 h-4.5" />{day}</span>
                  <span className="text-xxs uppercase tracking-wider opacity-85">{dayPeriods.length} period{dayPeriods.length !== 1 ? "s" : ""}</span>
                </div>
                <div className="divide-y divide-border-subtle">
                  {dayPeriods.map((period) => (
                    <div key={period.id} className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors">
                      <div className="w-9 h-9 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0 text-zinc-700 dark:text-zinc-400 font-extrabold text-xs border border-border-subtle">
                        P{period.periodNumber}
                      </div>
                      <div className="text-xs font-semibold text-muted-foreground w-28 flex-shrink-0">{period.startTime} – {period.endTime}</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-zinc-950 dark:text-zinc-100 text-sm leading-tight">{period.subject}</p>
                        {(period.teacher || period.classroom) && (
                          <p className="text-xs text-muted-foreground mt-1 font-medium">{[period.teacher, period.classroom].filter(Boolean).join(" · ")}</p>
                        )}
                      </div>
                      {period.remarks && <span className="badge-premium bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xxs font-bold">{period.remarks}</span>}
                      <button onClick={() => handleDelete(period.id)} disabled={isPending} className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-550 transition-colors flex-shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <AddPeriodModal
            defaultGrade={gradeFilter}
            onClose={() => setShowForm(false)}
            onSubmit={async (data) => {
              startTransition(async () => {
                const res = await addPeriod(data);
                if (res.success) { await loadTimetable(); setShowForm(false); showToast("success", "Period schedule added"); }
                else showToast("error", res.error ?? "Failed");
              });
            }}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toast && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.type === "success" ? "bg-emerald-600" : "bg-red-650"}`}>
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AddPeriodModalProps {
  defaultGrade: string;
  onClose: () => void;
  onSubmit: (data: Omit<TimetablePeriod, "id">) => void;
  isPending: boolean;
}

function AddPeriodModal({ defaultGrade, onClose, onSubmit, isPending }: AddPeriodModalProps) {
  const [grade, setGrade] = useState(defaultGrade);
  const [day, setDay] = useState<string>("Monday");
  const [periodNumber, setPeriodNumber] = useState("1");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:45");
  const [subject, setSubject] = useState("");
  const [teacher, setTeacher] = useState("");
  const [classroom, setClassroom] = useState("");
  const [remarks, setRemarks] = useState("");

  const subjects = SUBJECTS_BY_GRADE[grade as keyof typeof SUBJECTS_BY_GRADE] ?? [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({
      grade: grade as TimetablePeriod["grade"],
      day: day as TimetablePeriod["day"],
      periodNumber: Number(periodNumber),
      startTime, endTime, subject, teacher, classroom, remarks,
    });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-card dark:bg-zinc-930 border border-border-subtle rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle sticky top-0 bg-card dark:bg-zinc-930 z-10">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Add Class Period</h3>
          <button onClick={onClose} className="p-2 hover:bg-border-subtle rounded-xl text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Grade</label>
              <select value={grade} onChange={(e) => setGrade(e.target.value)} className="input-premium cursor-pointer">
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Day</label>
              <select value={day} onChange={(e) => setDay(e.target.value)} className="input-premium cursor-pointer">
                {DAYS_OF_WEEK.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Period #</label>
              <input type="number" value={periodNumber} onChange={(e) => setPeriodNumber(e.target.value)} min={1} max={10} required className="input-premium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Start Time</label>
              <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required className="input-premium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">End Time</label>
              <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required className="input-premium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Subject</label>
            <select value={subject} onChange={(e) => setSubject(e.target.value)} required className="input-premium cursor-pointer">
              <option value="">Select...</option>
              {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Teacher (optional)</label>
              <input type="text" value={teacher} onChange={(e) => setTeacher(e.target.value)} placeholder="Teacher name" className="input-premium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Classroom (optional)</label>
              <input type="text" value={classroom} onChange={(e) => setClassroom(e.target.value)} placeholder="Room number" className="input-premium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Remarks (optional)</label>
            <input type="text" value={remarks} onChange={(e) => setRemarks(e.target.value)} placeholder="e.g. Lab session" className="input-premium" />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" onClick={onClose} className="btn-premium-secondary">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-premium-primary disabled:opacity-75">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : "Add Period"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
