import Link from "next/link";
import { Users, Award, ExternalLink, Mail, UserPlus, Globe } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const revalidate = 60;

interface BoardMember {
  id: string;
  name: string;
  role: string;
  category: "PATRON" | "CHIEF_EDITOR" | "ASSOCIATE_EDITOR" | "ADVISORY" | "REVIEWER";
  affiliation: string;
  country: string;
  specialization: string;
  orcid?: string | null;
}

const defaultBoard: BoardMember[] = [
  {
    id: "b-1",
    name: "Prof. Dr. R. K. Sharma",
    role: "Chief Editor & Academic Director",
    category: "CHIEF_EDITOR",
    affiliation: "Department of Management Studies, Central University",
    country: "India",
    specialization: "Strategic Governance, Applied Analytics & Public Policy",
    orcid: "0000-0002-1825-0097",
  },
  {
    id: "b-2",
    name: "Dr. Evelyn Vance",
    role: "Associate Editor (Technology & AI)",
    category: "ASSOCIATE_EDITOR",
    affiliation: "School of Computing & Engineering, London",
    country: "United Kingdom",
    specialization: "Intelligent Systems, Machine Learning & Cyber-Physical Security",
    orcid: "0000-0003-4921-8840",
  },
  {
    id: "b-3",
    name: "Dr. Ananya Mukherjee",
    role: "Associate Editor (Education & Pedagogy)",
    category: "ASSOCIATE_EDITOR",
    affiliation: "National Institute of Educational Planning",
    country: "India",
    specialization: "Curriculum Innovations, Educational Technology & Policy",
  },
  {
    id: "b-4",
    name: "Prof. Michael H. Chen",
    role: "Editorial Advisory Board Member",
    category: "ADVISORY",
    affiliation: "Faculty of Applied Sciences, Toronto",
    country: "Canada",
    specialization: "Materials Chemistry, Sustainable Energy & Green Systems",
  },
  {
    id: "b-5",
    name: "Dr. Rajeshwar Singh",
    role: "Associate Editor (Hospitality & Tourism)",
    category: "ASSOCIATE_EDITOR",
    affiliation: "Institute of Hotel Management & Tourism Analytics",
    country: "India",
    specialization: "Sustainable Destination Branding, Gastronomy & MICE",
  },
  {
    id: "b-6",
    name: "Dr. Sofia Rodriguez",
    role: "International Advisory Board Member",
    category: "ADVISORY",
    affiliation: "Universidad Politécnica, Madrid",
    country: "Spain",
    specialization: "Cognitive Psychology, Multidisciplinary Research Methods",
  },
];

export default async function EditorialBoardPage() {
  let members: any[] = [];

  try {
    members = await prisma.editorialMember.findMany({
      orderBy: [{ name: "asc" }],
    });
  } catch {}

  const displayMembers = members.length > 0 ? members : defaultBoard;

  const categories = [
    { key: "CHIEF_EDITOR", label: "Chief Editor & Leadership" },
    { key: "ASSOCIATE_EDITOR", label: "Associate & Section Editors" },
    { key: "ADVISORY", label: "International Editorial Advisory Board" },
    { key: "REVIEWER", label: "Distinguished Reviewer Board" },
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-border pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-orange" />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
              Peer-Review Governance
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
            Editorial Board & Academic Governance
          </h1>
          <p className="text-sm text-muted-foreground max-w-2xl">
            Our international editorial board comprises distinguished professors, researchers, and domain leaders
            who safeguard academic excellence and rigorous double-blind peer review.
          </p>
        </div>

        <Link
          href="/contact?subject=join_editorial_board"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Apply to Join Editorial Board</span>
        </Link>
      </div>

      {/* Board Categories */}
      <div className="space-y-12">
        {categories.map((cat) => {
          const catMembers = displayMembers.filter(
            (m) => m.category === cat.key || (!m.category && cat.key === "ASSOCIATE_EDITOR")
          );

          if (catMembers.length === 0) return null;

          return (
            <div key={cat.key} className="space-y-6">
              <div className="flex items-center gap-3 border-b border-border/80 pb-2">
                <Award className="w-5 h-5 text-brand-orange" />
                <h2 className="text-xl font-serif font-bold text-foreground">
                  {cat.label}
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {catMembers.map((member) => (
                  <div
                    key={member.id}
                    className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border hover:border-navy-300 dark:hover:border-navy-700 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="w-12 h-12 rounded-xl bg-navy-100 dark:bg-navy-950 text-navy-700 dark:text-navy-300 flex items-center justify-center font-serif font-bold text-base border border-navy-200 dark:border-navy-800">
                          {member.name.split(" ").slice(-1)[0]?.[0] ?? "E"}
                        </div>
                        {member.orcid && (
                          <a
                            href={`https://orcid.org/${member.orcid}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-[#A6CE39]/10 text-[#A6CE39] border border-[#A6CE39]/30 hover:bg-[#A6CE39]/20 transition-colors"
                          >
                            <span>ORCID</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>

                      <div>
                        <h3 className="text-base font-serif font-bold text-foreground">
                          {member.name}
                        </h3>
                        <p className="text-xs font-semibold text-primary mt-0.5">
                          {member.role}
                        </p>
                      </div>

                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>{member.affiliation}</p>
                        <p className="flex items-center gap-1 text-[11px] font-medium text-foreground/80">
                          <Globe className="w-3 h-3 text-brand-orange" />
                          {member.country}
                        </p>
                      </div>

                      {member.specialization && (
                        <div className="pt-2 border-t border-border/50">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                            Domain Expertise:
                          </span>
                          <p className="text-xs text-muted-foreground">
                            {member.specialization}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
