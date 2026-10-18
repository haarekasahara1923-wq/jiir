import { prisma } from "@/lib/prisma";

export interface NavLinkItem {
  id: string;
  label: string;
  labelHi?: string | null;
  href: string;
  target?: string;
  sortOrder: number;
  parentId?: string | null;
  children?: NavLinkItem[];
}

export const defaultHeaderNav: NavLinkItem[] = [
  { id: "nav-home", label: "Home", href: "/", sortOrder: 1 },
  {
    id: "nav-about",
    label: "About",
    href: "/about",
    sortOrder: 2,
    children: [
      { id: "sub-about-us", label: "About Us", href: "/about", sortOrder: 1 },
      { id: "sub-info", label: "Journal Information", href: "/journal-information", sortOrder: 2 },
      { id: "sub-board", label: "Editorial Board", href: "/editorial-board", sortOrder: 3 },
      { id: "sub-indexing", label: "Indexing & Abstracting", href: "/indexing", sortOrder: 4 },
      { id: "sub-doi", label: "DOI Information", href: "/doi", sortOrder: 5 },
    ],
  },
  {
    id: "nav-authors",
    label: "For Authors",
    href: "/author-guidelines",
    sortOrder: 3,
    children: [
      { id: "sub-guidelines", label: "Author Guidelines", href: "/author-guidelines", sortOrder: 1 },
      { id: "sub-resources", label: "Author Resources & Templates", href: "/author-resources", sortOrder: 2 },
      { id: "sub-procedure", label: "Publication Procedure", href: "/publication-procedure", sortOrder: 3 },
      { id: "sub-peer-review", label: "Peer Review Policy", href: "/peer-review-policy", sortOrder: 4 },
      { id: "sub-ethics", label: "Publication Ethics", href: "/publication-ethics", sortOrder: 5 },
      { id: "sub-apc", label: "Article Processing Charges (APC)", href: "/article-processing-charges", sortOrder: 6 },
      { id: "sub-faq", label: "Frequently Asked Questions", href: "/faq", sortOrder: 7 },
    ],
  },
  {
    id: "nav-issues",
    label: "Issues",
    href: "/current-issue",
    sortOrder: 4,
    children: [
      { id: "sub-current-issue", label: "Current Issue", href: "/current-issue", sortOrder: 1 },
      { id: "sub-past-issues", label: "Past Issues & Archive", href: "/past-issues", sortOrder: 2 },
    ],
  },
  { id: "nav-cfp", label: "Call for Papers", href: "/call-for-papers", sortOrder: 5 },
  { id: "nav-conferences", label: "Conferences", href: "/conferences", sortOrder: 6 },
  { id: "nav-pay", label: "Pay Online", href: "/pay-online", sortOrder: 7 },
  { id: "nav-contact", label: "Contact Us", href: "/contact", sortOrder: 8 },
];

export const defaultFooterNav = {
  journal: [
    { label: "About JIIR", href: "/about" },
    { label: "Journal Information", href: "/journal-information" },
    { label: "Editorial Board", href: "/editorial-board" },
    { label: "Indexing & Impact", href: "/indexing" },
    { label: "DOI & Crossref", href: "/doi" },
    { label: "Contact Editorial Secretariat", href: "/contact" },
  ],
  authors: [
    { label: "Submit Manuscript", href: "/submit-manuscript" },
    { label: "Track Manuscript", href: "/track-manuscript" },
    { label: "Author Guidelines", href: "/author-guidelines" },
    { label: "Paper Template Download", href: "/author-resources" },
    { label: "Article Processing Charges", href: "/article-processing-charges" },
    { label: "Publication Procedure", href: "/publication-procedure" },
    { label: "Online Fee Payment", href: "/pay-online" },
  ],
  policies: [
    { label: "Peer Review Policy", href: "/peer-review-policy" },
    { label: "Publication Ethics", href: "/publication-ethics" },
    { label: "Open Access Policy", href: "/open-access-policy" },
    { label: "Plagiarism Policy", href: "/plagiarism-policy" },
    { label: "Correction & Retraction", href: "/correction-retraction-policy" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
  ],
  connect: [
    { label: "Call for Papers 2026", href: "/call-for-papers" },
    { label: "Upcoming Conferences", href: "/conferences" },
    { label: "Frequently Asked Questions", href: "/faq" },
    { label: "Institutional Subscriptions", href: "/institutional-partnerships" },
    { label: "Author Portal Login", href: "/scholar/login" },
  ],
};

export async function getHeaderNavigation(): Promise<NavLinkItem[]> {
  try {
    const items = await prisma.navItem.findMany({
      where: { area: "HEADER", isVisible: true },
      orderBy: { sortOrder: "asc" },
    });

    if (!items || items.length === 0) return defaultHeaderNav;

    // Build hierarchy
    const map = new Map<string, NavLinkItem>();
    const roots: NavLinkItem[] = [];

    items.forEach((item) => {
      map.set(item.id, {
        id: item.id,
        label: item.label,
        labelHi: item.labelHi,
        href: item.href ?? "/",
        target: item.openInNewTab ? "_blank" : undefined,
        sortOrder: item.sortOrder,
        parentId: item.parentId,
        children: [],
      });
    });

    items.forEach((item) => {
      const node = map.get(item.id)!;
      if (item.parentId && map.has(item.parentId)) {
        map.get(item.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    });

    return roots;
  } catch {
    return defaultHeaderNav;
  }
}
