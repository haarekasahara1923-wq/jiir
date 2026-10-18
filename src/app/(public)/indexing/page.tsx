import Link from "next/link";
import { Award, CheckCircle2, Clock, Globe, ShieldAlert, ExternalLink, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

interface IndexService {
  id: string;
  name: string;
  category: string;
  status: "INDEXED" | "EVALUATION" | "PLANNED";
  description: string;
  url?: string | null;
  coverageStart?: string | null;
}

const defaultServices: IndexService[] = [
  {
    id: "idx-1",
    name: "Google Scholar",
    category: "Academic Search Engine & Metrics",
    status: "INDEXED",
    description: "Full automated harvesting of metadata, citations, abstracts, and PDF links for all published articles.",
    url: "https://scholar.google.com",
    coverageStart: "Volume 1, 2026",
  },
  {
    id: "idx-2",
    name: "Crossref (DOI)",
    category: "Digital Object Identifier Registry",
    status: "PLANNED",
    description: "Member publisher onboarding in process. Permanent DOI prefix assignment for persistent citation tracking.",
    url: "https://www.crossref.org",
  },
  {
    id: "idx-3",
    name: "ROAD (ISSN International Centre)",
    category: "Directory of Open Access Scholarly Resources",
    status: "EVALUATION",
    description: "Application submitted following formal ISSN issuance. Provides international open-access cataloguing.",
    url: "https://road.issn.org",
  },
  {
    id: "idx-4",
    name: "PKP Index",
    category: "Global Open Journal Repository",
    status: "INDEXED",
    description: "Harvested directly through Open Archives Initiative (OAI-PMH) metadata standards.",
    url: "https://index.pkp.sfu.ca",
    coverageStart: "2026",
  },
  {
    id: "idx-5",
    name: "DRJI (Directory of Research Journals Indexing)",
    category: "Journal Indexing & Quality Evaluation",
    status: "INDEXED",
    description: "Evaluated and listed under multidisciplinary peer-reviewed research publications.",
    url: "http://olddrji.lbp.world",
    coverageStart: "2026",
  },
  {
    id: "idx-6",
    name: "ResearchBib",
    category: "Academic Resource Database",
    status: "INDEXED",
    description: "Indexing multidisciplinary papers and promoting global scholarly dissemination.",
    url: "http://www.researchbib.com",
    coverageStart: "2026",
  },
  {
    id: "idx-7",
    name: "WorldCat (OCLC)",
    category: "Global Union Library Catalog",
    status: "PLANNED",
    description: "Planned bibliographic inclusion across university and national research libraries worldwide.",
    url: "https://www.worldcat.org",
  },
  {
    id: "idx-8",
    name: "Directory of Open Access Journals (DOAJ)",
    category: "Peer-Reviewed Open Access Index",
    status: "PLANNED",
    description: "Formal application scheduled following completion of Volume 1 in strict alignment with DOAJ transparency criteria.",
    url: "https://doaj.org",
  },
];

export default async function IndexingPage() {
  let services: any[] = [];

  try {
    services = await prisma.indexingService.findMany({
      orderBy: { sortOrder: "asc" },
    });
  } catch {}

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Academic Visibility & Dissemination
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
          Indexing, Abstracting & Digital Archiving
        </h1>
        <p className="text-sm text-muted-foreground max-w-3xl leading-relaxed">
          JIIR is committed to verifiable transparency. Every indexing partner, library repository, and metadata
          aggregator is documented with its genuine, verifiable real-time evaluation status.
        </p>
      </div>

      {/* Honest Transparency Notice */}
      <div className="p-5 rounded-2xl bg-navy-50/80 dark:bg-navy-950/40 border border-navy-200 dark:border-navy-900 flex items-start gap-3.5 text-xs text-navy-900 dark:text-navy-200">
        <ShieldAlert className="w-5 h-5 text-brand-orange shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-sm">Transparency & Scientific Integrity Disclosure:</p>
          <p className="text-muted-foreground leading-relaxed text-[11px]">
            JIIR is a newly founded peer-reviewed journal launched in 2026. Major legacy citation indexes (such as Scopus,
            Web of Science, and DOAJ) require 1–2 full calendar years of uninterrupted publishing history and minimum article quotas
            before commencing formal evaluation. We pledge never to advertise unverified or misleading indexing claims.
          </p>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayServices.map((srv) => (
          <div
            key={srv.id}
            className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {srv.category}
                </span>

                {srv.status === "INDEXED" ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Active / Indexed
                  </span>
                ) : srv.status === "EVALUATION" ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    In Evaluation
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-500/10 text-blue-600 dark:text-blue-300 border border-blue-500/20">
                    Planned Inclusion
                  </span>
                )}
              </div>

              <h2 className="text-base font-serif font-bold text-foreground">
                {srv.name}
              </h2>

              <p className="text-xs text-muted-foreground leading-relaxed">
                {srv.description}
              </p>

              {srv.coverageStart && (
                <p className="text-[11px] text-muted-foreground font-semibold">
                  Coverage: {srv.coverageStart}
                </p>
              )}
            </div>

            {srv.url && (
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
                <a
                  href={srv.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                >
                  <span>Verification Directory</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
