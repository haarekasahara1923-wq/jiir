import Link from "next/link";
import { CheckCircle2, Clock, ArrowRight, ShieldCheck } from "lucide-react";

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
    <section className="bg-gradient-to-br from-navy-900 to-navy-950 text-white rounded-2xl p-6 sm:p-8 lg:p-10 border border-navy-700 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Scholarly Discovery &amp; Transparency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Indexing, Abstracting &amp; Digital Preservation
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-2xl font-medium">
            In compliance with our ethical transparency policy, every indexing and metadata partner
            is reported with its true, verifiable real-time status.
          </p>
        </div>

        <Link
          href="/indexing"
          className="text-xs font-bold text-amber-300 hover:text-white hover:underline inline-flex items-center gap-1 group shrink-0 transition-colors"
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
            className="p-3.5 rounded-xl bg-white/5 border border-white/15 hover:border-white/30 transition-colors space-y-1.5"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-[10px] text-slate-300 uppercase tracking-wider font-semibold truncate">
                {item.category}
              </span>
              {item.status === "INDEXED" ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-500 text-white flex items-center gap-0.5 shrink-0">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Active
                </span>
              ) : item.status === "EVALUATION" ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-500 text-white flex items-center gap-0.5 shrink-0">
                  <Clock className="w-2.5 h-2.5" />
                  In Review
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-sky-500 text-white shrink-0">
                  Planned
                </span>
              )}
            </div>
            <h4 className="text-xs font-bold text-white truncate">{item.name}</h4>
            {item.note && <p className="text-[10px] text-slate-300 line-clamp-1">{item.note}</p>}
          </div>
        ))}
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs border-t border-white/15">
        <p className="text-[11px] text-slate-300 font-medium">
          DOI prefix assignment and Crossref integration is maintained transparently without false claims.
        </p>
        <Link href="/doi" className="text-[11px] text-amber-300 hover:text-white hover:underline font-bold transition-colors shrink-0">
          Learn about our DOI roadmap →
        </Link>
      </div>
    </section>
  );
}
