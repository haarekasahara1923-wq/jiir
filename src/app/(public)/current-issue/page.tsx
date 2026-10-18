import Link from "next/link";
import { BookOpen, Calendar, Download, FileText, ArrowRight, ExternalLink } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

export default async function CurrentIssuePage() {
  const settings = await getSiteSettings();

  let issue: any = null;

  try {
    issue = await prisma.issue.findFirst({
      where: { status: "CURRENT" },
      include: {
        articles: {
          orderBy: { pageStart: "asc" },
        },
      },
    });
  } catch {}

  const current = issue || {
    volume: 1,
    issueNo: 1,
    year: 2026,
    month: 10,
    title: "Inaugural Issue — Multidisciplinary Innovation Across Global Frontiers",
    status: "CURRENT",
    articles: [],
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Issue Hero Banner */}
      <div className="bg-gradient-to-br from-navy-900 via-navy-950 to-slate-950 text-white rounded-2xl p-6 sm:p-10 border border-navy-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-navy-800/80 pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-orange text-white">
                Current Issue
              </span>
              <span className="text-xs text-navy-300 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Year {current.year}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Volume {current.volume}, Issue {current.issueNo} ({current.year})
            </h1>
            {current.title && (
              <p className="text-sm text-navy-200 max-w-2xl">{current.title}</p>
            )}
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/past-issues"
              className="px-4 py-2.5 rounded-xl border border-white/20 text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              Browse Archives
            </Link>
            <Link
              href="/submit-manuscript"
              className="px-4 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider transition-colors shadow-md"
            >
              Submit to Next Issue
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs text-navy-300">
          <div>
            <span className="text-[10px] uppercase text-navy-400 block font-semibold">Frequency</span>
            <strong className="text-white text-sm">Monthly</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-navy-400 block font-semibold">Peer-Review</span>
            <strong className="text-white text-sm">Double-Blind</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-navy-400 block font-semibold">Articles Published</span>
            <strong className="text-white text-sm">{current.articles.length} Papers</strong>
          </div>
          <div>
            <span className="text-[10px] uppercase text-navy-400 block font-semibold">Licensing</span>
            <strong className="text-white text-sm">CC BY-NC 4.0</strong>
          </div>
        </div>
      </div>

      {/* Articles Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <h2 className="text-xl font-serif font-bold text-foreground">
            Table of Contents
          </h2>
          <span className="text-xs text-muted-foreground">
            {current.articles.length} {current.articles.length === 1 ? "article" : "articles"} in this issue
          </span>
        </div>

        {current.articles.length > 0 ? (
          <div className="space-y-4">
            {current.articles.map((art: any) => {
              const authorsList = Array.isArray(art.authors)
                ? art.authors.map((a: any) => a.name || a).join(", ")
                : String(art.authors || "");

              return (
                <div
                  key={art.id}
                  className="bg-white dark:bg-slate-900 rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-shadow space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
                        {String(art.articleType).replace("_", " ")}
                      </span>
                      {art.researchArea && (
                        <span className="text-xs text-muted-foreground">
                          {art.researchArea}
                        </span>
                      )}
                    </div>
                    {art.doi && (
                      <span className="text-xs font-mono text-primary hover:underline">
                        doi.org/{art.doi}
                      </span>
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/articles/${art.slug}`}
                      className="text-lg font-serif font-bold text-foreground hover:text-primary transition-colors"
                    >
                      {art.title}
                    </Link>
                    <p className="text-xs text-muted-foreground mt-1">
                      {authorsList}
                    </p>
                  </div>

                  {art.abstract && (
                    <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                      {art.abstract}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border/60 text-xs">
                    <div className="flex items-center gap-3">
                      <Link
                        href={`/articles/${art.slug}`}
                        className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
                      >
                        <span>Full Text (HTML)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      {art.pdfAssetId && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-muted hover:bg-navy-700 hover:text-white font-semibold transition-colors cursor-pointer">
                          <Download className="w-3 h-3" />
                          <span>PDF</span>
                        </span>
                      )}
                    </div>

                    <div className="text-[11px] text-muted-foreground">
                      Pages {art.pageStart ?? 1}–{art.pageEnd ?? 10}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-12 rounded-2xl bg-white dark:bg-slate-900 border border-dashed border-border text-center space-y-4">
            <BookOpen className="w-12 h-12 text-muted-foreground mx-auto" />
            <h3 className="text-lg font-serif font-bold text-foreground">
              Volume 1, Issue 1 is In Progress
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
              Manuscripts accepted in the current review cycle will appear here immediately upon completion of
              typesetting and author proof approvals.
            </p>
            <div className="pt-2">
              <Link
                href="/submit-manuscript"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
              >
                <span>Submit Your Manuscript for Volume 1</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
