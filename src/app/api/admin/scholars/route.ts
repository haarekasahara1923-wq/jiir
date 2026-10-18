import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user || !["SUPER_ADMIN", "CHIEF_EDITOR", "EDITOR"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";

    const scholars = await prisma.user.findMany({
      where: {
        role: "SCHOLAR",
        ...(search
          ? {
              OR: [
                { email: { contains: search, mode: "insensitive" } },
                { profile: { fullName: { contains: search, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      include: {
        profile: true,
        _count: { select: { manuscripts: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(scholars);
  } catch (err: any) {
    console.error("Admin scholars GET error:", err);
    return NextResponse.json({ error: "Failed to load scholars" }, { status: 500 });
  }
}
