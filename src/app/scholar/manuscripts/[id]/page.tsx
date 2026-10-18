"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  CreditCard,
  Award,
  ArrowRight,
  RefreshCw,
  Upload,
} from "lucide-react";
import { STATUS_DISPLAY } from "@/lib/workflow";
import type { ManuscriptStatus } from "@prisma/client";

export default function ScholarManuscriptDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [manuscript, setManuscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Short Polling every 8 seconds
  useEffect(() => {
    if (!id) return;

    const fetchDetail = () => {
      fetch(`/api/manuscripts/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load manuscript");
          return res.json();
        })
        .then((data) => setManuscript(data))
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    };

    fetchDetail();
    const interval = setInterval(fetchDetail, 8000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-primary" />
        <span>Loading manuscript record...</span>
      </div>
    );
  }

  if (error || !manuscript) {
    return (
      <div className="p-8 text-center text-xs text-destructive">
        {error || "Manuscript not found or unauthorized access."}
      </div>
    );
  }

  const statusInfo = STATUS_DISPLAY[manuscript.status as ManuscriptStatus];

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div className="border-b border-border pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-navy-300">
              {manuscript.manuscriptCode}
            </span>
            <span className="text-xs text-muted-foreground">
              Submitted: {new Date(manuscript.createdAt).toLocaleDateString()}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            {manuscript.title}
          </h1>
        </div>

        <Link
          href="/scholar/manuscripts"
          className="text-xs text-muted-foreground hover:text-foreground font-semibold shrink-0"
        >
          ← All Manuscripts
        </Link>
      </div>

      {/* Real-time Status Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-navy-900 to-slate-900 text-white border border-navy-800 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/20 px-2 py-0.5 rounded">
            Live Peer Review Status
          </span>
          <span className="text-[10px] text-navy-300 flex items-center gap-1 font-mono">
            <RefreshCw className="w-3 h-3 animate-spin text-brand-orange" />
            Auto-polling real time
          </span>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-white">
            {statusInfo?.label || manuscript.status}
          </h2>
          <p className="text-xs text-navy-200 mt-1 max-w-2xl leading-relaxed">
            {statusInfo?.description || "Your paper is progressing through standard editorial channels."}
          </p>
        </div>

        {/* Action Callouts depending on status */}
        {manuscript.status === "PUBLICATION_FEE_REQUIRED" && (
          <div className="pt-2 flex items-center gap-4">
            <Link
              href="/pay-online"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all"
            >
              <CreditCard className="w-4 h-4" />
              <span>Pay Publication Fee (APC)</span>
            </Link>
          </div>
        )}

        {manuscript.status === "REVISION_REQUIRED" && (
          <div className="p-4 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs text-amber-200 space-y-2">
            <h4 className="font-bold flex items-center gap-1.5 text-white">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Editorial Revision Requested</span>
            </h4>
            <p className="text-[11px] leading-relaxed">
              {manuscript.decisionNote || "Please review reviewer comments and upload a revised manuscript version."}
            </p>
          </div>
        )}
      </div>

      {/* Metadata & Abstract */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
        <h3 className="text-sm font-serif font-bold text-foreground border-b border-border pb-2">
          Submission Dossier & Abstract
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Discipline</span>
            <span className="font-semibold text-foreground">{manuscript.subjectArea}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Article Type</span>
            <span className="font-semibold text-foreground">{manuscript.articleType.replace("_", " ")}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Language</span>
            <span className="font-semibold text-foreground">{manuscript.language}</span>
          </div>
          <div>
            <span className="text-[10px] font-semibold uppercase text-muted-foreground block">Author Region</span>
            <span className="font-semibold text-foreground">{manuscript.authorRegion}</span>
          </div>
        </div>

        {manuscript.abstract && (
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-semibold text-foreground">Abstract:</span>
            <p className="text-xs text-muted-foreground leading-relaxed p-4 rounded-xl bg-muted/40 border border-border">
              {manuscript.abstract}
            </p>
          </div>
        )}

        {manuscript.keywords && manuscript.keywords.length > 0 && (
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-foreground">Keywords:</span>
            <div className="flex flex-wrap gap-1.5">
              {manuscript.keywords.map((kw: string) => (
                <span
                  key={kw}
                  className="px-2.5 py-0.5 rounded-md bg-muted text-xs text-muted-foreground font-semibold"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* History Audit Trail */}
      {manuscript.history && manuscript.history.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-serif font-bold text-foreground border-b border-border pb-2">
            Status Audit History
          </h3>

          <div className="divide-y divide-border text-xs">
            {manuscript.history.map((h: any) => (
              <div key={h.id} className="py-2.5 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-foreground">{h.toStatus.replace(/_/g, " ")}</span>
                  {h.comment && <p className="text-muted-foreground text-[11px] mt-0.5">{h.comment}</p>}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                  {new Date(h.changedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
