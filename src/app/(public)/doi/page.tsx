import Link from "next/link";
import { Globe, Award, ShieldAlert, ArrowRight, ExternalLink, CheckCircle2, BookmarkCheck } from "lucide-react";

export default function DoiPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Digital Object Identifiers
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
          DOI & Persistent Identifiers Roadmap
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Learn how Digital Object Identifiers (DOIs) safeguard permanent discovery, citation tracking,
          and metadata interoperability for all JIIR published articles.
        </p>
      </div>

      {/* Honest Status Callout */}
      <div className="p-4 sm:p-6 rounded-2xl bg-navy-50/80 dark:bg-navy-950/40 border border-navy-200 dark:border-navy-900 flex items-start gap-4 text-left">
        <ShieldAlert className="w-6 h-6 text-brand-orange shrink-0 mt-0.5" />
        <div className="space-y-2 text-xs text-navy-900 dark:text-navy-200">
          <h2 className="text-base font-bold font-serif">
            DOI Integration Status: Crossref Application In Process (Planned)
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            In strict compliance with our transparency ethos, JIIR discloses that Crossref publisher onboarding and
            assigned DOI prefix allocation is currently in progress. DOI badges will only appear on published articles
            once formal registration is completed with Crossref.
          </p>
          <div className="flex items-center gap-2 pt-1 font-semibold text-primary">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>All Volume 1 articles will receive permanent DOIs retroactively upon completion.</span>
          </div>
        </div>
      </div>

      {/* What is a DOI */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        <div className="p-4 sm:p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border space-y-4 shadow-sm text-left">
          <h3 className="text-lg font-serif font-bold text-foreground">
            What is a Digital Object Identifier (DOI)?
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            A Digital Object Identifier (DOI) is a unique alphanumeric string assigned by the International DOI Foundation
            (IDF) through registration agencies like Crossref. Unlike standard web URLs which can suffer from link rot,
            a DOI provides an actionable, permanent, and persistent link to a published scholarly document.
          </p>
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-foreground">Key Benefits for JIIR Authors:</h4>
            <ul className="space-y-1.5 list-disc list-inside text-muted-foreground">
              <li>Permanent citation indexing in Web of Science, Scopus, and Google Scholar</li>
              <li>Automated altmetric tracking (social shares, policy citations, news mentions)</li>
              <li>Instant resolution regardless of server migrations or domain updates</li>
              <li>Seamless import into Mendeley, Zotero, EndNote, and reference managers</li>
            </ul>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border space-y-4 shadow-sm">
          <h3 className="text-lg font-serif font-bold text-foreground">
            JIIR Standard DOI Citation Schema
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Each published article in JIIR is structured according to the international Crossref syntax:
          </p>
          <div className="p-4 rounded-xl bg-muted font-mono text-xs text-primary font-bold break-all">
            10.xxxxx/jiir.YYYY.VV.II.AAAA
          </div>
          <div className="text-[11px] text-muted-foreground space-y-1">
            <p>• <strong>10.xxxxx:</strong> Publisher registrant prefix allocated by Crossref</p>
            <p>• <strong>YYYY:</strong> Calendar year of publication (e.g. 2026)</p>
            <p>• <strong>VV:</strong> Journal volume number</p>
            <p>• <strong>II:</strong> Journal issue number</p>
            <p>• <strong>AAAA:</strong> Unique article sequence / identifier</p>
          </div>
        </div>
      </div>

      {/* How to cite */}
      <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border space-y-4 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-foreground">
          How to Cite JIIR Articles
        </h3>
        <p className="text-xs text-muted-foreground">
          Authors and researchers citing papers published in JIIR should follow standard APA 7th Edition format:
        </p>

        <div className="p-4 rounded-xl bg-navy-50/60 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-900 font-serif text-xs text-foreground space-y-2">
          <p>
            Author, A. A., & Author, B. B. (2026). Title of multidisciplinary research paper.{" "}
            <em>Journal of Interdisciplinary Innovation & Research</em>, 1(1), 10–24.
            https://doi.org/10.xxxxx/jiir.2026.01.01.0001
          </p>
        </div>
      </div>
    </div>
  );
}
