import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const pages = await prisma.page.findMany({
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, pages });
  } catch (err: any) {
    console.error("Fetch pages error:", err);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
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
    const {
      slug,
      title,
      titleHi,
      subtitle,
      subtitleHi,
      content,
      seoTitle,
      seoDescription,
      isPublished,
    } = body;

    if (!slug || !title) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const formattedSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-");

    const blocksData = [
      {
        type: "MARKDOWN",
        content: content || "",
      },
    ];

    const savedPage = await prisma.page.upsert({
      where: { slug: formattedSlug },
      update: {
        title,
        titleHi,
        subtitle,
        subtitleHi,
        blocks: blocksData,
        seoTitle,
        seoDescription,
        isPublished: isPublished ?? true,
      },
      create: {
        slug: formattedSlug,
        title,
        titleHi,
        subtitle,
        subtitleHi,
        blocks: blocksData,
        seoTitle,
        seoDescription,
        isPublished: isPublished ?? true,
      },
    });

    return NextResponse.json({ success: true, page: savedPage });
  } catch (err: any) {
    console.error("Save page error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to save page" },
      { status: 500 }
    );
  }
}
