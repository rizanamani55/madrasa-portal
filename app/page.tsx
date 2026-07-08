"use client";

import { useState, useTransition, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { BookOpen, Hash, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

const MADRASA_NAME = "Irshadul Anam Madrasa";
const ARABIC_NAME = "مدرسة إرشاد الأنام";

function LoginContent() {
  const [admissionNumber, setAdmissionNumber] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!admissionNumber.trim()) {
      setError("Please enter your admission number.");
      return;
    }

    startTransition(async () => {
      const result = await signIn("student", {
        name: name.trim(),
        admissionNumber: admissionNumber.trim(),
        redirect: false,
      });

      if (result?.error) {
        setError(
          "Invalid admission number. Please check and try again."
        );
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    });
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 pattern-bg flex-col items-center justify-center p-12 relative overflow-hidden"
      >
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-white opacity-5 -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-white opacity-5 translate-y-40 -translate-x-40" />

        <div className="relative z-10 text-center">
          {/* Mosque icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20"
          >
            <BookOpen className="w-12 h-12 text-white" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-4xl font-bold text-white mb-2"
          >
            {MADRASA_NAME}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl font-arabic text-emerald-200 mb-6"
          >
            {ARABIC_NAME}
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-emerald-100 text-lg max-w-sm leading-relaxed"
          >
            Digital Academic Portal for Students, Parents & Teachers
          </motion.p>

          {/* Feature bullets */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mt-10 space-y-3 text-left"
          >
            {[
              "📚 Notes & Study Materials",
              "📝 Examination Results",
              "📋 Weekly Timetable",
              "📢 Announcements",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-3 text-emerald-100"
              >
                <div className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 pattern-light">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{MADRASA_NAME}</h1>
            <p className="text-emerald-600 font-arabic text-lg">{ARABIC_NAME}</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">
                Student Portal
              </h2>
              <p className="text-gray-500 mt-1">
                Enter your admission number to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Student Name Input */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Student Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <BookOpen className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. John Doe"
                    autoComplete="name"
                    className="block w-full pl-10 pr-4 py-3 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Admission Number Input (Password) */}
              <div>
                <label
                  htmlFor="admissionNumber"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password (Admission Number)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="admissionNumber"
                    type={showPassword ? "text" : "password"}
                    value={admissionNumber}
                    onChange={(e) => setAdmissionNumber(e.target.value)}
                    placeholder="e.g. IAM-2024-001"
                    autoComplete="current-password"
                    className="block w-full pl-10 pr-12 py-3 text-gray-900 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-base placeholder:text-gray-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm"
                >
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full btn-primary justify-center py-3 text-base rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Access Portal"
                )}
              </button>
            </form>

            {/* Help text */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Don&apos;t know your admission number?{" "}
              <span className="text-emerald-600 font-medium">
                Contact your class teacher.
              </span>
            </p>

            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <Link
                href="/admin/login"
                className="text-sm text-gray-400 hover:text-emerald-600 transition-colors"
              >
                Teacher / Admin Login →
              </Link>
            </div>
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-gray-400">
            © {new Date().getFullYear()} {MADRASA_NAME}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50"><Loader2 className="w-8 h-8 animate-spin text-emerald-600" /></div>}>
      <LoginContent />
    </Suspense>
  );
}
