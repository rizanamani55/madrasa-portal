"use client";

import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";

const CONTACT_ITEMS = [
  {
    icon: MapPin,
    label: "Address",
    value: "Irshadul Anam Madrasa, Your City, State, Country",
    href: null,
    color: "from-emerald-500 to-emerald-700",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "+91 00000 00000",
    href: "tel:+910000000000",
    color: "from-teal-500 to-teal-700",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@irshadulanam.edu",
    href: "mailto:info@irshadulanam.edu",
    color: "from-amber-500 to-amber-700",
  },
];

export default function ContactSection() {
  return (
    <section
      id="contact"
      className="py-24 bg-gradient-to-br from-emerald-950 via-emerald-900 to-slate-900 relative overflow-hidden"
    >
      {/* Background pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full bg-emerald-600/10 blur-3xl" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span className="inline-block px-4 py-1.5 bg-white/10 border border-white/20 text-emerald-300 text-sm font-semibold rounded-full mb-4">
            Get in Touch
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Contact{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-amber-300">
              Irshadul Anam
            </span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            We are here to help. Reach out to us for any inquiries about
            admissions, academics, or portal support.
          </p>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {CONTACT_ITEMS.map((item, i) => {
            const Icon = item.icon;
            const Inner = (
              <>
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center mb-5 shadow-lg mx-auto`}
                >
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-slate-400 mb-1 font-medium">
                  {item.label}
                </p>
                <p className="text-white font-semibold text-base leading-snug">
                  {item.value}
                </p>
              </>
            );

            return (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                {item.href ? (
                  <a
                    href={item.href}
                    className="block p-8 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 group"
                  >
                    {Inner}
                  </a>
                ) : (
                  <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
                    {Inner}
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
