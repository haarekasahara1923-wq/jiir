import Link from "next/link";
import { BookOpen, Calendar, Archive, ArrowRight, Search, FileText } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

export default async function PastIssuesPage() {
  let issues: any[] = [];

  try {
    issues = await prisma.issue.findMany({
      include: {
        _count: { select: { articles: true } },
      },
      orderBy: [{ year: "desc" }, { volume: "desc" }, { issueNo: "desc" }],
    });
  } catch {}

  const displayIssues = issues.length > 0 ? issues : [
    {
      id: "iss-1",
      volume: 1,
      issue: 1,
      year: 2026,
      month: "October",
      status: "CURRENT",
      title: "Inaugural Issue — Multidisciplinary Innovation Across Global Frontiers",
      _count: { articles: 0 },
    },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-8">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Archive className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Archives & Repositories
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
          Past Issues & Volume Archive
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Browse through the complete archive of peer-reviewed volumes and issues published by the
          Journal of Interdisciplinary Innovation & Research.
        </p>
      </div>

      {/* Grid of Issues */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayIssues.map((iss) => (
          <div
            key={iss.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4 text-left"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
                  Vol. {iss.volume}, Issue {iss.issue}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  {iss.year}
                </span>
              </div>

              <h2 className="text-lg font-serif font-bold text-foreground">
                {iss.title || `Volume ${iss.volume}, Issue ${iss.issue} (${iss.year})`}
              </h2>

              <p className="text-xs text-muted-foreground">
                {iss._count.articles} {iss._count.articles === 1 ? "article" : "articles"} published
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              <Link
                href={iss.status === "CURRENT" ? "/current-issue" : `/issues/${iss.volume}-${iss.issue}`}
                className="font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>View Table of Contents</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
