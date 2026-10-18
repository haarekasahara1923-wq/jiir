"use client";

import { useState } from "react";
import Link from "next/link";
import { HelpCircle, ChevronDown, Search, ArrowRight, Mail } from "lucide-react";

interface Faq {
  id: string;
  category: string;
  question: string;
  questionHi?: string;
  answer: string;
}

const allFaqs: Faq[] = [
  {
    id: "f1",
    category: "General",
    question: "What is the scope and discipline focus of JIIR?",
    questionHi: "JIIR का विषय क्षेत्र और फोकस क्या है?",
    answer: "JIIR publishes original multidisciplinary research across 5 primary pillars: Management & Business, Education & Pedagogy, Hospitality & Tourism Management, Applied Sciences, and Engineering & Technology. Cross-disciplinary research connecting two or more of these areas is especially encouraged.",
  },
  {
    id: "f2",
    category: "Submission",
    question: "How do I submit my manuscript?",
    questionHi: "मैं अपना शोध पत्र कैसे जमा करूँ?",
    answer: "Manuscripts are submitted directly through our online Scholar Portal. Simply create an author account with your email and password, navigate to 'Submit Manuscript', complete the 5-step metadata wizard, and upload your manuscript file (DOCX or PDF). There is no file size limitation.",
  },
  {
    id: "f3",
    category: "Submission",
    question: "Can I submit my manuscript in Hindi?",
    questionHi: "क्या मैं अपना शोध पत्र हिंदी में जमा कर सकता हूँ?",
    answer: "Yes, absolutely. JIIR is an officially bilingual journal publishing papers in English and Hindi. Hindi manuscripts must include an English title, an abstract in English (150–250 words), and 4–6 English keywords to ensure indexing in international databases.",
  },
  {
    id: "f4",
    category: "Peer Review",
    question: "What peer-review model does JIIR employ?",
    questionHi: "JIIR में किस प्रकार की सहकर्मी समीक्षा प्रणाली अपनाई जाती है?",
    answer: "We employ a strict Double-Blind Peer Review model. The identities of both the authors and the reviewers remain undisclosed to each other throughout the review cycle. Every paper is reviewed by at least two independent subject experts.",
  },
  {
    id: "f5",
    category: "Peer Review",
    question: "What is the typical time frame from submission to publication decision?",
    questionHi: "जमा करने से लेकर प्रकाशन के निर्णय तक कितना समय लगता है?",
    answer: "Initial editorial screening is completed in 2 to 4 business days. The full peer-review process takes between 2 and 3 weeks. Fast-track reviews (for urgent research) can be completed in 7 to 10 days.",
  },
  {
    id: "f6",
    category: "Payments & APC",
    question: "When and how are Article Processing Charges (APC) paid?",
    questionHi: "आर्टिकल प्रोसेसिंग शुल्क (APC) कब और कैसे दिया जाता है?",
    answer: "APC is only payable after your manuscript has received an unconditional acceptance decision from the Chief Editor. There are zero submission fees. Payment can be completed online via Razorpay (UPI, Credit/Debit cards, Net Banking) or through direct institutional bank transfer.",
  },
  {
    id: "f7",
    category: "Payments & APC",
    question: "Are fee waivers available for researchers?",
    questionHi: "क्या शोधकर्ताओं के लिए शुल्क छूट की सुविधा है?",
    answer: "Yes. Waivers of up to 50% are available for deserving independent scholars, unfunded researchers, or researchers from low-income economies upon written request with supporting documentation.",
  },
  {
    id: "f8",
    category: "Post-Publication & Certificates",
    question: "How can authors verify and download their publication certificates?",
    questionHi: "लेखक अपना प्रमाण पत्र कैसे सत्यापित और डाउनलोड कर सकते हैं?",
    answer: "Upon publication of the issue, each author and co-author can instantly download a high-resolution, digitally signed Certificate of Publication from their Scholar Portal. Each certificate contains an encrypted QR code linking to an official online verification page.",
  },
];

export default function FaqPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [openIds, setOpenIds] = useState<string[]>(["f1"]);

  const categories = ["ALL", "General", "Submission", "Peer Review", "Payments & APC", "Post-Publication & Certificates"];

  const filtered = allFaqs.filter((f) => {
    const matchCat = selectedCategory === "ALL" || f.category === selectedCategory;
    const matchSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase()) ||
      (f.questionHi && f.questionHi.includes(search));
    return matchCat && matchSearch;
  });

  const toggle = (id: string) => {
    setOpenIds(openIds.includes(id) ? openIds.filter((i) => i !== id) : [...openIds, id]);
  };

  const expandAll = () => setOpenIds(filtered.map((f) => f.id));
  const collapseAll = () => setOpenIds([]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Knowledge Base
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Everything you need to know about preparing, submitting, reviewing, and publishing research in JIIR.
        </p>
      </div>

      {/* Controls: Search, Category Filter, Expand/Collapse */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search questions by keyword or topic..."
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
            <button
              onClick={expandAll}
              className="hover:text-primary font-semibold transition-colors"
            >
              Expand All
            </button>
            <span>•</span>
            <button
              onClick={collapseAll}
              className="hover:text-primary font-semibold transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 pt-1">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                selectedCategory === c
                  ? "bg-navy-700 text-white shadow-sm"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {c === "ALL" ? "All Questions" : c}
            </button>
          ))}
        </div>
      </div>

      {/* Accordion list */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-6 sm:p-8 divide-y divide-border shadow-sm">
        {filtered.length > 0 ? (
          filtered.map((faq) => {
            const isOpen = openIds.includes(faq.id);
            return (
              <div key={faq.id} className="py-4 first:pt-0 last:pb-0">
                <button
                  onClick={() => toggle(faq.id)}
                  className="w-full flex items-start justify-between gap-4 text-left group"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                        {faq.question}
                      </h3>
                    </div>
                    {faq.questionHi && (
                      <p className="text-xs text-muted-foreground font-devanagari pl-0.5">
                        {faq.questionHi}
                      </p>
                    )}
                  </div>
                  <div
                    className={`p-1.5 rounded-full bg-muted text-muted-foreground group-hover:text-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 bg-navy-100 text-navy-800 dark:bg-navy-900" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="pt-3 pl-1 pr-6 text-xs sm:text-sm text-muted-foreground leading-relaxed animate-in fade-in duration-150">
                    <p>{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-xs text-muted-foreground">
            No matching questions found for &ldquo;{search}&rdquo;. Try another term.
          </div>
        )}
      </div>

      {/* Still Have Questions Box */}
      <div className="p-6 sm:p-8 rounded-2xl bg-navy-50/70 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-serif font-bold text-foreground">
            Still have an unanswered question?
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Contact the JIIR Editorial Secretariat directly for personalized assistance with your submission.
          </p>
        </div>

        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-navy-700 hover:bg-navy-800 text-white text-xs font-bold uppercase tracking-wider shadow-sm transition-colors shrink-0"
        >
          <Mail className="w-4 h-4" />
          <span>Contact Editorial Secretariat</span>
        </Link>
      </div>
    </div>
  );
}
