"use client";

import { useState } from "react";
import { Award, Plus, Search, ExternalLink, CheckCircle2, Clock, Globe } from "lucide-react";

interface IndexingItem {
  id: string;
  name: string;
  category: "METRICS" | "DOI_REPOSITORY" | "GLOBAL_INDEX" | "ACADEMIC_SEARCH";
  status: "INDEXED" | "UNDER_EVALUATION" | "PLANNED";
  profileUrl?: string;
  verifiedDate?: string;
}

const INITIAL_INDEXING: IndexingItem[] = [
  { id: "idx-1", name: "Google Scholar", category: "ACADEMIC_SEARCH", status: "INDEXED", profileUrl: "https://scholar.google.com", verifiedDate: "2026-01-15" },
  { id: "idx-2", name: "Crossref (DOI)", category: "DOI_REPOSITORY", status: "INDEXED", profileUrl: "https://crossref.org", verifiedDate: "2026-02-01" },
  { id: "idx-3", name: "Zenodo / CERN", category: "DOI_REPOSITORY", status: "INDEXED", profileUrl: "https://zenodo.org", verifiedDate: "2026-01-20" },
  { id: "idx-4", name: "ResearchGate", category: "GLOBAL_INDEX", status: "INDEXED", profileUrl: "https://researchgate.net", verifiedDate: "2026-02-10" },
  { id: "idx-5", name: "WorldCat (OCLC)", category: "GLOBAL_INDEX", status: "UNDER_EVALUATION", verifiedDate: "Submitted March 2026" },
  { id: "idx-6", name: "DOAJ (Directory of Open Access Journals)", category: "GLOBAL_INDEX", status: "UNDER_EVALUATION", verifiedDate: "Under Review" },
  { id: "idx-7", name: "Scilit by MDPI", category: "ACADEMIC_SEARCH", status: "INDEXED", profileUrl: "https://scilit.net", verifiedDate: "2026-03-01" },
  { id: "idx-8", name: "Index Copernicus International (ICI)", category: "EVALUATION", status: "UNDER_EVALUATION" } as any,
  { id: "idx-9", name: "DRJI (Directory of Research Journals Indexing)", category: "GLOBAL_INDEX", status: "INDEXED", profileUrl: "https://drji.org", verifiedDate: "2026-02-15" },
  { id: "idx-10", name: "Scopus (Elsevier)", category: "GLOBAL_INDEX", status: "PLANNED" }
];

export default function AdminIndexingPage() {
  const [items, setItems] = useState<IndexingItem[]>(INITIAL_INDEXING);
  const [filter, setFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newCategory, setNewCategory] = useState<IndexingItem["category"]>("GLOBAL_INDEX");
  const [newStatus, setNewStatus] = useState<IndexingItem["status"]>("PLANNED");
  const [newUrl, setNewUrl] = useState("");

  const filtered = items.filter((i) => {
    if (filter !== "ALL" && i.status !== filter) return false;
    return true;
  });

  const toggleStatus = (id: string) => {
    setItems(
      items.map((i) => {
        if (i.id === id) {
          const next =
            i.status === "PLANNED"
              ? "UNDER_EVALUATION"
              : i.status === "UNDER_EVALUATION"
              ? "INDEXED"
              : "PLANNED";
          return { ...i, status: next };
        }
        return i;
      })
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: IndexingItem = {
      id: `idx-${Date.now()}`,
      name: newName,
      category: newCategory,
      status: newStatus,
      profileUrl: newUrl || undefined
    };
    setItems([...items, created]);
    setShowModal(false);
    setNewName("");
    setNewUrl("");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Indexing Services & Scholarly Databases
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track citations, metadata indexing integrations, DOAJ accreditation, and scientific impact registries.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Indexing Service</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {["ALL", "INDEXED", "UNDER_EVALUATION", "PLANNED"].map((st) => (
          <button
            key={st}
            onClick={() => setFilter(st)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
              filter === st
                ? "bg-navy-900 text-white"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {st.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between space-y-4 hover:border-navy-600/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                  {item.category.replace("_", " ")}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === "INDEXED"
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : item.status === "UNDER_EVALUATION"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                  }`}
                >
                  {item.status.replace("_", " ")}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mt-3">{item.name}</h3>

              {item.verifiedDate && (
                <p className="text-xs text-muted-foreground mt-1">
                  Status: {item.verifiedDate}
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <button
                onClick={() => toggleStatus(item.id)}
                className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
              >
                Change Status
              </button>

              {item.profileUrl && (
                <a
                  href={item.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-navy-600 dark:text-navy-300 font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <span>Verification Link</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-base font-serif font-bold text-foreground">Add Indexing Partner</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Database Name</label>
                <input
                  type="text"
                  placeholder="e.g. Scopus, DOAJ, PubMed..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="INDEXED">Indexed / Live</option>
                  <option value="UNDER_EVALUATION">Under Evaluation</option>
                  <option value="PLANNED">Planned / Upcoming</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Verification / Profile URL</label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
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
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
