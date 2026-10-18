"use client";

import { useState } from "react";
import Link from "next/link";
import { Layers, Search, ExternalLink, Edit3, CheckCircle2, FileText, Globe } from "lucide-react";

interface CmsPageItem {
  id: string;
  slug: string;
  title: string;
  category: "EDITORIAL" | "POLICIES" | "AUTHORS" | "COLLABORATION";
  isPublished: boolean;
  updatedAt: string;
}

const INITIAL_PAGES: CmsPageItem[] = [
  { id: "p-1", slug: "about", title: "About Journal & Editorial Scope", category: "EDITORIAL", isPublished: true, updatedAt: "2026-04-10" },
  { id: "p-2", slug: "author-guidelines", title: "Author Guidelines & Submission Checklist", category: "AUTHORS", isPublished: true, updatedAt: "2026-04-12" },
  { id: "p-3", slug: "peer-review-policy", title: "Double-Blind Peer Review Policy", category: "POLICIES", isPublished: true, updatedAt: "2026-03-25" },
  { id: "p-4", slug: "publication-ethics", title: "Publication Ethics & Malpractice Statement (COPE aligned)", category: "POLICIES", isPublished: true, updatedAt: "2026-03-20" },
  { id: "p-5", slug: "article-processing-charges", title: "Article Processing Charges & Fee Waivers", category: "AUTHORS", isPublished: true, updatedAt: "2026-04-01" },
  { id: "p-6", slug: "conference-collaboration", title: "Conference Collaboration & Special Issue Services", category: "COLLABORATION", isPublished: true, updatedAt: "2026-03-15" },
  { id: "p-7", slug: "institutional-membership", title: "Institutional Membership & Academic Alliances", category: "COLLABORATION", isPublished: true, updatedAt: "2026-03-18" },
  { id: "p-8", slug: "privacy", title: "Privacy Policy & GDPR Compliance", category: "POLICIES", isPublished: true, updatedAt: "2026-01-10" },
  { id: "p-9", slug: "terms", title: "Terms and Conditions of Scholarly Use", category: "POLICIES", isPublished: true, updatedAt: "2026-01-10" }
];

export default function AdminCmsPages() {
  const [pages, setPages] = useState<CmsPageItem[]>(INITIAL_PAGES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");

  const filtered = pages.filter((p) => {
    if (filter !== "ALL" && p.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const togglePublish = (id: string) => {
    setPages(
      pages.map((p) => (p.id === id ? { ...p, isPublished: !p.isPublished } : p))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Public Pages & CMS Content
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage static informational pages, author directives, publication policies, and institutional portals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 dark:bg-navy-950/60 dark:text-navy-200 border border-border">
            Total Pages: {pages.length}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "EDITORIAL", "AUTHORS", "POLICIES", "COLLABORATION"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === st
                  ? "bg-navy-900 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search page or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">Page Title & Slug</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-foreground text-sm">{item.title}</p>
                    <span className="font-mono text-[11px] text-muted-foreground">/{item.slug}</span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        item.isPublished
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.isPublished ? "Live" : "Draft"}</span>
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap text-muted-foreground text-[11px]">
                    {item.updatedAt}
                  </td>

                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => togglePublish(item.id)}
                      className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
                    >
                      {item.isPublished ? "Unpublish" : "Publish"}
                    </button>
                    <Link
                      href={`/${item.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
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
