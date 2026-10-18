import Link from "next/link";
import { Download, FileText, BookOpen, BookmarkCheck, ArrowRight } from "lucide-react";

const resources = [
  {
    title: "Official Manuscript Template (DOCX)",
    desc: "Pre-formatted template with title, abstract, heading styles, and referencing guidelines.",
    format: "DOCX",
    size: "85 KB",
    href: "/resources/jiir-manuscript-template.docx",
  },
  {
    title: "Complete Author Guidelines (PDF)",
    desc: "Comprehensive handbook detailing structural requirements, ethics, and submission checklist.",
    format: "PDF",
    size: "420 KB",
    href: "/resources/jiir-author-guidelines.pdf",
  },
  {
    title: "APA & Citation Style Sheet (PDF)",
    desc: "Quick-reference referencing manual for journal articles, books, and online datasets.",
    format: "PDF",
    size: "190 KB",
    href: "/resources/jiir-citation-guide.pdf",
  },
  {
    title: "Copyright & Authorship Agreement",
    desc: "Open Access CC BY-NC 4.0 declaration and conflict of interest disclosure template.",
    format: "PDF",
    size: "150 KB",
    href: "/resources/jiir-copyright-form.pdf",
  },
];

export function AuthorResourcesStrip() {
  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Downloads & Tools
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 dark:text-white mt-1">
            Author Resources & Submission Kit
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Download verified templates and referencing guides to accelerate manuscript preparation.
          </p>
        </div>

        <Link
          href="/author-resources"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 group shrink-0"
        >
          <span>View All Author Resources</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resources.map((res) => (
          <div
            key={res.title}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border hover:border-navy-300 dark:hover:border-navy-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
                  {res.format}
                </span>
                <span className="text-[10px] text-muted-foreground">{res.size}</span>
              </div>
              <h3 className="text-xs font-bold text-foreground leading-snug">{res.title}</h3>
              <p className="text-[11px] text-muted-foreground leading-relaxed">{res.desc}</p>
            </div>

            <div className="pt-4 mt-2 border-t border-border/50">
              <a
                href={res.href}
                download
                className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-muted hover:bg-navy-700 hover:text-white text-foreground transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Kit</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
