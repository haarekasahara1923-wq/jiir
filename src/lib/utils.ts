import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  date: Date | string | null | undefined,
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...options,
  });
}

export function formatDateTime(date: Date | string | null | undefined): string {
  if (!date) return "—";
  return new Date(date).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatCurrency(
  amount: number | string | null | undefined,
  currency: "INR" | "USD" = "INR"
): string {
  if (amount === null || amount === undefined || amount === "") return "—";
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function formatFileSize(bytes: number | bigint | null | undefined): string {
  if (bytes === null || bytes === undefined) return "—";
  const b = typeof bytes === "bigint" ? Number(bytes) : bytes;
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  if (b < 1024 * 1024 * 1024) return `${(b / (1024 * 1024)).toFixed(1)} MB`;
  return `${(b / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength - 3) + "...";
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export function generateManuscriptCode(year: number, counter: number): string {
  return `JIIR-${year}-${String(counter).padStart(4, "0")}`;
}

export function generateCertificateNo(
  type: "ACC" | "PUB" | "REV" | "EDI" | "PAR",
  year: number,
  counter: number
): string {
  return `JIIR-${type}-${year}-${String(counter).padStart(4, "0")}`;
}

export function generateInvoiceNo(year: number, counter: number): string {
  return `JIIR-INV-${year}-${String(counter).padStart(5, "0")}`;
}

export function getMonthName(month: number): string {
  return new Date(2000, month - 1, 1).toLocaleString("en-IN", {
    month: "long",
  });
}

export function absoluteUrl(path: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function isTestRazorpayKey(keyId: string): boolean {
  return keyId.startsWith("rzp_test_");
}

export function parseError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
}

// Timing-safe string comparison (anti-timing-attack)
export async function timingSafeEqual(a: string, b: string): Promise<boolean> {
  const enc = new TextEncoder();
  const aBytes = enc.encode(a);
  const bBytes = enc.encode(b);

  if (aBytes.length !== bBytes.length) {
    // Compare anyway to avoid timing attack
    let acc = 1;
    for (let i = 0; i < aBytes.length; i++) {
      acc |= aBytes[i] ^ (bBytes[i % bBytes.length] ?? 0);
    }
    return false;
  }

  let acc = 0;
  for (let i = 0; i < aBytes.length; i++) {
    acc |= aBytes[i] ^ bBytes[i];
  }
  return acc === 0;
}
