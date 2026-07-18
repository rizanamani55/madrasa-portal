"use client";

import { useState, useTransition } from "react";
import { PrayerQuranRecord } from "@/lib/types";
import { upsertTrackerDay } from "@/actions/tracker";
import { motion } from "framer-motion";
import { Check, Save, Loader2 } from "lucide-react";

interface TrackerTableProps {
  initialData: PrayerQuranRecord[];
  month: number;
  year: number;
  studentName: string;
  admissionNumber: string;
  grade: string;
  readonly?: boolean;
}

const PRAYERS = ["subh", "duhr", "asr", "magrib", "isha"] as const;

export default function TrackerTable({
  initialData,
  month,
  year,
  studentName,
  admissionNumber,
  grade,
  readonly = false
}: TrackerTableProps) {
  const [data, setData] = useState<PrayerQuranRecord[]>(initialData);
  const [isPending, startTransition] = useTransition();
  const [savingDay, setSavingDay] = useState<number | null>(null);

  const daysInMonth = new Date(year, month, 0).getDate();
  const monthName = new Date(year, month - 1, 1).toLocaleString('default', { month: 'long' });

  // Generate complete days array
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    const existing = data.find(r => r.day === day);
    return existing || {
      studentId: admissionNumber,
      month,
      year,
      day,
      subh: 0,
      duhr: 0,
      asr: 0,
      magrib: 0,
      isha: 0,
      prayerMarks: 0,
      quranPages: 0,
      quranMarks: 0,
      locked: false
    } as PrayerQuranRecord;
  });



  const handleFieldChange = (day: number, field: 'quranPages' | 'prayerMarks' | typeof PRAYERS[number], value: number) => {
    if (readonly) return;
    setData(prev => prev.map(d => {
      if (d.day === day) {
        if (d.locked) return d;
        const newD = { ...d, [field]: value };
        if (field === 'quranPages') {
          newD.quranMarks = value * 5;
        } else if (PRAYERS.includes(field as any)) {
          newD.prayerMarks = (newD.subh || 0) + (newD.duhr || 0) + (newD.asr || 0) + (newD.magrib || 0) + (newD.isha || 0);
        }
        return newD;
      }
      return d;
    }));
  };

  const handleBlurField = (day: number, field: 'quranPages' | 'prayerMarks' | typeof PRAYERS[number], value: number) => {
    if (readonly) return;
    const record = data.find(d => d.day === day);
    if (record && !record.locked) {
      const newD = { ...record, [field]: value };
      if (field === 'quranPages') {
        newD.quranMarks = value * 5;
      } else if (PRAYERS.includes(field as any)) {
        newD.prayerMarks = (newD.subh || 0) + (newD.duhr || 0) + (newD.asr || 0) + (newD.magrib || 0) + (newD.isha || 0);
      }
      saveRecord(newD);
    }
  };

  const saveRecord = (record: PrayerQuranRecord) => {
    setSavingDay(record.day);
    startTransition(async () => {
      await upsertTrackerDay({
        studentId: record.studentId,
        month: record.month,
        year: record.year,
        day: record.day,
        subh: record.subh,
        duhr: record.duhr,
        asr: record.asr,
        magrib: record.magrib,
        isha: record.isha,
        prayerMarks: record.prayerMarks,
        quranPages: record.quranPages
      });
      setSavingDay(null);
    });
  };

  const totalPrayerMarks = data.reduce((acc, curr) => acc + (curr.prayerMarks || 0), 0);
  const totalQuranMarks = data.reduce((acc, curr) => acc + (curr.quranMarks || 0), 0);
  const overallMarks = totalPrayerMarks + totalQuranMarks;

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-sm">
      {/* Header Info */}
      <div className="p-6 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">{monthName} {year} Tracker</h2>
            <p className="text-sm text-zinc-500 mt-1">
              {studentName} • {admissionNumber} • {grade}
            </p>
          </div>
          <div className="flex gap-4">
            <div className="px-4 py-2 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 font-semibold text-sm flex flex-col items-center">
              <span className="text-xs uppercase opacity-70">Prayer Total</span>
              <span className="text-lg">{totalPrayerMarks}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold text-sm flex flex-col items-center">
              <span className="text-xs uppercase opacity-70">Quran Total</span>
              <span className="text-lg">{totalQuranMarks}</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 font-semibold text-sm flex flex-col items-center">
              <span className="text-xs uppercase opacity-70">Overall</span>
              <span className="text-lg">{overallMarks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-zinc-500 uppercase bg-zinc-50/80 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-medium sticky left-0 bg-zinc-50/90 dark:bg-zinc-800/90 backdrop-blur z-10 w-16">Day</th>
              <th className="px-4 py-3 font-medium text-center">Subh</th>
              <th className="px-4 py-3 font-medium text-center">Duhr</th>
              <th className="px-4 py-3 font-medium text-center">Asr</th>
              <th className="px-4 py-3 font-medium text-center">Magrib</th>
              <th className="px-4 py-3 font-medium text-center">Isha</th>
              <th className="px-4 py-3 font-medium text-center text-emerald-600 dark:text-emerald-400">Prayer Marks</th>
              <th className="px-4 py-3 font-medium text-center text-blue-600 dark:text-blue-400">Quran Pages</th>
              <th className="px-4 py-3 font-medium text-center text-amber-600 dark:text-amber-400">Quran Marks</th>
              <th className="px-4 py-3 w-8"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {days.map((row) => (
              <motion.tr 
                key={row.day} 
                className={`hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition-colors ${row.locked ? 'opacity-70 bg-zinc-50/50 dark:bg-zinc-900' : ''}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: row.day * 0.01 }}
              >
                <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100 sticky left-0 bg-white/90 dark:bg-zinc-900/90 hover:bg-zinc-50 dark:hover:bg-zinc-800 z-10 backdrop-blur">
                  {row.day}
                </td>
                {PRAYERS.map(p => (
                  <td key={p} className="px-4 py-3 text-center">
                    <input
                      type="number"
                      min="0"
                      disabled={readonly || row.locked}
                      value={row[p] === undefined ? 0 : row[p]}
                      onChange={(e) => handleFieldChange(row.day, p, e.target.value === '' ? 0 : Number(e.target.value))}
                      onBlur={(e) => handleBlurField(row.day, p, e.target.value === '' ? 0 : Number(e.target.value))}
                      onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                      className="w-12 mx-auto text-center py-1.5 px-1 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="0"
                    />
                  </td>
                ))}
                
                <td className="px-4 py-3 text-center font-semibold text-emerald-600 dark:text-emerald-400">
                  {row.prayerMarks}
                </td>
                
                <td className="px-4 py-3 text-center">
                  <input
                    type="number"
                    min="0"
                    disabled={readonly || row.locked}
                    value={row.quranPages === undefined ? 0 : row.quranPages}
                    onChange={(e) => handleFieldChange(row.day, 'quranPages', e.target.value === '' ? 0 : Number(e.target.value))}
                    onBlur={(e) => handleBlurField(row.day, 'quranPages', e.target.value === '' ? 0 : Number(e.target.value))}
                    onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); }}
                    className="w-16 mx-auto text-center py-1.5 px-2 text-sm bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-zinc-900 dark:text-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="0"
                  />
                </td>
                
                <td className="px-4 py-3 text-center font-semibold text-amber-600 dark:text-amber-400">
                  {row.quranMarks}
                </td>

                <td className="px-4 py-3 text-center text-zinc-400">
                  {savingDay === row.day && <Loader2 className="w-4 h-4 animate-spin" />}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
