"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Megaphone, X, Loader2, AlertCircle, CheckCircle2, HelpCircle } from "lucide-react";
import { Announcement } from "@/lib/types";
import { ANNOUNCEMENT_TYPES, ANNOUNCEMENT_PRIORITIES } from "@/lib/constants/grades";
import { formatDate, getPriorityColor, getAnnouncementTypeColor } from "@/lib/utils";
import { fetchAllAnnouncements, publishAnnouncement, removeAnnouncement } from "@/actions/announcements";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => { loadAnnouncements(); }, []);

  async function loadAnnouncements() {
    const res = await fetchAllAnnouncements();
    if (res.success) setAnnouncements(res.data ?? []);
  }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this announcement?")) return;
    startTransition(async () => {
      const res = await removeAnnouncement(id);
      if (res.success) { await loadAnnouncements(); showToast("success", "Announcement removed successfully"); }
      else showToast("error", res.error ?? "Failed");
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Announcements Noticeboard</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{announcements.length} updates published</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn-premium-primary">
          <Plus className="w-4 h-4" />New Notice
        </button>
      </div>

      {announcements.length === 0 ? (
        <div className="card-premium flex flex-col items-center justify-center py-20 text-center border-dashed">
          <Megaphone className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-100">No announcements published yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann.id} className={`card-premium p-6 border-l-4 priority-${ann.priority.toLowerCase()}`}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-2">
                    <h3 className="font-extrabold text-zinc-900 dark:text-zinc-50 leading-tight text-base">{ann.title}</h3>
                    <span className={`badge-premium text-xxs font-bold ${getAnnouncementTypeColor(ann.type)}`}>{ann.type}</span>
                    <span className={`badge-premium text-xxs font-bold ${getPriorityColor(ann.priority)}`}>{ann.priority}</span>
                    {!ann.isActive && <span className="badge-premium text-xxs bg-zinc-100 text-zinc-500 font-bold">Inactive</span>}
                  </div>
                  <p className="text-sm text-zinc-650 dark:text-zinc-300 leading-relaxed font-medium">{ann.content}</p>
                  <div className="flex items-center gap-4 text-xxs text-muted-foreground mt-4 pt-3 border-t border-border-subtle/50">
                    <span>Published: {formatDate(ann.publishDate)}</span>
                    {ann.expiryDate && <span>Expires: {formatDate(ann.expiryDate)}</span>}
                    <span className="font-bold">By: {ann.publishedBy}</span>
                  </div>
                </div>
                <button onClick={() => handleDelete(ann.id)} disabled={isPending} className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors flex-shrink-0">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <AnnouncementFormModal
            onClose={() => setShowForm(false)}
            onSubmit={async (data) => {
              startTransition(async () => {
                const res = await publishAnnouncement(data);
                if (res.success) { await loadAnnouncements(); setShowForm(false); showToast("success", "Announcement published successfully"); }
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

interface FormModalProps {
  onClose: () => void;
  onSubmit: (data: Omit<Announcement, "id">) => void;
  isPending: boolean;
}

function AnnouncementFormModal({ onClose, onSubmit, isPending }: FormModalProps) {
  const today = new Date().toISOString().split("T")[0];
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("General");
  const [priority, setPriority] = useState("Medium");
  const [publishDate, setPublishDate] = useState(today);
  const [expiryDate, setExpiryDate] = useState("");
  const [isActive, setIsActive] = useState(true);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ title, content, type: type as Announcement["type"], priority: priority as Announcement["priority"], publishDate, expiryDate: expiryDate || undefined, publishedBy: "admin", isActive });
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="bg-card dark:bg-zinc-930 border border-border-subtle rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50">Publish Announcement</h3>
          <button onClick={onClose} className="p-2 hover:bg-border-subtle rounded-xl text-muted-foreground"><X className="w-4 h-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Announcement title" className="input-premium" />
          </div>
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Content</label>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={4} placeholder="Announcement content..." className="input-premium resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Type</label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="input-premium cursor-pointer">
                {ANNOUNCEMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Priority</label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)} className="input-premium cursor-pointer">
                {ANNOUNCEMENT_PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Publish Date</label>
              <input type="date" value={publishDate} onChange={(e) => setPublishDate(e.target.value)} required className="input-premium" />
            </div>
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Expiry Date (optional)</label>
              <input type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} min={publishDate} className="input-premium" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setIsActive(!isActive)} className={`relative inline-flex h-5.5 w-10 items-center rounded-full transition-colors ${isActive ? "bg-emerald-500" : "bg-zinc-350 dark:bg-zinc-800"}`}>
              <span className={`inline-block h-4.5 w-4.5 rounded-full bg-white shadow transition-transform ${isActive ? "translate-x-5" : "translate-x-0.5"}`} />
            </button>
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Publish immediately (visible to portal users)</label>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-border-subtle">
            <button type="button" onClick={onClose} className="btn-premium-secondary">Cancel</button>
            <button type="submit" disabled={isPending} className="btn-premium-primary disabled:opacity-75">
              {isPending ? <><Loader2 className="w-4 h-4 animate-spin" />Publishing...</> : "Publish Notice"}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
