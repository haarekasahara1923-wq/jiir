"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/scholar";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (res?.error) {
        if (res.error.startsWith("BLOCKED:")) {
          setError(res.error.replace("BLOCKED:", ""));
        } else {
          setError("Invalid email address or password. Please verify your credentials.");
        }
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError("An unexpected error occurred during sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-navy-50/60 via-background to-background dark:from-navy-950/40 dark:via-background dark:to-background">
      <div className="w-full max-w-md space-y-8">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 dark:text-white">
            Scholar & Editorial Portal
          </h1>
          <p className="text-xs text-muted-foreground">
            Sign in to submit manuscripts, track peer review, or manage editorial workflows.
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl border border-border shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Registered Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <label className="font-semibold text-foreground">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline text-[11px]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              <span>{loading ? "Authenticating..." : "Sign In to Portal"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Don&apos;t have an author account yet?{" "}
            <Link
              href={`/register${callbackUrl !== "/scholar" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="font-bold text-primary hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>

        <div className="text-center text-[11px] text-muted-foreground">
          <Link href="/" className="hover:underline">
            ← Return to Public Journal Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading portal...</div>}>
      <LoginForm />
    </Suspense>
  );
}
