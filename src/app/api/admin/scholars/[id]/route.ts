import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "CHIEF_EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const updated = await prisma.user.update({
      where: { id },
      data: {
        status: body.status,
        blockedReason: body.blockedReason ?? null,
      },
      include: { profile: true },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: `SCHOLAR_${body.status}`,
        entity: "User",
        entityId: id,
        after: { reason: body.blockedReason },
      },
    });

    return NextResponse.json(updated);
  } catch (err: any) {
    console.error("Admin scholar patch error:", err);
    return NextResponse.json({ error: "Failed to update scholar" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Unauthorized. Super Admin only." }, { status: 403 });
    }

    const { id } = await params;

    await prisma.user.delete({ where: { id } });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "SCHOLAR_DELETED",
        entity: "User",
        entityId: id,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Admin scholar delete error:", err);
    return NextResponse.json({ error: "Failed to delete scholar" }, { status: 500 });
  }
}
