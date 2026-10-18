"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FileText, Search, Filter, Eye, ArrowRight, RefreshCw, CheckCircle2 } from "lucide-react";
import { STATUS_DISPLAY } from "@/lib/workflow";
import type { ManuscriptStatus } from "@prisma/client";

export default function AdminManuscriptsPage() {
  const [manuscripts, setManuscripts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");

  const fetchManuscripts = () => {
    setLoading(true);
    const url = statusFilter
      ? `/api/manuscripts?status=${statusFilter}`
      : `/api/manuscripts`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setManuscripts(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchManuscripts();
  }, [statusFilter]);

  const filtered = manuscripts.filter((m) => {
    if (!search) return true;
    return (
      m.manuscriptCode.toLowerCase().includes(search.toLowerCase()) ||
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.correspondingAuthor.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Manuscript Submissions & Editorial Queue
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Evaluate incoming papers, assign reviewers, track double-blind reviews, and render decisions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search code, title, or author..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-input bg-background"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-input bg-background font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="SUBMITTED">Submitted</option>
            <option value="INITIAL_EDITORIAL_CHECK">Editorial Check</option>
            <option value="UNDER_PEER_REVIEW">Under Peer Review</option>
            <option value="REVISION_REQUIRED">Revision Required</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PUBLICATION_FEE_REQUIRED">Fee Required</option>
            <option value="PUBLISHED">Published</option>
            <option value="REJECTED">Rejected</option>
          </select>
        </div>
      </div>

      {/* Manuscripts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            <span>Loading submissions...</span>
          </div>
        ) : filtered.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Tracking ID</th>
                  <th className="p-3.5">Title & Discipline</th>
                  <th className="p-3.5">Author & Region</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5">Date</th>
                  <th className="p-3.5 text-right">Editorial Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((item) => {
                  const statusInfo = STATUS_DISPLAY[item.status as ManuscriptStatus];
                  return (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-primary">
                        {item.manuscriptCode}
                      </td>
                      <td className="p-3.5 max-w-xs">
                        <Link
                          href={`/admin/manuscripts/${item.id}`}
                          className="font-semibold text-foreground hover:text-primary line-clamp-1 block"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] text-muted-foreground">
                          {item.subjectArea} • {item.articleType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3.5 text-muted-foreground">
                        <strong className="block text-foreground">{item.correspondingAuthor}</strong>
                        <span className="text-[11px]">{item.authorRegion}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
                          {statusInfo?.label || item.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-muted-foreground text-[11px]">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/admin/manuscripts/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-700 text-white font-semibold hover:bg-navy-800 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Review Dossier</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No manuscripts match the selected filter.
          </div>
        )}
      </div>
    </div>
  );
}
