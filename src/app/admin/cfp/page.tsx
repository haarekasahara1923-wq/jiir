"use client";

import { useState } from "react";
import { Calendar, Plus, Clock, CheckCircle2, XCircle, Search } from "lucide-react";

interface CfpItem {
  id: string;
  title: string;
  issue: string;
  deadline: string;
  categories: string[];
  isActive: boolean;
}

const INITIAL_CFPS: CfpItem[] = [
  {
    id: "cfp-1",
    title: "Call for Papers: Volume 2, Issue 5 (May 2026 Edition)",
    issue: "Vol. 2, Issue 5",
    deadline: "2026-05-25",
    categories: ["Management & Business", "Applied Sciences", "Sustainable Technology", "Educational Policy"],
    isActive: true
  },
  {
    id: "cfp-2",
    title: "Special Issue Call: Artificial Intelligence & Autonomous Systems in Modern Healthcare",
    issue: "Special Issue 2026-SI1",
    deadline: "2026-06-30",
    categories: ["Healthcare Informatics", "Machine Learning", "Bio-Engineering", "Medical Ethics"],
    isActive: true
  },
  {
    id: "cfp-3",
    title: "Call for Papers: Volume 2, Issue 4 (April 2026 Edition)",
    issue: "Vol. 2, Issue 4",
    deadline: "2026-04-25",
    categories: ["Interdisciplinary Sciences", "Tourism Studies", "Corporate Governance"],
    isActive: false
  }
];

export default function AdminCfpPage() {
  const [cfps, setCfps] = useState<CfpItem[]>(INITIAL_CFPS);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newIssue, setNewIssue] = useState("Vol. 2, Issue 6");
  const [newDeadline, setNewDeadline] = useState("2026-06-25");
  const [newCategories, setNewCategories] = useState("Science, Engineering, Management");

  const toggleActive = (id: string) => {
    setCfps(cfps.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c)));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: CfpItem = {
      id: `cfp-${Date.now()}`,
      title: newTitle,
      issue: newIssue,
      deadline: newDeadline,
      categories: newCategories.split(",").map((s) => s.trim()),
      isActive: true
    };
    setCfps([created, ...cfps]);
    setShowModal(false);
    setNewTitle("");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Call for Papers (CFP) Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure submission deadlines, thematic tracks, and banners for forthcoming journal editions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Publish New CFP</span>
        </button>
      </div>

      {/* Grid of CFPs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cfps.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between space-y-4 hover:border-navy-600/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-brand-orange uppercase tracking-wider">
                  {c.issue}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    c.isActive
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {c.isActive ? "Active Call" : "Closed / Expired"}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mt-2">{c.title}</h3>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <Clock className="w-4 h-4 text-navy-600" />
                <span>Submission Deadline: <strong className="text-foreground">{c.deadline}</strong></span>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {c.categories.map((cat) => (
                  <span key={cat} className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground">
                    {cat}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <button
                onClick={() => toggleActive(c.id)}
                className="px-3 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
              >
                {c.isActive ? "Close Submission" : "Re-open Call"}
              </button>

              <span className="text-[11px] text-navy-600 dark:text-navy-300 font-medium cursor-pointer hover:underline">
                View on Public Site →
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-base font-serif font-bold text-foreground">Publish Call for Papers</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">CFP Headline Title</label>
                <input
                  type="text"
                  placeholder="e.g. Call for Papers: Volume 2, Issue 6..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Target Issue</label>
                  <input
                    type="text"
                    value={newIssue}
                    onChange={(e) => setNewIssue(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Deadline Date</label>
                  <input
                    type="date"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Focus Disciplines (comma separated)</label>
                <input
                  type="text"
                  value={newCategories}
                  onChange={(e) => setNewCategories(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
                  Publish CFP
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
