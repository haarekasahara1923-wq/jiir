import Link from "next/link";
import { BookOpen, Calendar, ArrowRight, FileText, CheckCircle2 } from "lucide-react";

interface ArticleSummary {
  id: string;
  title: string;
  slug: string;
  authors: Array<{ name: string }>;
  articleType: string;
}

interface IssueData {
  volume: number;
  issue: number;
  year: number;
  title?: string | null;
  status: string;
  articles?: ArticleSummary[];
}

interface CurrentIssueBoxProps {
  currentIssue?: IssueData | null;
}

export function CurrentIssueBox({ currentIssue }: CurrentIssueBoxProps) {
  const issue = currentIssue || {
    volume: 1,
    issue: 1,
    year: 2026,
    title: "Inaugural Issue — Multidisciplinary Horizons in Science, Technology & Management",
    status: "CURRENT",
    articles: [],
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-border p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-4 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-navy-300">
              {issue.status}
            </span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Year {issue.year}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-navy-900 dark:text-white">
            Volume {issue.volume}, Issue {issue.issue} ({issue.year})
          </h2>
          {issue.title && (
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{issue.title}</p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/current-issue"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>View Current Issue</span>
          </Link>
          <Link
            href="/past-issues"
            className="inline-flex items-center gap-1 px-3 py-2 rounded-lg border border-border hover:bg-muted text-xs font-semibold transition-colors"
          >
            <span>Archives</span>
          </Link>
        </div>
      </div>

      {/* Article List or Forthcoming Notice */}
      {issue.articles && issue.articles.length > 0 ? (
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Featured Research in this Issue
          </h3>
          <div className="divide-y divide-border">
            {issue.articles.slice(0, 4).map((art) => (
              <div key={art.id} className="py-3 flex items-start justify-between gap-4">
                <div>
                  <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-foreground mb-1">
                    {art.articleType.replace("_", " ")}
                  </span>
                  <Link
                    href={`/articles/${art.slug}`}
                    className="text-sm font-semibold text-foreground hover:text-primary transition-colors block"
                  >
                    {art.title}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {art.authors.map((a) => a.name).join(", ")}
                  </p>
                </div>
                <Link
                  href={`/articles/${art.slug}`}
                  className="shrink-0 p-2 text-muted-foreground hover:text-foreground"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-6 rounded-xl bg-muted/40 border border-dashed border-border text-center space-y-2">
          <BookOpen className="w-8 h-8 text-muted-foreground mx-auto" />
          <h4 className="text-sm font-bold text-foreground">Inaugural Issue Currently Open for Submissions</h4>
          <p className="text-xs text-muted-foreground max-w-lg mx-auto">
            Authors are cordially invited to submit original research papers, reviews, and clinical studies
            for peer review and inclusion in Volume 1, Issue 1.
          </p>
          <div className="pt-2">
            <Link
              href="/submit-manuscript"
              className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
            >
              <span>Submit for Volume 1, Issue 1</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
