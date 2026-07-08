"use client";

import { useState, useTransition, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Search, Trash2, BookOpen, X, Loader2, Link2, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { Note } from "@/lib/types";
import { GRADES, SUBJECTS_BY_GRADE } from "@/lib/constants/grades";
import { formatDate } from "@/lib/utils";
import { fetchAllNotes, addNote, removeNote } from "@/actions/notes";
import { supabase } from "@/lib/supabase/client";

export default function AdminNotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => { loadNotes(); }, []);

  async function loadNotes() {
    const res = await fetchAllNotes();
    if (res.success) setNotes(res.data ?? []);
  }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = notes.filter((n) => {
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) || n.subject.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "all" || n.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  async function handleDelete(id: string) {
    if (!confirm("Delete this note?")) return;
    startTransition(async () => {
      const res = await removeNote(id);
      if (res.success) { await loadNotes(); showToast("success", "Note deleted successfully"); }
      else showToast("error", res.error ?? "Failed");
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Study Notes</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{notes.length} resource documents uploaded</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium-primary">
          <Plus className="w-4 h-4" />Upload Note
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search notes..." className="input-premium pl-10" />
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
                <th className="hidden md:table-cell">Uploaded</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-16 text-muted-foreground bg-card"><HelpCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" /><p className="font-semibold text-zinc-950 dark:text-zinc-100">No notes found</p></td></tr>
              ) : filtered.map((n) => (
                <tr key={n.id} className="table-row-premium">
                  <td>
                    <p className="font-semibold text-zinc-900 dark:text-zinc-50">{n.title}</p>
                    {n.chapter && <p className="text-xs text-muted-foreground mt-0.5">{n.chapter}</p>}
                  </td>
                  <td><span className="badge-premium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xxs font-bold">{n.grade}</span></td>
                  <td className="text-zinc-700 dark:text-zinc-300 font-medium">{n.subject}</td>
                  <td className="text-muted-foreground text-xs hidden md:table-cell">{formatDate(n.uploadDate)}</td>
                  <td className="text-right">
                    <button onClick={() => handleDelete(n.id)} disabled={isPending} className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <UploadNoteModal
            onClose={() => setShowForm(false)}
            onSuccess={async () => { await loadNotes(); setShowForm(false); showToast("success", "Note uploaded successfully"); }}
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

interface UploadNoteModalProps {
  onClose: () => void;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

function UploadNoteModal({ onClose, onSuccess, onError }: UploadNoteModalProps) {
  const [grade, setGrade] = useState("Grade 1");
  const [subject, setSubject] = useState("");
  const [chapter, setChapter] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const subjects = SUBJECTS_BY_GRADE[grade as keyof typeof SUBJECTS_BY_GRADE] ?? [];

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) { onError("Please provide a valid document link"); return; }
    setUploading(true);
    try {
      const fileId = url.trim();

      const note: Omit<Note, "id"> = {
        grade: grade as Note["grade"],
        subject,
        chapter,
        title,
        description,
        fileId: fileId,
        fileName: "External Resource",
        uploadDate: new Date().toISOString().split("T")[0],
        uploadedBy: "admin",
      };
      const res = await addNote(note, "admin");
      if (!res.success) throw new Error(res.error ?? "Failed to save note");
      onSuccess();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save note");
    } finally {
      setUploading(false);
    }
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-card dark:bg-zinc-930 border border-border-subtle rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Upload Revision Notes</h3>
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
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Chapter 3 Notes" className="input-premium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Chapter (optional)</label>
            <input type="text" value={chapter} onChange={(e) => setChapter(e.target.value)} placeholder="Chapter name or number" className="input-premium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Description (optional)</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} placeholder="Brief description..." className="input-premium resize-none" />
          </div>
          {/* URL picker */}
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
              {uploading ? <><Loader2 className="w-4 h-4 animate-spin" />Saving...</> : <><Link2 className="w-4 h-4" />Save Note</>}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
