"use client";

import { motion } from "framer-motion";
import {
  GraduationCap,
  Users,
  BarChart3,
  BookOpen,
  FileText,
  Clock,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: GraduationCap,
    title: "Student Portal",
    description:
      "Students access personal dashboards with results, notes, timetables, and academic resources.",
    color: "from-emerald-400 to-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100",
  },
  {
    icon: Users,
    title: "Parent Portal",
    description:
      "Parents stay informed about their child's academic progress, results, and school announcements.",
    color: "from-teal-400 to-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
  },
  {
    icon: BarChart3,
    title: "Examination Results",
    description:
      "View detailed subject-wise marks, grades, and performance analytics for each exam session.",
    color: "from-amber-400 to-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-100",
  },
  {
    icon: BookOpen,
    title: "Notes Library",
    description:
      "Access a curated library of study notes and educational materials organized by class and subject.",
    color: "from-sky-400 to-sky-600",
    bg: "bg-sky-50",
    border: "border-sky-100",
  },
  {
    icon: FileText,
    title: "Question Papers",
    description:
      "Browse and download previous year question papers to prepare effectively for examinations.",
    color: "from-violet-400 to-violet-600",
    bg: "bg-violet-50",
    border: "border-violet-100",
  },
  {
    icon: Clock,
    title: "Timetable",
    description:
      "Stay on schedule with the weekly class timetable, always up-to-date and accessible anywhere.",
    color: "from-rose-400 to-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100",
  },
  {
    icon: ShieldCheck,
    title: "Secure Administration",
    description:
      "Admins manage student records, upload content, publish announcements, and oversee all portal activity.",
    color: "from-slate-500 to-slate-700",
    bg: "bg-slate-50",
    border: "border-slate-100",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-semibold rounded-full mb-4">
            Portal Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Everything You Need,{" "}
            <span className="text-emerald-600">In One Place</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            A comprehensive academic management system designed for the needs of
            students, parents, and educators alike.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {FEATURES.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                variants={cardVariants}
                className={`group relative p-6 rounded-2xl border ${feature.border} ${feature.bg} hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-default`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
