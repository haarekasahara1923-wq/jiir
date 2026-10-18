import Link from "next/link";
import { BookOpen, FileText, Upload, SearchCheck, ExternalLink, Award } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import type { DefaultSiteSettings } from "@/lib/settings";

interface JournalCardProps {
  settings: DefaultSiteSettings;
}

export function JournalCard({ settings }: JournalCardProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-border p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Logo & Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-4 lg:border-r lg:border-border lg:pr-8">
            <Logo logoUrl={settings.logoUrl} size="lg" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              {settings.journalName} is indexed and committed to publishing rigorous original research,
              critical review articles, and scholarly case studies adhering strictly to COPE publishing ethics.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-navy-50 dark:bg-navy-950 text-navy-800 dark:text-navy-200 font-semibold border border-navy-200 dark:border-navy-800">
                Peer-Reviewed
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-200 font-semibold border border-emerald-200 dark:border-emerald-800">
                Monthly Frequency
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-semibold border border-amber-200 dark:border-amber-800">
                International Circulation
              </span>
            </div>
            <div>
              <Link
                href="/journal-information"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Read Complete Journal Information & Aims</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Quick Access Matrix (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/submit-manuscript"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-navy-50/70 hover:bg-navy-100 dark:bg-navy-950/50 dark:hover:bg-navy-900/60 border border-navy-100 dark:border-navy-900 transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-lg bg-navy-700 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <Upload className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-foreground">Submit Paper</span>
              <span className="text-[10px] text-muted-foreground">Easy step-by-step</span>
            </Link>

            <Link
              href="/track-manuscript"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-700 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <SearchCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-foreground">Track Status</span>
              <span className="text-[10px] text-muted-foreground">Live updates</span>
            </Link>

            <Link
              href="/current-issue"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-orange text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-foreground">Current Issue</span>
              <span className="text-[10px] text-muted-foreground">Vol. 1 (2026)</span>
            </Link>

            <Link
              href="/author-guidelines"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-muted/50 hover:bg-muted border border-border transition-all text-center group"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-green text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-foreground">Guidelines</span>
              <span className="text-[10px] text-muted-foreground">Formatting & style</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
