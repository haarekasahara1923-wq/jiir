import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles, CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSiteSettings } from "@/lib/settings";
import { Hero } from "@/components/home/Hero";
import { JournalCard } from "@/components/home/JournalCard";
import { CurrentIssueBox } from "@/components/home/CurrentIssueBox";
import { CallForPapersBanner } from "@/components/home/CallForPapersBanner";
import { ResearchAreasGrid } from "@/components/home/ResearchAreasGrid";
import { PublicationTimeline } from "@/components/home/PublicationTimeline";
import { IndexingBanner } from "@/components/home/IndexingBanner";
import { HomeFaqAccordion } from "@/components/home/HomeFaqAccordion";
import { AuthorResourcesStrip } from "@/components/home/AuthorResourcesStrip";

export const revalidate = 60; // ISR cache for 1 minute

export default async function HomePage() {
  const settings = await getSiteSettings();

  // Load dynamic data safely with fallbacks
  let currentIssue: any = null;
  let researchAreas: any[] = [];
  let cfpData: any = null;
  let faqs: any[] = [];

  try {
    currentIssue = await prisma.issue.findFirst({
      where: { status: "CURRENT" },
      include: {
        articles: {
          take: 4,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  try {
    researchAreas = await prisma.researchArea.findMany({
      include: { subtopics: { take: 5 } },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });
  } catch {}

  try {
    cfpData = await prisma.callForPapers.findFirst({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {}

  try {
    faqs = await prisma.faq.findMany({
      where: { isPublished: true, showOnHome: true },
      orderBy: { sortOrder: "asc" },
      take: 6,
    });
  } catch {}

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <Hero settings={settings} />

      {/* 2. Journal Identity & Quick Action Matrix */}
      <JournalCard settings={settings} />

      {/* 3. About JIIR Summary & Aims */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
                Aims &amp; Scholarly Scope
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900">
                Fostering Rigorous Cross-Disciplinary Discourse
              </h2>
              <p className="text-sm text-slate-800 leading-relaxed font-normal">
                The <strong>Journal of Interdisciplinary Innovation &amp; Research (JIIR)</strong> is dedicated to
                publishing foundational and applied research across Management, Education, Hospitality, Applied
                Sciences, and Engineering. By uniting diverse scientific perspectives under one rigorous peer-reviewed
                banner, JIIR provides an intellectual nexus for breakthroughs that transcend traditional academic boundaries.
              </p>
              <div className="pt-2 flex flex-wrap gap-4 text-xs font-bold text-slate-800">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Blind Peer Review
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Monthly Issues
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  International Indexing
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Global Open Access
                </span>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold font-serif text-slate-900">
                Interested in publishing with JIIR?
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed">
                Review our comprehensive author guidelines, formatting standards, and double-blind peer review policies.
              </p>
              <div className="space-y-2 pt-1">
                <Link
                  href="/about"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 hover:border-navy-400 transition-colors shadow-sm"
                >
                  <span>Discover our Aims &amp; Scope</span>
                  <ArrowRight className="w-3.5 h-3.5 text-navy-700" />
                </Link>
                <Link
                  href="/author-guidelines"
                  className="w-full inline-flex items-center justify-between px-4 py-2.5 rounded-lg bg-navy-800 text-white text-xs font-bold hover:bg-navy-900 transition-colors shadow-sm"
                >
                  <span>View Author Guidelines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Current Issue Preview */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <CurrentIssueBox currentIssue={currentIssue} />
      </section>

      {/* 5. Call for Papers with Live Countdown */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <CallForPapersBanner
          deadline={cfpData?.submissionDeadline ? cfpData.submissionDeadline.toISOString() : undefined}
          issueLabel={cfpData?.issueLabel ?? "Volume 1, Issue 1 (2026)"}
          theme={cfpData?.theme ?? undefined}
        />
      </section>

      {/* 6. Research Domains & Subtopics Grid */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <ResearchAreasGrid areas={researchAreas} />
      </section>

      {/* 7. Publication Timeline & Ethical Safeguards */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <PublicationTimeline />
      </section>

      {/* 8. Indexing, Abstracting & Digital Preservation */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <IndexingBanner />
      </section>

      {/* 9. Author Resources & Download Kit */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AuthorResourcesStrip />
      </section>

      {/* 10. Frequently Asked Questions */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8">
        <HomeFaqAccordion faqs={faqs} />
      </section>
    </div>
  );
}
