import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "jiir/brand";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Try Cloudinary upload
    try {
      if (process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
        const result = await new Promise<any>((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder,
              resource_type: "auto",
            },
            (error, res) => {
              if (error) reject(error);
              else resolve(res);
            }
          );
          stream.end(buffer);
        });

        if (result?.secure_url) {
          return NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      }
    } catch (uploadErr) {
      console.warn("Cloudinary upload failed, falling back to base64 data url:", uploadErr);
    }

    // Fallback to base64 data URI if Cloudinary is offline or credentials error
    const base64 = buffer.toString("base64");
    const mimeType = file.type || "image/png";
    const dataUrl = `data:${mimeType};base64,${base64}`;

    return NextResponse.json({
      success: true,
      url: dataUrl,
      publicId: `local-${Date.now()}`,
    });
  } catch (err: any) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to upload asset" },
      { status: 500 }
    );
  }
}
