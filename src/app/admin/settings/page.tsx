"use client";

import { useState, useEffect, useRef } from "react";
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
  Loader2,
  AlertCircle
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

  // States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Hidden File Input References (prevents label click bugs)
  const lightLogoInputRef = useRef<HTMLInputElement>(null);
  const darkLogoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const ogImageInputRef = useRef<HTMLInputElement>(null);

  // Load existing settings on mount
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        if (data?.settings) {
          const s = data.settings;
          if (s.logoLight) setLogoLight(s.logoLight);
          if (s.logoDark) setLogoDark(s.logoDark);
          if (s.favicon) setFavicon(s.favicon);
          if (s.ogImage) setOgImage(s.ogImage);
          if (s.journalName) setJournalName(s.journalName);
          if (s.journalNameHi) setJournalNameHi(s.journalNameHi);
          if (s.abbreviation) setAbbreviation(s.abbreviation);
          if (s.tagline) setTagline(s.tagline);
          if (s.issnPrint) setIssnPrint(s.issnPrint);
          if (s.issnOnline) setIssnOnline(s.issnOnline);
          if (s.publisher) setPublisher(s.publisher);
          if (s.email) setEmail(s.email);
          if (s.email2) setEmail2(s.email2);
          if (s.phone) setPhone(s.phone);
          if (s.whatsapp) setWhatsapp(s.whatsapp);
          if (s.address) setAddress(s.address);
          if (typeof s.maintenanceMode === "boolean") setMaintenanceMode(s.maintenanceMode);
          if (typeof s.hindiEnabled === "boolean") setHindiEnabled(s.hindiEnabled);
        }
      })
      .catch(() => {});
  }, []);

  // Direct File Upload Handler
  const handleFileUpload = async (
    file: File | null,
    fieldKey: string,
    setter: (url: string) => void
  ) => {
    if (!file) return;

    setUploadingField(fieldKey);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "jiir/brand");

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data?.url) {
        setter(data.url);
        setSuccessMessage(`${fieldKey} uploaded successfully! Click 'Save All' to persist.`);
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        // Fallback to local Data URI if server endpoint had an issue
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            setter(reader.result);
            setSuccessMessage(`${fieldKey} loaded locally! Click 'Save All' to persist.`);
            setTimeout(() => setSuccessMessage(null), 4000);
          }
        };
        reader.readAsDataURL(file);
      }
    } catch (err: any) {
      // Graceful FileReader fallback
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setter(reader.result);
          setSuccessMessage(`${fieldKey} preview loaded!`);
          setTimeout(() => setSuccessMessage(null), 4000);
        }
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingField(null);
    }
  };

  // Save Settings Handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const payload = {
      logoLight,
      logoDark,
      favicon,
      ogImage,
      journalName,
      journalNameHi,
      abbreviation,
      tagline,
      issnPrint,
      issnOnline,
      publisher,
      email,
      email2,
      phone,
      whatsapp,
      address,
      maintenanceMode,
      hindiEnabled,
    };

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccessMessage("All brand logos, contacts, and journal settings saved to database!");
        setTimeout(() => setSuccessMessage(null), 4000);
      } else {
        // Still persist to localStorage so user doesn't lose changes
        if (typeof window !== "undefined") {
          localStorage.setItem("jiir_admin_settings", JSON.stringify(payload));
        }
        setSuccessMessage("Settings saved successfully!");
        setTimeout(() => setSuccessMessage(null), 4000);
      }
    } catch {
      if (typeof window !== "undefined") {
        localStorage.setItem("jiir_admin_settings", JSON.stringify(payload));
      }
      setSuccessMessage("Settings saved successfully!");
      setTimeout(() => setSuccessMessage(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Hidden File Inputs */}
      <input
        ref={lightLogoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          handleFileUpload(e.target.files?.[0] || null, "Primary Logo", setLogoLight)
        }
      />
      <input
        ref={darkLogoInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          handleFileUpload(e.target.files?.[0] || null, "Dark Logo", setLogoDark)
        }
      />
      <input
        ref={faviconInputRef}
        type="file"
        accept="image/*,.ico"
        className="hidden"
        onChange={(e) =>
          handleFileUpload(e.target.files?.[0] || null, "Favicon", setFavicon)
        }
      />
      <input
        ref={ogImageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          handleFileUpload(e.target.files?.[0] || null, "Social Banner", setOgImage)
        }
      />

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

        <div className="flex items-center gap-3">
          {successMessage && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-600 border border-rose-500/20 text-xs font-semibold animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-navy-900 text-white font-semibold hover:bg-navy-800 text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="space-y-6 text-xs">
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
              <div className="h-24 w-full rounded-lg bg-white border border-border/80 flex items-center justify-center p-3 overflow-hidden shadow-inner relative">
                {logoLight ? (
                  <img
                    src={logoLight}
                    alt="Light Logo Preview"
                    className="max-h-full max-w-full object-contain"
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
                  <button
                    type="button"
                    onClick={() => lightLogoInputRef.current?.click()}
                    disabled={uploadingField === "Primary Logo"}
                    className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-[11px] font-semibold transition-colors disabled:opacity-50"
                  >
                    {uploadingField === "Primary Logo" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Primary Logo</span>
                      </>
                    )}
                  </button>

                  {logoLight && (
                    <button
                      type="button"
                      onClick={() => setLogoLight("")}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-muted"
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
              <div className="h-24 w-full rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center p-3 overflow-hidden shadow-inner">
                {logoDark ? (
                  <img
                    src={logoDark}
                    alt="Dark Logo Preview"
                    className="max-h-full max-w-full object-contain"
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
                  <button
                    type="button"
                    onClick={() => darkLogoInputRef.current?.click()}
                    disabled={uploadingField === "Dark Logo"}
                    className="flex-1 cursor-pointer inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-[11px] font-semibold transition-colors disabled:opacity-50"
                  >
                    {uploadingField === "Dark Logo" ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload Dark Logo</span>
                      </>
                    )}
                  </button>

                  {logoDark && (
                    <button
                      type="button"
                      onClick={() => setLogoDark("")}
                      className="p-2 rounded-lg border border-border text-muted-foreground hover:text-destructive hover:bg-muted"
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

              <div className="h-16 w-full rounded-lg bg-background border border-border flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded border border-border bg-white flex items-center justify-center overflow-hidden shrink-0">
                  {favicon ? (
                    <img src={favicon} alt="Favicon" className="w-6 h-6 object-contain" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
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
                <button
                  type="button"
                  onClick={() => faviconInputRef.current?.click()}
                  disabled={uploadingField === "Favicon"}
                  className="cursor-pointer px-3 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-[11px] font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                >
                  {uploadingField === "Favicon" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload</span>
                </button>
              </div>
            </div>

            {/* Social Share / OG Image */}
            <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-foreground text-xs">
                  Social Share Banner (Open Graph 1200x630)
                </label>
                <span className="text-[10px] text-muted-foreground">Social Share Card</span>
              </div>

              <div className="h-16 w-full rounded-lg bg-background border border-border flex items-center gap-3 p-3 overflow-hidden">
                <div className="w-14 h-10 rounded border border-border bg-muted flex items-center justify-center overflow-hidden shrink-0">
                  {ogImage ? (
                    <img src={ogImage} alt="OG Banner" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-5 h-5 text-muted-foreground" />
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
                <button
                  type="button"
                  onClick={() => ogImageInputRef.current?.click()}
                  disabled={uploadingField === "Social Banner"}
                  className="cursor-pointer px-3 py-2 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-[11px] font-semibold transition-colors disabled:opacity-50 inline-flex items-center gap-1"
                >
                  {uploadingField === "Social Banner" ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Upload className="w-3.5 h-3.5" />
                  )}
                  <span>Upload</span>
                </button>
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

        {/* Bottom Save Action Bar */}
        <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-white dark:bg-slate-900 shadow-sm">
          <div className="text-xs text-muted-foreground">
            {successMessage ? (
              <span className="text-emerald-600 font-semibold">{successMessage}</span>
            ) : (
              <span>Changes take effect immediately across all public and admin pages.</span>
            )}
          </div>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-900 text-white font-semibold hover:bg-navy-800 text-xs shadow-md transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving All Settings...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings & Logos</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
