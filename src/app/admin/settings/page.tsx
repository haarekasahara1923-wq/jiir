"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
  Globe,
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Eye
} from "lucide-react";

export default function AdminSettingsPage() {
  // Brand & Logos
  const [logoLight, setLogoLight] = useState("/brand/logo.png");
  const [logoDark, setLogoDark] = useState("/brand/logo.png");
  const [favicon, setFavicon] = useState("/brand/favicon.ico");
  const [ogImage, setOgImage] = useState("/brand/og-image.png");

  // Journal Info
  const [journalName, setJournalName] = useState("Journal of Interdisciplinary Innovation & Research");
  const [journalNameHi, setJournalNameHi] = useState("अंतःविषय नवाचार एवं अनुसंधान जर्नल");
  const [abbreviation, setAbbreviation] = useState("JIIR");
  const [tagline, setTagline] = useState("Advancing Knowledge Across Disciplines");
  const [issnPrint, setIssnPrint] = useState("XXXX-XXXX");
  const [issnOnline, setIssnOnline] = useState("2584-XXXX");
  const [publisher, setPublisher] = useState("JIIR Academic Publications");

  // Editorial Office
  const [email, setEmail] = useState("editor@jiir.in");
  const [email2, setEmail2] = useState("info@jiir.in");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [whatsapp, setWhatsapp] = useState("+91 98765 43210");
  const [address, setAddress] = useState("JIIR Editorial Secretariat, Connaught Place, New Delhi — 110001, India");

  // Toggles
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [hindiEnabled, setHindiEnabled] = useState(true);
  const [saved, setSaved] = useState(false);

  // Helper for image upload from file input
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (val: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setter(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3500);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            General Journal Settings & Branding
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure journal logos, visual identity, ISSN registries, editorial communications, and system switches.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Logo & Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* BRAND & LOGOS SECTION */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-5">
          <div className="border-b border-border pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-foreground">
                Journal Brand Assets & Logos
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Upload or enter image URLs for headers, dark mode, browser tabs, and social cards.
              </p>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
              Visual Identity
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Primary / Light Logo */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground text-xs">
                  Primary Logo (Light Backgrounds)
                </label>
                <span className="text-[10px] text-muted-foreground">Header / Navbar</span>
              </div>

              {/* Preview Box */}
              <div className="h-20 w-full rounded-lg bg-white border border-border/80 flex items-center justify-center p-2 overflow-hidden shadow-inner relative group">
                {logoLight ? (
                  <img
                    src={logoLight}
                    alt="Light Logo Preview"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-[11px] text-muted-foreground">No Logo Selected</span>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://... or /brand/logo.png"
                  value={logoLight}
                  onChange={(e) => setLogoLight(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-[11px]"
                />

                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Logo File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setLogoLight)}
                    />
                  </label>
                  {logoLight && (
                    <button
                      type="button"
                      onClick={() => setLogoLight("")}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-muted"
                      title="Clear Logo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Dark Mode Logo */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground text-xs">
                  Dark Mode Logo (Dark Backgrounds)
                </label>
                <span className="text-[10px] text-muted-foreground">Night Mode</span>
              </div>

              {/* Preview Box (Dark Canvas) */}
              <div className="h-20 w-full rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-2 overflow-hidden shadow-inner">
                {logoDark ? (
                  <img
                    src={logoDark}
                    alt="Dark Logo Preview"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                ) : (
                  <span className="text-[11px] text-slate-500">No Logo Selected</span>
                )}
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="https://... or /brand/logo.png"
                  value={logoDark}
                  onChange={(e) => setLogoDark(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground text-[11px]"
                />

                <div className="flex items-center gap-2">
                  <label className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Dark Logo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload(e, setLogoDark)}
                    />
                  </label>
                  {logoDark && (
                    <button
                      type="button"
                      onClick={() => setLogoDark("")}
                      className="p-1.5 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-muted"
                      title="Clear Logo"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Favicon Icon */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground text-xs">
                  Favicon (.ico or 32x32 .png)
                </label>
                <span className="text-[10px] text-muted-foreground">Browser Tab Icon</span>
              </div>

              <div className="h-14 w-full rounded-lg bg-background border border-border flex items-center gap-3 p-3">
                <div className="w-8 h-8 rounded border border-border bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {favicon ? (
                    <img src={favicon} alt="Favicon" className="w-5 h-5 object-contain" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {favicon || "Default favicon.ico"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={favicon}
                  onChange={(e) => setFavicon(e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-border bg-background text-foreground text-[11px]"
                  placeholder="/favicon.ico"
                />
                <label className="cursor-pointer px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setFavicon)}
                  />
                </label>
              </div>
            </div>

            {/* Social Share / OG Image */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground text-xs">
                  Social Share Banner (Open Graph 1200x630)
                </label>
                <span className="text-[10px] text-muted-foreground">WhatsApp / Twitter Cards</span>
              </div>

              <div className="h-14 w-full rounded-lg bg-background border border-border flex items-center gap-3 p-3 overflow-hidden">
                <div className="w-12 h-8 rounded border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {ogImage ? (
                    <img src={ogImage} alt="OG Banner" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="text-[11px] text-muted-foreground truncate">
                  {ogImage || "/brand/og-image.png"}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={ogImage}
                  onChange={(e) => setOgImage(e.target.value)}
                  className="flex-1 p-2 rounded-lg border border-border bg-background text-foreground text-[11px]"
                  placeholder="/brand/og-image.png"
                />
                <label className="cursor-pointer px-3 py-2 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, setOgImage)}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Identity & Nomenclature */}
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

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Official Tagline / Motto</label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
            />
          </div>
        </div>

        {/* Contact & Secretariat */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-foreground border-b border-border pb-2">
            Editorial Secretariat & Communication
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Primary Editorial Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Secondary / Queries Email</label>
              <input
                type="email"
                value={email2}
                onChange={(e) => setEmail2(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-foreground font-medium mb-1">Office Telephone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
                required
              />
            </div>

            <div>
              <label className="block text-muted-foreground font-medium mb-1">Official WhatsApp Support</label>
              <input
                type="text"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground font-medium mb-1">Editorial Office Physical Address</label>
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

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <p className="font-semibold text-foreground text-xs">Bilingual Support (Hindi / English)</p>
              <p className="text-[11px] text-muted-foreground">
                Enable language selector switch for researchers across India.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHindiEnabled(!hindiEnabled)}
              className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                hindiEnabled ? "bg-emerald-600" : "bg-muted"
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                  hindiEnabled ? "translate-x-5" : "translate-x-0"
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
            <span>Save All Settings & Logos</span>
          </button>
        </div>
      </form>
    </div>
  );
}
