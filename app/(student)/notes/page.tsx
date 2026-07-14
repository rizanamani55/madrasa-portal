import { Metadata } from "next";
import { getMyNotes } from "@/actions/notes";
import { formatDate } from "@/lib/utils";
import { BookOpen, Search } from "lucide-react";
import FileListClient from "@/components/student/FileListClient";

export const metadata: Metadata = { title: "Notes" };

export default async function NotesPage() {
  const res = await getMyNotes();
  const notes = res.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Study Notes</h1>
        <p className="text-gray-500 mt-1">
          Notes and study materials for your grade
        </p>
      </div>

      <FileListClient
        items={notes.map((n) => ({
          id: n.id,
          title: n.title,
          subtitle: n.chapter ? `${n.subject} · ${n.chapter}` : n.subject,
          description: n.description,
          fileId: n.fileId,
          fileName: n.fileName,
          uploadDate: n.uploadDate,
          tag: n.subject,
        }))}
        emptyIcon={<BookOpen className="w-8 h-8" />}
        emptyMessage="No notes available yet"
        emptySubtext="Your teacher will upload notes here"
      />
    </div>
  );
}
