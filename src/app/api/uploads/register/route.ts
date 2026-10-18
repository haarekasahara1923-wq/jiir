import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const registerSchema = z.object({
  publicId: z.string().min(1),
  secureUrl: z.string().url(),
  bytes: z.number().or(z.string()).optional(),
  format: z.string().optional(),
  originalName: z.string().optional(),
  resourceType: z.string().default("auto"),
  folder: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    const json = await req.json();
    const parsed = registerSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid asset payload" },
        { status: 400 }
      );
    }

    const { publicId, secureUrl, bytes, format, originalName, resourceType, folder } = parsed.data;

    const asset = await prisma.mediaAsset.upsert({
      where: { publicId },
      update: {
        url: secureUrl,
        secureUrl,
        bytes: bytes ? BigInt(bytes) : undefined,
        format,
        originalName,
        resourceType,
        folder,
      },
      create: {
        publicId,
        url: secureUrl,
        secureUrl,
        bytes: bytes ? BigInt(bytes) : undefined,
        format,
        originalName,
        resourceType,
        folder,
        uploadedById: session?.user?.id ?? null,
      },
    });

    return NextResponse.json({
      success: true,
      asset: {
        id: asset.id,
        publicId: asset.publicId,
        url: asset.url,
        secureUrl: asset.secureUrl,
        originalName: asset.originalName,
        format: asset.format,
      },
    });
  } catch (err: any) {
    console.error("Asset registration error:", err);
    return NextResponse.json(
      { error: "Failed to register uploaded asset" },
      { status: 500 }
    );
  }
}
