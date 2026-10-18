"use client";

import { useState } from "react";
import { CreditCard, Search, CheckCircle2, Clock, XCircle, Download, FileText, ArrowUpRight, DollarSign } from "lucide-react";

interface PaymentItem {
  id: string;
  invoiceNo: string;
  manuscriptCode: string;
  author: string;
  amount: number;
  currency: "INR" | "USD";
  mode: "RAZORPAY" | "MANUAL";
  status: "VERIFIED" | "SUBMITTED" | "INITIATED" | "REFUNDED";
  txnId: string;
  date: string;
}

const INITIAL_PAYMENTS: PaymentItem[] = [
  {
    id: "pay-1",
    invoiceNo: "INV-2026-0041",
    manuscriptCode: "JIIR-2026-0104",
    author: "Dr. Rajesh Sharma",
    amount: 2500,
    currency: "INR",
    mode: "RAZORPAY",
    status: "VERIFIED",
    txnId: "pay_NspW9281aKlM",
    date: "2026-04-12"
  },
  {
    id: "pay-2",
    invoiceNo: "INV-2026-0042",
    manuscriptCode: "JIIR-2026-0109",
    author: "Prof. Sunita Deshmukh",
    amount: 2500,
    currency: "INR",
    mode: "MANUAL",
    status: "SUBMITTED",
    txnId: "UTR: 908123764812",
    date: "2026-04-14"
  },
  {
    id: "pay-3",
    invoiceNo: "INV-2026-0043",
    manuscriptCode: "JIIR-2026-0098",
    author: "Dr. Elena Rostova",
    amount: 75,
    currency: "USD",
    mode: "RAZORPAY",
    status: "VERIFIED",
    txnId: "pay_KlpA8912qWz",
    date: "2026-04-10"
  },
  {
    id: "pay-4",
    invoiceNo: "INV-2026-0044",
    manuscriptCode: "JIIR-2026-0112",
    author: "Rohan Kulkarni",
    amount: 3200,
    currency: "INR",
    mode: "RAZORPAY",
    status: "INITIATED",
    txnId: "order_Qws718291a",
    date: "2026-04-15"
  },
  {
    id: "pay-5",
    invoiceNo: "INV-2026-0038",
    manuscriptCode: "JIIR-2026-0082",
    author: "Arjun Verma",
    amount: 2500,
    currency: "INR",
    mode: "MANUAL",
    status: "VERIFIED",
    txnId: "IMPS: 409182371",
    date: "2026-03-29"
  }
];

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>(INITIAL_PAYMENTS);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = payments.filter((p) => {
    if (filter !== "ALL" && p.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        p.invoiceNo.toLowerCase().includes(q) ||
        p.manuscriptCode.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.txnId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const verifyPayment = (id: string) => {
    setPayments(
      payments.map((p) => (p.id === id ? { ...p, status: "VERIFIED" } : p))
    );
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Payments, APC & Invoices
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Monitor article processing fee transactions, verify offline bank receipts, and download tax invoices.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
            <span>Verified Total: ₹ 1,42,500</span>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "VERIFIED", "SUBMITTED", "INITIATED", "REFUNDED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === st
                  ? "bg-navy-900 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search invoice, manuscript, author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>
      </div>

      {/* Payments Table */}
      <div className="rounded-2xl border border-border bg-white dark:bg-slate-900 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/50 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-4">Invoice #</th>
                <th className="p-4">Manuscript & Author</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Payment Mode & Txn</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 font-mono font-bold text-foreground">
                    {item.invoiceNo}
                    <span className="block text-[10px] font-sans text-muted-foreground font-normal">
                      {item.date}
                    </span>
                  </td>

                  <td className="p-4">
                    <span className="font-semibold text-foreground block">{item.manuscriptCode}</span>
                    <span className="text-muted-foreground">{item.author}</span>
                  </td>

                  <td className="p-4 whitespace-nowrap font-bold text-foreground">
                    {item.currency === "INR" ? "₹ " : "$ "}
                    {item.amount.toLocaleString()}
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.mode === "RAZORPAY"
                          ? "bg-blue-500/10 text-blue-600"
                          : "bg-purple-500/10 text-purple-600"
                      }`}
                    >
                      {item.mode}
                    </span>
                    <span className="block font-mono text-[10px] text-muted-foreground mt-0.5">
                      {item.txnId}
                    </span>
                  </td>

                  <td className="p-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                        item.status === "VERIFIED"
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                          : item.status === "SUBMITTED"
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                          : item.status === "INITIATED"
                          ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      }`}
                    >
                      {item.status === "VERIFIED" && <CheckCircle2 className="w-3 h-3" />}
                      {item.status === "SUBMITTED" && <Clock className="w-3 h-3" />}
                      <span>{item.status}</span>
                    </span>
                  </td>

                  <td className="p-4 text-right whitespace-nowrap space-x-2">
                    {item.status === "SUBMITTED" && (
                      <button
                        onClick={() => verifyPayment(item.id)}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-[11px] font-semibold transition-colors"
                      >
                        Verify Receipt
                      </button>
                    )}
                    <button className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors inline-flex items-center gap-1">
                      <Download className="w-3 h-3" />
                      <span>Invoice</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
