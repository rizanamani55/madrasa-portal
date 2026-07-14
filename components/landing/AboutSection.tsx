"use client";

import { motion } from "framer-motion";
import { Heart, Award, Users } from "lucide-react";

const STATS = [
  { value: "500+", label: "Students Enrolled", icon: Users },
  { value: "15+", label: "Years of Excellence", icon: Award },
  { value: "100%", label: "Dedicated to Learning", icon: Heart },
];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="py-24 bg-gradient-to-br from-slate-50 to-emerald-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 bg-emerald-100 border border-emerald-200 text-emerald-700 text-sm font-semibold rounded-full mb-6">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              Nurturing Minds with{" "}
              <span className="text-emerald-600">
                Islamic Values &amp; Modern Education
              </span>
            </h2>
            <div className="space-y-4 text-slate-600 text-base leading-relaxed">
              <p>
                <strong className="text-slate-800">Irshadul Anam Madrasa</strong> is
                a renowned Islamic educational institution committed to
                providing holistic education that combines deep-rooted Islamic
                teachings with contemporary academic excellence.
              </p>
              <p>
                Our institution fosters a nurturing environment where students
                develop strong moral character, intellectual curiosity, and a
                profound understanding of their faith. We believe that true
                education enlightens both the mind and the heart.
              </p>
              <p>
                The Irshadul Anam Academic Portal is our digital initiative to
                bring the benefits of modern technology to our community —
                making academic resources, results, and communication
                accessible to students, parents, and educators at any time,
                from anywhere.
              </p>
            </div>

            {/* Arabic quote */}
            <div className="mt-8 p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm">
              <p
                className="text-2xl text-emerald-800 text-right leading-loose mb-2"
                style={{ fontFamily: "Amiri, serif" }}
              >
                طَلَبُ الْعِلْمِ فَرِيضَةٌ عَلَى كُلِّ مُسْلِمٍ
              </p>
              <p className="text-sm text-slate-500 text-right">
                &ldquo;Seeking knowledge is obligatory upon every Muslim.&rdquo; — Hadith
              </p>
            </div>
          </motion.div>

          {/* Right: Stats */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="grid grid-cols-1 gap-6"
          >
            {STATS.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-6 p-6 bg-white rounded-2xl border border-emerald-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-300"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-md">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-3xl font-extrabold text-slate-900">
                      {stat.value}
                    </p>
                    <p className="text-slate-500 font-medium">{stat.label}</p>
                  </div>
                </motion.div>
              );
            })}

            {/* Decorative card */}
            <div className="p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-2xl text-white shadow-lg">
              <p
                className="text-xl mb-2"
                style={{ fontFamily: "Amiri, serif" }}
              >
                بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
              </p>
              <p className="text-emerald-200 text-sm">
                In the name of Allah, the Most Gracious, the Most Merciful
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
