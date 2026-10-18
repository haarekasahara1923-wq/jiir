"use client";

import Link from "next/link";
import {
  FileText,
  Users,
  BookOpen,
  Award,
  CreditCard,
  Mail,
  ShieldCheck,
  Settings,
  Layers,
  Calendar,
  DollarSign,
  HelpCircle,
  Image as ImageIcon,
  History,
  TrendingUp,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Manuscripts in Queue",
      value: "14",
      sub: "3 awaiting initial review",
      icon: FileText,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900",
      href: "/admin/manuscripts"
    },
    {
      label: "Registered Scholars",
      value: "128",
      sub: "Active researchers & reviewers",
      icon: Users,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/40 border-purple-200 dark:border-purple-900",
      href: "/admin/scholars"
    },
    {
      label: "Issues & Volumes",
      value: "8 Issues",
      sub: "Vol. 1 & 2 published",
      icon: BookOpen,
      color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900",
      href: "/admin/issues"
    },
    {
      label: "Payments & Invoices",
      value: "₹ 1,42,500",
      sub: "Verified this quarter",
      icon: CreditCard,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900",
      href: "/admin/payments"
    },
    {
      label: "Pending Enquiries",
      value: "5",
      sub: "Author queries to resolve",
      icon: Mail,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900",
      href: "/admin/enquiries"
    },
    {
      label: "Indexing Services",
      value: "12",
      sub: "Crossref, Google Scholar, etc.",
      icon: Award,
      color: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-900",
      href: "/admin/indexing"
    }
  ];

  const quickLinks = [
    { title: "Manuscript Queue", desc: "Evaluate incoming papers & assign reviewers", href: "/admin/manuscripts", icon: FileText },
    { title: "Issues & Volumes", desc: "Create and publish forthcoming journal issues", href: "/admin/issues", icon: BookOpen },
    { title: "Published Articles", desc: "Manage catalogued papers, DOIs, and citations", href: "/admin/articles", icon: Award },
    { title: "Editorial Board", desc: "Update Editors-in-Chief, advisory panel & reviewers", href: "/admin/board", icon: ShieldCheck },
    { title: "Scholars & Users", desc: "Manage accounts, author profiles, and access", href: "/admin/scholars", icon: Users },
    { title: "Payments & Invoices", desc: "Review Razorpay receipts and generate invoices", href: "/admin/payments", icon: CreditCard },
    { title: "Fee Plans & APC", desc: "Configure publication fees (India & International)", href: "/admin/fee-plans", icon: DollarSign },
    { title: "Enquiries & Helpdesk", desc: "Respond to author and reviewer queries", href: "/admin/enquiries", icon: Mail },
    { title: "Public Pages & CMS", desc: "Edit static journal pages, guidelines, and policies", href: "/admin/pages", icon: Layers },
    { title: "Call for Papers", desc: "Manage open CFPs and submission deadlines", href: "/admin/cfp", icon: Calendar },
    { title: "Conferences", desc: "Publish national & international symposiums", href: "/admin/conferences", icon: Calendar },
    { title: "Indexing Services", desc: "Track indexing applications and verified links", href: "/admin/indexing", icon: Award },
    { title: "FAQs Manager", desc: "Update bilingual Q&A for author assistance", href: "/admin/faqs", icon: HelpCircle },
    { title: "Media Library", desc: "Manage Cloudinary assets, certificates, and PDFs", href: "/admin/media", icon: ImageIcon },
    { title: "General Settings", desc: "Update journal title, ISSN, addresses, and contacts", href: "/admin/settings", icon: Settings },
    { title: "Audit Log & Security", desc: "Review admin activities and system events", href: "/admin/audit-log", icon: History }
  ];

  return (
    <div className="space-y-8 max-w-7xl">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">
            Secretariat & Editorial Control Center
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Journal of Interdisciplinary Innovation & Research (JIIR) · High-Performance Administration
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Live & Connected
          </span>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:shadow-md hover:border-brand-navy/40 transition-all group flex items-start justify-between"
            >
              <div>
                <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5 flex items-center gap-1">
                  <span>{s.sub}</span>
                </p>
              </div>
              <div className={`p-3 rounded-xl border ${s.color} shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
            </Link>
          );
        })}
      </div>

      {/* Modules Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-serif font-bold text-foreground">
            All Admin Modules & Management Tools
          </h2>
          <span className="text-xs text-muted-foreground">16 modules active</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-border shadow-sm hover:border-brand-navy/40 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="w-9 h-9 rounded-lg bg-navy-50 dark:bg-navy-950/60 border border-border text-navy-800 dark:text-navy-200 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-foreground group-hover:text-brand-orange transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {item.desc}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between text-[11px] font-medium text-navy-600 dark:text-navy-300">
                  <span>Open Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
