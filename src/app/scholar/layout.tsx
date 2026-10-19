import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { ScholarShell } from "@/components/scholar/ScholarShell";

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

  return (
    <ScholarShell
      user={{
        name: user.name,
        email: user.email,
        role: user.role,
      }}
    >
      {children}
    </ScholarShell>
  );
}
