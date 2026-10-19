import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { BlockRenderer, type PageBlock } from "@/components/page/BlockRenderer";
import { getSiteSettings } from "@/lib/settings";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Fallback content directory for standard academic journal pages
const fallbackPages: Record<
  string,
  {
    title: string;
    titleHi?: string;
    subtitle?: string;
    blocks: PageBlock[];
  }
> = {
  about: {
    title: "About the Journal",
    titleHi: "जर्नल के बारे में",
    subtitle: "Journal of Interdisciplinary Innovation & Research (JIIR)",
    blocks: [
      {
        type: "paragraph",
        content:
          "<p>The <strong>Journal of Interdisciplinary Innovation & Research (JIIR)</strong> is a peer-reviewed, open-access multidisciplinary journal founded on the conviction that the most transformative scholarly discoveries emerge at the intersections of distinct intellectual domains.</p><p>JIIR serves as an international forum for professors, independent researchers, doctoral candidates, and industry practitioners seeking to publish high-rigour scholarship connecting Management, Education, Hospitality & Tourism, Applied Sciences, and Engineering.</p>",
      },
      {
        type: "heading",
        level: 2,
        content: "Core Mission & Values",
      },
      {
        type: "list",
        items: [
          "<strong>Educate:</strong> Disseminating empirically grounded theories and pedagogy to enrich academic curricula globally.",
          "<strong>Innovate:</strong> Championing bold research methodologies and technological breakthroughs that address urgent societal challenges.",
          "<strong>Collaborate:</strong> Uniting researchers across disciplines, linguistic traditions, and continents in open intellectual dialogue.",
        ],
      },
      {
        type: "callout",
        variant: "note",
        title: "International Publication Mandate",
        content:
          "JIIR publishes scholarly research in English to ensure global indexing, international peer review, and worldwide citation impact across Crossref and indexing databases.",
      },
    ],
  },
  "journal-information": {
    title: "Journal Information & Governance",
    subtitle: "Complete bibliographic identity, frequency, and editorial policies",
    blocks: [
      {
        type: "table",
        headers: ["Characteristic", "Details"],
        rows: [
          ["Full Journal Title", "Journal of Interdisciplinary Innovation & Research"],
          ["Short Abbreviation", "JIIR"],
          ["Publication Frequency", "Monthly (12 Issues Per Calendar Year)"],
          ["Primary Language", "English (International Scholarly Standard)"],
          ["Publishing Model", "Gold Open Access (CC BY-NC 4.0)"],
          ["Review Model", "Double-Blind Peer Review (2 Independent Referees)"],
          ["ISSN (Online)", "Applied / In Process"],
          ["ISSN (Print)", "Applied / In Process"],
          ["Publisher", "JIIR Academic Publishing Secretariat"],
        ],
      },
    ],
  },
  "author-guidelines": {
    title: "Author Guidelines & Submission Checklist",
    subtitle: "Preparation, structural requirements, formatting, and submission protocols",
    blocks: [
      {
        type: "heading",
        level: 2,
        content: "1. Manuscript Structure & Preparation",
      },
      {
        type: "list",
        items: [
          "<strong>Title Page:</strong> Concise, informative title, followed by full names, institutional affiliations, and corresponding author email.",
          "<strong>Abstract:</strong> Structured summary of 150–250 words outlining background, methodology, key findings, and implications.",
          "<strong>Keywords:</strong> 4 to 6 relevant keywords indexed for searchability.",
          "<strong>Main Body:</strong> Typically organized into: Introduction, Literature Review, Methodology, Results & Discussion, Conclusion & Future Scope.",
          "<strong>References:</strong> Prepared in standard APA (7th Edition) format with DOIs included wherever available.",
        ],
      },
      {
        type: "callout",
        variant: "warning",
        title: "Plagiarism & Originality Limit",
        content:
          "All submitted manuscripts undergo strict plagiarism verification. Submissions must exhibit an overall similarity index of <strong>less than 15%</strong> (excluding bibliography). Higher indices result in automatic return for revision.",
      },
      {
        type: "download",
        title: "Download Official JIIR Manuscript Template (DOCX)",
        format: "DOCX",
        fileSize: "85 KB",
        fileUrl: "/resources/jiir-manuscript-template.docx",
      },
    ],
  },
  "article-processing-charges": {
    title: "Article Processing Charges (APC)",
    subtitle: "Transparent fee structure, waiver policies, and payment terms",
    blocks: [
      {
        type: "paragraph",
        content:
          "<p>JIIR operates as an open-access journal. To defray costs associated with peer review systems, plagiarism screening software, professional typesetting, DOI registration, and digital preservation, authors of accepted papers are invited to pay an Article Processing Charge (APC).</p>",
      },
      {
        type: "callout",
        variant: "info",
        title: "Strict Editorial Independence",
        content:
          "There are <strong>zero submission fees</strong>. APC is ONLY requested after an unconditional acceptance decision has been rendered by the Chief Editor. Financial considerations play no role whatsoever in review decisions.",
      },
      {
        type: "table",
        headers: ["Author Category", "Fee Amount", "Included Services"],
        rows: [
          ["Indian Authors (Standard)", "₹1,500 INR", "Typesetting, Open Access, Digital PDF, QR Certificate"],
          ["Indian Authors (Fast-Track)", "₹2,500 INR", "Expedited 7-day review turnaround, priority publication"],
          ["International Authors", "$50 USD", "Typesetting, Open Access, Global Indexing, Digital Certificate"],
          ["Institutional Waiver", "Up to 50% Waiver", "Available upon request for unfunded research from developing economies"],
        ],
      },
    ],
  },
  "publication-ethics": {
    title: "Publication Ethics & Malpractice Statement",
    subtitle: "Adherence to COPE Code of Conduct guidelines",
    blocks: [
      {
        type: "paragraph",
        content:
          "<p>JIIR rigorously follows the core practices and ethical guidelines set forth by the <strong>Committee on Publication Ethics (COPE)</strong>. Our editorial board and peer reviewers are bound by strict obligations to maintain absolute confidentiality, impartiality, and academic integrity.</p>",
      },
      {
        type: "heading",
        level: 2,
        content: "Author Obligations",
      },
      {
        type: "list",
        items: [
          "Authors must guarantee that their submitted manuscript is original, has not been published elsewhere, and is not currently under review by another journal.",
          "Fabrication, falsification, and data manipulation constitute grave academic misconduct.",
          "All individuals who made substantial intellectual contributions must be listed as co-authors.",
          "All sources of external funding and conflicts of interest must be explicitly declared.",
        ],
      },
    ],
  },
  "peer-review-policy": {
    title: "Peer Review Policy & Guidelines",
    subtitle: "Double-blind evaluation model ensuring scientific validity",
    blocks: [
      {
        type: "paragraph",
        content:
          "<p>All submitted manuscripts are subjected to a rigorous <strong>Double-Blind Peer Review</strong> process. The identities of both the authors and the reviewers are withheld from each other throughout the evaluation.</p>",
      },
      {
        type: "heading",
        level: 2,
        content: "Evaluation Criteria",
      },
      {
        type: "list",
        items: [
          "Originality and significance of intellectual contribution.",
          "Rigour, validity, and reproducibility of the proposed methodology.",
          "Clarity, logical coherence, and academic quality of writing.",
          "Soundness of analytical conclusions and empirical evidence.",
          "Adherence to ethical protocols and citation standards.",
        ],
      },
    ],
  },
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const settings = await getSiteSettings();

  try {
    const page = await prisma.page.findUnique({ where: { slug } });
    if (page) {
      return {
        title: `${page.seoTitle || page.title} | ${settings.abbreviation}`,
        description: page.seoDescription || page.subtitle || settings.tagline,
      };
    }
  } catch {}

  const fallback = fallbackPages[slug];
  if (fallback) {
    return {
      title: `${fallback.title} | ${settings.abbreviation}`,
      description: fallback.subtitle || settings.tagline,
    };
  }

  return {
    title: `Page | ${settings.abbreviation}`,
  };
}

export default async function DynamicPublicPage({ params }: PageProps) {
  const { slug } = await params;

  let pageData: any = null;

  try {
    pageData = await prisma.page.findUnique({
      where: { slug },
    });
  } catch {}

  const page = pageData || fallbackPages[slug];

  if (!page) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-14">
      <div className="w-full max-w-5xl xl:max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Page Header */}
        <div className="border-b border-border pb-6 space-y-2 text-left">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-navy-300">
              Journal Information
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
            {page.title}
          </h1>
          {page.subtitle && (
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {page.subtitle}
            </p>
          )}
        </div>

        {/* Page Blocks */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-4 sm:p-8 lg:p-10 shadow-sm text-left">
          <BlockRenderer blocks={page.blocks} />
        </div>
      </div>
    </div>
  );
}
