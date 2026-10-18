"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  ShieldCheck,
  Ban,
  Check,
  Send,
} from "lucide-react";
import { STATUS_DISPLAY } from "@/lib/workflow";
import type { ManuscriptStatus } from "@prisma/client";

export default function AdminManuscriptDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [manuscript, setManuscript] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transitionModal, setTransitionModal] = useState<ManuscriptStatus | null>(null);
  const [decisionNote, setDecisionNote] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDetail = () => {
    fetch(`/api/manuscripts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load manuscript dossier");
        return res.json();
      })
      .then((data) => setManuscript(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const handleTransition = async () => {
    if (!transitionModal) return;
    setActionLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/manuscripts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toStatus: transitionModal,
          decisionNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Transition failed");

      setTransitionModal(null);
      setDecisionNote("");
      fetchDetail();
    } catch (err: any) {
      setError(err.message || "Failed to update manuscript status");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
        <RefreshCw className="w-4 h-4 animate-spin text-primary" />
        <span>Loading editorial dossier...</span>
      </div>
    );
  }

  if (error && !manuscript) {
    return <div className="p-8 text-center text-xs text-destructive">{error}</div>;
  }

  const currentStatus = manuscript.status as ManuscriptStatus;
  const statusInfo = STATUS_DISPLAY[currentStatus];

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
              Submitted: {new Date(manuscript.createdAt).toLocaleString()}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-serif font-bold text-foreground">
            {manuscript.title}
          </h1>
        </div>

        <Link
          href="/admin/manuscripts"
          className="text-xs text-muted-foreground hover:text-foreground font-semibold shrink-0"
        >
          ← Back to Queue
        </Link>
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Editorial Actions Toolbar */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-serif font-bold text-foreground">
              Editorial Decision & Workflow State Machine
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-muted-foreground uppercase font-semibold">Current State:</span>
            <span className="px-2.5 py-0.5 rounded text-xs font-bold uppercase bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
              {statusInfo?.label || manuscript.status}
            </span>
          </div>
        </div>

        {/* Dynamic Action Buttons based on state */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {currentStatus === "SUBMITTED" && (
            <>
              <button
                onClick={() => setTransitionModal("INITIAL_EDITORIAL_CHECK")}
                className="px-4 py-2 rounded-xl bg-navy-700 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
              >
                Start Initial Editorial Check
              </button>
              <button
                onClick={() => setTransitionModal("REJECTED")}
                className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-semibold transition-colors"
              >
                Desk Reject
              </button>
            </>
          )}

          {currentStatus === "INITIAL_EDITORIAL_CHECK" && (
            <>
              <button
                onClick={() => setTransitionModal("UNDER_PEER_REVIEW")}
                className="px-4 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 transition-colors"
              >
                Assign Reviewers & Send to Peer Review
              </button>
              <button
                onClick={() => setTransitionModal("REVISION_REQUIRED")}
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
              >
                Request Pre-Review Revision
              </button>
              <button
                onClick={() => setTransitionModal("REJECTED")}
                className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-semibold transition-colors"
              >
                Reject
              </button>
            </>
          )}

          {currentStatus === "UNDER_PEER_REVIEW" && (
            <>
              <button
                onClick={() => setTransitionModal("FINAL_EDITORIAL_DECISION")}
                className="px-4 py-2 rounded-xl bg-purple-700 text-white text-xs font-bold hover:bg-purple-800 transition-colors"
              >
                Move to Final Editorial Decision
              </button>
              <button
                onClick={() => setTransitionModal("REVISION_REQUIRED")}
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
              >
                Request Revisions from Author
              </button>
            </>
          )}

          {currentStatus === "FINAL_EDITORIAL_DECISION" && (
            <>
              <button
                onClick={() => setTransitionModal("ACCEPTED")}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                Unconditionally Accept Paper
              </button>
              <button
                onClick={() => setTransitionModal("REVISION_REQUIRED")}
                className="px-4 py-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-semibold transition-colors"
              >
                Request Further Revision
              </button>
              <button
                onClick={() => setTransitionModal("REJECTED")}
                className="px-4 py-2 rounded-xl bg-destructive/10 text-destructive hover:bg-destructive/20 text-xs font-semibold transition-colors"
              >
                Reject Manuscript
              </button>
            </>
          )}

          {currentStatus === "ACCEPTED" && (
            <>
              <button
                onClick={() => setTransitionModal("PUBLICATION_FEE_REQUIRED")}
                className="px-5 py-2.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                Generate APC Invoice & Request Fee
              </button>
              <button
                onClick={() => setTransitionModal("PRODUCTION")}
                className="px-4 py-2 rounded-xl bg-navy-700 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
              >
                Move Directly to Production (Fee Waived)
              </button>
            </>
          )}

          {currentStatus === "PUBLICATION_FEE_REQUIRED" && (
            <button
              onClick={() => setTransitionModal("PAYMENT_VERIFIED")}
              className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors"
            >
              Mark Payment Verified & Move to Production
            </button>
          )}

          {currentStatus === "PAYMENT_VERIFIED" && (
            <button
              onClick={() => setTransitionModal("PRODUCTION")}
              className="px-4 py-2 rounded-xl bg-navy-700 text-white text-xs font-bold hover:bg-navy-800 transition-colors"
            >
              Start Typesetting & Production
            </button>
          )}

          {currentStatus === "PRODUCTION" && (
            <button
              onClick={() => setTransitionModal("PROOFREADING")}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 transition-colors"
            >
              Send Proofs to Author
            </button>
          )}

          {currentStatus === "PROOFREADING" && (
            <button
              onClick={() => setTransitionModal("PUBLISHED")}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
            >
              Publish Article in Issue
            </button>
          )}
        </div>
      </div>

      {/* Manuscript Dossier */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
        <h3 className="text-sm font-serif font-bold text-foreground border-b border-border pb-2">
          Submission Information & Abstract
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Author</span>
            <span className="font-semibold text-foreground">{manuscript.correspondingAuthor}</span>
            <span className="text-[11px] text-muted-foreground block">{manuscript.correspondingEmail}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Discipline</span>
            <span className="font-semibold text-foreground">{manuscript.subjectArea}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Article Type</span>
            <span className="font-semibold text-foreground">{manuscript.articleType.replace("_", " ")}</span>
          </div>
          <div>
            <span className="text-[10px] text-muted-foreground uppercase font-semibold block">Region</span>
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

        {manuscript.coAuthors && Array.isArray(manuscript.coAuthors) && manuscript.coAuthors.length > 0 && (
          <div className="space-y-1.5 pt-2">
            <span className="text-xs font-semibold text-foreground">Co-Authors:</span>
            <ul className="space-y-1 text-xs text-muted-foreground">
              {manuscript.coAuthors.map((ca: any, i: number) => (
                <li key={i}>
                  • {ca.name} ({ca.affiliation}, {ca.country}) — {ca.email}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Audit History */}
      {manuscript.history && manuscript.history.length > 0 && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-serif font-bold text-foreground border-b border-border pb-2">
            Editorial Transition Trail
          </h3>

          <div className="divide-y divide-border text-xs">
            {manuscript.history.map((h: any) => (
              <div key={h.id} className="py-2.5 flex items-start justify-between gap-4">
                <div>
                  <span className="font-bold text-foreground">{h.toStatus.replace(/_/g, " ")}</span>
                  {h.message && <p className="text-muted-foreground text-[11px] mt-0.5">{h.message}</p>}
                </div>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                  {new Date(h.createdAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* State Machine Transition Confirmation Modal */}
      {transitionModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-base font-serif font-bold text-foreground">
              Confirm Transition to: {transitionModal.replace(/_/g, " ")}
            </h3>
            <p className="text-xs text-muted-foreground">
              Please enter an editorial decision note or message to be logged in the history and notified to the author.
            </p>

            <textarea
              rows={4}
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="e.g. Manuscript accepted following successful reviewer clearance. Proceeding to production."
              className="w-full px-3 py-2 text-xs rounded-xl border border-input bg-background"
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setTransitionModal(null)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-muted-foreground hover:bg-muted"
              >
                Cancel
              </button>
              <button
                disabled={actionLoading}
                onClick={handleTransition}
                className="px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-navy-700 hover:bg-navy-800 text-white"
              >
                {actionLoading ? "Applying Transition..." : "Confirm & Update Status"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
