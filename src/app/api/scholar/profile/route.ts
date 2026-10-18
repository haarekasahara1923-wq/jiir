import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  fullName: z.string().min(2),
  designation: z.string().optional(),
  department: z.string().optional(),
  institution: z.string().optional(),
  city: z.string().optional(),
  country: z.string().min(1),
  contactNo: z.string().optional(),
  bio: z.string().optional(),
  orcid: z.string().optional(),
  googleScholarUrl: z.string().optional(),
  researchGateUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  websiteUrl: z.string().optional(),
  photoUrl: z.string().optional(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.scholarProfile.findUnique({
    where: { userId: session.user.id },
    include: { achievements: { orderBy: { sortOrder: "asc" } } },
  });

  return NextResponse.json(profile);
}

export async function PUT(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const json = await req.json();
  const parsed = profileSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Validation failed" },
      { status: 400 }
    );
  }

  const data = parsed.data;

  const profile = await prisma.scholarProfile.upsert({
    where: { userId: session.user.id },
    update: data,
    create: {
      ...data,
      userId: session.user.id,
    },
  });

  return NextResponse.json({ success: true, profile });
}
