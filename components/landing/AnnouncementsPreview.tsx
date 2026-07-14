"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Megaphone, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase/client";
import Link from "next/link";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  content: string;
  created_at: string;
  is_published?: boolean;
}

export default function AnnouncementsPreview() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnnouncements() {
      try {
        const { data } = await supabase
          .from("announcements")
          .select("id, title, content, created_at, is_published")
          .eq("is_published", true)
          .order("created_at", { ascending: false })
          .limit(3);
        if (data) setAnnouncements(data);
      } catch {
        // silently fail — announcements are optional
      } finally {
        setLoading(false);
      }
    }
    fetchAnnouncements();
  }, []);

  if (!loading && announcements.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <span className="inline-block px-4 py-1.5 bg-amber-50 border border-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">
              Latest Announcements
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
              Stay <span className="text-emerald-600">Informed</span>
            </h2>
          </div>
          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {announcements.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl border border-slate-100 bg-gradient-to-br from-white to-slate-50 hover:border-emerald-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Megaphone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-slate-800 text-sm leading-tight line-clamp-2">
                      {item.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {item.content}
                </p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {format(new Date(item.created_at), "d MMM yyyy")}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
