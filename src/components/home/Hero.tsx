import Link from "next/link";
import { Upload, SearchCheck, CheckCircle2, Sparkles, BookOpen } from "lucide-react";
import type { DefaultSiteSettings } from "@/lib/settings";

interface HeroProps {
  settings: DefaultSiteSettings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-white border-b border-slate-200/80 py-8 sm:py-16 lg:py-20">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-60 pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-navy-200 text-xs font-semibold text-navy-800">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Management · Education · Hospitality · Science · Technology</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-navy-950 leading-[1.18]">
            Advancing Knowledge Across Disciplines
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
            {settings.journalName} (JIIR) is an international, peer-reviewed, open-access academic journal
            publishing innovative multidisciplinary research across science, engineering, management, humanities, and hospitality.
          </p>

          {/* Slogan */}
          <p className="text-sm font-bold tracking-wider text-brand-orange uppercase">
            Educate · Innovate · Collaborate
          </p>

          {/* CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/submit-manuscript"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 hover:from-navy-800 hover:to-navy-950 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
            >
              <Upload className="w-4 h-4 text-brand-orange" />
              <span>Submit Your Manuscript</span>
            </Link>

            <Link
              href="/track-manuscript"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 shadow-sm hover:shadow transition-all duration-200"
            >
              <SearchCheck className="w-4 h-4 text-navy-700" />
              <span>Track Manuscript Status</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
              <span>Double-Blind Peer Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
              <span>Immediate Open Access</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
              <span>DOI Assigned to Every Paper</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-brand-green" />
              <span>COPE Ethics Compliant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
