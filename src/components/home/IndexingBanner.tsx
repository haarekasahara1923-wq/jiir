import Link from "next/link";
import { Award, CheckCircle2, Clock, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";

interface IndexingItem {
  name: string;
  category: string;
  status: "INDEXED" | "EVALUATION" | "PLANNED";
  note?: string;
}

const defaultPartners: IndexingItem[] = [
  { name: "Google Scholar", category: "Search & Metrics", status: "INDEXED", note: "Automated crawling active" },
  { name: "Crossref (DOI)", category: "Identifier Registry", status: "PLANNED", note: "Member application in process" },
  { name: "PKP Index", category: "Open Journal Directory", status: "INDEXED", note: "Harvested regularly" },
  { name: "ROAD (ISSN)", category: "Directory of Open Access", status: "EVALUATION", note: "Under verification" },
  { name: "Directory of Research Journals (DRJI)", category: "Indexing Service", status: "INDEXED", note: "Verified indexed" },
  { name: "ResearchBib", category: "Academic Database", status: "INDEXED", note: "Active listing" },
  { name: "WorldCat (OCLC)", category: "Global Library Catalog", status: "PLANNED", note: "Scheduled for submission" },
  { name: "DOAJ", category: "Open Access Directory", status: "PLANNED", note: "Eligible after Volume 1 completion" },
];

export function IndexingBanner() {
  return (
    <section className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-navy-800 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-navy-800/80 text-brand-orange text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scholarly Discovery & Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Indexing, Abstracting & Digital Preservation
          </h2>
          <p className="text-xs sm:text-sm text-navy-200 mt-1 max-w-2xl">
            In compliance with our ethical transparency policy, every indexing and metadata partner
            is reported with its true, verifiable real-time status.
          </p>
        </div>

        <Link
          href="/indexing"
          className="text-xs font-bold text-brand-orange hover:underline inline-flex items-center gap-1 group shrink-0"
        >
          <span>View Complete Indexing Directory</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      {/* Indexing Partners Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {defaultPartners.map((item) => (
          <div
            key={item.name}
            className="p-3.5 rounded-xl bg-navy-850/60 border border-navy-800/80 hover:border-navy-700 transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-navy-400 uppercase tracking-wider font-semibold">
                {item.category}
              </span>
              {item.status === "INDEXED" ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500/20 text-emerald-400 flex items-center gap-0.5">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Active
                </span>
              ) : item.status === "EVALUATION" ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500/20 text-amber-400 flex items-center gap-0.5">
                  <Clock className="w-2.5 h-2.5" />
                  In Review
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-blue-500/20 text-blue-300">
                  Planned
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
            {item.note && <p className="text-[10px] text-navy-400 line-clamp-1">{item.note}</p>}
          </div>
        ))}
      </div>

      <div className="pt-2 flex items-center justify-between text-xs text-navy-300 border-t border-navy-800/80">
        <p className="text-[11px]">
          DOI prefix assignment and Crossref integration is maintained transparently without false claims.
        </p>
        <Link href="/doi" className="text-[11px] text-brand-orange hover:underline font-semibold">
          Learn about our DOI roadmap →
        </Link>
      </div>
    </section>
  );
}
