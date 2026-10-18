"use client";

import { useState } from "react";
import { Award, Search, Filter, Eye, Download, FileText, CheckCircle2, XCircle, ExternalLink } from "lucide-react";

interface ArticleItem {
  id: string;
  title: string;
  authors: string;
  doi?: string;
  issue: string;
  subject: string;
  publishedDate: string;
  views: number;
  downloads: number;
  isPublished: boolean;
}

const INITIAL_ARTICLES: ArticleItem[] = [
  {
    id: "art-1",
    title: "Deep Neural Optimization Frameworks in Renewable Smart Microgrids: A Multi-Regional Study",
    authors: "Dr. Rajesh Sharma, Prof. Ananya Roy",
    doi: "10.5281/zenodo.1084291",
    issue: "Vol. 2, Issue 3 (March 2026)",
    subject: "Technology & Engineering",
    publishedDate: "2026-03-31",
    views: 482,
    downloads: 167,
    isPublished: true
  },
  {
    id: "art-2",
    title: "Comparative Analysis of Higher Education Digital Transformation Policies in Emerging Markets",
    authors: "Dr. Vikram Seth, Dr. Priya Nair",
    doi: "10.5281/zenodo.1084292",
    issue: "Vol. 2, Issue 3 (March 2026)",
    subject: "Education & Pedagogy",
    publishedDate: "2026-03-30",
    views: 319,
    downloads: 112,
    isPublished: true
  },
  {
    id: "art-3",
    title: "Post-Pandemic Hospitality Operations: Workforce Retention & Sustainable Eco-Resort Systems",
    authors: "Prof. Sunita Deshmukh, Rohan Kulkarni",
    doi: "10.5281/zenodo.1084293",
    issue: "Vol. 2, Issue 2 (Feb 2026)",
    subject: "Hospitality & Tourism",
    publishedDate: "2026-02-28",
    views: 654,
    downloads: 245,
    isPublished: true
  },
  {
    id: "art-4",
    title: "Cryptographic Data Integrity in Healthcare Supply Chain Auditing: An Ethereum Blockchain Evaluation",
    authors: "Arjun Verma, Dr. Michael Chen",
    doi: "10.5281/zenodo.1084294",
    issue: "Vol. 2, Issue 2 (Feb 2026)",
    subject: "Science & Technology",
    publishedDate: "2026-02-27",
    views: 521,
    downloads: 198,
    isPublished: true
  },
  {
    id: "art-5",
    title: "Cross-Cultural Behavioral Economics: Decision Heuristics Among Rural Micro-Entrepreneurs",
    authors: "Dr. Fatima Noor, Dr. Alok Mathur",
    doi: "10.5281/zenodo.1084295",
    issue: "Vol. 1, Issue 1 (Jan 2026)",
    subject: "Management & Business",
    publishedDate: "2026-01-31",
    views: 890,
    downloads: 384,
    isPublished: true
  }
];

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<ArticleItem[]>(INITIAL_ARTICLES);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("ALL");

  const filtered = articles.filter((a) => {
    if (subjectFilter !== "ALL" && a.subject !== subjectFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.authors.toLowerCase().includes(q) ||
        a.doi?.toLowerCase().includes(q) ||
        a.issue.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const togglePublish = (id: string) => {
    setArticles(
      articles.map((a) => (a.id === id ? { ...a, isPublished: !a.isPublished } : a))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Published Articles Catalog
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor live scholarly publications, indexing records, citation metrics, and reader engagement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 dark:bg-navy-950/60 dark:text-navy-200 border border-border">
            Total Published: {articles.filter((a) => a.isPublished).length}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search title, author, DOI..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>

        <select
          value={subjectFilter}
          onChange={(e) => setSubjectFilter(e.target.value)}
          className="w-full sm:w-auto p-1.5 rounded-lg border border-border bg-background text-xs text-foreground"
        >
          <option value="ALL">All Disciplines</option>
          <option value="Technology & Engineering">Technology & Engineering</option>
          <option value="Education & Pedagogy">Education & Pedagogy</option>
          <option value="Hospitality & Tourism">Hospitality & Tourism</option>
          <option value="Management & Business">Management & Business</option>
        </select>
      </div>

      {/* Articles Table */}
      <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">Article Details</th>
                <th className="p-4">Discipline & Issue</th>
                <th className="p-4">Metrics</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 max-w-md">
                    <p className="font-semibold text-foreground text-sm line-clamp-2">
                      {item.title}
                    </p>
                    <p className="text-muted-foreground text-[11px] mt-1">
                      {item.authors}
                    </p>
                    {item.doi && (
                      <span className="inline-block mt-1 font-mono text-[10px] text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded">
                        DOI: {item.doi}
                      </span>
                    )}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="font-medium text-foreground block">{item.subject}</span>
                    <span className="text-[11px] text-muted-foreground">{item.issue}</span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <div className="space-y-1 text-[11px] text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Eye className="w-3.5 h-3.5 text-blue-500" />
                        <span>{item.views} Views</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Download className="w-3.5 h-3.5 text-emerald-500" />
                        <span>{item.downloads} Downloads</span>
                      </div>
                    </div>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        item.isPublished
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {item.isPublished ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3" />
                          <span>Unpublished</span>
                        </>
                      )}
                    </span>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => togglePublish(item.id)}
                      className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
                    >
                      {item.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <button className="px-2.5 py-1 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-[11px] font-semibold transition-colors">
                      View PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
