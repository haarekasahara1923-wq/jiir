"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  FileText,
  Users,
  BookOpen,
  CreditCard,
  Mail,
  HelpCircle,
  Award,
  Calendar,
  Layers,
  Settings,
  ShieldCheck,
  Image as ImageIcon,
  ExternalLink,
  DollarSign,
  History,
  Menu,
  X,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";

interface NavItem {
  label: string;
  href: string;
  icon: any;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface AdminShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  children: React.ReactNode;
}

export const ADMIN_NAV_GROUPS: NavGroup[] = [
  {
    group: "Core Editorial",
    items: [
      { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
      { label: "Manuscripts Queue", href: "/admin/manuscripts", icon: FileText },
      { label: "Issues & Volumes", href: "/admin/issues", icon: BookOpen },
      { label: "Published Articles", href: "/admin/articles", icon: Award },
      { label: "Editorial Board", href: "/admin/board", icon: ShieldCheck },
    ],
  },
  {
    group: "Authors & Financials",
    items: [
      { label: "Scholars & Users", href: "/admin/scholars", icon: Users },
      { label: "Payments & Invoices", href: "/admin/payments", icon: CreditCard },
      { label: "Fee Plans & APC", href: "/admin/fee-plans", icon: DollarSign },
      { label: "Enquiries & Helpdesk", href: "/admin/enquiries", icon: Mail },
    ],
  },
  {
    group: "Content & Dissemination",
    items: [
      { label: "Public Pages & CMS", href: "/admin/pages", icon: Layers },
      { label: "Call for Papers", href: "/admin/cfp", icon: Calendar },
      { label: "Conferences", href: "/admin/conferences", icon: Calendar },
      { label: "Indexing Services", href: "/admin/indexing", icon: Award },
      { label: "FAQs Manager", href: "/admin/faqs", icon: HelpCircle },
      { label: "Media Library", href: "/admin/media", icon: ImageIcon },
    ],
  },
  {
    group: "System & Governance",
    items: [
      { label: "General Settings", href: "/admin/settings", icon: Settings },
      { label: "Audit Log & Security", href: "/admin/audit-log", icon: History },
    ],
  },
];

export function AdminShell({ user, children }: AdminShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close drawer on route change
  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const role = user.role ?? "EDITOR";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* ─────────────────────────────────────────────
          1. Top App Bar (Header) - Deep Navy
         ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-navy-950 text-white border-b border-navy-800 shadow-sm">
        <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile Hamburger & Logo */}
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 -ml-1 text-slate-200 hover:text-white hover:bg-navy-900 rounded-lg transition-colors focus:outline-none"
              aria-label="Open Admin Navigation Drawer"
            >
              <Menu className="w-6 h-6" />
            </button>

            <Logo size="sm" invertText={true} />

            <span className="hidden sm:inline-flex px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-900 text-brand-orange border border-navy-700">
              Admin Secretariat ({role})
            </span>
          </div>

          {/* Right: Actions & User Info */}
          <div className="flex items-center gap-3 text-xs shrink-0">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-800 text-slate-200 hover:text-white transition-colors border border-navy-800 font-semibold"
            >
              <span>View Public Journal</span>
              <ExternalLink className="w-3.5 h-3.5 text-brand-orange" />
            </Link>

            <div className="h-4 w-[1px] bg-navy-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-white/20">
                {user.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <div className="hidden sm:block text-left">
                <span className="font-bold text-white max-w-[130px] truncate block leading-tight text-xs">
                  {user.name}
                </span>
                <span className="text-[10px] text-slate-300 block leading-tight font-medium">
                  {role}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Color Brand Accent Strip */}
        <div className="brand-gradient-line" />
      </header>

      {/* ─────────────────────────────────────────────
          2. Main Container (Sidebar + Content Viewport)
         ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar: Pure Light Theme with high-contrast text */}
        <aside className="hidden md:block w-64 bg-white border-r border-slate-200 p-4 space-y-6 shrink-0 sticky top-[67px] h-[calc(100vh-67px)] overflow-y-auto">
          {ADMIN_NAV_GROUPS.map((group) => (
            <div key={group.group} className="space-y-1">
              <span className="px-3 text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                {group.group}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-navy-700 text-white shadow-sm font-bold"
                        : "text-slate-800 hover:bg-slate-100 hover:text-navy-950"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-brand-orange" : "text-navy-700"}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}

          {/* Quick Sign Out in desktop sidebar */}
          <div className="pt-4 border-t border-slate-200">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Secretariat</span>
            </button>
          </div>
        </aside>

        {/* Content Viewport with mobile bottom padding */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* ─────────────────────────────────────────────
          3. Android Mobile Slide-Over Navigation Drawer (Pure Light Theme)
         ───────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Sheet: Pure White Background, 100% Crisp Visibility */}
          <div className="relative w-[86vw] max-w-xs bg-white text-slate-900 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250 border-r border-slate-200">
            {/* Drawer Header: Deep Navy */}
            <div className="p-4 bg-navy-950 text-white border-b border-navy-800">
              <div className="flex items-center justify-between mb-3">
                <Logo size="sm" invertText={true} />
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-navy-900"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Profile Card */}
              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900 border border-navy-800">
                <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow">
                  {user.name?.[0]?.toUpperCase() ?? "A"}
                </div>
                <div className="overflow-hidden flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-bold text-white truncate">{user.name}</p>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse" />
                  </div>
                  <p className="text-xs text-slate-300 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-navy-800 text-[10px] font-bold text-brand-orange border border-navy-700">
                    {role}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick public journal link */}
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <Link
                href="/"
                target="_blank"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-semibold border border-slate-200 shadow-sm active:scale-95 transition-all"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-brand-orange" />
                  <span>View Public Journal Site</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Grouped Admin Modules List - 100% VISIBLE High-Contrast Labels */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
              {ADMIN_NAV_GROUPS.map((group) => (
                <div key={group.group} className="space-y-1">
                  <span className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500 block mb-1">
                    {group.group}
                  </span>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDrawerOpen(false)}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-navy-700 text-white shadow-sm font-bold"
                            : "text-slate-800 hover:bg-slate-100 active:bg-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-brand-orange" : "text-navy-700"}`} />
                          <span className={`truncate ${isActive ? "text-white" : "text-slate-800 font-semibold"}`}>
                            {item.label}
                          </span>
                        </div>
                        {isActive ? (
                          <span className="w-2 h-2 rounded-full bg-brand-orange shrink-0 ml-2" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-2" />
                        )}
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Drawer Footer with Sign Out */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 pb-safe">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 text-red-700 text-sm font-bold hover:bg-red-100 border border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out Secretariat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          4. Admin Mobile Bottom Navigation Bar (Pure Light Theme)
         ───────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe"
        aria-label="Admin mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {/* 1. Dashboard */}
          <Link
            href="/admin"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === "/admin"
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname === "/admin" ? "bg-navy-50" : ""}`}>
              <LayoutDashboard className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">Dashboard</span>
          </Link>

          {/* 2. Manuscripts */}
          <Link
            href="/admin/manuscripts"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/admin/manuscripts")
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname.startsWith("/admin/manuscripts") ? "bg-navy-50" : ""}`}>
              <FileText className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">Papers</span>
          </Link>

          {/* 3. Center Elevated FAB: Issues & Volumes */}
          <Link
            href="/admin/issues"
            className="flex flex-col items-center justify-center flex-1 -mt-5 group"
            title="Manage Issues & Volumes"
          >
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-navy-700 via-navy-800 to-brand-orange text-white flex items-center justify-center shadow-lg shadow-navy-950/25 ring-4 ring-white group-active:scale-95 transition-transform">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 mt-0.5">Issues</span>
          </Link>

          {/* 4. Payments */}
          <Link
            href="/admin/payments"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/admin/payments")
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname.startsWith("/admin/payments") ? "bg-navy-50" : ""}`}>
              <CreditCard className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">Finance</span>
          </Link>

          {/* 5. Menu (Opens Admin Navigation Drawer) */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              drawerOpen
                ? "text-brand-orange font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
            aria-label="Open all admin modules"
          >
            <div className={`p-1 rounded-full ${drawerOpen ? "bg-brand-orange/10" : ""}`}>
              <Menu className="w-5 h-5 text-slate-800" />
            </div>
            <span className="text-[11px] mt-0.5">All Tools</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
