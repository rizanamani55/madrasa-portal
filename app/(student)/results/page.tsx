import { Metadata } from "next";
import { getMyMarks } from "@/actions/marks";
import { formatDate, getGradeColor, calcPercentage } from "@/lib/utils";
import { FileText, TrendingUp, AlertCircle, HelpCircle } from "lucide-react";
import { Mark } from "@/lib/types";

export const metadata: Metadata = { title: "Examination Results" };

function groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
  return arr.reduce((acc, item) => {
    const k = String(item[key]);
    return { ...acc, [k]: [...(acc[k] ?? []), item] };
  }, {} as Record<string, T[]>);
}

const getSubjectStats = (m: Mark) => {
  let obtained = 0;
  let max = 0;
  if (m.unitTest !== null && m.unitTest !== undefined) { obtained += m.unitTest; max += 100; }
  if (m.midterm !== null && m.midterm !== undefined) { obtained += m.midterm; max += 100; }
  if (m.finalExam !== null && m.finalExam !== undefined) { obtained += m.finalExam; max += 100; }
  const pct = max > 0 ? Math.round((obtained / max) * 100) : 0;
  return { obtained, max, pct };
};

export default async function ResultsPage() {
  const res = await getMyMarks();
  const marks = res.data ?? [];

  if (marks.length === 0) {
    return (
      <div className="card-premium flex flex-col items-center justify-center py-20 text-center border-dashed">
        <FileText className="w-12 h-12 text-muted-foreground mb-4" />
        <h3 className="font-bold text-zinc-950 dark:text-zinc-100">No results published yet</h3>
        <p className="text-xs text-muted-foreground mt-1">Academics results will appear here once exams are graded.</p>
      </div>
    );
  }

  // Group marks by academic year
  const grouped = groupBy(marks, "academicYear");
  
  const totalObtained = marks.reduce((s, m) => s + getSubjectStats(m).obtained, 0);
  const totalMax = marks.reduce((s, m) => s + getSubjectStats(m).max, 0);
  const overallPct = totalMax > 0 ? calcPercentage(totalObtained, totalMax) : 0;

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Overall Score summaries */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="card-premium p-5 flex flex-col items-center text-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Overall Average</span>
            <p className="text-4xl font-extrabold text-emerald-550 dark:text-emerald-400 mt-2 tracking-tight">{overallPct}%</p>
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border-subtle w-full">Across all examinations</p>
        </div>
        <div className="card-premium p-5 flex flex-col items-center text-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Total Marks Obtained</span>
            <p className="text-4xl font-extrabold text-zinc-900 dark:text-zinc-50 mt-2 tracking-tight">{totalObtained}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border-subtle w-full">Aggregated score</p>
        </div>
        <div className="card-premium p-5 flex flex-col items-center text-center justify-between">
          <div>
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Maximum Marks</span>
            <p className="text-4xl font-extrabold text-zinc-400 dark:text-zinc-650 mt-2 tracking-tight">{totalMax}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border-subtle w-full">Total possible score</p>
        </div>
      </div>

      {/* Terms list */}
      {Object.entries(grouped).map(([academicYear, yearMarks]) => {
        const yearObtained = yearMarks.reduce((s, m) => s + getSubjectStats(m).obtained, 0);
        const yearMax = yearMarks.reduce((s, m) => s + getSubjectStats(m).max, 0);
        const yearPct = yearMax > 0 ? calcPercentage(yearObtained, yearMax) : 0;

        return (
          <div key={academicYear} className="card-premium overflow-hidden">
            {/* Header info */}
            <div className="px-5 py-4 bg-zinc-50/50 dark:bg-zinc-900/10 border-b border-border-subtle flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-550 dark:text-emerald-400" />
                <h3 className="font-bold text-zinc-900 dark:text-zinc-50 leading-tight">Academic Year {academicYear}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-muted-foreground">
                  {yearObtained}/{yearMax}
                </span>
                <span className={`badge-premium text-xxs font-bold ${getGradeColor(
                  yearPct >= 90 ? "A+" : yearPct >= 80 ? "A" : yearPct >= 70 ? "B+" : yearPct >= 60 ? "B" : yearPct >= 50 ? "C" : "F"
                )}`}>
                  {yearPct}%
                </span>
              </div>
            </div>

            {/* Marks Table */}
            <div className="overflow-x-auto">
              <table className="table-premium">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th className="text-center">Unit Test</th>
                    <th className="text-center">Midterm</th>
                    <th className="text-center">Final</th>
                    <th className="text-center">Total</th>
                    <th className="text-center">Percentage</th>
                    <th className="text-center">Grade</th>
                  </tr>
                </thead>
                <tbody>
                  {yearMarks.map((mark) => {
                    const stats = getSubjectStats(mark);
                    const gradeLetter = stats.pct >= 90 ? "A+" : stats.pct >= 80 ? "A" : stats.pct >= 70 ? "B+" : stats.pct >= 60 ? "B" : stats.pct >= 50 ? "C" : "F";
                    return (
                      <tr key={mark.id} className="table-row-premium">
                        <td className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {mark.subject}
                        </td>
                        <td className="text-center text-muted-foreground">
                          {mark.unitTest !== null && mark.unitTest !== undefined ? mark.unitTest : "-"}
                        </td>
                        <td className="text-center text-muted-foreground">
                          {mark.midterm !== null && mark.midterm !== undefined ? mark.midterm : "-"}
                        </td>
                        <td className="text-center text-muted-foreground">
                          {mark.finalExam !== null && mark.finalExam !== undefined ? mark.finalExam : "-"}
                        </td>
                        <td className="text-center font-bold text-zinc-900 dark:text-zinc-100">
                          {stats.obtained} / {stats.max}
                        </td>
                        <td className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-16 bg-zinc-100 dark:bg-zinc-900 rounded-full h-1.5 overflow-hidden">
                              <div
                                className="bg-emerald-500 h-full rounded-full"
                                style={{ width: `${stats.pct}%` }}
                              />
                            </div>
                            <span className="text-xxs font-semibold text-zinc-800 dark:text-zinc-300 w-8 text-right">
                              {stats.pct}%
                            </span>
                          </div>
                        </td>
                        <td className="text-center">
                          <span className={`badge-premium text-xxs font-bold ${getGradeColor(gradeLetter)}`}>
                            {gradeLetter}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );
}
