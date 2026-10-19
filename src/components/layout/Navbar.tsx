"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Upload,
  SearchCheck,
  User,
  LogOut,
  ShieldCheck,
  FileText,
  Home,
  BookOpen,
  Calendar,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Logo } from "@/components/shared/Logo";
import type { NavLinkItem } from "@/lib/navigation";
import type { DefaultSiteSettings } from "@/lib/settings";

interface NavbarProps {
  settings: DefaultSiteSettings;
  navItems: NavLinkItem[];
}

export function Navbar({ settings, navItems }: NavbarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [expandedMobileCategories, setExpandedMobileCategories] = useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileDrawerOpen(false);
      setActiveDropdown(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (mobileDrawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileDrawerOpen]);

  const toggleCategory = (id: string) => {
    setExpandedMobileCategories((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const user = session?.user;
  const isStaff =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "CHIEF_EDITOR" ||
    user?.role === "EDITOR";

  return (
    <>
      {/* ─────────────────────────────────────────────
          STICKY WRAPPER: AnnouncementTicker + Header in ONE sticky container
          Prevents overlap between ticker and navbar on desktop
         ───────────────────────────────────────────── */}
      <div
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        {/* Announcement Ticker — lives inside the sticky wrapper */}
        <div className="bg-navy-950 text-navy-100 py-1.5 border-b border-navy-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-hidden flex-1">
              <span className="inline-flex items-center gap-1 font-bold text-brand-orange uppercase text-[10px] tracking-wider px-2 py-0.5 rounded bg-brand-orange/15 shrink-0 whitespace-nowrap">
                📢 Announcement
              </span>
              <span className="truncate text-slate-300 text-xs font-medium">
                Call for Papers 2026: Submissions open — Vol. 1, Issue 1 · Multidisciplinary Innovations.
              </span>
            </div>
            <div className="hidden md:flex items-center gap-4 shrink-0 text-slate-400 text-xs">
              {settings.issnOnline && (
                <span>
                  <strong className="text-white">ISSN (Online):</strong>{" "}{settings.issnOnline}
                </span>
              )}
              {settings.contactEmail && (
                <a href={`mailto:${settings.contactEmail}`} className="hover:text-white transition-colors">
                  {settings.contactEmail}
                </a>
              )}
            </div>
          </div>
        </div>

      {/* ─────────────────────────────────────────────
          1. Top App Bar (Header) - Pure Light Theme
         ───────────────────────────────────────────── */}
      <header
        className="w-full bg-white/98 backdrop-blur-md border-b border-slate-200"
      >
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Left: Mobile Hamburger & Single Responsive Logo */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-xl text-slate-800 hover:text-navy-900 hover:bg-slate-100 active:scale-95 transition-all"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-6 h-6 text-navy-900" />
              </button>

              {/* Single Logo Component: Handles both mobile & desktop responsively */}
              <Logo logoUrl={settings.logoUrl} size="md" />
            </div>

            {/* Desktop Navigation Links — 15px for academic readability */}
            <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isActive =
                  pathname === item.href ||
                  (hasChildren &&
                    item.children?.some((c) => pathname.startsWith(c.href)));

                if (hasChildren) {
                  return (
                    <div
                      key={item.id}
                      className="relative group"
                      onMouseEnter={() => setActiveDropdown(item.id)}
                      onMouseLeave={() => setActiveDropdown(null)}
                    >
                      <button
                        className={`flex items-center gap-1.5 px-3.5 py-2 text-[15px] font-semibold rounded-lg transition-colors ${
                          isActive
                            ? "text-navy-700 bg-navy-50 font-bold"
                            : "text-slate-700 hover:text-navy-900 hover:bg-slate-100"
                        }`}
                        aria-expanded={activeDropdown === item.id}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180 text-slate-500" />
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-0 top-full w-64 pt-2 transition-all duration-150 origin-top-left ${
                          activeDropdown === item.id
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        <div className="p-2 bg-white rounded-xl shadow-xl border border-slate-200">
                          {item.children?.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              target={child.target}
                              className={`block px-3.5 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                                pathname === child.href
                                  ? "bg-navy-50 text-navy-700 font-bold"
                                  : "text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                              }`}
                            >
                              <span>{child.label}</span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    target={item.target}
                    className={`px-3.5 py-2 text-[15px] font-semibold rounded-lg transition-colors ${
                      isActive
                        ? "text-navy-700 bg-navy-50 font-bold"
                        : "text-slate-700 hover:text-navy-900 hover:bg-slate-100"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3 shrink-0">
              {/* Track Manuscript */}
              <Link
                href="/track-manuscript"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 hover:text-navy-900 hover:bg-slate-100 rounded-lg transition-colors"
                title="Track submitted manuscript by ID"
              >
                <SearchCheck className="w-4 h-4 text-navy-700" />
                <span>Track Paper</span>
              </Link>

              {/* Auth Button or User Menu */}
              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 transition-colors border border-slate-200">
                    <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-500 mr-1" />
                  </button>

                  <div className="absolute right-0 top-full w-56 pt-2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all">
                    <div className="p-2 bg-white rounded-xl shadow-xl border border-slate-200 text-slate-800">
                      <div className="px-3 py-2 border-b border-slate-200 mb-1">
                        <p className="text-sm font-bold truncate text-slate-900">{user?.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.5 rounded bg-navy-50 text-[10px] font-bold text-navy-800 border border-navy-200">
                          {user?.role}
                        </span>
                      </div>

                      {isStaff ? (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-navy-700" />
                          <span>Admin Console</span>
                        </Link>
                      ) : (
                        <Link
                          href="/scholar"
                          className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                        >
                          <User className="w-4 h-4 text-navy-700" />
                          <span>Scholar Portal</span>
                        </Link>
                      )}

                      <Link
                        href="/scholar/manuscripts"
                        className="flex items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg font-medium"
                      >
                        <FileText className="w-4 h-4 text-slate-500" />
                        <span>My Manuscripts</span>
                      </Link>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg mt-1 font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-navy-800 hover:text-navy-950 rounded-lg hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Submit Manuscript CTA Button */}
              <Link
                href="/submit-manuscript"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider text-white bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 hover:from-navy-800 hover:to-navy-950 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <Upload className="w-4 h-4 text-brand-orange" />
                <span>Submit Paper</span>
              </Link>
            </div>

            {/* Mobile Top Bar Quick Actions */}
            <div className="flex lg:hidden items-center gap-2 shrink-0">
              <Link
                href="/track-manuscript"
                className="p-2 rounded-xl text-slate-700 hover:text-navy-900 hover:bg-slate-100"
                aria-label="Track Manuscript"
                title="Track Manuscript"
              >
                <SearchCheck className="w-5 h-5 text-navy-700" />
              </Link>

              {session ? (
                <Link
                  href={isStaff ? "/admin" : "/scholar"}
                  className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center font-bold text-xs shadow-sm ring-1 ring-navy-800"
                  aria-label="Go to Dashboard"
                >
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-3 py-1.5 text-xs font-bold rounded-lg bg-navy-700 text-white shadow-sm active:scale-95"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* 4-Color Brand Accent Strip */}
        <div className="brand-gradient-line" />
      </header>
      </div>

      {/* ─────────────────────────────────────────────
          2. Android Mobile Slide-Over Navigation Drawer (Pure Light Theme)
         ───────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Sheet: Pure Crisp White Background */}
          <div className="relative w-[86vw] max-w-sm bg-white text-slate-900 h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250 border-r border-slate-200">
            {/* Drawer Header: Deep Navy with White Text */}
            <div className="p-4 bg-navy-950 text-white border-b border-navy-800">
              <div className="flex items-center justify-between mb-3">
                <Logo size="sm" invertText={true} />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-navy-900 transition-colors"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity or Guest Banner */}
              {session ? (
                <div className="p-3 rounded-xl bg-navy-900 border border-navy-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-sm shadow">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-sm font-bold text-white truncate">{user?.name}</p>
                      <p className="text-xs text-slate-300 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-navy-800 text-[10px] font-bold text-brand-orange border border-navy-700">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-navy-800 flex items-center justify-between">
                    <Link
                      href={isStaff ? "/admin" : "/scholar"}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="text-xs font-bold text-brand-orange hover:underline flex items-center gap-1"
                    >
                      <span>Open {isStaff ? "Admin Console" : "Author Workspace"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-navy-900 border border-navy-800">
                  <p className="text-sm font-bold text-white">Welcome, Scholar & Author</p>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Submit research, track review status & access issues.
                  </p>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Link
                      href="/login"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center justify-center py-2 text-xs font-bold rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/register"
                      onClick={() => setMobileDrawerOpen(false)}
                      className="flex items-center justify-center py-2 text-xs font-bold rounded-lg bg-gradient-to-r from-brand-orange to-brand-amber text-white shadow transition-transform active:scale-95"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Action Matrix (2x2) */}
            <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 border-b border-slate-200">
              <Link
                href="/submit-manuscript"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold shadow-sm active:scale-95 transition-all hover:border-brand-orange"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <span>Submit Paper</span>
              </Link>

              <Link
                href="/track-manuscript"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold shadow-sm active:scale-95 transition-all hover:border-navy-600"
              >
                <div className="w-7 h-7 rounded-lg bg-navy-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <SearchCheck className="w-3.5 h-3.5" />
                </div>
                <span>Track Status</span>
              </Link>

              <Link
                href="/current-issue"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold shadow-sm active:scale-95 transition-all hover:border-emerald-600"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span>Current Issue</span>
              </Link>

              <Link
                href="/call-for-papers"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 text-xs font-bold shadow-sm active:scale-95 transition-all hover:border-purple-600"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span>Call for Papers</span>
              </Link>
            </div>

            {/* Main Categorized Links in Drawer (14px Font, 100% Crisp Visible) */}
            <div className="flex-1 overflow-y-auto p-3.5 space-y-1">
              <span className="px-2 text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
                Journal Navigation
              </span>

              {navItems.map((item) => {
                const hasChildren = item.children && item.children.length > 0;
                const isExpanded = !!expandedMobileCategories[item.id];
                const isActive =
                  pathname === item.href ||
                  (hasChildren &&
                    item.children?.some((c) => pathname.startsWith(c.href)));

                if (hasChildren) {
                  return (
                    <div key={item.id} className="rounded-xl overflow-hidden mb-1">
                      <button
                        onClick={() => toggleCategory(item.id)}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                          isActive
                            ? "bg-navy-50 text-navy-800 font-bold"
                            : "text-slate-800 hover:bg-slate-100"
                        }`}
                      >
                        <span>{item.label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-navy-700 font-bold" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-4 pr-1 py-1 space-y-1 bg-slate-50 rounded-b-xl border-l-2 border-navy-700 ml-2">
                          {item.children?.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              onClick={() => setMobileDrawerOpen(false)}
                              className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                pathname === child.href
                                  ? "bg-navy-700 text-white font-bold shadow-sm"
                                  : "text-slate-700 hover:bg-slate-200 hover:text-slate-900"
                              }`}
                            >
                              <span>{child.label}</span>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-colors ${
                      isActive
                        ? "bg-navy-700 text-white font-bold shadow-sm"
                        : "text-slate-800 hover:bg-slate-100"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer: Pure Light Mode Info */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50 space-y-2 pb-safe">
              {session && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-red-50 text-red-700 text-sm font-bold hover:bg-red-100 border border-red-200 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}

              <p className="text-xs text-center text-slate-500 font-medium pt-1">
                ISSN (Online): {settings.issnOnline} · Educate · Innovate · Collaborate
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          3. Android Mobile Bottom Navigation Bar (Pure Light Theme)
         ───────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/98 backdrop-blur-xl border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe"
        aria-label="Public mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === "/"
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname === "/" ? "bg-navy-50" : ""}`}>
              <Home className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">Home</span>
          </Link>

          {/* 2. Issues */}
          <Link
            href="/current-issue"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/current-issue") || pathname.startsWith("/past-issues")
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                pathname.startsWith("/current-issue") || pathname.startsWith("/past-issues")
                  ? "bg-navy-50"
                  : ""
              }`}
            >
              <BookOpen className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">Issues</span>
          </Link>

          {/* 3. Center Elevated FAB: Submit Paper */}
          <Link
            href="/submit-manuscript"
            className="flex flex-col items-center justify-center flex-1 -mt-5 group"
            title="Submit Manuscript"
          >
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#0B2570] via-[#D81B60] to-[#E65100] text-white flex items-center justify-center shadow-lg shadow-navy-950/25 ring-4 ring-white group-active:scale-95 transition-transform">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <span className="text-[11px] font-bold text-slate-900 mt-0.5">Submit</span>
          </Link>

          {/* 4. Track Paper */}
          <Link
            href="/track-manuscript"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/track-manuscript")
                ? "text-navy-700 font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname.startsWith("/track-manuscript") ? "bg-navy-50" : ""}`}>
              <SearchCheck className="w-5 h-5 text-navy-800" />
            </div>
            <span className="text-[11px] mt-0.5">Track</span>
          </Link>

          {/* 5. Menu (Opens Drawer) */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              mobileDrawerOpen
                ? "text-brand-orange font-bold scale-105"
                : "text-slate-600 hover:text-navy-900"
            }`}
            aria-label="Open mobile navigation drawer"
          >
            <div className={`p-1 rounded-full ${mobileDrawerOpen ? "bg-brand-orange/10" : ""}`}>
              <Menu className="w-5 h-5 text-slate-800" />
            </div>
            <span className="text-[11px] mt-0.5">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
