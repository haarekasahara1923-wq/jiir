"use client";

import { useState } from "react";
import { Calendar, Plus, MapPin, Users, CheckCircle2, Clock, DollarSign, Globe } from "lucide-react";

interface ConferenceItem {
  id: string;
  title: string;
  dates: string;
  venue: string;
  mode: "HYBRID" | "ONLINE" | "IN_PERSON";
  organiser: string;
  registrations: number;
  isPublished: boolean;
}

const INITIAL_CONFERENCES: ConferenceItem[] = [
  {
    id: "conf-1",
    title: "International Conference on Interdisciplinary Innovations in Artificial Intelligence & Sustainability (ICIIAS-2026)",
    dates: "July 18-19, 2026",
    venue: "New Delhi Convention Centre",
    mode: "HYBRID",
    organiser: "JIIR Academic Alliance & Delhi Research Forum",
    registrations: 46,
    isPublished: true
  },
  {
    id: "conf-2",
    title: "National Symposium on Contemporary Tourism Dynamics & Hospitality Leadership",
    dates: "August 24-25, 2026",
    venue: "Virtual Platform",
    mode: "ONLINE",
    organiser: "School of Hotel Management & Tourism Studies",
    registrations: 28,
    isPublished: true
  }
];

export default function AdminConferencesPage() {
  const [conferences, setConferences] = useState<ConferenceItem[]>(INITIAL_CONFERENCES);
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDates, setNewDates] = useState("");
  const [newVenue, setNewVenue] = useState("");
  const [newOrganiser, setNewOrganiser] = useState("");

  const togglePublish = (id: string) => {
    setConferences(
      conferences.map((c) => (c.id === id ? { ...c, isPublished: !c.isPublished } : c))
    );
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const created: ConferenceItem = {
      id: `conf-${Date.now()}`,
      title: newTitle,
      dates: newDates || "October 2026",
      venue: newVenue || "Hybrid / Online",
      mode: "HYBRID",
      organiser: newOrganiser || "JIIR Consortium",
      registrations: 0,
      isPublished: true
    };
    setConferences([...conferences, created]);
    setShowModal(false);
    setNewTitle("");
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Conferences & Academic Symposia
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Partner with academic institutions to host proceedings, special conference tracks, and delegate registrations.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Host New Conference</span>
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {conferences.map((c) => (
          <div
            key={c.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between space-y-4 hover:border-navy-600/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300 border border-border">
                  {c.mode}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    c.isPublished
                      ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                      : "bg-muted text-muted-foreground border border-border"
                  }`}
                >
                  {c.isPublished ? "Open for Submissions" : "Draft / Closed"}
                </span>
              </div>

              <h3 className="text-base font-bold text-foreground mt-2">{c.title}</h3>

              <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-navy-600" />
                  <span>Dates: <strong className="text-foreground">{c.dates}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-navy-600" />
                  <span>Venue: {c.venue}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-navy-600" />
                  <span>Organiser: {c.organiser}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs">
              <span className="font-semibold text-foreground">
                {c.registrations} Delegates Registered
              </span>

              <button
                onClick={() => togglePublish(c.id)}
                className="px-3 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors"
              >
                {c.isPublished ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-base font-serif font-bold text-foreground">Host New Conference</h2>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Conference Title</label>
                <input
                  type="text"
                  placeholder="e.g. 3rd International Symposium on Multidisciplinary Research"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Conference Dates</label>
                <input
                  type="text"
                  placeholder="e.g. November 14-15, 2026"
                  value={newDates}
                  onChange={(e) => setNewDates(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Venue / City</label>
                <input
                  type="text"
                  placeholder="e.g. Jaipur National University / Virtual"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Host Institution / Organiser</label>
                <input
                  type="text"
                  placeholder="e.g. Department of Engineering & JIIR"
                  value={newOrganiser}
                  onChange={(e) => setNewOrganiser(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-navy-900 text-white font-semibold hover:bg-navy-800"
                >
                  Publish Conference
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
