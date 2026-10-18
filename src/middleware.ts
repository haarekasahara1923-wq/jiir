import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = [
  "/",
  "/about",
  "/contact",
  "/current-issue",
  "/past-issues",
  "/articles",
  "/call-for-papers",
  "/faq",
  "/editorial-board",
  "/conferences",
  "/indexing",
  "/doi",
  "/author-guidelines",
  "/author-resources",
  "/article-processing-charges",
  "/publication-ethics",
  "/peer-review-policy",
  "/publication-procedure",
  "/submit-manuscript",
  "/track-manuscript",
  "/pay-online",
  "/journal-information",
  "/institutional-membership",
  "/research-collaboration",
  "/conference-collaboration",
  "/institutional-services",
  "/privacy",
  "/terms",
  "/copyright",
  "/refund-policy",
  "/certificate-verify",
];

const AUTH_PATHS = ["/login", "/register", "/forgot-password", "/reset-password", "/verify-email"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Auth routes
  if (AUTH_PATHS.some((p) => pathname.startsWith(p))) {
    const session = await auth();
    if (session?.user) {
      // Redirect logged-in users away from auth pages
      const role = session.user.role;
      if (["SUPER_ADMIN", "CHIEF_EDITOR", "EDITOR"].includes(role)) {
        return NextResponse.redirect(new URL("/admin", request.url));
      } else if (role === "REVIEWER") {
        return NextResponse.redirect(new URL("/reviewer", request.url));
      } else {
        return NextResponse.redirect(new URL("/scholar", request.url));
      }
    }
    return NextResponse.next();
  }

  // Admin routes
  if (pathname.startsWith("/admin")) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    const role = session.user.role;
    if (!["SUPER_ADMIN", "CHIEF_EDITOR", "EDITOR"].includes(role)) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    // Check account status
    if (session.user.status === "BLOCKED") {
      return NextResponse.redirect(new URL("/login?blocked=1", request.url));
    }
    return NextResponse.next();
  }

  // Scholar routes
  if (pathname.startsWith("/scholar")) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    if (session.user.status === "BLOCKED") {
      return NextResponse.redirect(new URL("/login?blocked=1", request.url));
    }
    if (session.user.role !== "SCHOLAR") {
      // Redirect staff to admin panel
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  // Reviewer routes
  if (pathname.startsWith("/reviewer")) {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.redirect(
        new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url)
      );
    }
    if (session.user.status === "BLOCKED") {
      return NextResponse.redirect(new URL("/login?blocked=1", request.url));
    }
    if (!["REVIEWER", "SUPER_ADMIN", "CHIEF_EDITOR", "EDITOR"].includes(session.user.role)) {
      return NextResponse.redirect(new URL("/scholar", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|public|brand).*)",
  ],
};
