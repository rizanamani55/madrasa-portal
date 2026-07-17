"use client";

import { useState, useEffect } from "react";
import { Student, PrayerQuranRecord } from "@/lib/types";
import { fetchAllStudents } from "@/actions/student";
import { getAdminTrackers, setTrackerLock } from "@/actions/tracker";
import TrackerTable from "@/components/tracker/TrackerTable";

const GRADE_LEVELS = [
  "Play Class", "LKG", "UKG", 
  "Class 1", "Class 2", "Class 3", "Class 4", 
  "Class 5", "Class 6", "Class 7", "Class 8", 
  "Class 9", "Class 10", "Class 11", "Class 12"
];
import { Lock, Unlock, Loader2, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTrackerClient() {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedGrade, setSelectedGrade] = useState<string>("all");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  
  const [trackerData, setTrackerData] = useState<PrayerQuranRecord[]>([]);
  const [loadingTracker, setLoadingTracker] = useState(false);

  useEffect(() => {
    fetchAllStudents().then(res => {
      if (res.success && res.data) {
        setStudents(res.data);
        setFilteredStudents(res.data);
      }
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (selectedGrade === "all") {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter(s => s.grade === selectedGrade));
    }
    setSelectedStudent(null);
  }, [selectedGrade, students]);

  useEffect(() => {
    if (selectedStudent) {
      setLoadingTracker(true);
      getAdminTrackers({ month, year, studentId: selectedStudent.admissionNumber }).then(res => {
        if (res.success && res.data) {
          setTrackerData(res.data);
        }
        setLoadingTracker(false);
      });
    }
  }, [selectedStudent, month, year]);

  const handleToggleLock = async () => {
    if (!selectedStudent) return;
    const isCurrentlyLocked = trackerData.some(d => d.locked);
    const newLockState = !isCurrentlyLocked;
    
    // Optimistic update
    setTrackerData(prev => prev.map(d => ({ ...d, locked: newLockState })));
    
    await setTrackerLock(selectedStudent.admissionNumber, month, year, newLockState);
  };

  const isLocked = trackerData.some(d => d.locked);

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="card-premium p-6">
        <h2 className="text-lg font-bold text-zinc-900 dark:text-zinc-100 mb-4">Filter Trackers</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Grade</label>
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Grades</option>
              {GRADE_LEVELS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Month</label>
            <select
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i+1} value={i+1}>{new Date(year, i, 1).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Year</label>
            <select
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[2024, 2025, 2026, 2027].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Student</label>
            <select
              value={selectedStudent?.admissionNumber || ""}
              onChange={(e) => {
                const std = students.find(s => s.admissionNumber === e.target.value);
                setSelectedStudent(std || null);
              }}
              className="w-full bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="" disabled>Select Student</option>
              {filteredStudents.map(s => (
                <option key={s.admissionNumber} value={s.admissionNumber}>{s.name} ({s.admissionNumber})</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tracker View */}
      {selectedStudent && (
        <AnimatePresence mode="wait">
          {loadingTracker ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="card-premium p-12 flex flex-col items-center justify-center text-zinc-400"
            >
              <Loader2 className="w-8 h-8 animate-spin mb-2" />
              <p>Loading tracker data...</p>
            </motion.div>
          ) : (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <div className="flex justify-end">
                <button
                  onClick={handleToggleLock}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-colors shadow-sm ${
                    isLocked 
                      ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50'
                      : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
                  }`}
                >
                  {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                  {isLocked ? "Unlock Month" : "Lock Month"}
                </button>
              </div>

              <TrackerTable 
                initialData={trackerData}
                month={month}
                year={year}
                studentName={selectedStudent.name}
                admissionNumber={selectedStudent.admissionNumber}
                grade={selectedStudent.grade}
                readonly={false} // Admins can edit even if locked
              />
            </motion.div>
          )}
        </AnimatePresence>
      )}

      {!selectedStudent && !loading && (
        <div className="card-premium p-12 flex flex-col items-center justify-center text-zinc-400 border-dashed">
          <Search className="w-12 h-12 mb-4 opacity-50" />
          <p className="text-center">Select a student to view their Prayer & Quran tracker.</p>
        </div>
      )}
    </div>
  );
}
