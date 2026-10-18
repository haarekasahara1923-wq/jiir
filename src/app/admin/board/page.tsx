"use client";

import { useState } from "react";
import { ShieldCheck, Plus, Search, Filter, Mail, Globe, Trash2, Edit2, CheckCircle2 } from "lucide-react";

interface BoardMember {
  id: string;
  name: string;
  group: "EDITOR_IN_CHIEF" | "ADVISORY" | "MANAGING" | "ASSOCIATE" | "REVIEWER_PANEL";
  designation: string;
  institution: string;
  country: string;
  email: string;
  orcid?: string;
  expertise: string[];
  isActive: boolean;
}

const INITIAL_MEMBERS: BoardMember[] = [
  {
    id: "eb-1",
    name: "Prof. (Dr.) Harish Chandra Sharma",
    group: "EDITOR_IN_CHIEF",
    designation: "Professor & Senior Researcher",
    institution: "National Institute of Interdisciplinary Research",
    country: "India",
    email: "editorinchief@jiir.in",
    orcid: "0000-0002-1825-0097",
    expertise: ["Interdisciplinary Innovation", "Applied Sciences", "Research Governance"],
    isActive: true
  },
  {
    id: "eb-2",
    name: "Dr. Elena Rostova",
    group: "ADVISORY",
    designation: "Director of International Scholarly Relations",
    institution: "Central European Academic Consortium",
    country: "Germany",
    email: "elena.rostova@jiir.in",
    orcid: "0000-0003-9124-7712",
    expertise: ["Sustainable Systems", "Cross-Border Higher Education", "Policy Analysis"],
    isActive: true
  },
  {
    id: "eb-3",
    name: "Dr. K. S. Venkatesh",
    group: "MANAGING",
    designation: "Associate Professor & Managing Editor",
    institution: "Institute of Management & Computing Sciences",
    country: "India",
    email: "managing.editor@jiir.in",
    orcid: "0000-0001-4412-8890",
    expertise: ["Computational Analytics", "Tourism Management", "Peer-Review Ethics"],
    isActive: true
  },
  {
    id: "eb-4",
    name: "Prof. Arthur Pendelton",
    group: "ASSOCIATE",
    designation: "Department Chair of Economics & Operations",
    institution: "University of Melbourne",
    country: "Australia",
    email: "arthur.pendelton@jiir.in",
    expertise: ["Behavioral Economics", "Statistical Optimization", "Supply Chain"],
    isActive: true
  },
  {
    id: "eb-5",
    name: "Dr. Reema Al-Sayed",
    group: "REVIEWER_PANEL",
    designation: "Senior Fellow in Educational Technology",
    institution: "Dubai Academic Research Institute",
    country: "United Arab Emirates",
    email: "reema.alsayed@jiir.in",
    expertise: ["EdTech", "Artificial Intelligence", "Curriculum Architecture"],
    isActive: true
  }
];

