import { z } from "zod";

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  DIRECT_URL: z.string().url("DIRECT_URL must be a valid URL"),

  // Auth
  AUTH_SECRET: z.string().min(32, "AUTH_SECRET must be at least 32 characters"),

  // Site
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL"),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: z.string().min(1),

  // Razorpay
  RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_KEY_SECRET: z.string().min(1),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().min(1),
  RAZORPAY_WEBHOOK_SECRET: z.string().min(1),

  // SMTP
  SMTP_HOST: z.string().min(1),
  SMTP_PORT: z
    .string()
    .transform(Number)
    .pipe(z.number().int().positive()),
  SMTP_USER: z.string().min(1),
  SMTP_PASS: z.string().min(1),
  EMAIL_FROM: z.string().min(1),

  // Cron
  CRON_SECRET: z.string().min(1),

  // Seed
  SEED_SUPERADMIN_EMAIL: z.string().email(),
  SEED_SUPERADMIN_PASSWORD: z.string().min(8),

  // Optional
  UPSTASH_REDIS_REST_URL: z.string().url().optional(),
  UPSTASH_REDIS_REST_TOKEN: z.string().optional(),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

type Env = z.infer<typeof envSchema>;

let env: Env;

function validateEnv(): Env {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const missing = result.error.issues.map(
      (i) => `  ❌ ${i.path.join(".")}: ${i.message}`
    );
    const message = [
      "",
      "══════════════════════════════════════════════════",
      "  JIIR: Missing or invalid environment variables",
      "══════════════════════════════════════════════════",
      ...missing,
      "",
      "  Copy .env.example to .env.local and fill in all values.",
      "══════════════════════════════════════════════════",
      "",
    ].join("\n");

    console.error(message);
    throw new Error("Invalid environment variables. See above for details.");
  }

  return result.data;
}

// Validate only on server side
if (typeof window === "undefined") {
  env = validateEnv();
} else {
  // Provide safe subset for client
  env = {
    DATABASE_URL: "",
    DIRECT_URL: "",
    AUTH_SECRET: "",
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL ?? "",
    CLOUDINARY_CLOUD_NAME: "",
    CLOUDINARY_API_KEY: "",
    CLOUDINARY_API_SECRET: "",
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:
      process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "",
    RAZORPAY_KEY_ID: "",
    RAZORPAY_KEY_SECRET: "",
    NEXT_PUBLIC_RAZORPAY_KEY_ID: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? "",
    RAZORPAY_WEBHOOK_SECRET: "",
    SMTP_HOST: "",
    SMTP_PORT: 587,
    SMTP_USER: "",
    SMTP_PASS: "",
    EMAIL_FROM: "",
    CRON_SECRET: "",
    SEED_SUPERADMIN_EMAIL: "",
    SEED_SUPERADMIN_PASSWORD: "",
    NODE_ENV:
      (process.env.NODE_ENV as "development" | "production" | "test") ??
      "development",
  } as Env;
}

export { env };
export type { Env };
