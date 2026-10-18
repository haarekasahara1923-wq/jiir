"use client";

import { useState } from "react";
import { HelpCircle, Plus, Search, Trash2, Edit2, CheckCircle2 } from "lucide-react";

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  showOnHome: boolean;
  isPublished: boolean;
}

const INITIAL_FAQS: FaqItem[] = [
  {
    id: "faq-1",
    category: "SUBMISSIONS",
    question: "What is the typical peer-review and editorial decision turnaround time?",
    answer: "Initial editorial screening is completed within 48-72 hours. Comprehensive double-blind peer review concludes in 14-21 days.",
    showOnHome: true,
    isPublished: true
  },
  {
    id: "faq-2",
    category: "FEES & APC",
    question: "Are there any submission fees or evaluation charges?",
    answer: "No. JIIR does not charge any submission or evaluation fee. Article Processing Charges (APC) are only requested after formal acceptance.",
    showOnHome: true,
    isPublished: true
  },
  {
    id: "faq-3",
    category: "DOI & INDEXING",
    question: "Does every published article receive a permanent DOI?",
    answer: "Yes, all accepted manuscripts opting for DOI receive a permanent digital object identifier registered through Crossref / Zenodo.",
    showOnHome: true,
    isPublished: true
  },
  {
    id: "faq-4",
    category: "CERTIFICATES",
    question: "Do co-authors receive individual digitally verifiable certificates?",
    answer: "Yes. Both corresponding and all co-authors are issued separate cryptographically signed publication certificates with QR verification.",
    showOnHome: false,
    isPublished: true
  }
];

export default function AdminFaqsPage() {
  const [faqs, setFaqs] = useState<FaqItem[]>(INITIAL_FAQS);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("SUBMISSIONS");

  const filtered = faqs.filter((f) => {
    if (search) {
      const q = search.toLowerCase();
      return f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleHome = (id: string) => {
    setFaqs(faqs.map((f) => (f.id === id ? { ...f, showOnHome: !f.showOnHome } : f)));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: FaqItem = {
      id: `faq-${Date.now()}`,
      category: newCategory,
      question: newQuestion,
      answer: newAnswer,
      showOnHome: false,
      isPublished: true
    };
    setFaqs([...faqs, created]);
    setShowModal(false);
    setNewQuestion("");
    setNewAnswer("");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Frequently Asked Questions (FAQ) Manager
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Curate author, reviewer, and reader knowledge bases with English and Hindi support.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New FAQ</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search question or keyword..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
        />
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-2 hover:border-navy-600/30 transition-all"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase">
                {item.category}
              </span>

              <div className="flex items-center gap-2 text-xs">
                <button
                  onClick={() => toggleHome(item.id)}
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors ${
                    item.showOnHome
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.showOnHome ? "Featured on Home" : "General FAQ"}
                </button>
              </div>
            </div>

            <h3 className="text-sm font-bold text-foreground">{item.question}</h3>
            <p className="text-xs text-muted-foreground">{item.answer}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-base font-serif font-bold text-foreground">Add New FAQ</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="SUBMISSIONS">Submissions & Workflow</option>
                  <option value="FEES & APC">Publication Fees & APC</option>
                  <option value="DOI & INDEXING">DOI & Indexing</option>
                  <option value="CERTIFICATES">Certificates & Verification</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Question</label>
                <input
                  type="text"
                  placeholder="e.g. Can authors request fast-track peer review?"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Answer</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="Detailed answer for researchers..."
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground h-28"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-navy-900 text-white font-semibold hover:bg-navy-800"
                >
                  Save FAQ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
