import { Metadata } from "next";
import { getMyPapers } from "@/actions/papers";
import { ClipboardList } from "lucide-react";
import FileListClient from "@/components/student/FileListClient";

export const metadata: Metadata = { title: "Question Papers" };

export default async function PapersPage() {
  const res = await getMyPapers();
  const papers = res.data ?? [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="page-header">
        <h1 className="text-2xl font-bold text-gray-900">Question Papers</h1>
        <p className="text-gray-500 mt-1">
          Previous exam papers for practice and preparation
        </p>
      </div>

      <FileListClient
        items={papers.map((p) => ({
          id: p.id,
          title: p.title,
          subtitle: `${p.subject} · ${p.examType} · ${p.academicYear}`,
          fileId: p.fileId,
          fileName: p.fileName,
          uploadDate: p.uploadDate,
          tag: p.examType,
        }))}
        emptyIcon={ClipboardList}
        emptyMessage="No question papers available yet"
        emptySubtext="Past exam papers will appear here"
      />
    </div>
  );
}
