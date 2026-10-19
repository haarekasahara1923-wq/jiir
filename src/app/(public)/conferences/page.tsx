import Link from "next/link";
import { Calendar, MapPin, ExternalLink, Download, FileText, ArrowRight, Award } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

interface Conference {
  id: string;
  title: string;
  acronym?: string | null;
  theme: string;
  organizer: string;
  location: string;
  startDate: string;
  endDate: string;
  submissionDeadline: string;
  status: "UPCOMING" | "PAST";
  brochureUrl?: string | null;
}

const defaultConferences: Conference[] = [
  {
    id: "conf-1",
    title: "International Conference on Multidisciplinary Innovations & Sustainable Technologies (ICMIST 2026)",
    acronym: "ICMIST 2026",
    theme: "Fostering Cross-Disciplinary Synergies for Global Sustainability",
    organizer: "JIIR Academic Secretariat in association with Global Research Consortium",
    location: "New Delhi, India (Hybrid: In-Person & Virtual)",
    startDate: "2026-12-15",
    endDate: "2026-12-17",
    submissionDeadline: "2026-11-15",
    status: "UPCOMING",
  },
  {
    id: "conf-2",
    title: "National Symposium on Pedagogical Innovations & Educational Technology (NSPIET 2026)",
    acronym: "NSPIET 2026",
    theme: "AI Integration, Curriculum Modernization & Inclusive Pedagogy",
    organizer: "Faculty of Education Studies",
    location: "Online / Virtual Mode",
    startDate: "2026-11-20",
    endDate: "2026-11-21",
    submissionDeadline: "2026-10-31",
    status: "UPCOMING",
  },
];

export default async function ConferencesPage() {
  let conferences: any[] = [];

  try {
    conferences = await prisma.conference.findMany({
      where: { isPublished: true },
      orderBy: { startDate: "asc" },
    });
  } catch {}

  const display = conferences.length > 0 ? conferences : defaultConferences;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-orange" />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
              Academic Symposia & Proceedings
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
            Academic Conferences & Special Issues
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Partner your university or institutional conference with JIIR for dedicated special issue publication,
            peer-review management, and worldwide digital dissemination.
          </p>
        </div>

        <Link
          href="/contact?category=Conference%20Collaboration"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors shrink-0"
        >
          <span>Partner Your Conference With JIIR</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Conference Cards */}
      <div className="space-y-6">
        {display.map((conf) => (
          <div
            key={conf.id}
            className="p-4 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:shadow-md transition-all space-y-4 text-left"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand-orange text-white">
                  {conf.acronym || "Symposium"}
                </span>
                <span className="text-xs text-muted-foreground font-semibold flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {conf.location}
                </span>
              </div>

              <span className="text-xs font-semibold text-primary">
                Dates: {new Date(conf.startDate).toLocaleDateString()} – {new Date(conf.endDate).toLocaleDateString()}
              </span>
            </div>

            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">
                {conf.title}
              </h2>
              <p className="text-xs sm:text-sm text-primary font-semibold mt-1">
                Theme: {conf.theme}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Organizer: {conf.organizer}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs border-t border-border">
              <div className="text-muted-foreground">
                Abstract & Manuscript Deadline:{" "}
                <strong className="text-foreground">
                  {new Date(conf.submissionDeadline).toLocaleDateString()}
                </strong>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href="/submit-manuscript"
                  className="px-4 py-2 rounded-lg bg-navy-700 hover:bg-navy-800 text-white font-semibold transition-colors"
                >
                  Submit Conference Paper
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
