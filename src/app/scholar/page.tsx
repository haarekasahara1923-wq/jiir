import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_DISPLAY } from "@/lib/workflow";
import type { ManuscriptStatus } from "@prisma/client";
import {
  Upload,
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  CreditCard,
  Award,
  ArrowRight,
  Eye,
} from "lucide-react";

export default async function ScholarDashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const userId = session.user.id;

  let userProfile: any = null;
  let manuscripts: any[] = [];

  try {
    userProfile = await prisma.scholarProfile.findUnique({
      where: { userId },
    });
  } catch {}

  try {
    manuscripts = await prisma.manuscript.findMany({
      where: { scholarId: userId },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  const stats = {
    total: manuscripts.length,
    underReview: manuscripts.filter((m) =>
      ["SUBMITTED", "INITIAL_EDITORIAL_CHECK", "UNDER_PEER_REVIEW", "REVISED_MANUSCRIPT_SUBMITTED"].includes(m.status)
    ).length,
    accepted: manuscripts.filter((m) =>
      ["ACCEPTED", "PUBLICATION_FEE_REQUIRED", "PAYMENT_SUBMITTED", "PAYMENT_VERIFIED", "PRODUCTION", "PROOFREADING"].includes(m.status)
    ).length,
    published: manuscripts.filter((m) => m.status === "PUBLISHED").length,
  };

  return (
    <div className="space-y-8 max-w-6xl">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-slate-900 text-white rounded-2xl p-6 sm:p-8 border border-navy-800 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded">
            Scholar Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Welcome back, {userProfile?.fullName || session.user.name}
          </h1>
          <p className="text-xs text-navy-200">
            {userProfile?.institution ? `${userProfile.institution} • ` : ""}
            Manage all your active manuscript submissions, reviewer correspondences, and publication certificates.
          </p>
        </div>

        <Link
          href="/scholar/submit"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95 shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Submit New Manuscript</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Total Submitted</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground">{stats.total}</div>
          <p className="text-[11px] text-muted-foreground">All submission records</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Under Review</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground">{stats.underReview}</div>
          <p className="text-[11px] text-muted-foreground">Active in editorial review</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Accepted Papers</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground">{stats.accepted}</div>
          <p className="text-[11px] text-muted-foreground">Approved for publishing</p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">Published</span>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-foreground">{stats.published}</div>
          <p className="text-[11px] text-muted-foreground">Live in issues</p>
        </div>
      </div>

      {/* Manuscripts Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm overflow-hidden space-y-4 p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-orange" />
            <h2 className="text-base font-serif font-bold text-foreground">
              My Submitted Manuscripts
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            {manuscripts.length} {manuscripts.length === 1 ? "record" : "records"}
          </span>
        </div>

        {manuscripts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3">Tracking ID</th>
                  <th className="p-3">Title & Subject</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">Submitted</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {manuscripts.map((item) => {
                  const statusInfo = STATUS_DISPLAY[item.status as ManuscriptStatus];
                  return (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3 font-mono font-bold text-primary">
                        {item.manuscriptCode}
                      </td>
                      <td className="p-3">
                        <Link
                          href={`/scholar/manuscripts/${item.id}`}
                          className="font-semibold text-foreground hover:text-primary line-clamp-1 block"
                        >
                          {item.title}
                        </Link>
                        <span className="text-[10px] text-muted-foreground">
                          {item.subjectArea} • {item.articleType.replace("_", " ")}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
                          {statusInfo?.label || item.status}
                        </span>
                      </td>
                      <td className="p-3 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/scholar/manuscripts/${item.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border hover:bg-muted font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-muted-foreground mx-auto" />
            <h3 className="text-sm font-bold text-foreground">No Manuscripts Submitted Yet</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Start your first manuscript submission to initiate the double-blind peer review process.
            </p>
            <div className="pt-2">
              <Link
                href="/scholar/submit"
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>Submit Manuscript Now</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
