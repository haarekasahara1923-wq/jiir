"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Clock, ShieldCheck, Building } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    affiliation: "",
    category: "General",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit enquiry");

      setSubmitted(data.trackingId || "ENQ-2026-0001");
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Official Editorial Secretariat
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
          Contact Editorial Office
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Get in touch with the editorial team of the Journal of Interdisciplinary Innovation & Research.
          Our academic secretariat responds to all enquiries within 24–48 business hours.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Contact Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-5">
            <h2 className="text-lg font-serif font-bold text-foreground border-b border-border pb-2">
              Secretariat Desks
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-foreground">Editor-in-Chief & Editorial Office</strong>
                  <a href="mailto:editor@jiir.in" className="text-primary hover:underline">
                    editor@jiir.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-foreground">Manuscript Submissions & Review Desk</strong>
                  <a href="mailto:submissions@jiir.in" className="text-primary hover:underline">
                    submissions@jiir.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-foreground">Technical Support & Certificates</strong>
                  <a href="mailto:support@jiir.in" className="text-primary hover:underline">
                    support@jiir.in
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-foreground">Telephone Support</strong>
                  <span className="text-muted-foreground">+91 98765 43210 (Mon–Fri, 9:30 AM – 6:00 PM IST)</span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-foreground">Registered Secretariat Address</strong>
                  <span className="text-muted-foreground">JIIR Editorial Secretariat, Connaught Place, New Delhi 110001, India</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-navy-50/70 dark:bg-navy-950/40 border border-navy-100 dark:border-navy-900 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-navy-800 dark:text-navy-200">
              <Clock className="w-4 h-4 text-brand-orange" />
              <span>Response Time Commitment</span>
            </div>
            <p className="text-muted-foreground leading-relaxed text-[11px]">
              Authors with an assigned manuscript ID should include their tracking number in the subject line
              for priority routing to the responsible Associate Editor.
            </p>
          </div>
        </div>

        {/* Form (7 cols) */}
        <div className="lg:col-span-7">
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-foreground">
                  Enquiry Submitted Successfully
                </h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Your enquiry has been logged in our editorial registry. Our secretariat team will review and reply within 24–48 business hours.
                </p>
                <div className="p-3 rounded-lg bg-muted text-xs font-mono font-bold text-primary inline-block">
                  Tracking Reference: {submitted}
                </div>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(null);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        affiliation: "",
                        category: "General",
                        subject: "",
                        message: "",
                      });
                    }}
                    className="px-4 py-2 rounded-lg bg-navy-700 text-white text-xs font-semibold hover:bg-navy-800 transition-colors"
                  >
                    Submit Another Query
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-serif font-bold text-foreground border-b border-border pb-2">
                  Send an Academic Enquiry
                </h2>

                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Full Name *</label>
                    <input
                      required
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Dr. / Prof. / Scholar"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="scholar@university.edu"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 / Country code"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-foreground">Institutional Affiliation</label>
                    <input
                      type="text"
                      value={formData.affiliation}
                      onChange={(e) => setFormData({ ...formData, affiliation: e.target.value })}
                      placeholder="University / Institute name"
                      className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Enquiry Nature / Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="General">General Editorial Inquiry</option>
                    <option value="Submission">Manuscript Submission Inquiry</option>
                    <option value="Editorial Board Application">Editorial / Reviewer Board Application</option>
                    <option value="Payment & Fee Waiver">APC / Fee Waiver Inquiry</option>
                    <option value="Conference Collaboration">Conference Proceedings Partnership</option>
                    <option value="Plagiarism & Ethics">Plagiarism / Ethical Clarification</option>
                    <option value="Certificate Verification">Certificate Verification</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Subject *</label>
                  <input
                    required
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of your query (or Manuscript ID)"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Message Details *</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your inquiry in detail..."
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    disabled={loading}
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    <span>{loading ? "Submitting..." : "Send Message to Secretariat"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