export default function AdminBoardPage() {
  const [members, setMembers] = useState<BoardMember[]>(INITIAL_MEMBERS);
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [newName, setNewName] = useState("");
  const [newGroup, setNewGroup] = useState<BoardMember["group"]>("ASSOCIATE");
  const [newDesignation, setNewDesignation] = useState("");
  const [newInstitution, setNewInstitution] = useState("");
  const [newCountry, setNewCountry] = useState("India");
  const [newEmail, setNewEmail] = useState("");
  const [newExpertise, setNewExpertise] = useState("");

  const filtered = members.filter((m) => {
    if (groupFilter !== "ALL" && m.group !== groupFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        m.name.toLowerCase().includes(q) ||
        m.institution.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q) ||
        m.expertise.some((e) => e.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddMember = (e: React.FormEvent) => {
    e.preventDefault();
    const created: BoardMember = {
      id: `eb-${Date.now()}`,
      name: newName,
      group: newGroup,
      designation: newDesignation,
      institution: newInstitution,
      country: newCountry,
      email: newEmail,
      expertise: newExpertise ? newExpertise.split(",").map((s) => s.trim()) : ["Interdisciplinary"],
      isActive: true
    };
    setMembers([created, ...members]);
    setShowModal(false);
    setNewName("");
    setNewDesignation("");
    setNewInstitution("");
    setNewEmail("");
    setNewExpertise("");
  };

  const toggleMemberActive = (id: string) => {
    setMembers(
      members.map((m) => (m.id === id ? { ...m, isActive: !m.isActive } : m))
    );
  };

  const deleteMember = (id: string) => {
    if (confirm("Are you sure you want to remove this member from the Editorial Board?")) {
      setMembers(members.filter((m) => m.id !== id));
    }
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Editorial Board & Reviewer Secretariat
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Maintain the roster of Editors-in-Chief, Advisory Council, Associate Editors, and International Reviewers.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Board Member</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "EDITOR_IN_CHIEF", "ADVISORY", "MANAGING", "ASSOCIATE", "REVIEWER_PANEL"].map((g) => (
            <button
              key={g}
              onClick={() => setGroupFilter(g)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                groupFilter === g
                  ? "bg-navy-900 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {g === "ALL" ? "All Board" : g.replace("_", " ")}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search name, institution..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between space-y-4 hover:border-navy-600/30 transition-all"
          >
            <div>
              <div className="flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300 border border-border">
                  {m.group.replace("_", " ")}
                </span>
                <span
                  className={`w-2 h-2 rounded-full ${
                    m.isActive ? "bg-emerald-500" : "bg-muted-foreground"
                  }`}
                />
              </div>

              <h3 className="text-base font-bold text-foreground mt-3">{m.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{m.designation}</p>
              <p className="text-xs font-medium text-foreground/80 mt-1">
                {m.institution}, {m.country}
              </p>

              <div className="mt-3 flex flex-wrap gap-1">
                {m.expertise.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded text-[10px] bg-muted text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>{m.email}</span>
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMemberActive(m.id)}
                  className="p-1 hover:text-foreground transition-colors"
                  title="Toggle Active Status"
                >
                  <CheckCircle2
                    className={`w-4 h-4 ${
                      m.isActive ? "text-emerald-500" : "text-muted-foreground"
                    }`}
                  />
                </button>
                <button
                  onClick={() => deleteMember(m.id)}
                  className="p-1 text-destructive/70 hover:text-destructive transition-colors"
                  title="Delete Member"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-border rounded-2xl p-6 w-full max-w-md shadow-2xl space-y-4">
            <h2 className="text-lg font-serif font-bold text-foreground">Add Editorial Member</h2>

            <form onSubmit={handleAddMember} className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Full Name & Salutation</label>
                <input
                  type="text"
                  placeholder="e.g. Prof. (Dr.) John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Board Category</label>
                <select
                  value={newGroup}
                  onChange={(e) => setNewGroup(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                >
                  <option value="EDITOR_IN_CHIEF">Editor-in-Chief</option>
                  <option value="ADVISORY">Advisory Board</option>
                  <option value="MANAGING">Managing Editor</option>
                  <option value="ASSOCIATE">Associate Editor</option>
                  <option value="REVIEWER_PANEL">Reviewer Panel</option>
                </select>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Designation</label>
                <input
                  type="text"
                  placeholder="e.g. Professor of Computer Science"
                  value={newDesignation}
                  onChange={(e) => setNewDesignation(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Institution</label>
                  <input
                    type="text"
                    value={newInstitution}
                    onChange={(e) => setNewInstitution(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Country</label>
                  <input
                    type="text"
                    value={newCountry}
                    onChange={(e) => setNewCountry(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Official Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Areas of Expertise (comma separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Artificial Intelligence, Data Ethics, IoT"
                  value={newExpertise}
                  onChange={(e) => setNewExpertise(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
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
                  Save Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
