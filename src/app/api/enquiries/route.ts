import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const enquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  affiliation: z.string().optional(),
  category: z.string().default("General"),
  subject: z.string().min(3, "Subject must be at least 3 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = enquirySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { name, email, category, subject, message } = parsed.data;

    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        email,
        type: category,
        topic: category,
        subject,
        message,
        status: "NEW",
      },
    });

    const trackingId = `ENQ-${new Date().getFullYear()}-${enquiry.id.slice(-4).toUpperCase()}`;

    return NextResponse.json({
      success: true,
      trackingId,
      message: "Enquiry logged successfully with editorial desk",
    });
  } catch (err: any) {
    console.error("Enquiry submission error:", err);
    return NextResponse.json(
      { error: "Failed to submit enquiry. Please try again later." },
      { status: 500 }
    );
  }
}
