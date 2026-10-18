"use client";

import { useState } from "react";
import { BookOpen, Plus, Filter, Search, Calendar, FileText, CheckCircle2, Clock, AlertCircle, ArrowUpRight } from "lucide-react";

interface IssueItem {
  id: string;
  volume: number;
  issueNo: number;
  month: string;
  year: number;
  status: "CURRENT" | "FORTHCOMING" | "PUBLISHED";
  articleCount: number;
  deadline: string;
  publishDate?: string;
  theme?: string;
}

const INITIAL_ISSUES: IssueItem[] = [
  {
    id: "iss-1",
    volume: 2,
    issueNo: 4,
    month: "April",
    year: 2026,
    status: "CURRENT",
    articleCount: 12,
    deadline: "2026-04-25",
    publishDate: "2026-04-30",
    theme: "Interdisciplinary Advances in AI, Renewable Energy & Sustainable Governance"
  },
  {
    id: "iss-2",
    volume: 2,
    issueNo: 5,
    month: "May",
    year: 2026,
    status: "FORTHCOMING",
    articleCount: 4,
    deadline: "2026-05-25",
    theme: "Technological Innovations & Multidisciplinary Healthcare Strategies"
  },
  {
    id: "iss-3",
    volume: 2,
    issueNo: 3,
    month: "March",
    year: 2026,
    status: "PUBLISHED",
    articleCount: 16,
    deadline: "2026-03-25",
    publishDate: "2026-03-31",
    theme: "Global Pedagogical Transitions & Digital Education Architecture"
  },
  {
    id: "iss-4",
    volume: 2,
    issueNo: 2,
    month: "February",
    year: 2026,
    status: "PUBLISHED",
    articleCount: 14,
    deadline: "2026-02-25",
    publishDate: "2026-02-28",
    theme: "Sustainable Tourism, Hospitality & Cultural Heritage Preservation"
  },
  {
    id: "iss-5",
    volume: 1,
    issueNo: 1,
    month: "January",
    year: 2026,
    status: "PUBLISHED",
    articleCount: 18,
    deadline: "2026-01-25",
    publishDate: "2026-01-31",
    theme: "Inaugural Volume: Cross-Disciplinary Synergies in Modern Scholarship"
  }
];

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<IssueItem[]>(INITIAL_ISSUES);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newVolume, setNewVolume] = useState("2");
  const [newIssueNo, setNewIssueNo] = useState("6");
  const [newMonth, setNewMonth] = useState("June");
  const [newYear, setNewYear] = useState("2026");
  const [newTheme, setNewTheme] = useState("");

  const filtered = issues.filter((i) => {
    if (filter !== "ALL" && i.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        i.month.toLowerCase().includes(q) ||
        i.theme?.toLowerCase().includes(q) ||
        `vol ${i.volume} issue ${i.issueNo}`.includes(q)
      );
    }
    return true;
  });

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    const created: IssueItem = {
      id: `iss-${Date.now()}`,
      volume: parseInt(newVolume) || 2,
      issueNo: parseInt(newIssueNo) || 1,
      month: newMonth,
      year: parseInt(newYear) || 2026,
      status: "FORTHCOMING",
      articleCount: 0,
      deadline: `${newYear}-${newMonth.slice(0, 3)}-25`,
      theme: newTheme || "General Interdisciplinary Studies"
    };
    setIssues([created, ...issues]);
    setShowModal(false);
    setNewTheme("");
  };

  const toggleStatus = (id: string) => {
    setIssues(
      issues.map((it) => {
        if (it.id === id) {
          const nextStatus =
            it.status === "FORTHCOMING"
              ? "CURRENT"
              : it.status === "CURRENT"
              ? "PUBLISHED"
              : "FORTHCOMING";
          return { ...it, status: nextStatus };
        }
        return it;
      })
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Issues & Volumes Management
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize regular monthly issues, track forthcoming calls, and publish volume archives.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Issue</span>
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "CURRENT", "FORTHCOMING", "PUBLISHED"].map((st) => (
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
            placeholder="Search volume or theme..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>
      </div>

      {/* Issues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between space-y-4 hover:border-navy-600/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                  Volume {item.volume} · Issue {item.issueNo}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === "CURRENT"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : item.status === "FORTHCOMING"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                  }`}
                >
                  {item.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mt-2">
                {item.month} {item.year}
              </h3>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {item.theme}
              </p>
            </div>

            <div className="space-y-2 pt-3 border-t border-border text-xs">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Articles</span>
                </span>
                <span className="font-semibold text-foreground">{item.articleCount} papers</span>
              </div>

              <div className="flex items-center justify-between text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Deadline</span>
                </span>
                <span className="font-semibold text-foreground">{item.deadline}</span>
              </div>

              <div className="pt-2 flex items-center justify-between gap-2">
                <button
                  onClick={() => toggleStatus(item.id)}
                  className="px-2.5 py-1 rounded-lg border border-border bg-muted/50 hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
                >
                  Change Status
                </button>
                <span className="text-[11px] text-navy-600 dark:text-navy-300 font-medium hover:underline cursor-pointer">
                  Manage Papers →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Creating New Issue */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-foreground">Create New Journal Issue</h2>

            <form onSubmit={handleCreateIssue} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Volume Number</label>
                  <input
                    type="number"
                    value={newVolume}
                    onChange={(e) => setNewVolume(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Issue Number</label>
                  <input
                    type="number"
                    value={newIssueNo}
                    onChange={(e) => setNewIssueNo(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Month</label>
                  <input
                    type="text"
                    value={newMonth}
                    onChange={(e) => setNewMonth(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Year</label>
                  <input
                    type="number"
                    value={newYear}
                    onChange={(e) => setNewYear(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Issue Special Theme / Focus</label>
                <textarea
                  value={newTheme}
                  onChange={(e) => setNewTheme(e.target.value)}
                  placeholder="e.g. Emerging Technologies and Multidisciplinary Applications..."
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground h-20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-navy-900 text-white font-semibold hover:bg-navy-800"
                >
                  Save Issue
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
