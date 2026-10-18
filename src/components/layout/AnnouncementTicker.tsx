"use client";

import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Bell, Moon, Sun, Mail, Phone, Calendar, ChevronRight } from "lucide-react";
import type { DefaultSiteSettings } from "@/lib/settings";

interface AnnouncementTickerProps {
  settings: DefaultSiteSettings;
  announcements?: Array<{ id: string; title: string; link?: string | null }>;
}

export function AnnouncementTicker({
  settings,
  announcements = [],
}: AnnouncementTickerProps) {
  const { theme, setTheme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const displayAnnouncements =
    announcements.length > 0
      ? announcements
      : [
          {
            id: "default-1",
            title: "📢 Call for Papers 2026: Submissions are open for Vol. 1, Issue 1 — Multidisciplinary Innovations.",
            link: "/call-for-papers",
          },
        ];

  const current = displayAnnouncements[currentIndex] || displayAnnouncements[0];

  return (
    <div className="bg-navy-950 text-navy-100 text-xs py-1.5 px-4 sm:px-6 lg:px-8 border-b border-navy-800/80">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Announcements & CFP */}
        <div className="flex items-center gap-2 overflow-hidden w-full md:w-auto">
          <span className="inline-flex items-center gap-1 font-semibold text-brand-orange uppercase text-[10px] tracking-wider px-1.5 py-0.5 rounded bg-brand-orange/10 shrink-0">
            <Bell className="w-3 h-3 animate-pulse" />
            Announcement
          </span>
          <div className="truncate text-navy-200 hover:text-white transition-colors">
            {current.link ? (
              <Link href={current.link} className="hover:underline flex items-center gap-1">
                <span>{current.title}</span>
                <ChevronRight className="w-3 h-3 inline shrink-0" />
              </Link>
            ) : (
              <span>{current.title}</span>
            )}
          </div>
        </div>

        {/* Right: ISSN, Contact, Theme Toggle */}
        <div className="hidden md:flex items-center gap-4 shrink-0 text-navy-300">
          <div className="flex items-center gap-3">
            <span className="text-[11px]">
              <strong className="text-white">ISSN (Online):</strong> {settings.issnOnline}
            </span>
            <span className="text-navy-600">•</span>
            <span className="text-[11px]">
              <strong className="text-white">ISSN (Print):</strong> {settings.issnPrint}
            </span>
          </div>

          <div className="h-3 w-[1px] bg-navy-800" />

          <a
            href={`mailto:${settings.contactEmail}`}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <Mail className="w-3 h-3 text-navy-400" />
            <span>{settings.contactEmail}</span>
          </a>

          <div className="h-3 w-[1px] bg-navy-800" />

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="p-1 rounded hover:bg-navy-800 text-navy-300 hover:text-white transition-colors"
          >
            {theme === "dark" ? (
              <Sun className="w-3.5 h-3.5 text-amber-400" />
            ) : (
              <Moon className="w-3.5 h-3.5 text-navy-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
