"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Upload, FileText, CheckCircle2 } from "lucide-react";

interface CallForPapersBannerProps {
  deadline?: string | null;
  issueLabel?: string;
  theme?: string;
}

export function CallForPapersBanner({
  deadline = "2026-11-30T23:59:59Z",
  issueLabel = "Volume 1, Issue 1 (2026)",
  theme = "Interdisciplinary Innovations in Science, Technology & Social Dynamics",
}: CallForPapersBannerProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(deadline || "2026-11-30T23:59:59Z").getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  return (
    <section className="bg-gradient-to-br from-navy-900 via-navy-950 to-slate-950 text-white rounded-2xl shadow-xl overflow-hidden border border-navy-800 p-6 sm:p-8 lg:p-10 relative">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left: CFP Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
            <span>Call For Papers — Open Now</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            {issueLabel}
          </h2>

          <p className="text-sm text-navy-200 leading-relaxed">
            Special Focus: <strong className="text-white">{theme}</strong>. Scholars, researchers,
            and educators worldwide are invited to submit original research manuscripts, case studies,
            and review articles.
          </p>

          <div className="flex flex-wrap gap-y-2 gap-x-4 text-xs text-navy-300 pt-1">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
              Rigorous Peer Review (~2–3 Weeks)
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
              Immediate Open Access
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
              Digital Certificate with QR Verification
            </span>
          </div>

          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/submit-manuscript"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-orange-500/20 transition-all duration-200 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Paper Here</span>
            </Link>
            <Link
              href="/call-for-papers"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Read Full Guidelines & Scope</span>
            </Link>
          </div>
        </div>

        {/* Right: Live Countdown (5 cols) */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold text-navy-300 uppercase tracking-wider">
            <Clock className="w-4 h-4 text-brand-orange" />
            <span>Submission Deadline Countdown</span>
          </div>

          <div className="grid grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
                {timeLeft.days}
              </span>
              <span className="text-[10px] text-navy-400 uppercase tracking-wider">Days</span>
            </div>
            <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
                {timeLeft.hours.toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] text-navy-400 uppercase tracking-wider">Hours</span>
            </div>
            <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-white block">
                {timeLeft.minutes.toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] text-navy-400 uppercase tracking-wider">Mins</span>
            </div>
            <div className="bg-navy-900/80 border border-navy-800 rounded-xl p-3">
              <span className="text-2xl sm:text-3xl font-bold font-mono text-brand-orange block">
                {timeLeft.seconds.toString().padStart(2, "0")}
              </span>
              <span className="text-[10px] text-navy-400 uppercase tracking-wider">Secs</span>
            </div>
          </div>

          <p className="text-xs text-navy-300">
            Final Manuscript Submission Target:{" "}
            <strong className="text-white">
              {new Date(deadline || "2026-11-30").toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </strong>
          </p>
        </div>
      </div>
    </section>
  );
}
