"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const countries = [
  "India",
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "Japan",
  "Singapore",
  "Malaysia",
  "United Arab Emirates",
  "Saudi Arabia",
  "South Africa",
  "Brazil",
  "Other",
];

const disciplines = [
  "Management & Business",
  "Education & Pedagogy",
  "Hospitality & Tourism Management",
  "Applied Science & Mathematics",
  "Technology & Engineering",
  "Other Interdisciplinary Field",
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/scholar";

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    institution: "",
    department: "",
    country: "India",
    primaryDiscipline: "Management & Business",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password strength calculator
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "" };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 1, label: "Weak", color: "bg-red-500" };
    if (score === 2 || score === 3) return { score: 2, label: "Medium", color: "bg-amber-500" };
    return { score: 3, label: "Strong", color: "bg-emerald-500" };
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      // Auto sign in immediately after registration
      const signRes = await signIn("credentials", {
        redirect: false,
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
      });

      if (signRes?.error) {
        router.push("/login?registered=true");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Failed to create author account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12 bg-gradient-to-b from-navy-50/60 via-background to-background dark:from-navy-950/40 dark:via-background dark:to-background">
      <div className="w-full max-w-xl space-y-8">
        {/* Brand Logo & Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <Logo size="lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-navy-900 dark:text-white">
            Create Scholar Account
          </h1>
          <p className="text-xs text-muted-foreground">
            Register as a researcher or author with the Journal of Interdisciplinary Innovation & Research.
          </p>
        </div>

        {/* Form Box */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-border shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-destructive/10 text-destructive text-xs font-semibold flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Dr. / Prof. / Scholar Full Name"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="scholar@university.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Password (min 8 chars) *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {formData.password && (
                  <div className="flex items-center gap-2 pt-1 text-[10px]">
                    <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full ${strength.color}`}
                        style={{ width: `${(strength.score / 3) * 100}%` }}
                      />
                    </div>
                    <span className="font-semibold text-muted-foreground">{strength.label}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Confirm Password *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Institution / University</label>
                <input
                  type="text"
                  value={formData.institution}
                  onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                  placeholder="e.g. University of Delhi"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Primary Research Discipline *</label>
              <select
                value={formData.primaryDiscipline}
                onChange={(e) => setFormData({ ...formData, primaryDiscipline: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {disciplines.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-all active:scale-95"
            >
              <span>{loading ? "Creating Scholar Account..." : "Register & Continue"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="pt-4 border-t border-border text-center text-xs text-muted-foreground">
            Already registered?{" "}
            <Link
              href={`/login${callbackUrl !== "/scholar" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
              className="font-bold text-primary hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}
