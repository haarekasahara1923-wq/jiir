import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/shared/Logo";
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
} from "lucide-react";

export default async function ScholarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/scholar");
  }

  const user = session.user;

  const navLinks = [
    { label: "Dashboard", href: "/scholar", icon: LayoutDashboard },
    { label: "Submit Manuscript", href: "/scholar/submit", icon: Upload },
    { label: "My Manuscripts", href: "/scholar/manuscripts", icon: FileText },
    { label: "Author Profile", href: "/scholar/profile", icon: User },
    { label: "Fee Payments", href: "/scholar/payments", icon: CreditCard },
    { label: "Certificates", href: "/scholar/certificates", icon: Award },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-white dark:bg-slate-900 border-b border-border">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Logo size="sm" />
            <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-100 dark:bg-navy-950 text-navy-800 dark:text-navy-300">
              Scholar Portal
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground font-semibold"
            >
              <span>Public Journal Site</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-[1px] bg-border hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-navy-700 text-white flex items-center justify-center font-bold text-xs">
                {user.name?.[0]?.toUpperCase() ?? "S"}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xs font-bold text-foreground block truncate max-w-[140px]">
                  {user.name}
                </span>
                <span className="text-[10px] text-muted-foreground block truncate max-w-[140px]">
                  {user.email}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-border p-4 space-y-1">
          <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Author Workspace
          </div>
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-foreground/80 hover:bg-muted hover:text-foreground transition-colors group"
              >
                <Icon className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                <span className="flex-1">{item.label}</span>
                <ChevronRight className="w-3 h-3 text-muted-foreground/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            );
          })}
        </aside>

        {/* Content Area */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
