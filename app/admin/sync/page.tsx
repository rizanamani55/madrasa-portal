"use client";

import { motion } from "framer-motion";
import { RefreshCw, Database } from "lucide-react";

export default function SyncPage() {
  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Status Banner */}
      <div className="card-premium p-5 bg-emerald-500/5 border-emerald-500/20">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 bg-emerald-555/10 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-555/20 flex-shrink-0">
            <RefreshCw className="w-5.5 h-5.5 text-emerald-500" />
          </div>
          <div>
            <p className="font-bold text-emerald-650 dark:text-emerald-400">Database Active</p>
            <p className="text-muted-foreground text-xs leading-relaxed">All data operations are written directly to Supabase in real-time.</p>
          </div>
        </div>
      </div>

      {/* Database Structure */}
      <div className="card-premium p-6">
        <h2 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Supabase Configuration
        </h2>
        <p className="text-sm text-muted-foreground mb-4">
          Your portal is currently connected to a powerful Supabase PostgreSQL backend. Real-time syncing is handled natively by the server actions and the database itself.
        </p>
        <div className="space-y-2">
          {[
            { table: "students", cols: "admission_number, name, parent_name, grade, phone, status" },
            { table: "marks", cols: "id, student_id, subject, grade, academic_year, unit_test, midterm, final_exam, remarks" },
            { table: "notes", cols: "id, grade, subject, title, description, file_id, file_name, upload_date, uploaded_by" },
            { table: "question_papers", cols: "id, grade, subject, exam_type, academic_year, title, file_id, file_name, upload_date, uploaded_by" },
            { table: "timetables", cols: "id, grade, day_of_week, period_number, start_time, end_time, subject, teacher, classroom, remarks" },
            { table: "announcements", cols: "id, title, content, type, priority, publish_date, expiry_date, published_by, is_active" },
            { table: "audit_logs", cols: "id, timestamp, action, performed_by, details" },
          ].map(({ table, cols }) => (
            <div key={table} className="flex items-start gap-3 p-3.5 rounded-xl hover:bg-zinc-100/50 dark:hover:bg-zinc-900/10 border border-transparent hover:border-border-subtle transition-colors">
              <span className="badge-premium bg-emerald-550/10 text-emerald-600 dark:text-emerald-400 text-xxs font-bold flex-shrink-0 mt-0.5">{table}</span>
              <p className="text-xs text-muted-foreground font-mono truncate">{cols}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
