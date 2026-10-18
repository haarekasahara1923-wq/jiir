"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  questionHi?: string | null;
  answer: string;
  category: string;
}

const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "What is the typical peer-review and publication turnaround time?",
    questionHi: "सहकर्मी समीक्षा एवं प्रकाशन में कितना समय लगता है?",
    answer: "Initial editorial screening is completed within 2–4 days. The rigorous double-blind peer review process typically takes 2 to 3 weeks. Upon unconditional acceptance and proof approval, papers are published in the next monthly issue or online immediately.",
    category: "Review",
  },
  {
    id: "faq-2",
    question: "Are papers accepted in both English and Hindi?",
    questionHi: "क्या शोध पत्र अंग्रेजी और हिंदी दोनों में स्वीकार किए जाते हैं?",
    answer: "Yes. JIIR is proudly bilingual. We welcome high-calibre submissions written in English or Hindi (द्विभाषी जर्नल). Hindi manuscripts must include an English title, abstract, and keywords for international indexing.",
    category: "Submission",
  },
  {
    id: "faq-3",
    question: "When are Article Processing Charges (APC) payable?",
    questionHi: "आर्टिकल प्रोसेसिंग शुल्क (APC) का भुगतान कब करना होता है?",
    answer: "APC is only payable AFTER your manuscript has received an unconditional acceptance decision from the Chief Editor. There are zero submission fees. If a manuscript is rejected during peer review, no payment is ever required.",
    category: "Payment",
  },
  {
    id: "faq-4",
    question: "How do authors receive their publication certificates?",
    questionHi: "लेखकों को उनका प्रकाशन प्रमाण पत्र कैसे प्राप्त होता है?",
    answer: "Immediately upon publication, authors can download an official digital Certificate of Publication directly from their Scholar Portal. Each certificate includes an encrypted QR code linking to permanent online verification.",
    category: "Certificates",
  },
  {
    id: "faq-5",
    question: "What is the plagiarism threshold for JIIR submissions?",
    questionHi: "शोध पत्र के लिए साहित्यिक चोरी (Plagiarism) की सीमा क्या है?",
    answer: "In accordance with global COPE guidelines and UGC standards, the maximum allowable similarity index is 15% (excluding references and quotes). Any paper exceeding this is returned for revision before review.",
    category: "Ethics",
  },
];

export function HomeFaqAccordion({ faqs }: { faqs?: FaqItem[] }) {
  const displayFaqs = faqs && faqs.length > 0 ? faqs : defaultFaqs;
  const [openId, setOpenId] = useState<string | null>(displayFaqs[0]?.id || null);

  const toggle = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-white dark:bg-slate-900 rounded-2xl border border-border p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Author Help Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 dark:text-white mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-xl">
            Quick answers to common questions about peer review, bilingual guidelines, and publication workflow.
          </p>
        </div>

        <Link
          href="/faq"
          className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 group shrink-0"
        >
          <span>View All 16+ FAQs</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="divide-y divide-border">
        {displayFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div key={faq.id} className="py-4">
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
        })}
      </div>
    </section>
  );
}
