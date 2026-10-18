import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Logo } from "@/components/shared/Logo";
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
  Image,
  ExternalLink,
  DollarSign,
  History,
} from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login?callbackUrl=/admin");
  }

  const role = session.user.role;
  if (!["SUPER_ADMIN", "CHIEF_EDITOR", "EDITOR"].includes(role)) {
    redirect("/scholar");
  }

  const navGroups = [
    {
      group: "Core Editorial",
      items: [
        { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
        { label: "Manuscripts", href: "/admin/manuscripts", icon: FileText },
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
        { label: "Media Library", href: "/admin/media", icon: Image },
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

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-navy-950 text-white border-b border-navy-800">
        <div className="px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo size="sm" className="text-white" />
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-navy-800 text-brand-orange border border-navy-700">
              Admin Secretariat ({role})
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1 text-navy-300 hover:text-white transition-colors"
            >
              <span>View Public Journal</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <div className="h-4 w-[1px] bg-navy-800 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-orange text-white flex items-center justify-center font-bold text-xs">
                {session.user.name?.[0]?.toUpperCase() ?? "A"}
              </div>
              <span className="hidden sm:block font-bold text-white max-w-[120px] truncate">
                {session.user.name}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-white dark:bg-slate-900 border-r border-border p-4 space-y-6 shrink-0">
          {navGroups.map((group) => (
            <div key={group.group} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                {group.group}
              </span>
              {group.items.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold text-foreground/80 hover:bg-muted hover:text-foreground transition-colors"
                  >
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          ))}
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10">{children}</main>
      </div>
    </div>
  );
}
