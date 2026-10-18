"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  X,
  ChevronDown,
  Search,
  Upload,
  SearchCheck,
  User,
  LogOut,
  ShieldCheck,
  FileText,
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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false);
      setActiveDropdown(null);
    }, 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  const user = session?.user;
  const isStaff =
    user?.role === "SUPER_ADMIN" ||
    user?.role === "CHIEF_EDITOR" ||
    user?.role === "EDITOR";

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-200 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-border ${
        scrolled ? "shadow-md" : ""
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Logo logoUrl={settings.logoUrl} size="md" />

          {/* Desktop Navigation */}
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

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <Link
              href="/submit-manuscript"
              className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-lg text-white bg-navy-700"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Submit</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md hover:bg-muted text-foreground"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Brand 4-Color Accent Strip */}
      <div className="brand-gradient-line" />

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3 animate-in slide-in-from-top-4 duration-200">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              return (
                <div key={item.id} className="border-b border-border/50 pb-1">
                  <div className="flex items-center justify-between py-2">
                    <Link
                      href={item.href}
                      className="text-sm font-semibold text-foreground hover:text-primary"
                    >
                      {item.label}
                    </Link>
                  </div>
                  {hasChildren && (
                    <div className="pl-4 space-y-1 mb-2">
                      {item.children?.map((child) => (
                        <Link
                          key={child.id}
                          href={child.href}
                          className="block py-1.5 text-xs text-muted-foreground hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="pt-4 space-y-2 border-t border-border">
            <Link
              href="/track-manuscript"
              className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-semibold rounded-lg border border-border hover:bg-muted"
            >
              <SearchCheck className="w-4 h-4 text-navy-600" />
              <span>Track Submitted Manuscript</span>
            </Link>
            {session ? (
              <Link
                href={isStaff ? "/admin" : "/scholar"}
                className="flex items-center justify-center gap-2 w-full py-2.5 text-xs font-bold text-white bg-navy-700 rounded-lg"
              >
                <User className="w-4 h-4" />
                <span>Go to Dashboard ({user?.name})</span>
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  className="flex items-center justify-center py-2.5 text-xs font-semibold border border-border rounded-lg hover:bg-muted"
                >
                  Scholar Login
                </Link>
                <Link
                  href="/register"
                  className="flex items-center justify-center py-2.5 text-xs font-bold text-white bg-navy-700 rounded-lg hover:bg-navy-800"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
