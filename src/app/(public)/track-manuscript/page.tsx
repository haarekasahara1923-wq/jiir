"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, SearchCheck, Calendar, ArrowRight, ShieldAlert, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { STATUS_DISPLAY } from "@/lib/workflow";
import type { ManuscriptStatus } from "@prisma/client";

const timelineSteps = [
  { key: "SUBMITTED", label: "Submitted" },
  { key: "INITIAL_EDITORIAL_CHECK", label: "Screening" },
  { key: "UNDER_PEER_REVIEW", label: "Peer Review" },
  { key: "FINAL_EDITORIAL_DECISION", label: "Decision" },
  { key: "PUBLICATION_FEE_REQUIRED", label: "Payment" },
  { key: "PRODUCTION", label: "Production" },
  { key: "PUBLISHED", label: "Published" },
];

export default function TrackManuscriptPage() {
  const [trackingId, setTrackingId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/manuscripts/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId: trackingId.trim(), email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Manuscript not found");

      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to locate manuscript record. Verify Tracking ID and Author Email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <SearchCheck className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Real-Time Tracking
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
          Track Manuscript Status
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Enter your assigned Tracking ID (e.g. JIIR-2026-0001) along with your registered corresponding author email
          to inspect real-time peer review and publication milestones.
        </p>
      </div>

      {/* Tracker Card */}
      <div className="w-full max-w-2xl mx-auto">
        <div className="p-4 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm text-left">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Manuscript Tracking ID *</label>
              <input
                required
                type="text"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                placeholder="e.g. JIIR-2026-0001"
                className="w-full px-3.5 py-2.5 text-xs font-mono uppercase rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Corresponding Author Email *</label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="author@university.edu"
                className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              disabled={loading}
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? "Searching Editorial Registry..." : "Track My Manuscript"}</span>
            </button>
          </form>
        </div>

        {/* Results Display */}
        {result && (
          <div className="mt-8 p-4 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-md space-y-6 text-left animate-in fade-in">
            <div className="border-b border-border pb-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded text-xs font-mono font-bold bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-navy-300">
                  {result.trackingId}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Submitted: {new Date(result.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h2 className="text-lg font-serif font-bold text-foreground">
                {result.title}
              </h2>
            </div>

            {/* Status Highlight */}
            <div className="p-4 rounded-xl bg-navy-50/70 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-900 space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-brand-orange" />
                <span className="text-xs font-bold uppercase text-navy-800 dark:text-navy-200">
                  Current Editorial Stage:
                </span>
              </div>
              <h3 className="text-base font-bold text-primary">
                {STATUS_DISPLAY[result.status as ManuscriptStatus]?.label || result.status}
              </h3>
              <p className="text-xs text-muted-foreground">
                {STATUS_DISPLAY[result.status as ManuscriptStatus]?.description ||
                  "Your manuscript is proceeding through the standard peer-review and editorial pipeline."}
              </p>
            </div>

            {/* Stepper */}
            <div className="pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Milestone Progress
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center">
                {timelineSteps.map((step, idx) => (
                  <div
                    key={step.key}
                    className="p-2.5 rounded-lg border border-border bg-muted/30 text-[11px] font-semibold text-muted-foreground"
                  >
                    <span>{step.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Next steps CTA */}
            <div className="pt-4 border-t border-border flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Detailed reviewer comments are in the author portal.</span>
              <Link
                href="/scholar/login"
                className="font-bold text-primary hover:underline inline-flex items-center gap-1"
              >
                <span>Login to Scholar Portal</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
