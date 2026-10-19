"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle, ArrowRight } from "lucide-react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const defaultFaqs: FaqItem[] = [
  {
    id: "faq-1",
    question: "What is the typical peer-review and publication turnaround time?",
    answer: "Initial editorial screening is completed within 2–4 days. The rigorous double-blind peer review process typically takes 2 to 3 weeks. Upon unconditional acceptance and proof approval, papers are published in the next monthly issue or online immediately.",
    category: "Review",
  },
  {
    id: "faq-2",
    question: "What language should manuscripts be written in?",
    answer: "JIIR publishes scholarly research in standard academic English to ensure maximum global readership, international indexing, and worldwide citation impact across peer-reviewed databases.",
    category: "Submission",
  },
  {
    id: "faq-3",
    question: "When are Article Processing Charges (APC) payable?",
    answer: "APC is only payable AFTER your manuscript has received an unconditional acceptance decision from the Chief Editor. There are zero submission fees. If a manuscript is rejected during peer review, no payment is ever required.",
    category: "Payment",
  },
  {
    id: "faq-4",
    question: "How do authors receive their publication certificates?",
    answer: "Immediately upon publication, authors can download an official digital Certificate of Publication directly from their Scholar Portal. Each certificate includes an encrypted QR code linking to permanent online verification.",
    category: "Certificates",
  },
  {
    id: "faq-5",
    question: "What is the plagiarism threshold for JIIR submissions?",
    answer: "In accordance with global COPE guidelines and international standards, the maximum allowable similarity index is 15% (excluding references and quotes). Any paper exceeding this is returned for revision before review.",
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
    <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 lg:p-10 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-orange">
            Author Help Center
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 mt-1 max-w-xl font-medium">
            Quick answers to common questions about peer review, bilingual guidelines, and publication workflow.
          </p>
        </div>

        <Link
          href="/faq"
          className="text-xs font-bold text-navy-800 hover:text-brand-orange inline-flex items-center gap-1 group shrink-0"
        >
          <span>View All 16+ FAQs</span>
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="divide-y divide-slate-200">
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
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {faq.category}
                    </span>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-navy-800 transition-colors">
                      {faq.question}
                    </h3>
                  </div>
                </div>
                <div
                  className={`p-1.5 rounded-full bg-slate-100 text-slate-700 group-hover:text-slate-900 transition-transform duration-200 shrink-0 ${
                    isOpen ? "rotate-180 bg-navy-100 text-navy-900" : ""
                  }`}
                >
                  <ChevronDown className="w-4 h-4" />
                </div>
              </button>

              {isOpen && (
                <div className="pt-3 pl-1 pr-6 text-xs sm:text-sm text-slate-800 leading-relaxed font-normal animate-in fade-in duration-150">
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
