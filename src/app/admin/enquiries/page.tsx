"use client";

import { useState } from "react";
import { Mail, Search, CheckCircle2, Clock, Trash2, Send, AlertCircle, MessageSquare } from "lucide-react";

interface EnquiryItem {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
  status: "NEW" | "IN_PROGRESS" | "RESOLVED";
  date: string;
  reply?: string;
}

const INITIAL_ENQUIRIES: EnquiryItem[] = [
  {
    id: "enq-1",
    name: "Dr. Anirudh Sen",
    email: "anirudh.sen@univ.edu.in",
    subject: "Query regarding Fast-Track Peer Review Timeline for Volume 2 Issue 5",
    message: "Greetings Editorial Team, could you please clarify if fast-track review is available for our multidisciplinary AI paper submitted last week?",
    type: "SUBMISSION",
    status: "NEW",
    date: "2026-04-15"
  },
  {
    id: "enq-2",
    name: "Prof. Clara Oswald",
    email: "c.oswald@ed.ac.uk",
    subject: "Application for Reviewer Panel in Sustainable Architecture",
    message: "Dear Chief Editor, I would like to volunteer as a peer reviewer for JIIR. My CV and publication list are attached.",
    type: "REVIEWER",
    status: "IN_PROGRESS",
    date: "2026-04-14"
  },
  {
    id: "enq-3",
    name: "Rameshwar Prasad",
    email: "rameshwar.p@techinst.ac.in",
    subject: "Hard copy certificate and journal booklet dispatch inquiry",
    message: "Hello, our paper JIIR-2026-0045 was published in Issue 2. When can we expect the print certificate package to be couriered?",
    type: "CERTIFICATE",
    status: "RESOLVED",
    date: "2026-04-11",
    reply: "Dear Author, the certificate tracking code was sent to your registered email on April 12."
  }
];

export default function AdminEnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryItem[]>(INITIAL_ENQUIRIES);
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [replyModal, setReplyModal] = useState<EnquiryItem | null>(null);
  const [replyText, setReplyText] = useState("");

  const filtered = enquiries.filter((e) => {
    if (filter !== "ALL" && e.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.name.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.subject.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyModal) return;
    setEnquiries(
      enquiries.map((enq) =>
        enq.id === replyModal.id
          ? { ...enq, status: "RESOLVED", reply: replyText }
          : enq
      )
    );
    setReplyModal(null);
    setReplyText("");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Author Enquiries & Helpdesk
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage incoming inquiries, provide assistance to authors, and respond to review board communications.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-navy-50 text-navy-800 dark:bg-navy-950/60 dark:text-navy-200 border border-border">
            Pending Queries: {enquiries.filter((e) => e.status !== "RESOLVED").length}
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "NEW", "IN_PROGRESS", "RESOLVED"].map((st) => (
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
            placeholder="Search query, author, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>
      </div>

      {/* Enquiries List */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-3 hover:border-navy-600/30 transition-all"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    item.status === "NEW"
                      ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                      : item.status === "IN_PROGRESS"
                      ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  }`}
                >
                  {item.status}
                </span>
                <span className="text-xs font-semibold text-foreground">{item.name}</span>
                <span className="text-xs text-muted-foreground">({item.email})</span>
              </div>

              <span className="text-[11px] text-muted-foreground">{item.date}</span>
            </div>

            <div>
              <h3 className="text-sm font-bold text-foreground">{item.subject}</h3>
              <p className="text-xs text-muted-foreground mt-1 whitespace-pre-wrap">
                {item.message}
              </p>
            </div>

            {item.reply && (
              <div className="p-3 rounded-xl bg-muted/40 border border-border text-xs text-foreground space-y-1">
                <p className="font-semibold text-[11px] text-brand-orange">Editorial Response:</p>
                <p className="text-muted-foreground">{item.reply}</p>
              </div>
            )}

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setReplyModal(item);
                  setReplyText(item.reply ?? "");
                }}
                className="px-3 py-1.5 rounded-lg bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{item.reply ? "Edit Reply" : "Reply to Author"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Modal */}
      {replyModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4">
            <h2 className="text-base font-serif font-bold text-foreground">
              Reply to: {replyModal.name}
            </h2>
            <p className="text-xs text-muted-foreground">Subject: {replyModal.subject}</p>

            <form onSubmit={handleSendReply} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Official Response Message</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Type your response to the scholar..."
                  className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground h-32 focus:outline-none focus:ring-1 focus:ring-navy-600"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReplyModal(null)}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-navy-900 text-white font-semibold hover:bg-navy-800 inline-flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send & Mark Resolved</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
