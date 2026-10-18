import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadSignatureParams {
  folder?: string;
  resourceType?: "image" | "raw" | "auto" | "video";
  publicId?: string;
  tags?: string[];
}

export function generateUploadSignature(params: UploadSignatureParams = {}) {
  const timestamp = Math.round(new Date().getTime() / 1000);
  const folder = params.folder || "jiir/uploads";

  const paramsToSign: Record<string, string | number> = {
    folder,
    timestamp,
  };

  if (params.publicId) {
    paramsToSign.public_id = params.publicId;
  }

  if (params.tags && params.tags.length > 0) {
    paramsToSign.tags = params.tags.join(",");
  }

  const apiSecret = process.env.CLOUDINARY_API_SECRET || "";
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    signature,
    timestamp,
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    folder,
  };
}

export async function verifyCloudinaryAsset(publicId: string, resourceType: string = "auto") {
  try {
    const res = await cloudinary.api.resource(publicId, {
      resource_type: resourceType as any,
    });
    return res;
  } catch (err) {
    console.error("Cloudinary asset verification warning:", err);
    // In local demo or mock mode, return graceful object if API fails
    return null;
  }
}

export { cloudinary };
