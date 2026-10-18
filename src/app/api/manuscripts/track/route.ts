import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const trackSchema = z.object({
  trackingId: z.string().min(3),
  email: z.string().email(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = trackSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Valid Tracking ID and Corresponding Author Email required" },
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
      select: {
        id: true,
        manuscriptCode: true,
        title: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!manuscript) {
      return NextResponse.json(
        { error: "No manuscript found matching this Tracking ID and Author Email pair." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...manuscript,
      trackingId: manuscript.manuscriptCode,
    });
  } catch (err: any) {
    console.error("Tracking API error:", err);
    return NextResponse.json(
      { error: "Failed to query manuscript tracker" },
      { status: 500 }
    );
  }
}
