"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Calendar, Clock, Upload, FileText, CheckCircle2, Award, Sparkles, ExternalLink } from "lucide-react";

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
    <section className="bg-gradient-to-br from-navy-950 via-[#071746] to-slate-950 text-white rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-navy-800 p-4 sm:p-8 lg:p-10 relative text-left">
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-orange/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        
        {/* LEFT COLUMN: Official Call for Papers Poster (5 cols) */}
        <div className="lg:col-span-5 w-full">
          <div className="relative group w-full">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-orange via-amber-400 to-emerald-400 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-300" />
            
            <div className="relative rounded-2xl overflow-hidden border-2 border-navy-700 bg-navy-900 shadow-2xl w-full">
              <img
                src="/images/jiir-call-for-papers-poster.jpg"
                alt="JIIR Call for Papers - Discoverability in Leading Databases"
                className="w-full h-auto object-cover block group-hover:scale-[1.02] transition-transform duration-300"
                loading="lazy"
              />
              <div className="p-3 bg-navy-950/90 border-t border-navy-800 flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Official CFP Poster 2026</span>
                <span className="text-brand-orange font-bold">Submissions Open</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: CFP Details, Live Countdown & Action Matrix (7 cols) */}
        <div className="lg:col-span-7 space-y-5 text-left">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-brand-orange/20 border border-brand-orange/40 text-brand-orange text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-ping" />
            <span>Call For Papers — Submissions Open</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-black text-white leading-tight">
              {issueLabel}
            </h2>
            <p className="text-base text-slate-200 font-medium">
              Theme: <strong className="text-amber-300 font-semibold">{theme}</strong>
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            Scholars, professors, doctoral researchers, and industry leaders worldwide are cordially invited to submit original manuscripts, review papers, and technical studies. All accepted manuscripts will be peer-reviewed and assigned a Crossref DOI.
          </p>

          {/* Key Advantages Matrix */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-200 pt-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Low Cost &amp; Transparent APC</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Fast Review &amp; Timely Publication</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>High Quality Double-Blind Referees</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Global Database Discoverability</span>
            </div>
          </div>

          {/* Live Countdown Timer */}
          <div className="bg-navy-900/90 border border-navy-700/80 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
              <span className="flex items-center gap-1.5 uppercase tracking-wider">
                <Clock className="w-4 h-4 text-brand-orange" />
                Submission Deadline Countdown
              </span>
              <span className="text-slate-300">
                {new Date(deadline || "2026-11-30").toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
              <div className="bg-navy-950/90 border border-navy-800 rounded-xl p-2.5 sm:p-3">
                <span className="text-xl sm:text-3xl font-bold font-mono text-white block">
                  {timeLeft.days}
                </span>
                <span className="text-[10px] text-slate-200 uppercase tracking-wider font-semibold">Days</span>
              </div>
              <div className="bg-navy-950/90 border border-navy-800 rounded-xl p-2.5 sm:p-3">
                <span className="text-xl sm:text-3xl font-bold font-mono text-white block">
                  {timeLeft.hours.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-200 uppercase tracking-wider font-semibold">Hours</span>
              </div>
              <div className="bg-navy-950/90 border border-navy-800 rounded-xl p-2.5 sm:p-3">
                <span className="text-xl sm:text-3xl font-bold font-mono text-white block">
                  {timeLeft.minutes.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-200 uppercase tracking-wider font-semibold">Mins</span>
              </div>
              <div className="bg-navy-950/90 border border-navy-800 rounded-xl p-2.5 sm:p-3">
                <span className="text-xl sm:text-3xl font-bold font-mono text-brand-orange block">
                  {timeLeft.seconds.toString().padStart(2, "0")}
                </span>
                <span className="text-[10px] text-slate-200 uppercase tracking-wider font-semibold">Secs</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/submit-manuscript"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-orange to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-lg hover:shadow-orange-500/25 transition-all duration-200 active:scale-95"
            >
              <Upload className="w-4 h-4" />
              <span>Submit Manuscript Now</span>
            </Link>

            <Link
              href="/author-resources"
              className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs sm:text-sm font-semibold border border-white/20 transition-colors"
            >
              <FileText className="w-4 h-4" />
              <span>Download Word Template</span>
            </Link>

            <Link
              href="/author-guidelines"
              className="text-xs text-slate-300 hover:text-white transition-colors underline-offset-4 hover:underline ml-1"
            >
              View Author Guidelines →
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}
