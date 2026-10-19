import Link from "next/link";
import { BookOpen, FileText, Upload, SearchCheck, ExternalLink } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import type { DefaultSiteSettings } from "@/lib/settings";

interface JournalCardProps {
  settings: DefaultSiteSettings;
}

export function JournalCard({ settings }: JournalCardProps) {
  return (
    <section className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-5 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Logo & Identity (5 cols) */}
          <div className="lg:col-span-5 space-y-3.5 lg:border-r lg:border-slate-200 lg:pr-8">
            <Logo logoUrl={settings.logoUrl} size="lg" />
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              {settings.journalName} is indexed and committed to publishing rigorous original research,
              critical review articles, and scholarly case studies adhering strictly to COPE publishing ethics.
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 rounded-md bg-navy-50 text-navy-800 font-semibold border border-navy-200">
                Peer-Reviewed
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                Monthly Frequency
              </span>
              <span className="px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                International Circulation
              </span>
            </div>
            <div>
              <Link
                href="/journal-information"
                className="text-xs sm:text-sm font-semibold text-navy-700 hover:text-navy-900 hover:underline inline-flex items-center gap-1"
              >
                <span>Read Complete Journal Information & Aims</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Quick Access Matrix (7 cols) */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link
              href="/submit-manuscript"
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-navy-50/80 hover:bg-navy-100 border border-navy-100 transition-all text-center group active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-navy-700 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <Upload className="w-5 h-5 text-brand-orange" />
              </div>
              <span className="text-xs font-bold text-slate-900">Submit Paper</span>
              <span className="text-[10px] text-slate-500">Fast review track</span>
            </Link>

            <Link
              href="/track-manuscript"
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-center group active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-slate-700 text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <SearchCheck className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Track Status</span>
              <span className="text-[10px] text-slate-500">Live updates</span>
            </Link>

            <Link
              href="/current-issue"
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-center group active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-orange text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Current Issue</span>
              <span className="text-[10px] text-slate-500">Vol. 1 (2026)</span>
            </Link>

            <Link
              href="/author-guidelines"
              className="flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all text-center group active:scale-95 shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-brand-green text-white flex items-center justify-center mb-2 group-hover:scale-110 transition-transform shadow-sm">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-xs font-bold text-slate-900">Guidelines</span>
              <span className="text-[10px] text-slate-500">Style & templates</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
