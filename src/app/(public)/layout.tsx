import { getSiteSettings } from "@/lib/settings";
import { getHeaderNavigation } from "@/lib/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementTicker } from "@/components/layout/AnnouncementTicker";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();
  const navItems = await getHeaderNavigation();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground antialiased selection:bg-navy-600 selection:text-white">
      <AnnouncementTicker settings={settings} />
      <Navbar settings={settings} navItems={navItems} />
      <main className="flex-1 w-full pb-20 lg:pb-0">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
