import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { canTransition, assertTransition } from "@/lib/workflow";
import type { ManuscriptStatus } from "@prisma/client";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const isStaff = ["SUPER_ADMIN", "CHIEF_EDITOR", "EDITOR", "REVIEWER"].includes(session.user.role);

    const manuscript = await prisma.manuscript.findUnique({
      where: { id },
      include: {
        scholar: { include: { profile: true } },
        files: { include: { asset: true } },
        history: { orderBy: { createdAt: "desc" } },
        reviews: {
          include: { reviewer: { select: { email: true, profile: true } } },
        },
        payments: true,
      },
    });

    if (!manuscript) {
      return NextResponse.json({ error: "Manuscript not found" }, { status: 404 });
    }

    // Scholar can only view their own manuscript
    if (!isStaff && manuscript.scholarId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(manuscript);
  } catch (err: any) {
    console.error("Manuscript get error:", err);
    return NextResponse.json({ error: "Failed to fetch manuscript" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { toStatus, decisionNote } = body;

    const manuscript = await prisma.manuscript.findUnique({ where: { id } });
    if (!manuscript) {
      return NextResponse.json({ error: "Manuscript not found" }, { status: 404 });
    }

    // Role-based state machine enforcement
    const userForRbac = {
      id: session.user.id,
      role: session.user.role,
    };

    const check = canTransition(manuscript.status, toStatus as ManuscriptStatus, userForRbac);
    if (!check.allowed) {
      return NextResponse.json(
        { error: check.reason || "This status transition is not permitted for your role" },
        { status: 403 }
      );
    }

    // Execute transition in transaction
    const updated = await prisma.$transaction(async (tx) => {
      const ms = await tx.manuscript.update({
        where: { id },
        data: {
          status: toStatus as ManuscriptStatus,
          decisionNote: decisionNote ?? manuscript.decisionNote,
          decidedById: ["ACCEPTED", "REJECTED"].includes(toStatus) ? session.user.id : manuscript.decidedById,
          decidedAt: ["ACCEPTED", "REJECTED"].includes(toStatus) ? new Date() : manuscript.decidedAt,
          history: {
            create: {
              fromStatus: manuscript.status,
              toStatus: toStatus as ManuscriptStatus,
              changedById: session.user.id,
              message: decisionNote || `Status changed from ${manuscript.status} to ${toStatus}`,
            },
          },
        },
      });

      // Create notification for scholar
      await tx.notification.create({
        data: {
          userId: manuscript.scholarId,
          type: "MANUSCRIPT_STATUS_CHANGED",
          title: `Manuscript ${manuscript.manuscriptCode} Updated`,
          body: `Your manuscript status is now: ${toStatus.replace(/_/g, " ")}.`,
          href: `/scholar/manuscripts/${manuscript.id}`,
        },
      });

      return ms;
    });

    return NextResponse.json({ success: true, manuscript: updated });
  } catch (err: any) {
    console.error("Manuscript transition error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to update manuscript status" },
      { status: 500 }
    );
  }
}
