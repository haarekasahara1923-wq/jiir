import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const lookupSchema = z.object({
  trackingId: z.string().min(3),
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = lookupSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valid Tracking ID and Author Email are required" },
        { status: 400 }
      );
    }

    const { trackingId, email } = parsed.data;

    const manuscript = await prisma.manuscript.findFirst({
      where: {
        manuscriptCode: { equals: trackingId, mode: "insensitive" },
        OR: [
          { correspondingEmail: { equals: email, mode: "insensitive" } },
          { scholar: { email: { equals: email, mode: "insensitive" } } },
        ],
      },
      include: {
        scholar: { include: { profile: true } },
      },
    });

    if (!manuscript) {
      return NextResponse.json(
        { error: "No manuscript found matching this Tracking ID and Author Email pair." },
        { status: 404 }
      );
    }

    // Default fee if none specified
    const defaultFee = 1500;
    const currency = "INR";

    return NextResponse.json({
      id: manuscript.id,
      trackingId: manuscript.manuscriptCode,
      title: manuscript.title,
      authorName:
        manuscript.correspondingAuthor ||
        manuscript.scholar.profile?.fullName ||
        manuscript.scholar.email,
      status: manuscript.status,
      amount: defaultFee,
      currency,
    });
  } catch (err: any) {
    console.error("Payment lookup error:", err);
    return NextResponse.json(
      { error: "Failed to query fee registry" },
      { status: 500 }
    );
  }
}
