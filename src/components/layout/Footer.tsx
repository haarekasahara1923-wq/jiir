import Link from "next/link";
import { Mail, Phone, MapPin, ExternalLink, ShieldCheck, Award } from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import { defaultFooterNav } from "@/lib/navigation";
import type { DefaultSiteSettings } from "@/lib/settings";

interface FooterProps {
  settings: DefaultSiteSettings;
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-navy-950 text-navy-100 border-t border-navy-800">
      {/* 4-Color Brand Accent Bar */}
      <div className="brand-gradient-line" />

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Column 1: Journal Profile (Spans 2 cols on lg) */}
          <div className="lg:col-span-2 space-y-4">
            <Logo logoUrl={settings.logoUrl} size="lg" className="text-white" />
            <p className="text-xs text-navy-200 leading-relaxed max-w-sm">
              {settings.tagline} — A premier multidisciplinary, peer-reviewed international
              academic journal dedicated to fostering cutting-edge cross-disciplinary research and
              scholarship across science, technology, management, and humanities.
            </p>

            <div className="pt-2 space-y-2 text-xs text-navy-300">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                <span>{settings.officeAddress}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-orange shrink-0" />
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-orange shrink-0" />
                <span>{settings.contactPhone}</span>
              </div>
            </div>

            {/* ISSN & Frequency Badges */}
            <div className="pt-3 flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded bg-navy-900 border border-navy-800 text-navy-200">
                <strong className="text-white">ISSN (Online):</strong> {settings.issnOnline}
              </span>
              <span className="px-2.5 py-1 rounded bg-navy-900 border border-navy-800 text-navy-200">
                <strong className="text-white">ISSN (Print):</strong> {settings.issnPrint}
              </span>
              <span className="px-2.5 py-1 rounded bg-navy-900 border border-navy-800 text-brand-orange">
                Monthly Publication
              </span>
            </div>
          </div>

          {/* Column 2: Authors */}
          <div>
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              For Authors
            </h3>
            <ul className="space-y-2.5 text-xs text-navy-300">
              {defaultFooterNav.authors.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline transition-colors flex items-center justify-between group"
                  >
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Policies & Ethics */}
          <div>
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              Policies & Ethics
            </h3>
            <ul className="space-y-2.5 text-xs text-navy-300">
              {defaultFooterNav.policies.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Quick Links & Connect */}
          <div>
            <h3 className="text-sm font-serif font-bold text-white uppercase tracking-wider mb-4 border-b border-navy-800 pb-2">
              Connect & CFP
            </h3>
            <ul className="space-y-2.5 text-xs text-navy-300 mb-6">
              {defaultFooterNav.connect.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="p-3 rounded-lg bg-navy-900/80 border border-navy-800 text-[11px] text-navy-300">
              <div className="flex items-center gap-1.5 font-bold text-white mb-1">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                <span>Editorial Independence</span>
              </div>
              <p className="text-[10px] text-navy-300 leading-tight">
                Peer review decisions are made exclusively on academic merit and scientific integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Open Access & Licensing Notice */}
        <div className="mt-12 pt-6 border-t border-navy-900 text-xs text-navy-300 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded bg-navy-900 flex items-center justify-center shrink-0 border border-navy-800">
              <Award className="w-5 h-5 text-brand-orange" />
            </div>
            <p className="text-[11px] max-w-2xl text-navy-300">
              <strong className="text-white">Open Access Policy:</strong> Articles published in JIIR
              are distributed under the terms of the{" "}
              <a
                href="https://creativecommons.org/licenses/by-nc/4.0/"
                target="_blank"
                rel="noreferrer"
                className="text-brand-orange hover:underline inline-flex items-center gap-0.5"
              >
                Creative Commons Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)
                <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
              </a>
              , which permits unrestricted non-commercial use, distribution, and reproduction in any medium,
              provided the original work is properly cited.
            </p>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-8 pt-4 border-t border-navy-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-navy-400">
          <p>© {currentYear} Journal of Interdisciplinary Innovation & Research (JIIR). All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">Support & Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
