"use client";

import { useState, useTransition, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, Search, CheckCircle2, AlertCircle, Loader2, User } from "lucide-react";
import { Student, Mark } from "@/lib/types";
import { GRADES, SUBJECTS_BY_GRADE } from "@/lib/constants/grades";
import { getCurrentAcademicYear } from "@/lib/utils";
import { fetchAllStudents } from "@/actions/student";
import { fetchMarksByStudent, saveStudentMarks } from "@/actions/marks";

export default function MarksPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedGrade, setSelectedGrade] = useState<string>("Grade 1");
  const [search, setSearch] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Marks state for the selected student
  const [marksState, setMarksState] = useState<Record<string, Partial<Mark>>>({});
  
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

  const filteredStudents = students.filter((s) => {
    const matchSearch =
      s.admissionNumber.toLowerCase().includes(search.toLowerCase()) ||
      s.name.toLowerCase().includes(search.toLowerCase());
    const matchGrade = s.grade === selectedGrade;
    return matchSearch && matchGrade;
  });

  async function handleSelectStudent(student: Student) {
    setSelectedStudent(student);
    setMarksState({});
    const res = await fetchMarksByStudent(student.admissionNumber);
    if (res.success && res.data) {
      const state: Record<string, Partial<Mark>> = {};
      res.data.forEach((m) => {
        state[m.subject] = m;
      });
      setMarksState(state);
    }
  }

  function handleMarkChange(subject: string, field: "unitTest" | "midterm" | "finalExam", value: string) {
    const numValue = value === "" ? null : Number(value);
    setMarksState((prev) => ({
      ...prev,
      [subject]: {
        ...prev[subject],
        [field]: numValue,
      },
    }));
  }

  async function handleSaveMarks() {
    if (!selectedStudent) return;
    
    startTransition(async () => {
      const subjects = SUBJECTS_BY_GRADE[selectedStudent.grade as keyof typeof SUBJECTS_BY_GRADE] ?? [];
      const academicYear = getCurrentAcademicYear();
      
      const payload: Omit<Mark, "id">[] = subjects.map((sub) => {
        const state = marksState[sub] || {};
        return {
          studentId: selectedStudent.admissionNumber,
          grade: selectedStudent.grade,
          subject: sub,
          academicYear,
          unitTest: state.unitTest ?? null,
          midterm: state.midterm ?? null,
          finalExam: state.finalExam ?? null,
          remarks: state.remarks ?? "",
        };
      });

      const res = await saveStudentMarks(selectedStudent.admissionNumber, payload);
      if (res.success) {
        showToast("success", "Marks saved successfully");
      } else {
        showToast("error", res.error ?? "Failed to save marks");
      }
    });
  }

  const subjectsForSelected = selectedStudent
    ? SUBJECTS_BY_GRADE[selectedStudent.grade as keyof typeof SUBJECTS_BY_GRADE] ?? []
    : [];

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-border-subtle">
        <div>
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-50">Marks Management</h2>
          <p className="text-xs text-muted-foreground mt-0.5">Select a student to manage their marks</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Panel: Student Selection */}
        <div className="lg:col-span-4 space-y-4">
          <div className="card-premium p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-700 dark:text-zinc-300 mb-1.5 uppercase tracking-wide">Select Grade</label>
              <select
                value={selectedGrade}
                onChange={(e) => {
                  setSelectedGrade(e.target.value);
                  setSelectedStudent(null);
                }}
                className="input-premium cursor-pointer"
              >
                {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search students..."
                className="input-premium pl-9 text-sm py-2"
              />
            </div>

            <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
              {filteredStudents.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="text-sm">No students found in this grade.</p>
                </div>
              ) : (
                filteredStudents.map((s) => (
                  <button
                    key={s.admissionNumber}
                    onClick={() => handleSelectStudent(s)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedStudent?.admissionNumber === s.admissionNumber
                        ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30"
                        : "bg-card border-border-subtle hover:border-emerald-200"
                    }`}
                  >
                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">{s.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">ID: {s.admissionNumber}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel: Marks Table */}
        <div className="lg:col-span-8">
          {selectedStudent ? (
            <div className="card-premium p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border-subtle">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">{selectedStudent.name}</h3>
                    <p className="text-xs text-muted-foreground">Grade: {selectedStudent.grade} | ID: {selectedStudent.admissionNumber}</p>
                  </div>
                </div>
                <button
                  onClick={handleSaveMarks}
                  disabled={isPending}
                  className="btn-premium-primary"
                >
                  {isPending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="w-4 h-4" /> Save Marks</>
                  )}
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="table-premium w-full">
                  <thead>
                    <tr>
                      <th className="w-1/3">Subject</th>
                      <th className="text-center w-1/5">Unit Test (100)</th>
                      <th className="text-center w-1/5">Midterm (100)</th>
                      <th className="text-center w-1/5">Final (100)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subjectsForSelected.map((subject) => (
                      <tr key={subject} className="table-row-premium">
                        <td className="font-medium text-zinc-800 dark:text-zinc-200">{subject}</td>
                        <td className="px-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={marksState[subject]?.unitTest ?? ""}
                            onChange={(e) => handleMarkChange(subject, "unitTest", e.target.value)}
                            className="input-premium text-center py-1.5"
                            placeholder="--"
                          />
                        </td>
                        <td className="px-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={marksState[subject]?.midterm ?? ""}
                            onChange={(e) => handleMarkChange(subject, "midterm", e.target.value)}
                            className="input-premium text-center py-1.5"
                            placeholder="--"
                          />
                        </td>
                        <td className="px-2">
                          <input
                            type="number"
                            min={0}
                            max={100}
                            value={marksState[subject]?.finalExam ?? ""}
                            onChange={(e) => handleMarkChange(subject, "finalExam", e.target.value)}
                            className="input-premium text-center py-1.5"
                            placeholder="--"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="card-premium h-full min-h-[400px] flex flex-col items-center justify-center text-muted-foreground p-8">
              <User className="w-12 h-12 mb-4 opacity-20" />
              <p className="font-medium text-zinc-800 dark:text-zinc-200 mb-1">No Student Selected</p>
              <p className="text-sm text-center">Select a student from the list to view and manage their marks.</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-semibold text-white ${toast.type === "success" ? "bg-emerald-600" : "bg-red-600"}`}
          >
            {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
