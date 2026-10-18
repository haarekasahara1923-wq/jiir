"use client";

import { useState } from "react";
import { DollarSign, Save, CheckCircle2, ShieldAlert, Info } from "lucide-react";

export default function AdminFeePlansPage() {
  const [inrWithoutDoi, setInrWithoutDoi] = useState("2000");
  const [inrWithDoi, setInrWithDoi] = useState("2500");
  const [inrMaxAuthors, setInrMaxAuthors] = useState("4");
  const [inrExtraPage, setInrExtraPage] = useState("200");
  const [inrGst, setInrGst] = useState("18");

  const [usdWithoutDoi, setUsdWithoutDoi] = useState("50");
  const [usdWithDoi, setUsdWithDoi] = useState("75");
  const [usdMaxAuthors, setUsdMaxAuthors] = useState("4");
  const [usdExtraPage, setUsdExtraPage] = useState("10");

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-foreground">
            Publication Fee Plans & APC Configuration
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure Article Processing Charges (APC) for Indian (INR) and International (USD) scholars.
          </p>
        </div>

        {saved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 text-xs font-semibold animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Indian Authors Plan */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">Indian Authors Plan (INR)</h3>
                <p className="text-xs text-muted-foreground">Domestic researcher fee tier</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
                INR (₹)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Fee Without DOI (₹)</label>
                <input
                  type="number"
                  value={inrWithoutDoi}
                  onChange={(e) => setInrWithoutDoi(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Fee With DOI & Crossref (₹)</label>
                <input
                  type="number"
                  value={inrWithDoi}
                  onChange={(e) => setInrWithDoi(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Max Free Authors</label>
                  <input
                    type="number"
                    value={inrMaxAuthors}
                    onChange={(e) => setInrMaxAuthors(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Extra Page Fee (₹)</label>
                  <input
                    type="number"
                    value={inrExtraPage}
                    onChange={(e) => setInrExtraPage(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">GST / Tax Rate (%)</label>
                <input
                  type="number"
                  value={inrGst}
                  onChange={(e) => setInrGst(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                  required
                />
              </div>
            </div>
          </div>

          {/* International Authors Plan */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-base font-bold text-foreground">International Authors Plan (USD)</h3>
                <p className="text-xs text-muted-foreground">Global researcher fee tier</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-50 text-navy-800 dark:bg-navy-950 dark:text-navy-300">
                USD ($)
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-muted-foreground font-medium mb-1">Fee Without DOI ($)</label>
                <input
                  type="number"
                  value={usdWithoutDoi}
                  onChange={(e) => setUsdWithoutDoi(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground font-semibold"
                  required
                />
              </div>

              <div>
                <label className="block text-muted-foreground font-medium mb-1">Fee With DOI & Crossref ($)</label>
                <input
                  type="number"
                  value={usdWithDoi}
                  onChange={(e) => setUsdWithDoi(e.target.value)}
                  className="w-full p-2 rounded-lg border border-border bg-background text-foreground font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Max Free Authors</label>
                  <input
                    type="number"
                    value={usdMaxAuthors}
                    onChange={(e) => setUsdMaxAuthors(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground font-medium mb-1">Extra Page Fee ($)</label>
                  <input
                    type="number"
                    value={usdExtraPage}
                    onChange={(e) => setUsdExtraPage(e.target.value)}
                    className="w-full p-2 rounded-lg border border-border bg-background text-foreground"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-muted/40 border border-border flex items-start gap-3 text-xs text-muted-foreground">
          <Info className="w-4 h-4 shrink-0 text-navy-600 mt-0.5" />
          <span>
            APC fees are only payable by authors after their manuscript has passed double-blind peer review and received formal editorial acceptance. Submission and peer review remain 100% free.
          </span>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-navy-900 text-white font-semibold hover:bg-navy-800 text-xs shadow-md transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Fee Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
}
