import { Metadata } from "next";
import { getMyNotes } from "@/actions/notes";
import { getMyPapers } from "@/actions/papers";
import { formatDate, getSupabaseFileUrl } from "@/lib/utils";
import { Download, FileText, BookOpen, ClipboardList, HelpCircle } from "lucide-react";

export const metadata: Metadata = { title: "Downloads" };

export default async function DownloadsPage() {
  const [notesRes, papersRes] = await Promise.all([
    getMyNotes(),
    getMyPapers(),
  ]);

  const notes = notesRes.data ?? [];
  const papers = papersRes.data ?? [];

  const allFiles = [
    ...notes.map((n) => ({
      id: n.id,
      title: n.title,
      subtitle: n.subject + (n.chapter ? ` · ${n.chapter}` : ""),
      fileId: n.fileId,
      fileName: n.fileName,
      uploadDate: n.uploadDate,
      category: "Note" as const,
    })),
    ...papers.map((p) => ({
      id: p.id,
      title: p.title,
      subtitle: `${p.subject} · ${p.examType}`,
      fileId: p.fileId,
      fileName: p.fileName,
      uploadDate: p.uploadDate,
      category: "Question Paper" as const,
    })),
  ].sort(
    (a, b) =>
      new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime()
  );

  return (
    <div className="space-y-6 animate-fade-in-up">
      {allFiles.length === 0 ? (
        <div className="card-premium flex flex-col items-center justify-center py-20 text-center border-dashed">
          <HelpCircle className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-bold text-zinc-950 dark:text-zinc-100">No downloads available</h3>
          <p className="text-xs text-muted-foreground mt-1">Study materials or question papers will appear here.</p>
        </div>
      ) : (
        <div className="card-premium divide-y divide-border-subtle overflow-hidden">
          {allFiles.map((file) => (
            <div
              key={`${file.category}-${file.id}`}
              className="flex items-center gap-4 px-5 py-4.5 hover:bg-zinc-50/50 dark:hover:bg-zinc-900/10 transition-colors"
            >
              {/* Category Icon */}
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  file.category === "Note"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                    : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                }`}
              >
                {file.category === "Note" ? (
                  <BookOpen className="w-5 h-5" />
                ) : (
                  <ClipboardList className="w-5 h-5" />
                )}
              </div>

              {/* Title & subtitle info */}
              <div className="flex-1 min-w-0">
                <p className="font-bold text-zinc-950 dark:text-zinc-100 text-sm truncate leading-tight">
                  {file.title}
                </p>
                <p className="text-xs text-muted-foreground truncate mt-1">{file.subtitle}</p>
              </div>

              {/* Category tags */}
              <div className="hidden sm:flex items-center gap-4 flex-shrink-0 pr-2">
                <span
                  className={`badge-premium text-xxs font-bold ${
                    file.category === "Note"
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                      : "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                  }`}
                >
                  {file.category}
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">
                  {formatDate(file.uploadDate)}
                </span>
              </div>

              {/* Download CTA button */}
              <a
                href={getSupabaseFileUrl(file.fileId)}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-premium-primary py-2 px-3 text-xs flex-shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
