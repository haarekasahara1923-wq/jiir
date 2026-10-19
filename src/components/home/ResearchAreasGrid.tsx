import Link from "next/link";
import {
  Briefcase,
  GraduationCap,
  Hotel,
  Microscope,
  Cpu,
  Layers,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

interface ResearchArea {
  id: string;
  name: string;
  nameHi?: string | null;
  slug: string;
  description?: string | null;
  subtopics?: Array<{ id: string; name: string }>;
}

interface ResearchAreasGridProps {
  areas?: ResearchArea[];
}

const defaultAreas: ResearchArea[] = [
  {
    id: "area-1",
    name: "Management & Business",
    nameHi: "प्रबंधन एवं व्यवसाय",
    slug: "management-business",
    description: "Strategic leadership, finance, organizational dynamics, entrepreneurship, and global commerce.",
    subtopics: [
      { id: "s1", name: "Strategic Management & Leadership" },
      { id: "s2", name: "Human Resource Management (HRM)" },
      { id: "s3", name: "Financial Management & Banking" },
      { id: "s4", name: "Digital Marketing & Consumer Insights" },
      { id: "s5", name: "Operations & Supply Chain Logistics" },
    ],
  },
  {
    id: "area-2",
    name: "Education & Pedagogy",
    nameHi: "शिक्षा एवं शिक्षण शास्त्र",
    slug: "education-pedagogy",
    description: "Curriculum innovation, ed-tech integration, policy frameworks, and cognitive learning theories.",
    subtopics: [
      { id: "s6", name: "Educational Technology & E-Learning" },
      { id: "s7", name: "Teacher Education & Professional Growth" },
      { id: "s8", name: "Higher Education Policy & Governance" },
      { id: "s9", name: "Inclusive Education & Child Psychology" },
      { id: "s10", name: "Curriculum Design & Assessment Models" },
    ],
  },
  {
    id: "area-3",
    name: "Hospitality & Tourism Management",
    nameHi: "आतिथ्य, पर्यटन एवं होटल प्रबंधन",
    slug: "hospitality-tourism",
    description: "Sustainable tourism, destination branding, culinary arts, hotel operations, and guest relations.",
    subtopics: [
      { id: "s11", name: "Hotel Administration & Guest Analytics" },
      { id: "s12", name: "Sustainable & Eco-Tourism Development" },
      { id: "s13", name: "Culinary Arts & Food Service Innovation" },
      { id: "s14", name: "Event & MICE Management" },
      { id: "s15", name: "Heritage Tourism & Cultural Preservation" },
    ],
  },
  {
    id: "area-4",
    name: "Applied Science & Mathematics",
    nameHi: "अनुप्रयुक्त विज्ञान एवं गणित",
    slug: "science-mathematics",
    description: "Physical, chemical, biological, and environmental sciences exploring foundational discoveries.",
    subtopics: [
      { id: "s16", name: "Environmental Science & Climate Action" },
      { id: "s17", name: "Applied Mathematics & Statistical Modeling" },
      { id: "s18", name: "Materials Chemistry & Nanotechnology" },
      { id: "s19", name: "Biotechnology & Computational Biology" },
      { id: "s20", name: "Physics & Renewable Energy Systems" },
    ],
  },
  {
    id: "area-5",
    name: "Technology & Engineering",
    nameHi: "प्रौद्योगिकी एवं अभियांत्रिकी",
    slug: "technology-engineering",
    description: "Artificial intelligence, computational engineering, IoT, cybersecurity, and smart manufacturing.",
    subtopics: [
      { id: "s21", name: "Artificial Intelligence & Machine Learning" },
      { id: "s22", name: "Cybersecurity, Cloud & Distributed Systems" },
      { id: "s23", name: "IoT, Robotics & Automation" },
      { id: "s24", name: "Sustainable Civil & Structural Systems" },
      { id: "s25", name: "Data Science & Advanced Analytics" },
    ],
  },
];

const icons = [Briefcase, GraduationCap, Hotel, Microscope, Cpu];

export function ResearchAreasGrid({ areas }: ResearchAreasGridProps) {
  const displayAreas = areas && areas.length > 0 ? areas : defaultAreas;

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Interdisciplinary Scope
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Explore Core Research Domains
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-xl font-medium">
            JIIR invites cross-pollinated scholarship connecting these 5 primary pillars of contemporary research.
          </p>
        </div>

        <Link
          href="/research-areas"
          className="text-xs font-bold text-navy-800 hover:text-brand-orange inline-flex items-center gap-1 group"
        >
          <span>Explore All Subtopics &amp; Classifications</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayAreas.map((area, idx) => {
          const IconComponent = icons[idx % icons.length] || Layers;
          return (
            <div
              key={area.id}
              className="group bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 text-navy-800 flex items-center justify-center group-hover:bg-navy-800 group-hover:text-white transition-colors">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-slate-500 tracking-wider uppercase">
                    0{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-serif font-bold text-slate-900 group-hover:text-navy-800 transition-colors">
                    {area.name}
                  </h3>
                </div>

                {area.description && (
                  <p className="text-xs text-slate-700 line-clamp-2 leading-relaxed font-normal">
                    {area.description}
                  </p>
                )}

                {/* Subtopic badges / list */}
                {area.subtopics && area.subtopics.length > 0 && (
                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                      Featured Sub-disciplines:
                    </p>
                    <ul className="space-y-1.5 text-xs">
                      {area.subtopics.slice(0, 5).map((sub) => (
                        <li key={sub.id} className="flex items-center gap-1.5 text-slate-800 font-medium">
                          <ChevronRight className="w-3 h-3 text-brand-orange shrink-0" />
                          <span className="truncate">{sub.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100">
                <Link
                  href={`/submit-manuscript?area=${area.slug}`}
                  className="text-xs font-bold text-navy-800 hover:text-brand-orange inline-flex items-center gap-1"
                >
                  <span>Submit paper in this discipline</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
