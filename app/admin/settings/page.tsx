"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Settings, Key, Copy, CheckCircle2 } from "lucide-react";

export default function AdminSettingsPage() {
  const [copied, setCopied] = useState<string | null>(null);

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  }

  const envVars = [
    { key: "GOOGLE_SERVICE_ACCOUNT_KEY", desc: "Full JSON key from Google Cloud Service Account", sensitive: true },
    { key: "GOOGLE_SHEET_ID", desc: "Google Sheet ID (extracted from the URL)", sensitive: false },
    { key: "GOOGLE_DRIVE_ROOT_FOLDER_ID", desc: "Google Drive folder ID for notes and question papers", sensitive: false },
    { key: "NEXTAUTH_SECRET", desc: "Random 32-character secret for NextAuth session signing", sensitive: true },
    { key: "NEXTAUTH_URL", desc: "Your application URL (e.g. https://irshadulanam.vercel.app)", sensitive: false },
    { key: "ADMIN_EMAIL", desc: "Admin login email address", sensitive: false },
    { key: "ADMIN_PASSWORD_HASH", desc: "bcrypt hash of admin password (use bcrypt.hashSync('yourpassword', 10))", sensitive: true },
    { key: "NEXT_PUBLIC_APP_NAME", desc: "Application display name", sensitive: false },
    { key: "NEXT_PUBLIC_APP_URL", desc: "Public application URL for PWA and SEO", sensitive: false },
  ];

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* Environment Variables Guide */}
      <div className="card-premium p-6">
        <h2 className="font-bold text-zinc-900 dark:text-zinc-50 mb-1.5 flex items-center gap-2">
          <Key className="w-5 h-5 text-emerald-500" />
          Required Environment Variables
        </h2>
        <p className="text-xs text-muted-foreground mb-5">
          These must be configured in your Vercel project settings or <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-xxs font-mono">.env.local</code> file for local development.
        </p>
        <div className="space-y-3">
          {envVars.map(({ key, desc, sensitive }) => (
            <div key={key} className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/10 border border-border-subtle hover:border-emerald-500/20 transition-all group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <code className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10">
                    {key}
                  </code>
                  {sensitive && (
                    <span className="badge-premium bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold">Sensitive</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-2 leading-relaxed">{desc}</p>
              </div>
              <button
                onClick={() => copyToClipboard(key, key)}
                className="p-2 hover:bg-card border border-transparent hover:border-border-subtle rounded-xl text-muted-foreground hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors flex-shrink-0"
              >
                {copied === key ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Password Hash */}
      <div className="card-premium p-6 bg-blue-500/5 border-blue-500/20">
        <h3 className="font-bold text-blue-650 dark:text-blue-400 mb-2">Generate Admin Password Hash</h3>
        <p className="text-sm text-zinc-700 dark:text-zinc-300 leading-relaxed mb-4">
          To configure your admin password, generate a secure bcrypt hash by running this Node.js snippet locally:
        </p>
        <pre className="bg-zinc-900 text-zinc-100 rounded-2xl p-5 text-xs font-mono overflow-x-auto shadow-md">
          {`const bcrypt = require('bcryptjs');
const hash = bcrypt.hashSync('your-password-here', 10);
console.log(hash);
// Copy the output → ADMIN_PASSWORD_HASH env var`}
        </pre>
        <p className="text-xxs text-muted-foreground mt-3 font-semibold">
          One-liner shortcut: <code className="bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded text-zinc-650 dark:text-zinc-400">node -e &quot;const b=require(&apos;bcryptjs&apos;);console.log(b.hashSync(&apos;yourpassword&apos;,10))&quot;</code>
        </p>
      </div>

      {/* Vercel Deployment Checklist */}
      <div className="card-premium p-6">
        <h3 className="font-bold text-zinc-900 dark:text-zinc-50 mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-500" />
          Vercel Deployment Guide
        </h3>
        <div className="space-y-3.5 text-sm text-zinc-700 dark:text-zinc-300">
          {[
            "Push the code to your GitHub/GitLab repository",
            "Import the repository in your Vercel Dashboard",
            "Add all required environment variables under Vercel → Project Settings → Environment Variables",
            "Set NEXTAUTH_URL to your public deployment domain (e.g. https://your-app.vercel.app)",
            "Once deployed, visit /admin/sync to initialize your Google Sheets database headers",
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="w-5 h-5 bg-emerald-500/10 rounded-full flex items-center justify-center text-xs font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5">{i + 1}</span>
              <span className="font-medium leading-relaxed">{step}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
