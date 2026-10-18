import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settingsRecords = await prisma.siteSetting.findMany();
    const settings: Record<string, any> = {};

    for (const record of settingsRecords) {
      settings[record.key] = record.value;
    }

    return NextResponse.json({ success: true, settings });
  } catch (err: any) {
    console.error("Fetch settings error:", err);
    return NextResponse.json(
      { error: "Failed to load settings" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = session.user.role;
    if (!["SUPER_ADMIN", "CHIEF_EDITOR", "EDITOR"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();

    // Upsert all settings keys into database
    for (const [key, value] of Object.entries(body)) {
      await prisma.siteSetting.upsert({
        where: { key },
        update: { value: value as any },
        create: { key, value: value as any },
      });
    }

    // Also record audit log
    try {
      await prisma.auditLog.create({
        data: {
          actorId: session.user.id,
          action: "SETTINGS_UPDATE",
          entity: "SiteSetting",
          entityId: "global",
          details: "Updated site settings and brand logos",
        } as any,
      });
    } catch {}

    return NextResponse.json({ success: true, message: "Settings saved successfully" });
  } catch (err: any) {
    console.error("Save settings error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save settings" },
      { status: 500 }
    );
  }
}
