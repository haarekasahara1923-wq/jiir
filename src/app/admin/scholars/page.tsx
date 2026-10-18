"use client";

import { useState, useEffect } from "react";
import { Users, Search, ShieldAlert, ShieldCheck, Trash2, Ban, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface Scholar {
  id: string;
  email: string;
  status: "ACTIVE" | "BLOCKED" | "PENDING_VERIFICATION";
  blockedReason?: string | null;
  createdAt: string;
  profile?: {
    fullName: string;
    institution?: string | null;
    country: string;
  } | null;
  _count: {
    manuscripts: number;
  };
}

export default function AdminScholarsPage() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [blockModal, setBlockModal] = useState<{ id: string; name: string } | null>(null);
  const [blockReason, setBlockReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const fetchScholars = () => {
    setLoading(true);
    fetch(`/api/admin/scholars?search=${encodeURIComponent(search)}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setScholars(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchScholars();
  }, [search]);

  const handleStatusChange = async (id: string, status: "ACTIVE" | "BLOCKED", reason?: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/scholars/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, blockedReason: reason }),
      });

      if (res.ok) {
        setBlockModal(null);
        setBlockReason("");
        fetchScholars();
      }
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this scholar? This action cannot be undone.")) {
      return;
    }
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/scholars/${id}`, { method: "DELETE" });
      if (res.ok) fetchScholars();
    } catch {
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Scholars & Registered Authors
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage author accounts, inspect submission records, and apply security moderation.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl border border-input bg-background"
          />
        </div>
      </div>

      {/* Scholars Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
            <RefreshCw className="w-4 h-4 animate-spin text-primary" />
            <span>Loading scholars database...</span>
          </div>
        ) : scholars.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Author Details</th>
                  <th className="p-3.5">Affiliation & Country</th>
                  <th className="p-3.5">Submissions</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Joined</th>
                  <th className="p-3.5 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {scholars.map((s) => (
                  <tr key={s.id} className="hover:bg-muted/40 transition-colors">
                    <td className="p-3.5">
                      <strong className="block text-foreground font-semibold">
                        {s.profile?.fullName || "Unspecified Name"}
                      </strong>
                      <span className="text-muted-foreground text-[11px]">{s.email}</span>
                    </td>
                    <td className="p-3.5 text-muted-foreground">
                      <span className="block text-foreground">{s.profile?.institution || "—"}</span>
                      <span className="text-[11px]">{s.profile?.country || "—"}</span>
                    </td>
                    <td className="p-3.5 font-bold font-mono text-primary">
                      {s._count.manuscripts} papers
                    </td>
                    <td className="p-3.5">
                      {s.status === "ACTIVE" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      ) : s.status === "BLOCKED" ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-destructive/10 text-destructive">
                          Blocked
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-600">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 text-muted-foreground text-[11px]">
                      {new Date(s.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      {s.status === "ACTIVE" ? (
                        <button
                          onClick={() =>
                            setBlockModal({
                              id: s.id,
                              name: s.profile?.fullName || s.email,
                            })
                          }
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-[11px] font-semibold transition-colors"
                        >
                          <Ban className="w-3 h-3" />
                          <span>Block</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleStatusChange(s.id, "ACTIVE")}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 text-[11px] font-semibold transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Unblock</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(s.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 text-[11px] font-semibold transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-xs text-muted-foreground">
            No scholars match your search query.
          </div>
        )}
      </div>

      {/* Block Reason Modal */}
      {blockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-serif font-bold text-foreground">
              Block Author: {blockModal.name}
            </h3>
            <p className="text-xs text-muted-foreground">
              Please enter the administrative reason for blocking this scholar. This message will be displayed
              if the author attempts to sign in.
            </p>

            <textarea
              rows={3}
              value={blockReason}
              onChange={(e) => setBlockReason(e.target.value)}
              placeholder="e.g. Multiple policy violations or suspected plagiarism."
              className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setBlockModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleStatusChange(blockModal.id, "BLOCKED", blockReason)}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-destructive text-white hover:bg-destructive/90"
              >
                {actionLoading ? "Blocking..." : "Confirm Block"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
