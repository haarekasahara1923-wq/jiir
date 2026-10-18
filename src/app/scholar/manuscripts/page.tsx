import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { STATUS_DISPLAY } from "@/lib/workflow";
import type { ManuscriptStatus } from "@prisma/client";
import { FileText, Upload, ArrowRight, Eye, Calendar } from "lucide-react";

export default async function ScholarManuscriptsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  let manuscripts: any[] = [];

  try {
    manuscripts = await prisma.manuscript.findMany({
      where: { scholarId: session.user.id },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            My Manuscript Submissions
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Review status history, reviewer reports, revision requests, and APC invoices for all your papers.
          </p>
        </div>

        <Link
          href="/scholar/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors shrink-0"
        >
          <Upload className="w-4 h-4" />
          <span>Submit Another Paper</span>
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border shadow-sm overflow-hidden p-6 space-y-4">
        {manuscripts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground uppercase text-[10px] font-bold">
                <tr>
                  <th className="p-3.5">Tracking ID</th>
                  <th className="p-3.5">Title & Discipline</th>
                  <th className="p-3.5">Current Status</th>
                  <th className="p-3.5">Submitted Date</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {manuscripts.map((item) => {
                  const statusInfo = STATUS_DISPLAY[item.status as ManuscriptStatus];
                  return (
                    <tr key={item.id} className="hover:bg-muted/40 transition-colors">
                      <td className="p-3.5 font-mono font-bold text-primary">
                        {item.manuscriptCode}
                      </td>
                      <td className="p-3.5">
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
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
                          {statusInfo?.label || item.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-muted-foreground">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-3.5 text-right">
                        <Link
                          href={`/scholar/manuscripts/${item.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted font-semibold transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Dossier</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No manuscripts found in your submission history.
          </div>
        )}
      </div>
    </div>
  );
}
