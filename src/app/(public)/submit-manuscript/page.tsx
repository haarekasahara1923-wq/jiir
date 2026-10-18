import Link from "next/link";
import { Upload, CheckCircle2, FileText, ArrowRight, ShieldCheck, UserCheck, Lock } from "lucide-react";

export default function SubmitManuscriptLandingPage() {
  const checklist = [
    "Complete manuscript file prepared in Microsoft Word (.docx) or PDF format",
    "Structured abstract of 150 to 250 words describing background, methodology, and key findings",
    "4 to 6 relevant academic keywords for international indexing",
    "Full details of all co-authors: full names, institutional affiliations, and email addresses",
    "Author ORCID iDs (optional but strongly recommended for permanent citation indexing)",
    "Declaration that the work is original and not under evaluation with any other journal",
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-navy-300 text-xs font-semibold mb-2">
          <Upload className="w-3.5 h-3.5 text-brand-orange" />
          <span>Author Submission Portal</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-serif font-bold text-navy-900 dark:text-white">
          Submit Your Manuscript to JIIR
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Join a global community of interdisciplinary innovators. Review our pre-submission checklist
          and launch the streamlined 5-step manuscript submission wizard.
        </p>
      </div>

      {/* Grid: Checklist & Login/Register Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start max-w-5xl mx-auto">
        {/* Checklist (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl border border-border p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-xl font-serif font-bold text-foreground border-b border-border pb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-orange" />
            <span>Pre-Submission Checklist</span>
          </h2>

          <p className="text-xs text-muted-foreground">
            Please verify that your submission dossier includes all the required components prior to launching the submission wizard:
          </p>

          <ul className="space-y-3">
            {checklist.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-foreground/90">
                <CheckCircle2 className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                <span className="leading-snug">{item}</span>
              </li>
            ))}
          </ul>

          <div className="p-4 rounded-xl bg-navy-50/70 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-900 text-xs text-muted-foreground space-y-1">
            <span className="font-bold text-foreground">Zero File Size Limitations:</span>
            <p className="text-[11px]">
              JIIR accepts research papers, high-resolution figures, and supplemental datasets of any size with
              automatic chunked direct uploads.
            </p>
          </div>
        </div>

        {/* Action / Auth Card (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-6 sm:p-8 border border-navy-800 shadow-xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-brand-orange/20 border border-brand-orange/40 text-brand-orange flex items-center justify-center mx-auto">
              <Upload className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-serif font-bold text-white">
                Ready to Submit?
              </h3>
              <p className="text-xs text-navy-200 leading-relaxed">
                Log into your existing Scholar Account or register a new author profile to begin.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <Link
                href="/scholar/submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
              >
                <span>Launch Submission Wizard</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href="/login?callbackUrl=/scholar/submit"
                  className="py-2.5 px-3 rounded-lg border border-white/20 hover:bg-white/10 text-xs font-semibold text-white transition-colors"
                >
                  Scholar Login
                </Link>
                <Link
                  href="/register?callbackUrl=/scholar/submit"
                  className="py-2.5 px-3 rounded-lg bg-white text-navy-900 hover:bg-navy-50 text-xs font-bold transition-colors"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/50 border border-border text-center text-xs text-muted-foreground">
            Already submitted?{" "}
            <Link href="/track-manuscript" className="text-primary font-semibold hover:underline">
              Track your paper status here →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
