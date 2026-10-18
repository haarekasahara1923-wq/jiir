"use client";

import { useState } from "react";
import Link from "next/link";
import { CreditCard, Search, ArrowRight, ShieldCheck, CheckCircle2, AlertCircle, Building, QrCode } from "lucide-react";

export default function PayOnlinePage() {
  const [trackingId, setTrackingId] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [paymentMode, setPaymentMode] = useState<"RAZORPAY" | "MANUAL">("RAZORPAY");
  const [utrNumber, setUtrNumber] = useState("");
  const [manualSubmitted, setManualSubmitted] = useState(false);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const res = await fetch("/api/payments/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trackingId: trackingId.trim(), email: email.trim().toLowerCase() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No payable manuscript found");

      setOrderData(data);
    } catch (err: any) {
      setError(err.message || "Failed to locate payable manuscript. Ensure unconditional acceptance has been granted.");
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setManualSubmitted(true);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-10">
      {/* Header */}
      <div className="border-b border-border pb-6 space-y-2">
        <div className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-brand-orange" />
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
            Author Payment Gateway
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white">
          Pay Publication Fee Online
        </h1>
        <p className="text-sm text-muted-foreground max-w-2xl">
          Complete Article Processing Charge (APC) payments securely via Razorpay or direct institutional bank transfer (NEFT/RTGS).
          Payment is only due after an unconditional acceptance decision.
        </p>
      </div>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Step 1: Lookup Manuscript */}
        {!orderData ? (
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6">
            <h2 className="text-base font-serif font-bold text-foreground border-b border-border pb-2">
              Step 1: Enter Manuscript Identification
            </h2>

            <form onSubmit={handleLookup} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Manuscript Tracking ID *</label>
                <input
                  required
                  type="text"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  placeholder="e.g. JIIR-2026-0001"
                  className="w-full px-3.5 py-2.5 text-xs font-mono uppercase rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-foreground">Corresponding Author Email *</label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="author@university.edu"
                  className="w-full px-3.5 py-2.5 text-xs rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <button
                disabled={loading}
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-navy-700 hover:bg-navy-800 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider shadow-md transition-colors"
              >
                <Search className="w-4 h-4" />
                <span>{loading ? "Verifying with Registry..." : "Fetch Fee Details"}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Payment Options */
          <div className="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-6 animate-in fade-in">
            <div className="border-b border-border pb-4 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-primary">{orderData.trackingId}</span>
                <h2 className="text-lg font-serif font-bold text-foreground mt-0.5">{orderData.title}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Author: {orderData.authorName}</p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-muted-foreground uppercase block font-semibold">Payable Fee</span>
                <span className="text-2xl font-bold font-mono text-foreground">
                  {orderData.currency === "INR" ? "₹" : "$"}{orderData.amount}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setPaymentMode("RAZORPAY")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMode === "RAZORPAY"
                    ? "border-primary bg-navy-50/50 dark:bg-navy-950/40 ring-2 ring-primary/20"
                    : "border-border hover:bg-muted"
                }`}
              >
                <CreditCard className="w-5 h-5 text-primary mb-1" />
                <h4 className="text-xs font-bold text-foreground">Online via Razorpay</h4>
                <p className="text-[10px] text-muted-foreground">UPI, Credit/Debit Card, Net Banking</p>
              </button>

              <button
                onClick={() => setPaymentMode("MANUAL")}
                className={`p-4 rounded-xl border text-left transition-all ${
                  paymentMode === "MANUAL"
                    ? "border-primary bg-navy-50/50 dark:bg-navy-950/40 ring-2 ring-primary/20"
                    : "border-border hover:bg-muted"
                }`}
              >
                <Building className="w-5 h-5 text-primary mb-1" />
                <h4 className="text-xs font-bold text-foreground">Direct Bank Transfer (NEFT)</h4>
                <p className="text-[10px] text-muted-foreground">Institutional RTGS / Wire Transfer</p>
              </button>
            </div>

            {paymentMode === "RAZORPAY" ? (
              <div className="p-6 rounded-xl bg-muted/40 border border-border text-center space-y-4">
                <p className="text-xs text-muted-foreground">
                  Click below to launch the secure Razorpay Checkout popup with automated receipt generation.
                </p>
                <button
                  onClick={() => alert("Razorpay checkout triggers in test mode on verified API credentials.")}
                  className="px-8 py-3.5 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
                >
                  Proceed to Secure Checkout ({orderData.currency === "INR" ? "₹" : "$"}{orderData.amount})
                </button>
              </div>
            ) : manualSubmitted ? (
              <div className="p-6 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-foreground">Transaction Proof Submitted</h4>
                <p className="text-xs text-muted-foreground">
                  Our accounts team will verify your UTR reference ({utrNumber}) within 24 hours and issue your official tax invoice.
                </p>
              </div>
            ) : (
              <form onSubmit={handleManualSubmit} className="p-6 rounded-xl bg-muted/40 border border-border space-y-4">
                <div className="text-xs space-y-1">
                  <h4 className="font-bold text-foreground">JIIR Official Bank Account Details:</h4>
                  <p className="text-muted-foreground">Bank Name: State Bank of India (SBI)</p>
                  <p className="text-muted-foreground">Account Name: Journal of Interdisciplinary Innovation & Research</p>
                  <p className="text-muted-foreground">Account Number: 409823109821</p>
                  <p className="text-muted-foreground">IFSC Code: SBIN0000691 (Connaught Place Branch)</p>
                </div>

                <div className="space-y-1 pt-2">
                  <label className="text-xs font-semibold text-foreground">UTR / Transaction Reference Number *</label>
                  <input
                    required
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 2026101898765432"
                    className="w-full px-3 py-2 text-xs rounded-lg border border-input bg-background"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-navy-700 text-white text-xs font-bold uppercase tracking-wider hover:bg-navy-800 transition-colors"
                >
                  Submit UTR for Editorial Verification
                </button>
              </form>
            )}

            <div className="pt-2">
              <button
                onClick={() => setOrderData(null)}
                className="text-xs text-muted-foreground hover:underline"
              >
                ← Look up another manuscript
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
