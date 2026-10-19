import Link from "next/link";
import { Upload, CheckCircle2, FileText, ArrowRight, Clock, Star, Shield } from "lucide-react";

export const metadata = {
  title: "Submit Manuscript | JIIR",
  description: "Submit your research manuscript to the Journal of Interdisciplinary Innovation & Research. Review our pre-submission checklist and launch the 5-step wizard.",
};

export default function SubmitManuscriptLandingPage() {
  const checklist = [
    { text: "Complete manuscript file in Microsoft Word (.docx) or PDF format", note: "Max recommended: 8,000 words for research articles" },
    { text: "Structured abstract of 150–250 words covering background, methodology, and key findings", note: "" },
    { text: "4–6 relevant academic keywords for international indexing databases", note: "" },
    { text: "Full details of all co-authors: names, institutional affiliations, and email addresses", note: "" },
    { text: "Author ORCID iDs (optional but strongly recommended for permanent citation indexing)", note: "Register free at orcid.org" },
    { text: "Signed declaration that the work is original and not under concurrent evaluation", note: "Template provided in submission wizard" },
  ];

  const stats = [
    { label: "Avg. Review Time", value: "3–4 Weeks", icon: Clock },
    { label: "Acceptance Rate", value: "~28%", icon: Star },
    { label: "Double-Blind", value: "Peer Review", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Page Header — Full-width academic masthead */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-50 border border-navy-200 text-navy-700 text-xs font-bold mb-4">
              <Upload className="w-3.5 h-3.5 text-brand-orange" />
              <span>Author Submission Portal</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-navy-900 leading-tight mb-4">
              Submit Your Manuscript
            </h1>
            <p className="text-base text-slate-600 leading-relaxed max-w-2xl">
              Join a global community of interdisciplinary innovators. Review our pre-submission checklist
              and launch the streamlined 5-step manuscript submission wizard.
            </p>

            {/* Journal Stats Bar */}
            <div className="flex flex-wrap gap-6 mt-6 pt-6 border-t border-slate-200">
              {stats.map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.icon className="w-4 h-4 text-navy-600" />
                  <div>
                    <p className="text-base font-bold text-navy-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT: Pre-Submission Checklist */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Card Header */}
              <div className="px-4 sm:px-6 py-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50 text-left">
                <div className="w-9 h-9 rounded-lg bg-brand-orange/10 border border-brand-orange/20 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-brand-orange" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Pre-Submission Checklist</h2>
                  <p className="text-xs text-slate-500">Verify all items before launching the wizard</p>
                </div>
              </div>

              <div className="p-4 sm:p-8 text-left">
                <p className="text-sm text-slate-600 mb-6 leading-relaxed">
                  Please verify that your submission dossier includes all the required components
                  prior to launching the submission wizard:
                </p>

                <ul className="space-y-4">
                  {checklist.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-medium text-slate-800 leading-snug">{item.text}</p>
                        {item.note && (
                          <p className="text-xs text-slate-500 italic">{item.note}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                {/* File size note */}
                <div className="mt-6 p-4 rounded-xl bg-navy-50 border border-navy-200">
                  <p className="text-xs font-bold text-navy-800 mb-1">Zero File-Size Limitations</p>
                  <p className="text-xs text-navy-700 leading-relaxed">
                    JIIR accepts research papers, high-resolution figures, and supplemental datasets
                    of any size via automatic chunked direct uploads — no compression required.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: Action / Auth Card */}
          <div className="lg:col-span-5 space-y-4">
            {/* Main CTA Card */}
            <div className="bg-navy-950 text-white rounded-2xl overflow-hidden border border-navy-800 shadow-xl">
              {/* Gradient accent top */}
              <div className="h-1 bg-gradient-to-r from-[#1F3C88] via-[#C2185B] to-[#F57C00]" />

              <div className="p-4 sm:p-8 space-y-6 text-center">
                <div className="w-16 h-16 rounded-2xl bg-brand-orange/15 border border-brand-orange/30 text-brand-orange flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-serif font-bold text-white">Ready to Submit?</h3>
                  <p className="text-sm text-navy-300 leading-relaxed">
                    Log into your existing Scholar Account or register a new author profile to begin.
                  </p>
                </div>

                <div className="space-y-3">
                  <Link
                    href="/scholar/submit"
                    className="w-full inline-flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-orange-900/30 transition-all active:scale-95"
                  >
                    <span>Launch Submission Wizard</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <div className="grid grid-cols-2 gap-2.5">
                    <Link
                      href="/login?callbackUrl=/scholar/submit"
                      className="py-3 px-3 rounded-xl border border-white/20 hover:bg-white/10 text-sm font-semibold text-white transition-colors text-center"
                    >
                      Scholar Login
                    </Link>
                    <Link
                      href="/register?callbackUrl=/scholar/submit"
                      className="py-3 px-3 rounded-xl bg-white text-navy-900 hover:bg-navy-50 text-sm font-bold transition-colors text-center"
                    >
                      Create Account
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Track manuscript link */}
            <div className="p-4 rounded-xl bg-white border border-slate-200 text-center">
              <p className="text-sm text-slate-600">
                Already submitted?{" "}
                <Link href="/track-manuscript" className="text-navy-700 font-semibold hover:underline">
                  Track your paper status →
                </Link>
              </p>
            </div>

            {/* Ethics & Policy note */}
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
              <p className="text-xs font-bold text-emerald-800 mb-1">Publication Ethics</p>
              <p className="text-xs text-emerald-700 leading-relaxed">
                JIIR follows COPE guidelines. All submissions undergo plagiarism screening via iThenticate
                and double-blind peer review by domain experts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
