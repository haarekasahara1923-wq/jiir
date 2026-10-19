import Link from "next/link";
import {
  Upload,
  Search,
  Users,
  CheckCircle,
  FileCheck,
  Globe,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

const steps = [
  {
    step: "01",
    title: "Submission",
    desc: "Author uploads manuscript and metadata via Scholar Portal with live tracking ID.",
    icon: Upload,
  },
  {
    step: "02",
    title: "Editorial Screening",
    desc: "Chief Editor verifies scope, format, and initial similarity check (turnaround: 2–4 days).",
    icon: Search,
  },
  {
    step: "03",
    title: "Double-Blind Review",
    desc: "Two independent domain specialists evaluate methodology, originality, and impact.",
    icon: Users,
  },
  {
    step: "04",
    title: "Editorial Decision",
    desc: "Unconditional acceptance, revision required, or rejection issued solely on academic merits.",
    icon: CheckCircle,
  },
  {
    step: "05",
    title: "Production & Proofs",
    desc: "Typesetting, layout formatting, PDF galley proofs approved by the corresponding author.",
    icon: FileCheck,
  },
  {
    step: "06",
    title: "Online Publication",
    desc: "Immediate Open Access release, metadata indexing, and QR-verifiable certificate issuance.",
    icon: Globe,
  },
];

export function PublicationTimeline() {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-8 lg:p-10 shadow-sm space-y-8 text-left">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Rigorous &amp; Transparent
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Publication Procedure &amp; Workflow
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-2xl font-medium">
            From initial manuscript submission to digital DOI registration and global indexing, every step follows
            international COPE guidelines.
          </p>
        </div>

        <Link
          href="/peer-review-policy"
          className="text-xs font-bold text-navy-800 hover:text-brand-orange inline-flex items-center gap-1 group shrink-0"
        >
          <span>Read Full Peer Review Policy</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* 6-Step Horizontal / Grid Timeline */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 relative">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={s.step}
              className="relative p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-lg bg-navy-800 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-600">{s.step}</span>
                </div>
                <h3 className="text-xs font-bold font-serif text-slate-900">{s.title}</h3>
                <p className="text-[11px] text-slate-700 leading-relaxed font-normal">{s.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Editorial Independence Guarantee */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3 text-xs text-amber-950">
        <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-amber-950">Editorial Integrity &amp; Independence Notice:</p>
          <p className="text-[11px] leading-relaxed text-amber-900 font-medium">
            JIIR maintains absolute firewalling between editorial decisions and financial processing.
            Article Processing Charges (APC) are only requested <strong>after</strong> an unconditional acceptance
            decision has been granted by the Chief Editor. Payment does not guarantee publication, nor can fee payment
            accelerate acceptance.
          </p>
        </div>
      </div>
    </section>
  );
}
