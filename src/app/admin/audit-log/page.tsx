"use client";

import { useState } from "react";
import { History, Search, Shield, UserCheck, FileEdit, CheckCircle2, Lock } from "lucide-react";

interface AuditItem {
  id: string;
  actor: string;
  action: "LOGIN" | "STATUS_UPDATE" | "PAYMENT_VERIFIED" | "ISSUE_PUBLISHED" | "USER_BLOCKED";
  entity: string;
  entityId: string;
  ip: string;
  timestamp: string;
  details: string;
}

const INITIAL_LOGS: AuditItem[] = [
  {
    id: "log-1",
    actor: "admin@jiir.in (Super Admin)",
    action: "STATUS_UPDATE",
    entity: "Manuscript",
    entityId: "JIIR-2026-0104",
    ip: "103.212.14.88",
    timestamp: "2026-04-15 18:24:10",
    details: "Changed status from UNDER_PEER_REVIEW to ACCEPTED"
  },
  {
    id: "log-2",
    actor: "admin@jiir.in (Super Admin)",
    action: "PAYMENT_VERIFIED",
    entity: "Payment",
    entityId: "INV-2026-0041",
    ip: "103.212.14.88",
    timestamp: "2026-04-14 14:12:05",
    details: "Verified Razorpay payment of ₹ 2,500 for JIIR-2026-0104"
  },
  {
    id: "log-3",
    actor: "editor@jiir.in (Editor)",
    action: "LOGIN",
    entity: "User",
    entityId: "usr-0081",
    ip: "49.36.120.4",
    timestamp: "2026-04-14 09:30:22",
    details: "Successful credentials sign-in from New Delhi"
  },
  {
    id: "log-4",
    actor: "admin@jiir.in (Super Admin)",
    action: "ISSUE_PUBLISHED",
    entity: "Issue",
    entityId: "Vol. 2, Issue 3",
    ip: "103.212.14.88",
    timestamp: "2026-03-31 23:59:00",
    details: "Published March 2026 issue with 16 peer-reviewed articles"
  },
  {
    id: "log-5",
    actor: "admin@jiir.in (Super Admin)",
    action: "LOGIN",
    entity: "User",
    entityId: "usr-admin-1",
    ip: "103.212.14.88",
    timestamp: "2026-03-31 10:15:44",
    details: "Super admin session initiated"
  }
];

export default function AdminAuditLogPage() {
  const [logs, setLogs] = useState<AuditItem[]>(INITIAL_LOGS);
  const [search, setSearch] = useState("");
  const [actionFilter, setActionFilter] = useState("ALL");

  const filtered = logs.filter((l) => {
    if (actionFilter !== "ALL" && l.action !== actionFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        l.actor.toLowerCase().includes(q) ||
        l.entityId.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Audit Trail, Governance & Security Log
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Immutable tracking of editorial decisions, fee verifications, user modifications, and administrative logins.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 dark:bg-navy-950/60 dark:text-navy-200 border border-border inline-flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>Audit Integrity Active</span>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "STATUS_UPDATE", "PAYMENT_VERIFIED", "ISSUE_PUBLISHED", "LOGIN"].map((st) => (
            <button
              key={st}
              onClick={() => setActionFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                actionFilter === st
                  ? "bg-navy-900 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {st.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search actor, entity or action..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">Timestamp & IP</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action & Target</th>
                <th className="p-4">Log Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 whitespace-nowrap">
                    <span className="font-mono text-xs font-semibold text-foreground block">
                      {item.timestamp}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      IP: {item.ip}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap font-medium text-foreground">
                    {item.actor}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.action === "STATUS_UPDATE"
                          ? "bg-blue-500/10 text-blue-600"
                          : item.action === "PAYMENT_VERIFIED"
                          ? "bg-emerald-500/10 text-emerald-600"
                          : item.action === "ISSUE_PUBLISHED"
                          ? "bg-purple-500/10 text-purple-600"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {item.action.replace("_", " ")}
                    </span>
                    <span className="block text-[11px] text-muted-foreground mt-0.5">
                      {item.entity}: <strong className="text-foreground">{item.entityId}</strong>
                    </span>
                  </td>

                  <td className="p-4 text-foreground/80">
                    {item.details}
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
