"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Layers,
  Search,
  ExternalLink,
  Edit3,
  CheckCircle2,
  FileText,
  Globe,
  Plus,
  Save,
  X,
  Eye,
  Trash2,
  Code,
  Loader2
} from "lucide-react";

interface CmsPageItem {
  id: string;
  slug: string;
  title: string;
  titleHi?: string;
  subtitle?: string;
  category: "EDITORIAL" | "POLICIES" | "AUTHORS" | "COLLABORATION";
  content: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  updatedAt: string;
}

const INITIAL_PAGES: CmsPageItem[] = [
  {
    id: "p-1",
    slug: "about",
    title: "About Journal & Editorial Scope",
    titleHi: "जर्नल और संपादकीय दायरा के बारे में",
    subtitle: "A peer-reviewed multidisciplinary open-access research journal.",
    category: "EDITORIAL",
    content: `# About Journal of Interdisciplinary Innovation & Research (JIIR)

The Journal of Interdisciplinary Innovation & Research (JIIR) is an international, peer-reviewed, multidisciplinary open-access journal dedicated to publishing cutting-edge research across science, engineering, management, humanities, and hospitality studies.

### Core Objectives
- Foster cross-disciplinary scholarly exchange
- Ensure rigorous, ethical double-blind peer review
- Provide immediate, unrestricted open access with Crossref DOIs
- Support researchers, academicians, and practitioners worldwide`,
    seoTitle: "About JIIR - International Multidisciplinary Journal",
    seoDescription: "Learn about JIIR, our peer-review philosophy, editorial scope, and academic indexing partners.",
    isPublished: true,
    updatedAt: "2026-04-10"
  },
  {
    id: "p-2",
    slug: "author-guidelines",
    title: "Author Guidelines & Submission Checklist",
    titleHi: "लेखक दिशानिर्देश एवं पांडुलिपि चेकलिस्ट",
    subtitle: "Complete submission instructions, citation formats, and ethical checklists.",
    category: "AUTHORS",
    content: `# Author Guidelines for Manuscript Preparation

Authors must ensure that manuscripts submitted to JIIR adhere strictly to the following structure and standards:

1. **Title & Abstract**: Informative, concise, and accompanied by 4-6 keywords.
2. **Main Body**: Introduction, Literature Review, Methodology, Results, Discussion, and Conclusion.
3. **References**: APA 7th edition or IEEE referencing style.
4. **Declarations**: Conflict of interest, funding acknowledgement, and ethical compliance.`,
    seoTitle: "Author Guidelines - Submission Formatting - JIIR",
    seoDescription: "Step-by-step author instructions for manuscript submission and review preparation.",
    isPublished: true,
    updatedAt: "2026-04-12"
  },
  {
    id: "p-3",
    slug: "peer-review-policy",
    title: "Double-Blind Peer Review Policy",
    titleHi: "डबल-ब्लाइंड सहकर्मी समीक्षा नीति",
    subtitle: "Ensuring objective, independent, and constructive scholarly evaluation.",
    category: "POLICIES",
    content: `# Double-Blind Peer Review Process

JIIR follows an uncompromised double-blind peer review workflow where both author identities and reviewer identities remain completely anonymous.

### Workflow Stages:
1. **Initial Screening**: Plagiarism check and scope evaluation by managing editors within 48 hours.
2. **Reviewer Assignment**: Two independent subject experts assigned.
3. **Review Rounds**: 14-21 days turnaround time.
4. **Final Decision**: Accept, Minor Revisions, Major Revisions, or Reject.`,
    seoTitle: "Peer Review Policy - Double-Blind Evaluation - JIIR",
    seoDescription: "Comprehensive overview of JIIR's rigorous double-blind peer review process.",
    isPublished: true,
    updatedAt: "2026-03-25"
  },
  {
    id: "p-4",
    slug: "publication-ethics",
    title: "Publication Ethics & Malpractice Statement (COPE aligned)",
    titleHi: "प्रकाशन नैतिकता एवं कदाचार निवारण नीति",
    subtitle: "Adherence to COPE standards on research integrity, authorship, and disclosures.",
    category: "POLICIES",
    content: `# Publication Ethics and Malpractice Statement

JIIR complies with the Code of Conduct and Best Practice Guidelines set by the Committee on Publication Ethics (COPE).

- **Plagiarism**: Maximum acceptable similarity index is under 15%.
- **Duplicate Submissions**: Strictly prohibited.
- **Authorship Criteria**: All listed authors must have contributed significantly.`,
    seoTitle: "Publication Ethics & Malpractice Policy - JIIR",
    seoDescription: "COPE-aligned ethical publishing standards followed by JIIR.",
    isPublished: true,
    updatedAt: "2026-03-20"
  },
  {
    id: "p-5",
    slug: "article-processing-charges",
    title: "Article Processing Charges & Fee Waivers",
    titleHi: "लेख प्रसंस्करण शुल्क (APC) एवं छूट नीति",
    subtitle: "Transparent publication charges applicable only upon acceptance.",
    category: "AUTHORS",
    content: `# Article Processing Charges (APC)

JIIR operates as a gold open-access journal. Submission and peer review are 100% free. APC is payable solely after formal acceptance.

- **Indian Authors**: ₹ 2,000 (Without DOI) / ₹ 2,500 (With DOI)
- **International Authors**: $ 50 (Without DOI) / $ 75 (With DOI)
- **Waivers**: Deserving researchers from low-income regions may request fee waivers upon application.`,
    seoTitle: "Article Processing Charges (APC) - JIIR",
    seoDescription: "Transparent publication fee structure for Indian and international scholars.",
    isPublished: true,
    updatedAt: "2026-04-01"
  },
  {
    id: "p-6",
    slug: "conference-collaboration",
    title: "Conference Collaboration & Special Issue Services",
    titleHi: "सम्मेलन सहयोग एवं विशेष अंक सेवाएं",
    subtitle: "Institutional partnerships for conference proceedings and dedicated volumes.",
    category: "COLLABORATION",
    content: `# Academic Conference Collaboration

JIIR invites universities, research councils, and colleges to partner for publishing peer-reviewed conference proceedings as regular or special issues.`,
    seoTitle: "Conference Collaboration - Proceedings - JIIR",
    seoDescription: "Publish conference proceedings and symposium proceedings with JIIR.",
    isPublished: true,
    updatedAt: "2026-03-15"
  },
  {
    id: "p-7",
    slug: "institutional-membership",
    title: "Institutional Membership & Academic Alliances",
    titleHi: "संस्थागत सदस्यता एवं शैक्षणिक साझेदारी",
    subtitle: "Institutional membership plans for faculties, universities, and research libraries.",
    category: "COLLABORATION",
    content: `# Institutional Membership Program

Universities and research laboratories can enroll for annual institutional membership, granting faculty and students subsidized publication benefits and priority review tracks.`,
    seoTitle: "Institutional Membership - JIIR Academic Alliances",
    seoDescription: "Partner your university or college with JIIR.",
    isPublished: true,
    updatedAt: "2026-03-18"
  },
  {
    id: "p-8",
    slug: "privacy",
    title: "Privacy Policy & GDPR Compliance",
    titleHi: "गोपनीयता नीति",
    subtitle: "How we collect, protect, and process scholar information.",
    category: "POLICIES",
    content: `# Privacy Policy

JIIR values scholar privacy and guarantees that author emails, phone numbers, and peer-review records are never sold or shared with commercial entities.`,
    seoTitle: "Privacy Policy - Data Protection - JIIR",
    seoDescription: "JIIR Privacy Policy and personal data protection guarantees.",
    isPublished: true,
    updatedAt: "2026-01-10"
  },
  {
    id: "p-9",
    slug: "terms",
    title: "Terms and Conditions of Scholarly Use",
    titleHi: "नियम एवं शर्तें",
    subtitle: "User terms, open access licensing, and copyright agreements.",
    category: "POLICIES",
    content: `# Terms and Conditions

All articles published in JIIR are licensed under Creative Commons Attribution 4.0 International (CC BY 4.0). Authors retain full copyright over their research.`,
    seoTitle: "Terms and Conditions - CC BY 4.0 - JIIR",
    seoDescription: "Scholarly terms of use and Creative Commons copyright terms.",
    isPublished: true,
    updatedAt: "2026-01-10"
  }
];

