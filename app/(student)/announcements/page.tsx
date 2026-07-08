import { Metadata } from "next";
import { getPublicAnnouncements } from "@/actions/announcements";
import { formatDate, getPriorityColor, getAnnouncementTypeColor } from "@/lib/utils";
import { Megaphone, Clock, AlertCircle, HelpCircle } from "lucide-react";

export const metadata: Metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  const res = await getPublicAnnouncements();
  const announcements = res.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {announcements.length === 0 ? (
        <div className="card-premium flex flex-col items-center justify-center py-20 text-center border-dashed">
          <Megaphone className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="font-bold text-zinc-950 dark:text-zinc-100">No announcements published</h3>
          <p className="text-xs text-muted-foreground mt-1">Check back later for school updates, holidays, and news.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`card-premium p-6 border-l-4 priority-${ann.priority.toLowerCase()}`}
            >
              {/* Header tags */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-base text-zinc-900 dark:text-zinc-50 leading-tight">
                    {ann.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`badge-premium text-xxs font-bold ${getAnnouncementTypeColor(ann.type)}`}
                  >
                    {ann.type}
                  </span>
                  <span
                    className={`badge-premium text-xxs font-bold ${getPriorityColor(ann.priority)}`}
                  >
                    {ann.priority}
                  </span>
                </div>
              </div>

              {/* Content body */}
              <p className="text-zinc-650 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {ann.content}
              </p>

              {/* Footer details */}
              <div className="mt-5 pt-4 border-t border-border-subtle flex flex-wrap items-center justify-between gap-3 text-xxs text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-semibold">
                    <Clock className="w-3 h-3" />
                    Published: {formatDate(ann.publishDate)}
                  </span>
                  {ann.expiryDate && (
                    <span>Expires: {formatDate(ann.expiryDate)}</span>
                  )}
                </div>
                <span className="font-bold">Published by: {ann.publishedBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
