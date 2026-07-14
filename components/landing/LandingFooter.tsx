"use client";

import Link from "next/link";
import { BookOpen, Heart } from "lucide-react";

export default function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-lg flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-sm">Irshadul Anam Madrasa</p>
              <p className="text-slate-500 text-xs">Academic Portal</p>
            </div>
          </div>

          {/* Copyright */}
          <p className="text-slate-500 text-sm flex items-center gap-1.5">
            © {year} Irshadul Anam Madrasa. Made with{" "}
            <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400" /> for
            education.
          </p>

          {/* Links */}
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Login
            </Link>
            <a
              href="#about"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#about")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
            >
              About
            </a>
            <a
              href="#contact"
              onClick={(e) => {
                e.preventDefault();
                document
                  .querySelector("#contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="text-sm text-slate-400 hover:text-emerald-400 transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
