"use client";

import { useState, useTransition, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Mail,
  Hash,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  ArrowLeft,
  User,
} from "lucide-react";
import Link from "next/link";

const MADRASA_NAME = "Irshadul Anam Madrasa";
const ARABIC_NAME = "مدرسة إرشاد الأنام";

function isEmailLike(value: string) {
  return value.includes("@");
}

function UnifiedLoginContent() {
  const [identifier, setIdentifier] = useState("");
  const [secret, setSecret] = useState(""); // password for admin, name for student
  const [showSecret, setShowSecret] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? null;

  // Derive mode based on identifier content
  const isAdminMode = isEmailLike(identifier);

  // Reset secret when mode changes to avoid confusion
  const prevMode = useState(isAdminMode)[0];
  useEffect(() => {
    if (isAdminMode !== prevMode) {
      setSecret("");
      setError("");
    }
  }, [isAdminMode, prevMode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!identifier.trim()) {
      setError("Please enter your admission number or email.");
      return;
    }
    if (!secret.trim()) {
      setError(
        isAdminMode
          ? "Please enter your password."
          : "Please enter your full name."
      );
      return;
    }

    startTransition(async () => {
      if (isAdminMode) {
        // Admin flow
        const result = await signIn("admin", {
          email: identifier.trim(),
          password: secret.trim(),
          redirect: false,
        });
        if (result?.error) {
          setError("Invalid Admission Number, Email, or Password.");
        } else {
          router.push(callbackUrl ?? "/admin/dashboard");
          router.refresh();
        }
      } else {
        // Student flow
        const result = await signIn("student", {
          admissionNumber: identifier.trim(),
          name: secret.trim(),
          redirect: false,
        });
        if (result?.error) {
          setError("Invalid Admission Number, Email, or Password.");
        } else {
          router.push(callbackUrl ?? "/dashboard");
          router.refresh();
        }
      }
    });
  }

  const secretLabel = isAdminMode ? "Password" : "Your Full Name";
  const secretPlaceholder = isAdminMode ? "••••••••" : "e.g. Mohammed Ibrahim";
  const SecretIcon = isAdminMode ? Lock : User;

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Brand */}
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, #064e3b 0%, #065f46 40%, #1e293b 100%)",
        }}
      >
        {/* Islamic geometric pattern overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-emerald-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl" />

        <div className="relative z-10 text-center max-w-sm">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="w-24 h-24 bg-white/10 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm border border-white/20"
          >
            <BookOpen className="w-12 h-12 text-white" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl text-amber-300 mb-3 leading-relaxed"
            style={{ fontFamily: "Amiri, serif" }}
          >
            {ARABIC_NAME}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {MADRASA_NAME}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-emerald-200 text-base leading-relaxed mb-8"
          >
            Digital Academic Portal for Students, Parents &amp; Teachers
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="space-y-3 text-left"
          >
            {[
              "📚 Notes & Study Materials",
              "📝 Examination Results",
              "📋 Weekly Timetable",
              "📢 Announcements",
              "🔒 Secure & Private",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 text-emerald-100">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </motion.div>

      {/* Right Panel — Login Form */}
      <div
        className="flex-1 flex items-center justify-center p-6 relative"
        style={{ background: "linear-gradient(135deg, #f8fafc 0%, #f0fdf4 100%)" }}
      >
        {/* Subtle dot pattern */}
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "radial-gradient(rgba(16, 185, 129, 0.12) 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative z-10 w-full max-w-md"
        >
          {/* Back to home */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-emerald-600 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900">{MADRASA_NAME}</h1>
            <p
              className="text-emerald-600 text-lg"
              style={{ fontFamily: "Amiri, serif" }}
            >
              {ARABIC_NAME}
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900">
                Welcome Back
              </h2>
              <p className="text-slate-500 mt-1.5 text-sm">
                Sign in to your portal account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Identifier field */}
              <div>
                <label
                  htmlFor="identifier"
                  className="block text-sm font-semibold text-slate-700 mb-2"
                >
                  Admission Number or Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <AnimatePresence mode="wait">
                      {isAdminMode ? (
                        <motion.span
                          key="mail"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Mail className="h-5 w-5 text-slate-400" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="hash"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <Hash className="h-5 w-5 text-slate-400" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setError("");
                    }}
                    placeholder="IAM-2024-001 or admin@example.com"
                    autoComplete="username"
                    className="block w-full pl-10 pr-4 py-3.5 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm placeholder:text-slate-400"
                  />
                </div>
                {/* Animated hint */}
                <AnimatePresence>
                  {identifier.length > 0 && (
                    <motion.p
                      key={isAdminMode ? "admin-hint" : "student-hint"}
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="mt-1.5 text-xs text-emerald-600 font-medium"
                    >
                      {isAdminMode
                        ? "🔐 Admin account detected"
                        : "🎓 Student account detected"}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Password / Name field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label
                    htmlFor="secret"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={secretLabel}
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                      >
                        {secretLabel}
                      </motion.span>
                    </AnimatePresence>
                  </label>
                  {/* Forgot password — admin only */}
                  {isAdminMode && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-xs text-emerald-600 hover:text-emerald-700 cursor-pointer font-medium"
                    >
                      Forgot password?
                    </motion.span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <AnimatePresence mode="wait">
                      {isAdminMode ? (
                        <motion.span
                          key="lock"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <SecretIcon className="h-5 w-5 text-slate-400" />
                        </motion.span>
                      ) : (
                        <motion.span
                          key="user"
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                        >
                          <SecretIcon className="h-5 w-5 text-slate-400" />
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </div>
                  <input
                    id="secret"
                    type={isAdminMode ? (showSecret ? "text" : "password") : "text"}
                    value={secret}
                    onChange={(e) => {
                      setSecret(e.target.value);
                      setError("");
                    }}
                    placeholder={secretPlaceholder}
                    autoComplete={isAdminMode ? "current-password" : "name"}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSubmit(e as unknown as React.FormEvent);
                    }}
                    className="block w-full pl-10 pr-12 py-3.5 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:bg-white outline-none transition-all text-sm placeholder:text-slate-400"
                  />
                  {isAdminMode && (
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      {showSecret ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Error Message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: "auto" }}
                    exit={{ opacity: 0, y: -8, height: 0 }}
                    className="flex items-start gap-2.5 p-3.5 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm overflow-hidden"
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white font-bold text-base rounded-xl shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Authenticating...
                  </>
                ) : (
                  "Enter"
                )}
              </button>
            </form>

            {/* Help text */}
            {!isAdminMode && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-5 space-y-3 text-center text-sm text-slate-500"
              >
                <p>
                  Don&apos;t know your admission number?{" "}
                  <span className="text-emerald-600 font-medium">
                    Contact your class teacher.
                  </span>
                </p>
                <p className="pt-3 border-t border-slate-100">
                  Admin?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier("admin@");
                      document.getElementById("identifier")?.focus();
                    }}
                    className="text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
                  >
                    Login here
                  </button>
                </p>
              </motion.div>
            )}
          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-xs text-slate-400">
            © {new Date().getFullYear()} {MADRASA_NAME}. All rights reserved.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <UnifiedLoginContent />
    </Suspense>
  );
}
