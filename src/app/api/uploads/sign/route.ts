import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { generateUploadSignature } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth();

    // Parse requested options
    const body = await req.json().catch(() => ({}));
    const folder = body.folder || (session?.user ? `jiir/scholars/${session.user.id}` : "jiir/submissions");
    const resourceType = body.resourceType || "auto";

    const signData = generateUploadSignature({
      folder,
      resourceType,
    });

    return NextResponse.json(signData);
  } catch (err: any) {
    console.error("Sign upload error:", err);
    return NextResponse.json(
      { error: "Failed to generate upload signature" },
      { status: 500 }
    );
  }
}
