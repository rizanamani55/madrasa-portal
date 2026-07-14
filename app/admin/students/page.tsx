"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  User,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import { Student } from "@/lib/types";
import { GRADES } from "@/lib/constants/grades";
import { formatDate } from "@/lib/utils";
import { fetchAllStudents, addStudent, editStudent, removeStudent } from "@/actions/student";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [gradeFilter, setGradeFilter] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const res = await fetchAllStudents();
    if (res.success) setStudents(res.data ?? []);
  }

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 3500);
  }

  const filtered = students.filter((s) => {
    const matchSearch =
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(search.toLowerCase());
    const matchGrade = gradeFilter === "all" || s.grade === gradeFilter;
    return matchSearch && matchGrade;
  });

  function handleEdit(student: Student) {
    setEditingStudent(student);
    setShowForm(true);
  }

  function handleDelete(admissionNumber: string) {
    if (!confirm("Are you sure you want to remove this student?")) return;
    startTransition(async () => {
      const res = await removeStudent(admissionNumber);
      if (res.success) {
        await loadStudents();
        showToast("success", "Student removed successfully");
      } else {
        showToast("error", res.error ?? "Failed to remove");
      }
    });
  }

  async function handleFormSubmit(data: Student) {
    startTransition(async () => {
      const res = editingStudent
        ? await editStudent(data)
        : await addStudent(data);

      if (res.success) {
        await loadStudents();
        setShowForm(false);
        setEditingStudent(null);
        showToast("success", res.message ?? "Done");
      } else {
        showToast("error", res.error ?? "Failed");
      }
    });
  }

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Student Records</h2>
          <p className="text-xs text-muted-foreground mt-0.5">{students.length} students enrolled</p>
        </div>
        <button
          onClick={() => { setEditingStudent(null); setShowForm(true); }}
          className="btn-premium-primary"
        >
          <Plus className="w-4 h-4" />
          Add Student
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or admission number..."
            className="input-premium pl-10"
          />
        </div>
        <select
          value={gradeFilter}
          onChange={(e) => setGradeFilter(e.target.value)}
          className="input-premium sm:w-48 cursor-pointer"
        >
          <option value="all">All Grades</option>
          {GRADES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card-premium overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table-premium">
            <thead>
              <tr>
                <th>Student</th>
                <th>Admission No.</th>
                <th>Grade</th>
                <th className="hidden md:table-cell">Phone</th>
                <th className="hidden lg:table-cell">Email</th>
                <th className="hidden lg:table-cell">Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-muted-foreground bg-card">
                    <HelpCircle className="w-10 h-10 mx-auto mb-3 text-muted-foreground/50" />
                    <p className="font-semibold text-zinc-950 dark:text-zinc-100">No students found</p>
                    <p className="text-xs mt-1">Try expanding your search query or filters</p>
                  </td>
                </tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.admissionNumber} className="table-row-premium">
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-500/10 dark:bg-emerald-500/15 rounded-xl flex items-center justify-center flex-shrink-0 text-emerald-500 font-bold text-sm border border-emerald-500/20">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-zinc-900 dark:text-zinc-50">{s.name}</p>
                          <p className="text-xs text-muted-foreground">{s.parentName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="font-mono text-xs font-semibold text-zinc-650 dark:text-zinc-400">{s.admissionNumber}</td>
                    <td>
                      <span className="badge-premium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xxs font-bold">
                        {s.grade}
                      </span>
                    </td>
                    <td className="text-muted-foreground hidden md:table-cell">{s.phone}</td>
                    <td className="text-muted-foreground hidden lg:table-cell text-xs">{s.email || "—"}</td>
                    <td className="hidden lg:table-cell">
                      <span className={`badge-premium text-xxs ${s.status === "active" ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-500/10 text-red-600 dark:text-red-400"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleEdit(s)}
                          className="p-2 hover:bg-border-subtle rounded-lg text-muted-foreground hover:text-emerald-500 transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(s.admissionNumber)}
                          disabled={isPending}
                          className="p-2 hover:bg-red-500/10 rounded-lg text-muted-foreground hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showForm && (
          <StudentFormModal
            student={editingStudent}
            onClose={() => { setShowForm(false); setEditingStudent(null); }}
            onSubmit={handleFormSubmit}
            isPending={isPending}
          />
        )}
      </AnimatePresence>

      {/* Toast alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${
              toast.type === "success" ? "bg-emerald-600" : "bg-red-650"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4.5 h-4.5" />
            ) : (
              <AlertCircle className="w-4.5 h-4.5" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Student Form Modal ──────────────────────────────────────
interface FormProps {
  student: Student | null;
  onClose: () => void;
  onSubmit: (data: Student) => void;
  isPending: boolean;
}

function StudentFormModal({ student, onClose, onSubmit, isPending }: FormProps) {
  const empty: Student = {
    admissionNumber: "",
    name: "",
    parentName: "",
    grade: "Grade 1",
    phone: "",
    email: "",
    status: "active",
  };

  const [form, setForm] = useState<Student>(student ?? empty);

  function handleChange(k: keyof Student, v: string) {
    setForm((prev) => ({ ...prev, [k]: v }));
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card dark:bg-zinc-930 border border-border-subtle rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h3 className="font-bold text-zinc-900 dark:text-zinc-50">
            {student ? "Update Student Profile" : "Add Student Record"}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-border-subtle rounded-xl text-muted-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Grid */}
        <form
          onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}
          className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          {(
            [
              { key: "admissionNumber", label: "Admission Number", disabled: !!student },
              { key: "name", label: "Full Name" },
              { key: "parentName", label: "Parent's Name" },
              { key: "phone", label: "Phone Number" },
              { key: "email", label: "Email Address", type: "email" },
            ] as const
          ).map((field) => (
            <div key={field.key} className={("colSpan" in field && field.colSpan) ? "sm:col-span-2" : ""}>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide flex items-center gap-2">
                {field.label}
                {field.key === "email" && (
                  <span className="text-[10px] font-normal text-muted-foreground bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">Optional</span>
                )}
              </label>
              <input
                type={"type" in field ? field.type : "text"}
                value={String(form[field.key as keyof Student] ?? "")}
                onChange={(e) => handleChange(field.key as keyof Student, e.target.value)}
                disabled={"disabled" in field ? field.disabled : false}
                required={field.key !== "email"}
                className="input-premium"
              />
            </div>
          ))}

          {/* Grade */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Grade</label>
            <select
              value={form.grade}
              onChange={(e) => handleChange("grade", e.target.value)}
              className="input-premium cursor-pointer"
            >
              {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Status</label>
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className="input-premium cursor-pointer"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="sm:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t border-border-subtle">
            <button
              type="button"
              onClick={onClose}
              className="btn-premium-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="btn-premium-primary disabled:opacity-75 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                student ? "Update Profile" : "Add Student"
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
