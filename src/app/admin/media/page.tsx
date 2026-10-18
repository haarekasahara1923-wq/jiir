"use client";

import { useState } from "react";
import { Image as ImageIcon, FileText, Upload, Search, ExternalLink, Copy, CheckCircle2 } from "lucide-react";

interface MediaItem {
  id: string;
  name: string;
  folder: "MANUSCRIPTS" | "COVERS" | "CERTIFICATES" | "BRAND" | "RECEIPTS";
  format: string;
  size: string;
  url: string;
  createdAt: string;
}

const INITIAL_MEDIA: MediaItem[] = [
  { id: "m-1", name: "JIIR-2026-0104-Final-Proof.pdf", folder: "MANUSCRIPTS", format: "PDF", size: "2.4 MB", url: "https://res.cloudinary.com/dpgabobnc/image/upload/v1/jiir/papers/sample1.pdf", createdAt: "2026-04-12" },
  { id: "m-2", name: "Volume-2-Issue-4-Cover.png", folder: "COVERS", format: "PNG", size: "1.1 MB", url: "https://res.cloudinary.com/dpgabobnc/image/upload/v1/jiir/covers/vol2_iss4.png", createdAt: "2026-04-01" },
  { id: "m-3", name: "JIIR-CERT-2026-0812.pdf", folder: "CERTIFICATES", format: "PDF", size: "640 KB", url: "https://res.cloudinary.com/dpgabobnc/image/upload/v1/jiir/certs/cert_812.pdf", createdAt: "2026-04-10" },
  { id: "m-4", name: "jiir-logo-master-vector.png", folder: "BRAND", format: "PNG", size: "280 KB", url: "/brand/logo.png", createdAt: "2026-01-01" },
  { id: "m-5", name: "Bank-Receipt-NEFT-90812.jpg", folder: "RECEIPTS", format: "JPG", size: "820 KB", url: "https://res.cloudinary.com/dpgabobnc/image/upload/v1/jiir/receipts/rec_90812.jpg", createdAt: "2026-04-14" }
];

export default function AdminMediaPage() {
  const [media, setMedia] = useState<MediaItem[]>(INITIAL_MEDIA);
  const [folderFilter, setFolderFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = media.filter((m) => {
    if (folderFilter !== "ALL" && m.folder !== folderFilter) return false;
    if (search) return m.name.toLowerCase().includes(search.toLowerCase());
    return true;
  });

  const handleCopy = (id: string, url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Cloudinary Media Library & Document Store
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Cloud storage repository for submitted manuscripts, published research PDFs, issue covers, and certificates.
          </p>
        </div>

        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-navy-900 text-white hover:bg-navy-800 text-xs font-semibold shadow-sm transition-all">
          <Upload className="w-4 h-4" />
          <span>Direct Asset Upload</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {["ALL", "MANUSCRIPTS", "COVERS", "CERTIFICATES", "BRAND", "RECEIPTS"].map((folder) => (
            <button
              key={folder}
              onClick={() => setFolderFilter(folder)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                folderFilter === folder
                  ? "bg-navy-900 text-white"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {folder}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search filename..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-border bg-background text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-navy-600"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm flex flex-col justify-between space-y-3 hover:border-navy-600/30 transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-9 h-9 rounded-lg bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300 flex items-center justify-center shrink-0">
                {item.format === "PDF" ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-muted-foreground uppercase">
                {item.folder}
              </span>
            </div>

            <div>
              <h3 className="text-xs font-bold text-foreground break-all">{item.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-1">
                {item.size} · {item.format} · {item.createdAt}
              </p>
            </div>

            <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
              <button
                onClick={() => handleCopy(item.id, item.url)}
                className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-muted text-[11px] font-semibold text-foreground transition-colors inline-flex items-center gap-1"
              >
                {copiedId === item.id ? (
                  <>
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                    <span className="text-emerald-600">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy URL</span>
                  </>
                )}
              </button>

              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="p-1 text-muted-foreground hover:text-foreground transition-colors"
                title="Open Cloudinary Asset"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
