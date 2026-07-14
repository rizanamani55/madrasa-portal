"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, ClipboardList, X, Loader2, Link2, AlertCircle, CheckCircle2, HelpCircle, Eye } from "lucide-react";
import { QuestionPaper } from "@/lib/types";
import { GRADES, SUBJECTS_BY_GRADE, EXAM_TYPES } from "@/lib/constants/grades";
import { formatDate, getCurrentAcademicYear } from "@/lib/utils";
import { fetchAllPapers, addPaper, removePaper } from "@/actions/papers";
import { supabase } from "@/lib/supabase/client";

export default function AdminPapersPage() {
  const [papers, setPapers] = useState<QuestionPaper[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => { loadPapers(); }, []);

  async function loadPapers() {
    const res = await fetchAllPapers();
    if (res.success) setPapers(res.data ?? []);
  }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = papers.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.subject.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "all" || p.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this question paper?")) return;
    startTransition(async () => {
      const res = await removePaper(id);
      if (res.success) { await loadPapers(); showToast("success", "Paper deleted successfully"); }
      else showToast("error", res.error ?? "Failed");
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Question Papers</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{papers.length} question papers uploaded</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium-primary">
          <Plus className="w-4 h-4" />Upload Paper
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search papers..." className="input-premium pl-10" />
        </div>
        <select value={gradeFilter} onChange={(e) => setGradeFilter(e.target.value)} className="input-premium sm:w-48 cursor-pointer">
          <option value="all">All Grades</option>
          {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>

      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Title</th>
                <th>Grade</th>
                <th>Subject</th>
                <th>Exam</th>
                <th className="hidden md:table-cell">Year</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-16 text-muted-foreground bg-card"><HelpCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" /><p className="font-semibold text-zinc-950 dark:text-zinc-100">No papers found</p></td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="table-row-premium">
                  <td className="font-semibold text-zinc-900 dark:text-zinc-50">{p.title}</td>
                  <td><span className="badge-premium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xxs font-bold">{p.grade}</span></td>
                  <td className="text-zinc-755 dark:text-zinc-300 font-medium">{p.subject}</td>
                  <td><span className="badge-premium bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xxs font-bold">{p.examType}</span></td>
                  <td className="text-muted-foreground text-xs hidden md:table-cell">{p.academicYear}</td>
                  <td className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <a
                        href={p.fileId}
                        target="_blank"
                        rel="noopener noreferrer"
                        title="Preview"
                        className="p-2 hover:bg-emerald-500/10 rounded-lg text-muted-foreground hover:text-emerald-600 transition-colors inline-flex"
                      >
                        <Eye className="w-4 h-4" />
                      </a>
                      <button onClick={() => handleDelete(p.id)} disabled={isPending} title="Delete" className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <UploadPaperModal
            onClose={() => setShowForm(false)}
            onSuccess={async () => { await loadPapers(); setShowForm(false); showToast("success", "Question paper uploaded"); }}
            onError={(msg) => showToast("error", msg)}
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

interface UploadPaperModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

function UploadPaperModal({ onClose, onSuccess, onError }: UploadPaperModalProps) {
  const [grade, setGrade] = useState("Grade 1");
  const [subject, setSubject] = useState("");
  const [examType, setExamType] = useState("First Term");
  const [academicYear, setAcademicYear] = useState(getCurrentAcademicYear());
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const subjects = SUBJECTS_BY_GRADE[grade as keyof typeof SUBJECTS_BY_GRADE] ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) { onError("Please provide a valid document link"); return; }
    setUploading(true);
    try {
      const fileId = url.trim();

      const paper: Omit<QuestionPaper, "id"> = {
        grade: grade as QuestionPaper["grade"],
        subject,
        examType: examType as QuestionPaper["examType"],
        academicYear,
        title,
        fileId: fileId,
        fileName: "External Resource",
        uploadDate: new Date().toISOString().split("T")[0],
        uploadedBy: "admin",
      };
      const res = await addPaper(paper, "admin");
      if (!res.success) throw new Error(res.error ?? "Failed to save");
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save paper");
    } finally {
      setUploading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-card dark:bg-zinc-930 border border-border-subtle rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Upload Question Paper</h3>
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
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Subject</label>
              <select value={subject} onChange={(e) => setSubject(e.target.value)} required className="input-premium cursor-pointer">
                <option value="">Select...</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Exam Type</label>
              <select value={examType} onChange={(e) => setExamType(e.target.value)} className="input-premium cursor-pointer">
                {EXAM_TYPES.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Academic Year</label>
              <input type="text" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="2025-2026" className="input-premium" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. First Term Arabic Paper 2025" className="input-premium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Document Link (URL)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Link2 className="h-4 w-4 text-muted-foreground" />
              </div>
              <input 
                type="url" 
                value={url} 
                onChange={(e) => setUrl(e.target.value)} 
                required 
                placeholder="https://drive.google.com/..." 
                className="input-premium pl-9" 
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">Provide a link to a Google Drive file, external PDF, or any accessible web link.</p>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" onClick={onClose} className="btn-premium-secondary">Cancel</button>
            <button type="submit" disabled={uploading} className="btn-premium-primary disabled:opacity-75">
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Link2 className="w-4 h-4" />Save Paper</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