export default function AdminCmsPages() {
  const [pages, setPages] = useState<CmsPageItem[]>(INITIAL_PAGES);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Editor Modal State
  const [editingPage, setEditingPage] = useState<CmsPageItem | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formTitleHi, setFormTitleHi] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formSubtitle, setFormSubtitle] = useState("");
  const [formCategory, setFormCategory] = useState<CmsPageItem["category"]>("EDITORIAL");
  const [formContent, setFormContent] = useState("");
  const [formSeoTitle, setFormSeoTitle] = useState("");
  const [formSeoDesc, setFormSeoDesc] = useState("");
  const [formIsPublished, setFormIsPublished] = useState(true);

  const filtered = pages.filter((p) => {
    if (filter !== "ALL" && p.category !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return p.title.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q);
    }
    return true;
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const togglePublish = (id: string) => {
    setPages(
      pages.map((p) => {
        if (p.id === id) {
          const next = !p.isPublished;
          showToast(`Page "${p.title}" ${next ? "published" : "unpublished"}!`);
          return { ...p, isPublished: next };
        }
        return p;
      })
    );
  };

  const openEditor = (page: CmsPageItem) => {
    setEditingPage(page);
    setIsCreating(false);
    setFormTitle(page.title);
    setFormTitleHi(page.titleHi || "");
    setFormSlug(page.slug);
    setFormSubtitle(page.subtitle || "");
    setFormCategory(page.category);
    setFormContent(page.content);
    setFormSeoTitle(page.seoTitle || "");
    setFormSeoDesc(page.seoDescription || "");
    setFormIsPublished(page.isPublished);
  };

  const openCreator = () => {
    const blank: CmsPageItem = {
      id: `p-${Date.now()}`,
      slug: "new-page",
      title: "",
      category: "EDITORIAL",
      content: "# New Page Title\n\nEnter formatted scholarly content here...",
      isPublished: true,
      updatedAt: new Date().toISOString().split("T")[0]
    };
    setEditingPage(blank);
    setIsCreating(true);
    setFormTitle("");
    setFormTitleHi("");
    setFormSlug("");
    setFormSubtitle("");
    setFormCategory("EDITORIAL");
    setFormContent(blank.content);
    setFormSeoTitle("");
    setFormSeoDesc("");
    setFormIsPublished(true);
  };

  const [savingPage, setSavingPage] = useState(false);

  // Load pages from database on mount
  useEffect(() => {
    fetch("/api/admin/pages")
      .then((res) => res.json())
      .then((data) => {
        if (data?.pages && Array.isArray(data.pages) && data.pages.length > 0) {
          const dbPages: CmsPageItem[] = data.pages.map((p: any) => ({
            id: p.id,
            slug: p.slug,
            title: p.title,
            titleHi: p.titleHi || undefined,
            subtitle: p.subtitle || undefined,
            category: "EDITORIAL",
            content: Array.isArray(p.blocks) ? p.blocks[0]?.content || "" : "",
            seoTitle: p.seoTitle || undefined,
            seoDescription: p.seoDescription || undefined,
            isPublished: p.isPublished,
            updatedAt: p.updatedAt ? new Date(p.updatedAt).toISOString().split("T")[0] : "2026-04-18"
          }));

          // Merge with initial pages
          const slugSet = new Set(dbPages.map((p) => p.slug));
          const unmerged = INITIAL_PAGES.filter((p) => !slugSet.has(p.slug));
          setPages([...dbPages, ...unmerged]);
        }
      })
      .catch(() => {});
  }, []);

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    setSavingPage(true);

    const formattedSlug = formSlug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const payload = {
      slug: formattedSlug || "custom-page",
      title: formTitle,
      titleHi: formTitleHi,
      subtitle: formSubtitle,
      category: formCategory,
      content: formContent,
      seoTitle: formSeoTitle,
      seoDescription: formSeoDesc,
      isPublished: formIsPublished,
    };

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const updatedItem: CmsPageItem = {
        ...editingPage,
        ...payload,
        updatedAt: new Date().toISOString().split("T")[0],
      };

      if (isCreating) {
        setPages([updatedItem, ...pages]);
        showToast(`New page "${formTitle}" created & saved to database!`);
      } else {
        setPages(pages.map((p) => (p.id === editingPage.id ? updatedItem : p)));
        showToast(`Page "${formTitle}" updated & saved to database!`);
      }
    } catch (err) {
      showToast(`Page "${formTitle}" saved locally!`);
    } finally {
      setSavingPage(false);
      setEditingPage(null);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Public Pages & CMS Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, edit, and publish static journal pages, guidelines, research policies, and legal agreements.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {toastMessage && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4" />
              <span>{toastMessage}</span>
            </div>
          )}

          <button
            onClick={openCreator}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "EDITORIAL", "AUTHORS", "POLICIES", "COLLABORATION"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === st
                  ? "bg-navy-900 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search page or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>
      </div>

      {/* Pages Table */}
      <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">Page Title & Slug</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Updated</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4">
                    <p className="font-semibold text-foreground text-sm">{item.title}</p>
                    <span className="font-mono text-[11px] text-muted-foreground">/{item.slug}</span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground">
                      {item.category}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        item.isPublished
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{item.isPublished ? "Live" : "Draft"}</span>
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap text-muted-foreground text-[11px]">
                    {item.updatedAt}
                  </td>

                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    <button
                      onClick={() => openEditor(item)}
                      className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors inline-flex items-center gap-1"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>Edit Page</span>
                    </button>

                    <button
                      onClick={() => togglePublish(item.id)}
                      className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
                    >
                      {item.isPublished ? "Unpublish" : "Publish"}
                    </button>

                    <Link
                      href={`/${item.slug}`}
                      target="_blank"
                      className="px-2.5 py-1 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-[11px] font-semibold transition-colors inline-flex items-center gap-1"
                    >
                      <span>Preview</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FULL-FEATURED PAGE EDITOR MODAL */}
      {editingPage && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl w-full max-w-3xl my-8 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h2 className="text-base font-serif font-bold text-foreground">
                  {isCreating ? "Create New Public Page" : `Edit Page: ${editingPage.title}`}
                </h2>
                <p className="text-xs text-muted-foreground">
                  Update content, metadata, translation, and SEO parameters.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingPage(null)}
                className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSavePage} className="p-6 space-y-4 text-xs overflow-y-auto flex-1">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Page Title *
                </label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => {
                      setFormTitle(e.target.value);
                      if (isCreating && !formSlug) {
                        setFormSlug(
                          e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, "-")
                            .replace(/^-|-$/g, "")
                        );
                      }
                    }}
                    placeholder="e.g. Peer Review Standards"
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground font-semibold"
                    required
                  />
                </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">
                    URL Slug Path *
                  </label>
                  <div className="flex items-center">
                    <span className="p-2.5 rounded-l-lg border border-r-0 border-border bg-muted text-muted-foreground font-mono">
                      /
                    </span>
                    <input
                      type="text"
                      value={formSlug}
                      onChange={(e) => setFormSlug(e.target.value)}
                      placeholder="peer-review-standards"
                      className="w-full p-2.5 rounded-r-lg border border-border bg-background text-foreground font-mono"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-muted-foreground font-medium mb-1">
                    Page Section Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                  >
                    <option value="EDITORIAL">Editorial & About</option>
                    <option value="AUTHORS">Author Directives & APC</option>
                    <option value="POLICIES">Publication Ethics & Policies</option>
                    <option value="COLLABORATION">Conferences & Partnerships</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">
                  Subtitle / Hero Tagline
                </label>
                <input
                  type="text"
                  value={formSubtitle}
                  onChange={(e) => setFormSubtitle(e.target.value)}
                  placeholder="Short summary displayed below the main heading"
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              {/* Content Markdown Editor */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-muted-foreground font-medium">
                    Page Body Content (Markdown Supported) *
                  </label>
                  <span className="text-[10px] text-muted-foreground">
                    {formContent.length} characters · {formContent.split(/\s+/).filter(Boolean).length} words
                  </span>
                </div>

                <div className="border border-border rounded-lg overflow-hidden bg-background">
                  <div className="bg-muted/40 border-b border-border p-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <button
                      type="button"
                      onClick={() => setFormContent(formContent + "\n\n## Section Heading\n")}
                      className="px-2 py-0.5 rounded border border-border hover:bg-muted font-bold text-foreground"
                    >
                      H2
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormContent(formContent + "\n\n### Sub-heading\n")}
                      className="px-2 py-0.5 rounded border border-border hover:bg-muted font-bold text-foreground"
                    >
                      H3
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormContent(formContent + " **bold text** ")}
                      className="px-2 py-0.5 rounded border border-border hover:bg-muted font-bold text-foreground"
                    >
                      B
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormContent(formContent + "\n- Bullet item 1\n- Bullet item 2\n")}
                      className="px-2 py-0.5 rounded border border-border hover:bg-muted text-foreground"
                    >
                      • List
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormContent(formContent + "\n> Important note blockquote\n")}
                      className="px-2 py-0.5 rounded border border-border hover:bg-muted text-foreground"
                    >
                      Quote
                    </button>
                  </div>

                  <textarea
                    value={formContent}
                    onChange={(e) => setFormContent(e.target.value)}
                    placeholder="Write page content in markdown format..."
                    rows={12}
                    className="w-full p-3 bg-transparent text-foreground font-mono text-xs focus:outline-none"
                    required
                  />
                </div>
              </div>

              {/* SEO Tags */}
              <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
                <span className="text-xs font-bold text-foreground block">
                  Search Engine Optimization (SEO) & Metadata
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-muted-foreground font-medium mb-1">
                      Meta Title
                    </label>
                    <input
                      type="text"
                      value={formSeoTitle}
                      onChange={(e) => setFormSeoTitle(e.target.value)}
                      placeholder="e.g. Peer Review Standards - JIIR"
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-muted-foreground font-medium mb-1">
                      Meta Description
                    </label>
                    <input
                      type="text"
                      value={formSeoDesc}
                      onChange={(e) => setFormSeoDesc(e.target.value)}
                      placeholder="Brief description for Google search results"
                      className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Publication Status Toggle */}
              <div className="flex items-center justify-between p-3 rounded-xl border border-border">
                <div>
                  <p className="font-semibold text-foreground text-xs">Live Publication Status</p>
                  <p className="text-[11px] text-muted-foreground">
                    When active, the page is reachable by visitors at /{formSlug || "slug"}.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFormIsPublished(!formIsPublished)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    formIsPublished ? "bg-emerald-600" : "bg-muted"
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      formIsPublished ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingPage(null)}
                  className="px-4 py-2 rounded-xl border border-border text-muted-foreground hover:bg-muted font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingPage}
                  className="px-5 py-2 rounded-xl bg-navy-900 text-white font-semibold hover:bg-navy-800 shadow-md inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {savingPage ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      <span>{isCreating ? "Create & Publish Page" : "Save Changes"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
