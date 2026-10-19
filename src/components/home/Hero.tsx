"use client";

import Link from "next/link";
import { Upload, SearchCheck, CheckCircle2, Sparkles, ExternalLink } from "lucide-react";
import type { DefaultSiteSettings } from "@/lib/settings";

interface HeroProps {
  settings: DefaultSiteSettings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200 py-8 sm:py-12 lg:py-16">
      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

          {/* LEFT COLUMN: Academic Nomenclature, Title & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            
            {/* Academic Credential Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-800 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
              <span>International Peer-Reviewed Journal</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-900 font-bold">ISSN (Online): {settings.issnOnline || "3048-8958"}</span>
            </div>

            {/* Main Headline: Journal of Interdisciplinary Innovation & Research */}
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-black tracking-tight text-slate-900 leading-[1.15]">
                Journal of Interdisciplinary Innovation &amp; Research
              </h1>
              <p className="text-lg sm:text-xl font-serif font-bold text-navy-800 tracking-wide">
                Advancing Knowledge Across Disciplines
              </p>
            </div>

            {/* Slogan Pill */}
            <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-brand-orange uppercase">
              <span className="w-2 h-2 rounded-full bg-brand-orange" />
              <span>Educate · Innovate · Collaborate</span>
            </div>

            {/* Academic Abstract / Description - Sharp high contrast text */}
            <p className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal max-w-2xl">
              <strong>JIIR</strong> is an international, peer-reviewed, open-access academic journal dedicated to publishing high-impact multidisciplinary research connecting Management, Education, Hospitality &amp; Tourism, Applied Sciences, and Engineering.
            </p>

            {/* Trust Matrix (2x2 Grid) - High contrast, easy to read */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 text-xs text-slate-800 font-medium max-w-xl">
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">Rigorous Double-Blind Peer Review</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">Immediate Gold Open Access</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">Crossref DOI for Every Article</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold text-slate-900">Indexed in Leading Global Databases</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/submit-manuscript"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-navy-800 via-navy-900 to-slate-900 hover:from-navy-900 hover:to-black shadow-md hover:shadow-lg transition-all duration-200 active:scale-95 w-full sm:w-auto text-center"
              >
                <Upload className="w-4 h-4 text-brand-orange" />
                <span>Submit Your Manuscript</span>
              </Link>

              <Link
                href="/track-manuscript"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-semibold text-slate-900 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-200 w-full sm:w-auto text-center"
              >
                <SearchCheck className="w-4 h-4 text-navy-800" />
                <span>Track Manuscript Status</span>
              </Link>

              <Link
                href="/author-resources"
                className="text-xs sm:text-sm font-semibold text-navy-800 hover:text-brand-orange transition-colors inline-flex items-center justify-center sm:justify-start gap-1 py-1 sm:ml-1"
              >
                <span>Download Paper Template</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

          {/* RIGHT COLUMN: Official Visual Showcase / Clean Natural Frame without artificial shades (5 cols) */}
          <div className="lg:col-span-5 flex justify-start lg:justify-end w-full">
            <div className="w-full">
              {/* Clean, perfectly integrated poster container without awkward blur halos or heavy gradients */}
              <div className="rounded-2xl overflow-hidden border border-slate-200/90 bg-white shadow-md w-full">
                <img
                  src="/images/jiir-global-impact-poster.jpg"
                  alt="JIIR - Turn Your Research Into Global Impact"
                  className="w-full h-auto object-contain block"
                  loading="eager"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
