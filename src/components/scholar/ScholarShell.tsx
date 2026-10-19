"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Upload,
  FileText,
  User,
  CreditCard,
  Award,
  LogOut,
  ChevronRight,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";

interface ScholarShellProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string;
  };
  children: React.ReactNode;
}

export const SCHOLAR_NAV_ITEMS = [
  { label: "Dashboard", href: "/scholar", icon: LayoutDashboard },
  { label: "Submit Manuscript", href: "/scholar/submit", icon: Upload },
  { label: "My Manuscripts", href: "/scholar/manuscripts", icon: FileText },
  { label: "Author Profile", href: "/scholar/profile", icon: User },
  { label: "Fee Payments", href: "/scholar/payments", icon: CreditCard },
  { label: "Certificates", href: "/scholar/certificates", icon: Award },
];

export function ScholarShell({ user, children }: ScholarShellProps) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

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

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 antialiased">
      {/* ─────────────────────────────────────────────
          1. Top App Bar - Pure Light Mode
         ───────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <button
              onClick={() => setDrawerOpen(true)}
              className="md:hidden p-2 -ml-1 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none"
              aria-label="Open author navigation drawer"
            >
              <Menu className="w-6 h-6 text-navy-900" />
            </button>

            <Logo size="sm" />

            <span className="hidden sm:inline-block px-2.5 py-0.5 rounded text-xs font-bold uppercase tracking-wider bg-navy-50 text-navy-800 border border-navy-200/60">
              Scholar Portal
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm text-slate-700 hover:text-navy-900 font-semibold"
            >
              <span>Public Journal</span>
              <ExternalLink className="w-3.5 h-3.5 text-navy-700" />
            </Link>

            <div className="h-4 w-[1px] bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                {user.name?.[0]?.toUpperCase() ?? "S"}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-sm font-bold text-slate-900 block truncate max-w-[140px] leading-tight">
                  {user.name}
                </span>
                <span className="text-xs text-slate-500 block truncate max-w-[140px] leading-tight">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="brand-gradient-line" />
      </header>

      {/* ─────────────────────────────────────────────
          2. Main Layout (Sidebar + Content Viewport)
         ───────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white border-r border-slate-200 p-4 space-y-1 shrink-0 sticky top-[67px] h-[calc(100vh-67px)] overflow-y-auto">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Author Workspace
          </div>
          {SCHOLAR_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors group ${
                  isActive
                    ? "bg-navy-700 text-white font-bold shadow-sm"
                    : "text-slate-800 hover:bg-slate-100 hover:text-navy-900"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? "text-brand-orange" : "text-navy-700"
                  }`}
                />
                <span className="flex-1">{item.label}</span>
                <ChevronRight
                  className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-slate-400 opacity-0 group-hover:opacity-100"}`}
                />
              </Link>
            );
          })}

          <div className="pt-4 mt-6 border-t border-slate-200">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Viewport with mobile bottom padding */}
        <main className="flex-1 p-3.5 sm:p-6 lg:p-8 pb-24 md:pb-8 min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* ─────────────────────────────────────────────
          3. Scholar Mobile Navigation Drawer
         ───────────────────────────────────────────── */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            onClick={() => setDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          <div className="relative w-[86vw] max-w-xs bg-white text-slate-900 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250 border-r border-slate-200">
            {/* Header: Deep Navy */}
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

              <div className="flex items-center gap-3 p-3 rounded-xl bg-navy-900 border border-navy-800">
                <div className="w-10 h-10 rounded-full bg-navy-700 text-white flex items-center justify-center font-bold text-sm shadow">
                  {user.name?.[0]?.toUpperCase() ?? "S"}
                </div>
                <div className="overflow-hidden flex-1">
                  <p className="text-sm font-bold text-white truncate">{user.name}</p>
                  <p className="text-xs text-slate-300 truncate">{user.email}</p>
                  <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-navy-800 text-[10px] font-bold text-brand-orange border border-navy-700">
                    Registered Author
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Public Link */}
            <div className="p-3 bg-slate-50 border-b border-slate-200">
              <Link
                href="/"
                target="_blank"
                onClick={() => setDrawerOpen(false)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-white text-slate-900 text-sm font-semibold border border-slate-200 shadow-sm"
              >
                <span className="flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-brand-orange" />
                  <span>Public Journal Website</span>
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Nav Links: 100% VISIBLE High-Contrast Labels */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-1">
              <span className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Author Workspace
              </span>
              {SCHOLAR_NAV_ITEMS.map((item) => {
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
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? "text-brand-orange" : "text-navy-700"}`} />
                      <span className={isActive ? "text-white" : "text-slate-800 font-semibold"}>
                        {item.label}
                      </span>
                    </div>
                    {isActive ? (
                      <span className="w-2 h-2 rounded-full bg-brand-orange" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Footer Sign out */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 pb-safe">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-red-50 text-red-700 text-sm font-bold hover:bg-red-100 border border-red-200 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          4. Scholar Mobile Bottom Navigation Bar (Pure Light Theme)
         ───────────────────────────────────────────── */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-lg border-t border-slate-200 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] pb-safe"
        aria-label="Author mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {/* 1. Dashboard */}
          <Link
            href="/scholar"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === "/scholar"
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname === "/scholar" ? "bg-navy-50" : ""}`}>
              <LayoutDashboard className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">Overview</span>
          </Link>

          {/* 2. My Manuscripts */}
          <Link
            href="/scholar/manuscripts"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/scholar/manuscripts")
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname.startsWith("/scholar/manuscripts") ? "bg-navy-50" : ""}`}>
              <FileText className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">My Papers</span>
          </Link>

          {/* 3. Center Elevated FAB: Submit Paper */}
          <Link
            href="/scholar/submit"
            className="flex flex-col items-center justify-center flex-1 -mt-5 group"
            title="Submit New Manuscript"
          >
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-navy-700 via-navy-800 to-brand-orange text-white flex items-center justify-center shadow-lg shadow-navy-950/25 ring-4 ring-white group-active:scale-95 transition-transform">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 mt-0.5">Submit</span>
          </Link>

          {/* 4. Payments */}
          <Link
            href="/scholar/payments"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/scholar/payments")
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname.startsWith("/scholar/payments") ? "bg-navy-50" : ""}`}>
              <CreditCard className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">Fees</span>
          </Link>

          {/* 5. Menu */}
          <button
            onClick={() => setDrawerOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              drawerOpen
                ? "text-brand-orange font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
            aria-label="Open author menu"
          >
            <div className={`p-1 rounded-full ${drawerOpen ? "bg-brand-orange/10" : ""}`}>
              <Menu className="w-5 h-5 text-slate-800" />
            </div>
            <span className="text-[11px] mt-0.5">Menu</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
