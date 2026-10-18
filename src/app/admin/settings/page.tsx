"use client";

import { useState } from "react";
import { Settings, Save, CheckCircle2, ShieldCheck, Mail, Phone, MapPin, Globe } from "lucide-react";

export default function AdminSettingsPage() {
  const [journalName, setJournalName] = useState("Journal of Interdisciplinary Innovation & Research");
  const [journalNameHi, setJournalNameHi] = useState("अंतःविषय नवाचार एवं अनुसंधान जर्नल");
  const [abbreviation, setAbbreviation] = useState("JIIR");
  const [issnPrint, setIssnPrint] = useState("XXXX-XXXX");
  const [issnOnline, setIssnOnline] = useState("2584-XXXX");
  const [publisher, setPublisher] = useState("JIIR Academic Publications");
  const [email, setEmail] = useState("editor@jiir.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [address, setAddress] = useState("JIIR Editorial Secretariat, Connaught Place, New Delhi — 110001, India");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            General Journal Settings & Metadata
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure core identity, ISSN registries, editorial communications, and system maintenance switches.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Identity */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
            Journal Identity & Nomenclature
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Journal Full Name (English)</label>
              <input
                type="text"
                value={journalName}
                onChange={(e) => setJournalName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Journal Full Name (Hindi)</label>
              <input
                type="text"
                value={journalNameHi}
                onChange={(e) => setJournalNameHi(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Abbreviation / Acronym</label>
              <input
                type="text"
                value={abbreviation}
                onChange={(e) => setAbbreviation(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">ISSN (Online)</label>
              <input
                type="text"
                value={issnOnline}
                onChange={(e) => setIssnOnline(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground font-mono"
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">ISSN (Print)</label>
              <input
                type="text"
                value={issnPrint}
                onChange={(e) => setIssnPrint(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground font-mono"
              />
            </div>
          </div>
        </div>

        {/* Contact & Secretariat */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
            Editorial Secretariat & Communication
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Official Editorial Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Office Telephone / WhatsApp</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Office Physical Address</label>
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground h-18"
              required
            />
          </div>
        </div>

        {/* System & Maintenance */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
            System & Maintenance Toggles
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-foreground text-xs">Maintenance Mode</p>
              <p className="text-[11px] text-muted-foreground">
                Temporarily pause public manuscript submissions while database updates occur.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setMaintenanceMode(!maintenanceMode)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                maintenanceMode ? "bg-rose-600" : "bg-muted"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  maintenanceMode ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-900 text-white font-semibold hover:bg-navy-800 text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save All Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
}
