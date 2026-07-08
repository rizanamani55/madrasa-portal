import { Metadata } from "next";
import { getMyTimetable } from "@/actions/timetable";
import { Clock, AlertCircle, HelpCircle } from "lucide-react";
import { DAYS_OF_WEEK } from "@/lib/constants/grades";
import { TimetablePeriod } from "@/lib/types";

export const metadata: Metadata = { title: "Timetable" };

const DAY_COLORS: Record<string, string> = {
  Monday: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  Tuesday: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  Wednesday: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  Thursday: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  Friday: "bg-rose-500/10 text-rose-600 dark:text-rose-400",
  Saturday: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
  Sunday: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
};

export default async function TimetablePage() {
  const res = await getMyTimetable();
  const periods = res.data ?? [];

  const days = DAYS_OF_WEEK.filter((day) =>
    periods.some((p) => p.day === day)
  );

  if (periods.length === 0) {
    return (
      <div className="card-premium flex flex-col items-center justify-center py-20 text-center border-dashed">
        <Clock className="w-12 h-12 text-muted-foreground mb-4 animate-pulse" />
        <h3 className="font-bold text-zinc-950 dark:text-zinc-100">Timetable not published yet</h3>
        <p className="text-xs text-muted-foreground mt-1">Class timings and weekly schedule will appear here.</p>
      </div>
    );
  }

  // Group periods by day
  const byDay: Record<string, TimetablePeriod[]> = {};
  for (const day of days) {
    byDay[day] = periods
      .filter((p) => p.day === day)
      .sort((a, b) => a.periodNumber - b.periodNumber);
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Day Cards */}
      <div className="grid grid-cols-1 gap-6">
        {days.map((day) => {
          const dayPeriods = byDay[day];
          const colorClass = DAY_COLORS[day] ?? DAY_COLORS.Monday;
          return (
            <div key={day} className="card-premium overflow-hidden">
              {/* Day header */}
              <div
                className={`px-5 py-4 border-b border-border-subtle ${colorClass} flex items-center justify-between font-bold text-sm`}
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4.5 h-4.5" />
                  {day}
                </span>
                <span className="text-xxs font-bold uppercase tracking-wider opacity-80">
                  {dayPeriods.length} period{dayPeriods.length !== 1 ? "s" : ""} scheduled
                </span>
              </div>

              {/* Periods List */}
              <div className="divide-y divide-border-subtle">
                {dayPeriods.map((period) => (
                  <div
                    key={period.id}
                    className="flex items-center gap-4 px-5 py-4 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
                  >
                    {/* Period number */}
                    <div className="w-9 h-9 bg-zinc-100 dark:bg-zinc-900 rounded-xl flex items-center justify-center flex-shrink-0 text-zinc-700 dark:text-zinc-400 font-extrabold text-xs border border-border-subtle">
                      P{period.periodNumber}
                    </div>

                    {/* Timings */}
                    <div className="text-xs font-semibold text-muted-foreground w-28 flex-shrink-0">
                      {period.startTime} – {period.endTime}
                    </div>

                    {/* Subject info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-zinc-950 dark:text-zinc-100 text-sm leading-tight">
                        {period.subject}
                      </p>
                      {(period.teacher || period.classroom) && (
                        <p className="text-xs text-muted-foreground mt-1 font-medium">
                          {[period.teacher, period.classroom]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </div>

                    {/* Remarks Tag */}
                    {period.remarks && (
                      <span className="badge-premium bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xxs font-bold flex-shrink-0">
                        {period.remarks}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
