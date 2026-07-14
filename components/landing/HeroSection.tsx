"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const floatVariants = {
  initial: { y: 0 },
  animate: {
    y: [-8, 8, -8],
    transition: { duration: 6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] as [number, number, number, number] },
  },
};

export default function HeroSection() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
    >
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900" />

      {/* Geometric Islamic pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-emerald-600/20 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-amber-500/10 blur-3xl" />

      {/* Floating stars */}
      {[
        { size: 4, top: "20%", left: "15%", delay: 0 },
        { size: 3, top: "70%", left: "10%", delay: 1 },
        { size: 5, top: "30%", right: "12%", delay: 0.5 },
        { size: 3, top: "80%", right: "20%", delay: 1.5 },
        { size: 4, top: "50%", left: "5%", delay: 0.8 },
      ].map((star, i) => (
        <motion.div
          key={i}
          variants={floatVariants}
          initial="initial"
          animate="animate"
          style={{
            position: "absolute",
            top: star.top,
            left: "left" in star ? star.left : undefined,
            right: "right" in star ? star.right : undefined,
            transitionDelay: `${star.delay}s`,
          }}
        >
          <Star
            className="text-amber-400/60 fill-amber-400/40"
            style={{ width: `${star.size * 4}px`, height: `${star.size * 4}px` }}
          />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full text-emerald-200 text-sm font-medium mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          Digital Academic Portal
        </motion.div>

        {/* Arabic name */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl sm:text-4xl text-amber-300/90 mb-4 leading-relaxed"
          style={{ fontFamily: "Amiri, serif" }}
        >
          مدرسة إرشاد الأنام
        </motion.p>

        {/* Main heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6"
        >
          Irshadul Anam{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">
            Madrasa
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="text-xl sm:text-2xl text-emerald-200 font-medium mb-6"
        >
          Digital Academic Portal for Students, Parents &amp; Teachers
        </motion.p>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10"
        >
          Students, parents, and teachers can securely access academic
          resources, examination results, notes, question papers, and
          timetables — all in one place.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/login"
            className="group flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-2xl shadow-lg shadow-emerald-900/50 hover:shadow-emerald-700/50 hover:-translate-y-1 transition-all duration-300"
          >
            Login to Portal
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <button
            onClick={() => {
              const el = document.querySelector("#features");
              if (el) el.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-8 py-4 border border-white/20 text-white font-semibold text-lg rounded-2xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300"
          >
            Explore Features
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="mt-20 flex justify-center"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2 text-white/40"
          >
            <span className="text-xs tracking-widest uppercase">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-white/40 to-transparent" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
