"use client";

import Link from "next/link";
import Image from "next/image";
import { Upload, SearchCheck, CheckCircle2, Sparkles, BookOpen, ExternalLink, Award } from "lucide-react";
import type { DefaultSiteSettings } from "@/lib/settings";

interface HeroProps {
  settings: DefaultSiteSettings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80 py-8 sm:py-12 lg:py-16">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-60 pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT COLUMN: Academic Nomenclature, Title & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Academic Credential Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-navy-50/80 border border-navy-200/80 text-xs font-semibold text-navy-900 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>International Peer-Reviewed Journal</span>
              <span className="text-navy-300">•</span>
              <span className="text-navy-700 font-bold">ISSN (Online): {settings.issnOnline || "3048-8958"}</span>
            </div>

            {/* Main Headline: Journal of Interdisciplinary Innovation & Research */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-navy-950 leading-[1.15]">
                Journal of Interdisciplinary Innovation &amp; Research
              </h1>
              <p className="text-lg sm:text-xl font-serif font-bold text-navy-700 tracking-wide">
                Advancing Knowledge Across Disciplines
              </p>
            </div>

            {/* Slogan Pill */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand-orange uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <span>Educate · Innovate · Collaborate</span>
            </div>

            {/* Academic Abstract / Description */}
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-normal max-w-2xl">
              <strong>JIIR</strong> is an international, peer-reviewed, open-access academic journal dedicated to publishing high-impact multidisciplinary research connecting Management, Education, Hospitality &amp; Tourism, Applied Sciences, and Engineering.
            </p>

            {/* Trust Matrix (2x2 Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-700 font-medium max-w-xl">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Rigorous Double-Blind Peer Review</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Immediate Gold Open Access</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Crossref DOI for Every Article</span>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200/70">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Indexed in Leading Global Databases</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-wrap items-center gap-3 sm:gap-4">
              <Link
                href="/submit-manuscript"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 hover:from-navy-800 hover:to-navy-950 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <Upload className="w-4 h-4 text-brand-orange" />
                <span>Submit Your Manuscript</span>
              </Link>

              <Link
                href="/track-manuscript"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-200"
              >
                <SearchCheck className="w-4 h-4 text-navy-700" />
                <span>Track Manuscript Status</span>
              </Link>

              <Link
                href="/author-resources"
                className="text-xs sm:text-sm font-semibold text-navy-800 hover:text-brand-orange transition-colors inline-flex items-center gap-1 ml-1"
              >
                <span>Download Paper Template</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Official Visual Showcase / 3D Book & Impact Poster (5 cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative group w-full max-w-md lg:max-w-none">
              
              {/* Subtle background glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-r from-brand-orange/20 via-navy-600/20 to-brand-green/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-500" />

              {/* Main Framed Poster */}
              <div className="relative rounded-2xl overflow-hidden border-2 border-navy-100 bg-white shadow-2xl transition-all duration-300 group-hover:shadow-3xl group-hover:scale-[1.01]">
                <img
                  src="/images/jiir-global-impact-poster.jpg"
                  alt="JIIR - Turn Your Research Into Global Impact"
                  className="w-full h-auto object-cover block"
                  loading="eager"
                />

                {/* Bottom Overlay Ribbon */}
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent p-4 pt-8 text-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-xs font-bold leading-tight">Volume 1 · Issue 1 (2026)</p>
                      <p className="text-[11px] text-slate-300">Peer Reviewed &amp; Open Access</p>
                    </div>
                  </div>
                  <Link
                    href="/submit-manuscript"
                    className="px-3 py-1.5 rounded-lg bg-brand-orange text-white text-xs font-bold hover:bg-orange-600 shadow transition-colors"
                  >
                    Publish Now
                  </Link>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
