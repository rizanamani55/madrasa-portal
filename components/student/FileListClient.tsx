"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Search, FileText, HelpCircle, ExternalLink } from "lucide-react";
import { formatDate, getSupabaseFileUrl } from "@/lib/utils";
import Link from "next/link";

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
  emptyIcon: React.ReactNode;
  emptyMessage: string;
  emptySubtext: string;
}

export default function FileListClient({
  items,
  emptyIcon,
  emptyMessage,
  emptySubtext,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = items.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(search.toLowerCase())
  );

  if (items.length === 0) {
    return (
      <div className="card-premium flex flex-col items-center justify-center py-24 px-6 text-center border-dashed bg-zinc-550/5 dark:bg-zinc-900/10">
        <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mb-5 text-rose-500 border border-border-subtle">
          {emptyIcon}
        </div>
        <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Sorry, {emptyMessage.toLowerCase()}</h3>
        <p className="text-sm text-muted-foreground mt-1.5 max-w-sm mb-6">{emptySubtext}</p>
        <Link href="/dashboard" className="btn-premium-primary">
          Back to Dashboard
        </Link>
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
                <div className="flex gap-2 mt-4">
                  <a
                    href={getSupabaseFileUrl(item.fileId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-premium-primary flex-1 justify-center py-2 px-3 text-xs"
                  >
                    <ExternalLink size={14} />
                    Preview
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}
