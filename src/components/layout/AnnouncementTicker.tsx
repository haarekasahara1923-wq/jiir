"use client";

import { useState } from "react";
import Link from "next/link";
import { Bell, Mail, ChevronRight } from "lucide-react";
import type { DefaultSiteSettings } from "@/lib/settings";

interface AnnouncementTickerProps {
  settings: DefaultSiteSettings;
  announcements?: Array<{ id: string; title: string; link?: string | null }>;
}

export function AnnouncementTicker({
  settings,
  announcements = [],
}: AnnouncementTickerProps) {
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
    <div className="bg-navy-950 text-navy-100 text-xs py-1.5 px-3 sm:px-6 lg:px-8 border-b border-navy-800">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Left: Announcements & CFP */}
        <div className="flex items-center gap-2 overflow-hidden w-full md:w-auto">
          <span className="inline-flex items-center gap-1 font-bold text-brand-orange uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-brand-orange/15 shrink-0">
            <Bell className="w-3 h-3 animate-pulse" />
            Announcement
          </span>
          <div className="truncate text-slate-200 hover:text-white transition-colors text-xs font-medium">
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

        {/* Right: ISSN & Contact */}
        <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-300 text-xs">
          <div className="flex items-center gap-3">
            <span className="text-xs">
              <strong className="text-white">ISSN (Online):</strong> {settings.issnOnline}
            </span>
            <span className="text-navy-600">•</span>
            <span className="text-xs">
              <strong className="text-white">ISSN (Print):</strong> {settings.issnPrint}
            </span>
          </div>

          <div className="h-3 w-[1px] bg-navy-800" />

          <a
            href={`mailto:${settings.contactEmail}`}
            className="flex items-center gap-1.5 hover:text-white transition-colors text-xs"
          >
            <Mail className="w-3.5 h-3.5 text-brand-orange" />
            <span>{settings.contactEmail}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
