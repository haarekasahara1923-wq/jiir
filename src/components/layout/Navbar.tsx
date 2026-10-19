"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
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
  Sun,
  Moon,
  Sparkles,
  Calendar,
  HelpCircle,
  CreditCard,
  ExternalLink,
  Plus,
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
  const { theme, setTheme } = useTheme();
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
          1. Top App Bar (Header)
         ───────────────────────────────────────────── */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="container mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile: Hamburger Button + Logo */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="lg:hidden p-2 -ml-1 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted active:scale-95 transition-all"
                aria-label="Open Navigation Drawer"
              >
                <Menu className="w-6 h-6 text-navy-800 dark:text-navy-200" />
              </button>

              <Logo logoUrl={settings.logoUrl} size="sm" className="lg:hidden" />
              <Logo logoUrl={settings.logoUrl} size="md" className="hidden lg:inline-flex" />
            </div>

            {/* Desktop Navigation Links */}
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
                        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                          isActive
                            ? "text-primary dark:text-primary font-semibold"
                            : "text-foreground/80 hover:text-foreground hover:bg-muted"
                        }`}
                        aria-expanded={activeDropdown === item.id}
                      >
                        <span>{item.label}</span>
                        <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                      </button>

                      {/* Dropdown Menu */}
                      <div
                        className={`absolute left-0 top-full w-64 pt-2 transition-all duration-150 origin-top-left ${
                          activeDropdown === item.id
                            ? "opacity-100 scale-100 pointer-events-auto"
                            : "opacity-0 scale-95 pointer-events-none"
                        }`}
                      >
                        <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-border">
                          {item.children?.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              target={child.target}
                              className={`block px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                                pathname === child.href
                                  ? "bg-navy-50 dark:bg-navy-900/40 text-primary font-semibold"
                                  : "text-foreground/80 hover:bg-muted hover:text-foreground"
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
                    className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                      isActive
                        ? "text-primary dark:text-primary font-semibold"
                        : "text-foreground/80 hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden lg:flex items-center space-x-3">
              {/* Track Manuscript */}
              <Link
                href="/track-manuscript"
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-foreground/80 hover:text-foreground hover:bg-muted rounded-md transition-colors"
                title="Track submitted manuscript by ID"
              >
                <SearchCheck className="w-4 h-4 text-navy-600" />
                <span>Track</span>
              </Link>

              {/* Theme Switcher Button */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-lg text-foreground/70 hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Toggle color theme"
                title="Toggle Theme"
              >
                {theme === "dark" ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-navy-600" />}
              </button>

              {/* Auth Button or User Menu */}
              {session ? (
                <div className="relative group">
                  <button className="flex items-center gap-2 p-1.5 rounded-full hover:bg-muted transition-colors border border-border">
                    <div className="w-8 h-8 rounded-full bg-navy-600 text-white flex items-center justify-center font-bold text-xs">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-muted-foreground mr-1" />
                  </button>

                  <div className="absolute right-0 top-full w-56 pt-2 opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 group-hover:pointer-events-auto transition-all">
                    <div className="p-2 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-border">
                      <div className="px-3 py-2 border-b border-border mb-1">
                        <p className="text-xs font-bold truncate text-foreground">{user?.name}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{user?.email}</p>
                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded bg-navy-100 dark:bg-navy-900/50 text-[10px] font-semibold text-navy-700 dark:text-navy-300">
                          {user?.role}
                        </span>
                      </div>

                      {isStaff ? (
                        <Link
                          href="/admin"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-foreground/80 hover:bg-muted rounded-lg"
                        >
                          <ShieldCheck className="w-4 h-4 text-primary" />
                          <span>Admin Dashboard</span>
                        </Link>
                      ) : (
                        <Link
                          href="/scholar"
                          className="flex items-center gap-2 px-3 py-2 text-xs text-foreground/80 hover:bg-muted rounded-lg"
                        >
                          <User className="w-4 h-4 text-primary" />
                          <span>Scholar Portal</span>
                        </Link>
                      )}

                      <Link
                        href="/scholar/manuscripts"
                        className="flex items-center gap-2 px-3 py-2 text-xs text-foreground/80 hover:bg-muted rounded-lg"
                      >
                        <FileText className="w-4 h-4 text-muted-foreground" />
                        <span>My Manuscripts</span>
                      </Link>

                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs text-destructive hover:bg-destructive/10 rounded-lg mt-1"
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
                  className="px-3.5 py-2 text-xs font-semibold text-navy-700 dark:text-navy-300 hover:text-navy-900 rounded-md transition-colors"
                >
                  Sign In
                </Link>
              )}

              {/* Submit Manuscript CTA Button */}
              <Link
                href="/submit-manuscript"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-navy-700 via-navy-800 to-navy-900 hover:from-navy-800 hover:to-navy-950 shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <Upload className="w-4 h-4 text-brand-orange" />
                <span>Submit Paper</span>
              </Link>
            </div>

            {/* Mobile Top Bar Quick Icons */}
            <div className="flex lg:hidden items-center gap-1.5">
              {/* Quick Track Icon */}
              <Link
                href="/track-manuscript"
                className="p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted"
                aria-label="Track Manuscript"
                title="Track Manuscript"
              >
                <SearchCheck className="w-5 h-5 text-navy-600 dark:text-blue-400" />
              </Link>

              {/* Theme Toggle Icon */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-xl text-foreground/70 hover:text-foreground hover:bg-muted"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-navy-700" />}
              </button>

              {/* User Avatar or Login Icon */}
              {session ? (
                <Link
                  href={isStaff ? "/admin" : "/scholar"}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-navy-700 to-brand-orange text-white flex items-center justify-center font-bold text-xs shadow-sm ring-2 ring-background"
                  aria-label="Go to Dashboard"
                >
                  {user?.name?.[0]?.toUpperCase() ?? "U"}
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-navy-50 dark:bg-navy-950 text-navy-800 dark:text-navy-200 border border-navy-200/50"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Brand 4-Color Accent Strip */}
        <div className="brand-gradient-line" />
      </header>

      {/* ─────────────────────────────────────────────
          2. Android Mobile Slide-Over Navigation Drawer
         ───────────────────────────────────────────── */}
      {mobileDrawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop Overlay */}
          <div
            onClick={() => setMobileDrawerOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200"
          />

          {/* Drawer Sheet */}
          <div className="relative w-[86vw] max-w-sm bg-white dark:bg-slate-900 text-foreground h-full flex flex-col shadow-2xl z-10 animate-in slide-in-from-left duration-250">
            {/* Drawer Header */}
            <div className="p-4 bg-navy-950 text-white border-b border-navy-800">
              <div className="flex items-center justify-between mb-3">
                <Logo size="sm" className="text-white" />
                <button
                  onClick={() => setMobileDrawerOpen(false)}
                  className="p-1.5 text-navy-300 hover:text-white rounded-lg hover:bg-navy-900"
                  aria-label="Close drawer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* User Identity or Guest Banner */}
              {session ? (
                <div className="p-3 rounded-xl bg-navy-900/90 border border-navy-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-orange to-brand-amber text-white flex items-center justify-center font-bold text-sm shadow">
                      {user?.name?.[0]?.toUpperCase() ?? "U"}
                    </div>
                    <div className="overflow-hidden flex-1">
                      <p className="text-xs font-bold text-white truncate">{user?.name}</p>
                      <p className="text-[10px] text-navy-300 truncate">{user?.email}</p>
                      <span className="inline-block mt-0.5 px-1.5 py-0.2 rounded bg-navy-800 text-[9px] font-bold text-brand-orange">
                        {user?.role}
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-navy-800/80 flex items-center justify-between">
                    <Link
                      href={isStaff ? "/admin" : "/scholar"}
                      onClick={() => setMobileDrawerOpen(false)}
                      className="text-xs font-bold text-white hover:text-brand-orange transition-colors flex items-center gap-1"
                    >
                      <span>Open {isStaff ? "Admin Console" : "Author Workspace"}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-navy-900/90 border border-navy-800">
                  <p className="text-xs font-bold text-white">Welcome, Scholar & Researcher</p>
                  <p className="text-[10px] text-navy-300 mt-0.5">
                    Submit papers, track peer reviews & access academic issues.
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
            <div className="grid grid-cols-2 gap-2 p-3 bg-muted/30 border-b border-border">
              <Link
                href="/submit-manuscript"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-gradient-to-tr from-brand-orange/15 to-brand-amber/10 border border-brand-orange/30 text-foreground text-xs font-bold active:scale-95 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-brand-orange text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Upload className="w-3.5 h-3.5" />
                </div>
                <span>Submit Paper</span>
              </Link>

              <Link
                href="/track-manuscript"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-navy-50 dark:bg-navy-950/60 border border-navy-200/50 text-foreground text-xs font-bold active:scale-95 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-navy-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <SearchCheck className="w-3.5 h-3.5" />
                </div>
                <span>Track Status</span>
              </Link>

              <Link
                href="/current-issue"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 text-foreground text-xs font-bold active:scale-95 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <BookOpen className="w-3.5 h-3.5" />
                </div>
                <span>Current Issue</span>
              </Link>

              <Link
                href="/call-for-papers"
                onClick={() => setMobileDrawerOpen(false)}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200/50 text-foreground text-xs font-bold active:scale-95 transition-all"
              >
                <div className="w-7 h-7 rounded-lg bg-purple-700 text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Calendar className="w-3.5 h-3.5" />
                </div>
                <span>Call for Papers</span>
              </Link>
            </div>

            {/* Main Categorized Links in Drawer */}
            <div className="flex-1 overflow-y-auto p-4 space-y-1">
              <span className="px-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
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
                        className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                          isActive
                            ? "bg-navy-50 dark:bg-navy-950 text-navy-800 dark:text-navy-200 font-bold"
                            : "text-foreground/80 hover:bg-muted"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{item.label}</span>
                        </span>
                        <ChevronDown
                          className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                            isExpanded ? "rotate-180 text-primary" : ""
                          }`}
                        />
                      </button>

                      {isExpanded && (
                        <div className="pl-4 pr-1 py-1 space-y-1 bg-muted/20 rounded-b-xl">
                          {item.children?.map((child) => (
                            <Link
                              key={child.id}
                              href={child.href}
                              onClick={() => setMobileDrawerOpen(false)}
                              className={`flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors ${
                                pathname === child.href
                                  ? "bg-navy-600 text-white font-bold"
                                  : "text-foreground/75 hover:bg-muted hover:text-foreground"
                              }`}
                            >
                              <span>{child.label}</span>
                              <ChevronRight className="w-3 h-3 text-muted-foreground/60" />
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
                    className={`flex items-center justify-between px-3 py-2.5 text-xs font-semibold rounded-xl transition-colors ${
                      isActive
                        ? "bg-navy-600 text-white font-bold"
                        : "text-foreground/80 hover:bg-muted"
                    }`}
                  >
                    <span>{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-brand-orange" />}
                  </Link>
                );
              })}
            </div>

            {/* Drawer Footer */}
            <div className="p-3 border-t border-border bg-background space-y-2 pb-safe">
              <div className="flex items-center justify-between px-2 py-1">
                <span className="text-xs text-muted-foreground font-medium">Dark Mode</span>
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold hover:bg-muted transition-colors"
                >
                  {theme === "dark" ? (
                    <>
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Light Theme</span>
                    </>
                  ) : (
                    <>
                      <Moon className="w-3.5 h-3.5 text-navy-700" />
                      <span>Dark Theme</span>
                    </>
                  )}
                </button>
              </div>

              {session && (
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-destructive/10 text-destructive text-xs font-bold hover:bg-destructive/20 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}

              <p className="text-[10px] text-center text-muted-foreground pt-1">
                ISSN (Online): {settings.issnOnline} · JIIR Editorial
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────
          3. Android Mobile Bottom Navigation Bar
         ───────────────────────────────────────────── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.08)] pb-safe"
        aria-label="Public mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-1">
          {/* 1. Home */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname === "/"
                ? "text-navy-600 dark:text-blue-400 font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname === "/" ? "bg-navy-100 dark:bg-navy-950/70" : ""}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Home</span>
          </Link>

          {/* 2. Issues */}
          <Link
            href="/current-issue"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/current-issue") || pathname.startsWith("/past-issues")
                ? "text-navy-600 dark:text-blue-400 font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div
              className={`p-1 rounded-full ${
                pathname.startsWith("/current-issue") || pathname.startsWith("/past-issues")
                  ? "bg-navy-100 dark:bg-navy-950/70"
                  : ""
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Issues</span>
          </Link>

          {/* 3. Center Elevated FAB: Submit Paper */}
          <Link
            href="/submit-manuscript"
            className="flex flex-col items-center justify-center flex-1 -mt-5 group"
            title="Submit Manuscript"
          >
            <div className="w-13 h-13 rounded-full bg-gradient-to-tr from-[#0B2570] via-[#D81B60] to-[#E65100] text-white flex items-center justify-center shadow-lg shadow-navy-900/35 ring-4 ring-background group-active:scale-95 transition-transform">
              <Upload className="w-6 h-6 text-white" />
            </div>
            <span className="text-[10px] font-bold text-foreground mt-0.5">Submit</span>
          </Link>

          {/* 4. Track Paper */}
          <Link
            href="/track-manuscript"
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              pathname.startsWith("/track-manuscript")
                ? "text-navy-600 dark:text-blue-400 font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className={`p-1 rounded-full ${pathname.startsWith("/track-manuscript") ? "bg-navy-100 dark:bg-navy-950/70" : ""}`}>
              <SearchCheck className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Track</span>
          </Link>

          {/* 5. Menu (Opens Drawer) */}
          <button
            onClick={() => setMobileDrawerOpen(true)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              mobileDrawerOpen
                ? "text-brand-orange font-bold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
            aria-label="Open mobile navigation drawer"
          >
            <div className={`p-1 rounded-full ${mobileDrawerOpen ? "bg-brand-orange/10" : ""}`}>
              <Menu className="w-5 h-5" />
            </div>
            <span className="text-[10px] mt-0.5">Menu</span>
          </button>
        </div>
      </nav>
    </>
  );
}
