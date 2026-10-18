"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { User, Mail, Globe, Award, ExternalLink, Save, CheckCircle2, AlertCircle, Upload } from "lucide-react";
import { FileUpload } from "@/components/shared/FileUpload";

export default function ScholarProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    designation: "",
    department: "",
    institution: "",
    city: "",
    country: "India",
    contactNo: "",
    bio: "",
    orcid: "",
    googleScholarUrl: "",
    researchGateUrl: "",
    linkedinUrl: "",
    websiteUrl: "",
    photoUrl: "",
  });

  useEffect(() => {
    fetch("/api/scholar/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData({
            fullName: data.fullName || "",
            designation: data.designation || "",
            department: data.department || "",
            institution: data.institution || "",
            city: data.city || "",
            country: data.country || "India",
            contactNo: data.contactNo || "",
            bio: data.bio || "",
            orcid: data.orcid || "",
            googleScholarUrl: data.googleScholarUrl || "",
            researchGateUrl: data.researchGateUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            websiteUrl: data.websiteUrl || "",
            photoUrl: data.photoUrl || "",
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setError(null);

    // Validate ORCID if entered
    if (formData.orcid && !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(formData.orcid.trim())) {
      setError("Invalid ORCID format. Standard format: 0000-0000-0000-0000");
      setSaving(false);
      return;
    }

    try {
      const res = await fetch("/api/scholar/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to save profile changes");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-xs text-muted-foreground">Loading author profile...</div>;
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div className="border-b border-border pb-4 space-y-1">
        <h1 className="text-2xl font-serif font-bold text-foreground">
          Scholar & Author Profile
        </h1>
        <p className="text-xs text-muted-foreground">
          Manage your academic credentials, affiliations, ORCID iD, and researcher discovery links.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Profile successfully updated. Changes will reflect on all future submissions.</span>
          </div>
        )}

        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        {/* 1. Basic Details & Photo */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
          <h2 className="text-sm font-serif font-bold text-foreground border-b border-border pb-2">
            Personal & Academic Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
            {/* Avatar */}
            <div className="sm:col-span-3 text-center space-y-2">
              <div className="w-24 h-24 rounded-2xl bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-navy-200 flex items-center justify-center font-bold text-2xl mx-auto overflow-hidden border border-border">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt={formData.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  formData.fullName?.[0]?.toUpperCase() ?? "A"
                )}
              </div>
              <span className="text-[10px] text-muted-foreground block">Author Photo</span>
            </div>

            <div className="sm:col-span-9 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Full Name *</label>
                  <input
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Designation / Academic Title</label>
                  <input
                    type="text"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    placeholder="e.g. Associate Professor / Research Scholar"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Department</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="e.g. Department of Computer Science"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Institution / University</label>
                  <input
                    type="text"
                    value={formData.institution}
                    onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                    placeholder="e.g. Delhi University"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-foreground">Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 2. ORCID & Research Identifiers */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
          <h2 className="text-sm font-serif font-bold text-foreground border-b border-border pb-2">
            ORCID & Academic Discovery Links
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <span>ORCID iD</span>
              <span className="text-[10px] text-muted-foreground font-normal">(format: 0000-0000-0000-0000)</span>
            </label>
            <input
              type="text"
              value={formData.orcid}
              onChange={(e) => setFormData({ ...formData, orcid: e.target.value })}
              placeholder="0000-0002-1825-0097"
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-input bg-background"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Google Scholar Profile URL</label>
              <input
                type="url"
                value={formData.googleScholarUrl}
                onChange={(e) => setFormData({ ...formData, googleScholarUrl: e.target.value })}
                placeholder="https://scholar.google.com/citations?user=..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">ResearchGate Profile URL</label>
              <input
                type="url"
                value={formData.researchGateUrl}
                onChange={(e) => setFormData({ ...formData, researchGateUrl: e.target.value })}
                placeholder="https://www.researchgate.net/profile/..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">LinkedIn Profile</label>
              <input
                type="url"
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">Personal / Institutional Website</label>
              <input
                type="url"
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://faculty.university.edu/~scholar"
                className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
              />
            </div>
          </div>
        </div>

        {/* 3. Research Bio */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
          <h2 className="text-sm font-serif font-bold text-foreground border-b border-border pb-2">
            Academic Biography & Research Focus
          </h2>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-foreground">Short Bio & Specialties</label>
            <textarea
              rows={4}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Outline your research focus, methodology expertise, and ongoing projects..."
              className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            disabled={saving}
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving Changes..." : "Save Profile"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
