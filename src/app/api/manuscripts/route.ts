import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { ArticleType, AuthorRegion, PublicationOption } from "@prisma/client";

const manuscriptSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  articleType: z.enum([
    "RESEARCH_ARTICLE",
    "REVIEW_ARTICLE",
    "CASE_STUDY",
    "SHORT_COMMUNICATION",
  ]),
  subjectArea: z.string().min(1, "Subject area is required"),
  abstract: z.string().min(50, "Abstract must be at least 50 words"),
  keywords: z.array(z.string()).min(2, "At least 2 keywords are required"),
  language: z.string().default("English"),
  correspondingAuthor: z.string().min(2),
  correspondingEmail: z.string().email(),
  phone: z.string().optional(),
  department: z.string().optional(),
  institution: z.string().optional(),
  country: z.string().min(1),
  coAuthors: z.array(z.any()).default([]),
  fileId: z.string().optional(),
  coverLetterUrl: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const json = await req.json();
    const parsed = manuscriptSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const year = new Date().getFullYear();

    // Generate unique sequential manuscriptCode (e.g. JIIR-2026-0001)
    const count = await prisma.manuscript.count();
    const sequence = (count + 1).toString().padStart(4, "0");
    const manuscriptCode = `JIIR-${year}-${sequence}`;

    const authorRegion: AuthorRegion =
      data.country.toLowerCase() === "india" ? "INDIA" : "INTERNATIONAL";

    const manuscript = await prisma.manuscript.create({
      data: {
        manuscriptCode,
        scholarId: session.user.id,
        title: data.title,
        articleType: data.articleType as ArticleType,
        subjectArea: data.subjectArea,
        abstract: data.abstract,
        keywords: data.keywords,
        language: data.language,
        correspondingAuthor: data.correspondingAuthor,
        correspondingEmail: data.correspondingEmail,
        phone: data.phone,
        department: data.department,
        institution: data.institution,
        country: data.country,
        authorRegion,
        publicationOption: "WITHOUT_DOI",
        coAuthors: data.coAuthors,
        status: "SUBMITTED",
        declarationsAcceptedAt: new Date(),
        history: {
          create: {
            fromStatus: "SUBMITTED",
            toStatus: "SUBMITTED",
            changedById: session.user.id,
            message: "Manuscript initially submitted by author.",
          },
        },
      },
    });

    // Audit log
    await prisma.auditLog.create({
      data: {
        actorId: session.user.id,
        action: "MANUSCRIPT_SUBMITTED",
        entity: "Manuscript",
        entityId: manuscript.id,
      },
    });

    return NextResponse.json({
      success: true,
      manuscript: {
        id: manuscript.id,
        manuscriptCode: manuscript.manuscriptCode,
      },
    });
  } catch (err: any) {
    console.error("Manuscript submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit manuscript. Please try again." },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const isStaff = ["SUPER_ADMIN", "CHIEF_EDITOR", "EDITOR"].includes(session.user.role);

    const where: any = isStaff ? {} : { scholarId: session.user.id };

    const status = searchParams.get("status");
    if (status) where.status = status;

    const manuscripts = await prisma.manuscript.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        scholar: { include: { profile: true } },
      },
    });

    return NextResponse.json(manuscripts);
  } catch (err: any) {
    console.error("Manuscript list error:", err);
    return NextResponse.json({ error: "Failed to load manuscripts" }, { status: 500 });
  }
}
