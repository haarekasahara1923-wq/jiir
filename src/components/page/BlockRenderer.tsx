import React from "react";
import sanitizeHtml from "sanitize-html";
import { Info, AlertTriangle, CheckCircle, FileText, Download } from "lucide-react";

export interface PageBlock {
  type: "heading" | "paragraph" | "callout" | "list" | "table" | "accordion" | "download" | "rawHtml";
  content?: string;
  level?: number;
  variant?: "info" | "warning" | "success" | "note";
  items?: string[];
  headers?: string[];
  rows?: string[][];
  title?: string;
  fileUrl?: string;
  fileSize?: string;
  format?: string;
}

export function BlockRenderer({ blocks }: { blocks: PageBlock[] | unknown }) {
  if (!blocks || !Array.isArray(blocks)) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block: PageBlock, index: number) => {
        switch (block.type) {
          case "heading": {
            const level = block.level || 2;
            if (level === 1) {
              return (
                <h1 key={index} className="text-3xl sm:text-4xl font-serif font-bold text-navy-900 dark:text-white mt-8 mb-4">
                  {block.content}
                </h1>
              );
            }
            if (level === 3) {
              return (
                <h3 key={index} className="text-xl sm:text-2xl font-serif font-bold text-navy-700 dark:text-navy-200 mt-5 mb-2">
                  {block.content}
                </h3>
              );
            }
            if (level === 4) {
              return (
                <h4 key={index} className="text-lg font-serif font-bold text-foreground mt-4 mb-2">
                  {block.content}
                </h4>
              );
            }
            return (
              <h2 key={index} className="text-2xl sm:text-3xl font-serif font-bold text-navy-800 dark:text-navy-100 mt-6 mb-3">
                {block.content}
              </h2>
            );
          }

          case "paragraph":
          case "rawHtml": {
            const cleanHtml = sanitizeHtml(block.content || "", {
              allowedTags: sanitizeHtml.defaults.allowedTags.concat([
                "img",
                "h1",
                "h2",
                "h3",
                "h4",
                "span",
                "div",
                "sub",
                "sup",
              ]),
              allowedAttributes: {
                "*": ["class", "id", "style"],
                a: ["href", "name", "target", "rel"],
                img: ["src", "alt", "width", "height"],
              },
            });

            return (
              <div
                key={index}
                className="text-sm sm:text-base text-foreground/90 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: cleanHtml }}
              />
            );
          }

          case "callout": {
            const variants = {
              info: "bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800 text-blue-900 dark:text-blue-200",
              warning: "bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200",
              success: "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200",
              note: "bg-navy-50 dark:bg-navy-950/40 border-navy-200 dark:border-navy-800 text-navy-900 dark:text-navy-200",
            }[block.variant || "info"];

            const Icon = {
              info: Info,
              warning: AlertTriangle,
              success: CheckCircle,
              note: Info,
            }[block.variant || "info"];

            return (
              <div key={index} className={`p-4 sm:p-5 rounded-xl border flex items-start gap-3 text-xs sm:text-sm ${variants}`}>
                <Icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  {block.title && <h4 className="font-bold">{block.title}</h4>}
                  <div
                    dangerouslySetInnerHTML={{
                      __html: sanitizeHtml(block.content || ""),
                    }}
                  />
                </div>
              </div>
            );
          }

          case "list": {
            return (
              <ul key={index} className="space-y-2 list-disc list-inside text-sm sm:text-base text-foreground/90 pl-2">
                {block.items?.map((item, i) => (
                  <li key={i} className="leading-relaxed">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: sanitizeHtml(item),
                      }}
                    />
                  </li>
                ))}
              </ul>
            );
          }

          case "table": {
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-border my-6">
                <table className="w-full text-left text-xs sm:text-sm">
                  {block.headers && block.headers.length > 0 && (
                    <thead className="bg-muted text-foreground uppercase tracking-wider text-[11px] font-bold">
                      <tr>
                        {block.headers.map((h, i) => (
                          <th key={i} className="p-3.5 border-b border-border">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-border">
                    {block.rows?.map((row, rIdx) => (
                      <tr key={rIdx} className="hover:bg-muted/40 transition-colors">
                        {row.map((cell, cIdx) => (
                          <td key={cIdx} className="p-3.5 text-foreground/90">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "download": {
            return (
              <div
                key={index}
                className="p-4 rounded-xl bg-muted/50 border border-border flex items-center justify-between gap-4 my-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-navy-700 text-white flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-foreground">{block.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {block.format} • {block.fileSize}
                    </p>
                  </div>
                </div>

                <a
                  href={block.fileUrl || "#"}
                  download
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-navy-700 hover:bg-navy-800 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download</span>
                </a>
              </div>
            );
          }

          default:
            return null;
        }
      })}
    </div>
  );
}
