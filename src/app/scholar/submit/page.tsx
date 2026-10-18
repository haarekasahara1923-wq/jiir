"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Upload,
  CheckCircle2,
  FileText,
  UserPlus,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  X,
  Plus,
  AlertCircle,
} from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";

const articleTypes = [
  { value: "RESEARCH_ARTICLE", label: "Original Research Article" },
  { value: "REVIEW_ARTICLE", label: "Critical Literature Review" },
  { value: "CASE_STUDY", label: "Scholarly Case Study" },
  { value: "SHORT_COMMUNICATION", label: "Short Communication" },
];

const researchAreas = [
  "Management & Business",
  "Education & Pedagogy",
  "Hospitality & Tourism Management",
  "Applied Science & Mathematics",
  "Technology & Engineering",
  "Other Multidisciplinary Domain",
];

export default function ScholarSubmitWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    articleType: "RESEARCH_ARTICLE",
    subjectArea: "Management & Business",
    abstract: "",
    keywords: ["Interdisciplinary Research", "Innovation"],
    language: "English",
    correspondingAuthor: "Dr. Lead Author",
    correspondingEmail: "author@university.edu",
    phone: "",
    department: "",
    institution: "",
    country: "India",
    coAuthors: [] as Array<{
      name: string;
      email: string;
      affiliation: string;
      country: string;
      orcid?: string;
    }>,
    fileId: "",
    fileName: "",
    coverLetterUrl: "",
    declarationsAccepted: false,
    plagiarismDeclared: false,
  });

  const [keywordInput, setKeywordInput] = useState("");
  const [coAuthorInput, setCoAuthorInput] = useState({
    name: "",
    email: "",
    affiliation: "",
    country: "India",
    orcid: "",
  });

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({ ...formData, keywords: [...formData.keywords, keywordInput.trim()] });
      setKeywordInput("");
    }
  };

  const removeKeyword = (kw: string) => {
    setFormData({ ...formData, keywords: formData.keywords.filter((k) => k !== kw) });
  };

  const addCoAuthor = () => {
    if (coAuthorInput.name.trim() && coAuthorInput.email.trim()) {
      setFormData({
        ...formData,
        coAuthors: [...formData.coAuthors, { ...coAuthorInput }],
      });
      setCoAuthorInput({ name: "", email: "", affiliation: "", country: "India", orcid: "" });
    }
  };

  const removeCoAuthor = (index: number) => {
    setFormData({
      ...formData,
      coAuthors: formData.coAuthors.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async () => {
    if (!formData.declarationsAccepted || !formData.plagiarismDeclared) {
      setError("Please accept all mandatory ethical and submission declarations.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/manuscripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Submission failed");

      router.push(`/scholar/manuscripts/${data.manuscript.id}`);
    } catch (err: any) {
      setError(err.message || "Failed to submit manuscript");
      setLoading(false);
    }
  };

  const wordCount = formData.abstract.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="border-b border-border pb-4 space-y-1">
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Submit New Manuscript
        </h1>
        <p className="text-xs text-muted-foreground">
          Complete the 5-step submission wizard to initiate double-blind peer review.
        </p>
      </div>

      {/* Stepper Indicator */}
      <div className="grid grid-cols-5 gap-2 text-center text-xs">
        {[
          { num: 1, label: "Metadata" },
          { num: 2, label: "Authors" },
          { num: 3, label: "Files" },
          { num: 4, label: "Declarations" },
          { num: 5, label: "Review" },
        ].map((s) => (
          <div
            key={s.num}
            className={`p-2.5 rounded-xl border transition-all ${
              step === s.num
                ? "bg-navy-700 text-white border-navy-700 font-bold shadow-sm"
                : step > s.num
                ? "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            <span className="block text-xs font-mono">{s.num}</span>
            <span className="text-[11px] truncate block">{s.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Step 1: Metadata */}
      {step === 1 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6 animate-in fade-in">
          <h2 className="text-base font-serif font-bold text-foreground border-b border-border pb-2">
            Step 1: Manuscript Title & Abstract
          </h2>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Manuscript Title *</label>
            <textarea
              required
              rows={2}
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Full scholarly title of the paper..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-input bg-background font-serif"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Article Type *</label>
              <select
                value={formData.articleType}
                onChange={(e) => setFormData({ ...formData, articleType: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
              >
                {articleTypes.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Primary Research Area *</label>
              <select
                value={formData.subjectArea}
                onChange={(e) => setFormData({ ...formData, subjectArea: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
              >
                {researchAreas.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Language *</label>
              <select
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
              >
                <option value="English">English (Standard Academic)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-foreground">Structured Abstract (150–250 words) *</label>
              <span className={`text-[10px] font-mono ${wordCount < 150 ? "text-amber-500" : "text-emerald-500"}`}>
                {wordCount} words
              </span>
            </div>
            <textarea
              required
              rows={6}
              value={formData.abstract}
              onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
              placeholder="Outline background, methodology, core empirical findings, and scientific implications..."
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-input bg-background leading-relaxed"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-foreground">Keywords (min 2, max 6) *</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={keywordInput}
                onChange={(e) => setKeywordInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                placeholder="Type keyword and press Enter or click Add"
                className="flex-1 px-3 py-2 text-xs rounded-lg border border-input bg-background"
              />
              <button
                type="button"
                onClick={addKeyword}
                className="px-4 py-2 rounded-lg bg-navy-700 text-white text-xs font-semibold"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {formData.keywords.map((kw) => (
                <span
                  key={kw}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-muted text-xs font-semibold text-foreground"
                >
                  <span>{kw}</span>
                  <X
                    className="w-3 h-3 cursor-pointer text-muted-foreground hover:text-foreground"
                    onClick={() => removeKeyword(kw)}
                  />
                </span>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-border">
            <button
              onClick={() => {
                if (!formData.title.trim() || !formData.abstract.trim()) {
                  setError("Title and Abstract are required.");
                  return;
                }
                setError(null);
                setStep(2);
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-700 text-white text-xs font-bold uppercase tracking-wider"
            >
              <span>Next: Authors & Affiliations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Authors */}
      {step === 2 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6 animate-in fade-in">
          <h2 className="text-base font-serif font-bold text-foreground border-b border-border pb-2">
            Step 2: Authors & Affiliations
          </h2>

          <div className="p-4 rounded-xl bg-navy-50/50 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-900 space-y-3">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Corresponding Author (Primary)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                value={formData.correspondingAuthor}
                onChange={(e) => setFormData({ ...formData, correspondingAuthor: e.target.value })}
                placeholder="Full Name"
                className="px-3 py-2 text-xs rounded-lg border border-input bg-background"
              />
              <input
                type="email"
                value={formData.correspondingEmail}
                onChange={(e) => setFormData({ ...formData, correspondingEmail: e.target.value })}
                placeholder="Email Address"
                className="px-3 py-2 text-xs rounded-lg border border-input bg-background"
              />
            </div>
          </div>

          {/* Co-Authors List */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
              Co-Authors (Optional)
            </h3>

            {formData.coAuthors.map((ca, idx) => (
              <div key={idx} className="p-3 rounded-lg border border-border flex items-center justify-between text-xs">
                <div>
                  <strong className="block text-foreground">{ca.name}</strong>
                  <span className="text-muted-foreground">{ca.email} • {ca.affiliation} ({ca.country})</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCoAuthor(idx)}
                  className="text-destructive hover:underline text-xs"
                >
                  Remove
                </button>
              </div>
            ))}

            <div className="p-4 rounded-xl border border-dashed border-border space-y-3">
              <h4 className="text-xs font-semibold text-foreground">Add a Co-Author</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={coAuthorInput.name}
                  onChange={(e) => setCoAuthorInput({ ...coAuthorInput, name: e.target.value })}
                  placeholder="Co-Author Name"
                  className="px-3 py-2 text-xs rounded-lg border border-input bg-background"
                />
                <input
                  type="email"
                  value={coAuthorInput.email}
                  onChange={(e) => setCoAuthorInput({ ...coAuthorInput, email: e.target.value })}
                  placeholder="Co-Author Email"
                  className="px-3 py-2 text-xs rounded-lg border border-input bg-background"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={coAuthorInput.affiliation}
                  onChange={(e) => setCoAuthorInput({ ...coAuthorInput, affiliation: e.target.value })}
                  placeholder="Institution Affiliation"
                  className="px-3 py-2 text-xs rounded-lg border border-input bg-background"
                />
                <input
                  type="text"
                  value={coAuthorInput.country}
                  onChange={(e) => setCoAuthorInput({ ...coAuthorInput, country: e.target.value })}
                  placeholder="Country"
                  className="px-3 py-2 text-xs rounded-lg border border-input bg-background"
                />
              </div>
              <button
                type="button"
                onClick={addCoAuthor}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-muted text-xs font-semibold hover:bg-navy-700 hover:text-white transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Co-Author</span>
              </button>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <button
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-700 text-white text-xs font-bold uppercase tracking-wider"
            >
              <span>Next: Upload Files</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Files */}
      {step === 3 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6 animate-in fade-in">
          <h2 className="text-base font-serif font-bold text-foreground border-b border-border pb-2">
            Step 3: Upload Manuscript & Attachments
          </h2>

          <FileUpload
            label="Upload Main Manuscript File (DOCX or PDF) *"
            description="Direct upload with zero size limitation. Please ensure author names are removed from the main body for double-blind review."
            onUploadComplete={(asset) => {
              setFormData({
                ...formData,
                fileId: asset.id,
                fileName: asset.originalName,
              });
            }}
          />

          <div className="flex justify-between pt-4 border-t border-border">
            <button
              onClick={() => setStep(2)}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-700 text-white text-xs font-bold uppercase tracking-wider"
            >
              <span>Next: Declarations</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Declarations */}
      {step === 4 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6 animate-in fade-in">
          <h2 className="text-base font-serif font-bold text-foreground border-b border-border pb-2">
            Step 4: Ethical & Legal Declarations
          </h2>

          <div className="space-y-4">
            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.plagiarismDeclared}
                onChange={(e) => setFormData({ ...formData, plagiarismDeclared: e.target.checked })}
                className="mt-1 rounded text-primary focus:ring-primary"
              />
              <div className="text-xs space-y-0.5">
                <strong className="block text-foreground">Plagiarism & Originality Declaration *</strong>
                <span className="text-muted-foreground">
                  I confirm that this manuscript represents original research, is not published elsewhere,
                  and maintains an overall similarity index of less than 15%.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-3 p-4 rounded-xl border border-border hover:bg-muted/30 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.declarationsAccepted}
                onChange={(e) => setFormData({ ...formData, declarationsAccepted: e.target.checked })}
                className="mt-1 rounded text-primary focus:ring-primary"
              />
              <div className="text-xs space-y-0.5">
                <strong className="block text-foreground">Open Access & Editorial Agreement *</strong>
                <span className="text-muted-foreground">
                  I agree that upon unconditional acceptance, this article will be published Open Access under Creative Commons
                  Attribution-NonCommercial 4.0 International (CC BY-NC 4.0).
                </span>
              </div>
            </label>
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <button
              onClick={() => setStep(3)}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg"
            >
              Back
            </button>
            <button
              onClick={() => setStep(5)}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-700 text-white text-xs font-bold uppercase tracking-wider"
            >
              <span>Next: Final Review</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 5: Final Review & Submit */}
      {step === 5 && (
        <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6 animate-in fade-in">
          <h2 className="text-base font-serif font-bold text-foreground border-b border-border pb-2">
            Step 5: Review & Submit
          </h2>

          <div className="space-y-4 text-xs">
            <div>
              <span className="text-muted-foreground block font-semibold uppercase text-[10px]">Title:</span>
              <h3 className="text-sm font-serif font-bold text-foreground">{formData.title}</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-muted-foreground block uppercase text-[10px] font-semibold">Area:</span>
                <span className="text-foreground">{formData.subjectArea}</span>
              </div>
              <div>
                <span className="text-muted-foreground block uppercase text-[10px] font-semibold">Type:</span>
                <span className="text-foreground">{formData.articleType.replace("_", " ")}</span>
              </div>
              <div>
                <span className="text-muted-foreground block uppercase text-[10px] font-semibold">Language:</span>
                <span className="text-foreground">{formData.language}</span>
              </div>
            </div>

            <div>
              <span className="text-muted-foreground block font-semibold uppercase text-[10px]">Authors:</span>
              <p className="text-foreground font-semibold">
                {formData.correspondingAuthor} (Corresponding)
                {formData.coAuthors.length > 0 && `, ${formData.coAuthors.map((c) => c.name).join(", ")}`}
              </p>
            </div>
          </div>

          <div className="flex justify-between pt-4 border-t border-border">
            <button
              onClick={() => setStep(4)}
              className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg"
            >
              Back
            </button>
            <button
              disabled={loading}
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-orange-600 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all active:scale-95"
            >
              <span>{loading ? "Generating Tracking Code & Submitting..." : "Submit Manuscript Now"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
