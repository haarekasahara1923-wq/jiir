import Link from "next/link";
import { Upload, SearchCheck, CheckCircle2, Sparkles, BookOpen, ArrowRight } from "lucide-react";
import type { DefaultSiteSettings } from "@/lib/settings";

interface HeroProps {
  settings: DefaultSiteSettings;
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-navy-50/70 via-background to-background dark:from-navy-950/40 dark:via-background dark:to-background border-b border-border/40 py-16 lg:py-24">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-hero-pattern opacity-70 pointer-events-none" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-navy-900 shadow-sm border border-navy-200/60 dark:border-navy-800 text-xs font-semibold text-navy-800 dark:text-navy-200">
            <Sparkles className="w-3.5 h-3.5 text-brand-orange" />
            <span>Management · Education · Hospitality · Science · Technology</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold tracking-tight text-navy-900 dark:text-white leading-[1.15]">
            Advancing Knowledge Across Disciplines
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            {settings.journalName} (JIIR) is an international, peer-reviewed, open-access academic journal
            publishing innovative multidisciplinary research across science, engineering, management, humanities, and hospitality.
          </p>

          {/* Motto / Slogan from Official Logo */}
          <p className="text-sm font-semibold tracking-wider text-brand-orange uppercase">
            Educate · Innovate · Collaborate
          </p>

          {/* CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/submit-manuscript"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 hover:from-navy-800 hover:to-navy-950 shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95"
            >
              <Upload className="w-4 h-4 text-brand-orange" />
              <span>Submit Your Manuscript</span>
            </Link>

            <Link
              href="/track-manuscript"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-sm font-semibold text-foreground bg-white dark:bg-slate-900 border border-border hover:bg-muted shadow-sm hover:shadow transition-all duration-200"
            >
              <SearchCheck className="w-4 h-4 text-navy-600 dark:text-navy-400" />
              <span>Track Manuscript Status</span>
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-8 flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span>Double-Blind Peer Review</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span>Crossref DOI Registered</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span>Gold Open Access (CC BY 4.0)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-green" />
              <span>Monthly Rapid Editorial Decisions</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
