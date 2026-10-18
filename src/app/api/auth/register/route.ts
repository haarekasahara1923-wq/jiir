import { NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  institution: z.string().optional(),
  department: z.string().optional(),
  country: z.string().min(1, "Country is required"),
  phone: z.string().optional(),
  primaryDiscipline: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Validation failed" },
        { status: 400 }
      );
    }

    const { fullName, email, password, institution, department, country, phone } = parsed.data;

    const normalizedEmail = email.toLowerCase().trim();

    // Check existing
    const existing = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        { error: "An account with this email address already exists. Please sign in." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        passwordHash,
        role: "SCHOLAR",
        status: "ACTIVE",
        emailVerifiedAt: new Date(),
        profile: {
          create: {
            fullName,
            institution,
            department,
            country,
            contactNo: phone,
          },
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Scholar account registered successfully",
      user,
    });
  } catch (err: any) {
    console.error("Scholar registration error:", err);
    return NextResponse.json(
      { error: "Registration failed. Please try again later." },
      { status: 500 }
    );
  }
}
