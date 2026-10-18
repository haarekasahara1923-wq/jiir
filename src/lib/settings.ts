import { prisma } from "@/lib/prisma";

export interface DefaultSiteSettings {
  journalName: string;
  journalNameHi: string;
  abbreviation: string;
  tagline: string;
  mottoRing: string;
  logoUrl: string;
  issnOnline: string;
  issnPrint: string;
  publisherName: string;
  publishingFrequency: string;
  publicationLanguages: string;
  primaryDiscipline: string;
  contactEmail: string;
  supportEmail: string;
  contactPhone: string;
  officeAddress: string;
  feeTiming: "ON_SUBMISSION" | "AFTER_ACCEPTANCE";
  requireReviewerCount: number;
  plagiarismThreshold: number;
  allowScholarRegistration: boolean;
  maintenanceMode: boolean;
  facebookUrl?: string;
  twitterUrl?: string;
  linkedinUrl?: string;
  scholarGoogleUrl?: string;
  [key: string]: unknown;
}

export const defaultSettings: DefaultSiteSettings = {
  journalName: "Journal of Interdisciplinary Innovation & Research",
  journalNameHi: "अंतःविषय नवाचार एवं अनुसंधान जर्नल",
  abbreviation: "JIIR",
  tagline: "Advancing Knowledge Across Disciplines",
  mottoRing: "Educate · Innovate · Collaborate",
  logoUrl: "/brand/logo.png",
  issnOnline: "Applied / In Process",
  issnPrint: "Applied / In Process",
  publisherName: "JIIR Academic Publishing Group",
  publishingFrequency: "Monthly (12 issues / year)",
  publicationLanguages: "English & Hindi (द्विभाषी)",
  primaryDiscipline: "Multidisciplinary",
  contactEmail: "editor@jiir.in",
  supportEmail: "support@jiir.in",
  contactPhone: "+91 98765 43210",
  officeAddress: "JIIR Editorial Secretariat, New Delhi, India",
  feeTiming: "AFTER_ACCEPTANCE",
  requireReviewerCount: 2,
  plagiarismThreshold: 15,
  allowScholarRegistration: true,
  maintenanceMode: false,
};

export async function getSiteSettings(): Promise<DefaultSiteSettings> {
  try {
    const rows = await prisma.siteSetting.findMany();
    if (!rows || rows.length === 0) {
      return defaultSettings;
    }
    const result: Record<string, unknown> = { ...defaultSettings };
    for (const r of rows) {
      result[r.key] = r.value;
    }
    return result as DefaultSiteSettings;
  } catch (err) {
    // Database may not be connected or migrated yet during build
    return defaultSettings;
  }
}

export async function getSetting<T = unknown>(key: string, fallback?: T): Promise<T> {
  try {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    if (!row) return fallback as T;
    return (row.value as unknown as T) ?? (fallback as T);
  } catch {
    return fallback as T;
  }
}
