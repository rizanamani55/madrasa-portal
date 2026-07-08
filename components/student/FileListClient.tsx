"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Eye, Download, FileText, X, ExternalLink, HelpCircle } from "lucide-react";
import { formatDate, getSupabaseFileUrl } from "@/lib/utils";

interface FileItem {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  fileId: string;
  fileName: string;
  uploadDate: string;
  tag?: string;
}

interface Props {
  items: FileItem[];
  emptyIcon: React.ElementType;
  emptyMessage: string;
  emptySubtext: string;
}

export default function FileListClient({
  items,
  emptyIcon: EmptyIcon,
  emptyMessage,
  emptySubtext,
}: Props) {
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  if (items.length === 0) {
    return (
      <div className="card-premium flex flex-col items-center justify-center py-20 px-6 text-center border-dashed bg-zinc-550/5 dark:bg-zinc-900/10">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-5 text-muted-foreground border border-border-subtle">
          <EmptyIcon className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-50">{emptyMessage}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm">{emptySubtext}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Input bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-muted-foreground" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search study guides, exam materials, subjects..."
          className="input-premium pl-11 py-3"
        />
      </div>

      {/* File Grid */}
      {filtered.length === 0 ? (
        <div className="card-premium p-12 text-center flex flex-col items-center justify-center border-dashed">
          <HelpCircle className="w-10 h-10 text-muted-foreground mb-3" />
          <h4 className="font-bold text-zinc-900 dark:text-zinc-50">No results found</h4>
          <p className="text-xs text-muted-foreground mt-1">We couldn&apos;t find any resource matching &ldquo;{search}&rdquo;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04, duration: 0.3 }}
              className="card-premium p-5 flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start gap-3.5 mb-4">
                  <div className="w-11 h-11 bg-rose-500/10 dark:bg-rose-500/15 rounded-xl flex items-center justify-center flex-shrink-0 border border-rose-500/20">
                    <FileText className="w-5.5 h-5.5 text-rose-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>
                </div>

                {item.description && (
                  <p className="text-xs text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

              <div>
                {/* Meta details */}
                <div className="flex items-center justify-between mb-4 pt-3 border-t border-border-subtle">
                  {item.tag && (
                    <span className="badge-premium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      {item.tag}
                    </span>
                  )}
                  <span className="text-[10px] font-semibold text-muted-foreground ml-auto">
                    {formatDate(item.uploadDate)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewFile(item)}
                    className="btn-premium-secondary flex-1 justify-center py-2 px-3 text-xs"
                  >
                    <Eye size={14} />
                    Preview
                  </button>
                  <a
                    href={getSupabaseFileUrl(item.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium-primary flex-1 justify-center py-2 px-3 text-xs"
                  >
                    <Download size={14} />
                    Download
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card dark:bg-zinc-930 border border-border-subtle rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-border-subtle">
                <div className="flex items-center gap-2.5 min-w-0">
                  <FileText className="w-5 h-5 text-rose-500 flex-shrink-0" />
                  <p className="font-bold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                    {previewFile.title}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={getSupabaseFileUrl(previewFile.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium-secondary py-1.5 px-3 text-xs"
                  >
                    <Download size={14} />
                    Download
                  </a>
                  <a
                    href={getSupabaseFileUrl(previewFile.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium-secondary py-1.5 px-3 text-xs"
                  >
                    <ExternalLink size={14} />
                    Open Tab
                  </a>
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="p-1.5 hover:bg-border-subtle rounded-xl text-muted-foreground transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* PDF iframe viewer */}
              <div className="flex-1 min-h-[50vh] lg:min-h-[60vh] bg-zinc-100 dark:bg-zinc-900">
                <iframe
                  src={getSupabaseFileUrl(previewFile.fileId)}
                  className="w-full h-full border-0"
                  title={previewFile.title}
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
