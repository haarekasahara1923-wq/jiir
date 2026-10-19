"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
  invertText?: boolean;
  /** When true, renders full branding (subtitle + tagline + badge). */
  forceFullBranding?: boolean;
}

export function Logo({
  logoUrl = "/brand/logo.png",
  size = "md",
  showText = true,
  className = "",
  invertText = false,
  forceFullBranding = true,
}: LogoProps) {
  const [activeLogo, setActiveLogo] = useState(logoUrl || "/brand/logo.png");
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("jiir_admin_settings");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.logoLight) {
            setActiveLogo(parsed.logoLight);
          }
        }
      } catch {}
    }
  }, []);

  const dimensions = {
    sm: { imgClass: "w-8 h-8 sm:w-9 sm:h-9",      textSize: "text-lg sm:text-xl",     subSize: "text-[10px] sm:text-[11px]" },
    md: { imgClass: "w-11 h-11 sm:w-12 sm:h-12",  textSize: "text-2xl sm:text-3xl",   subSize: "text-[11px] sm:text-xs" },
    lg: { imgClass: "w-13 h-13 sm:w-15 sm:h-15",  textSize: "text-3xl sm:text-4xl",   subSize: "text-xs sm:text-sm" },
    xl: { imgClass: "w-16 h-16 sm:w-20 sm:h-20",  textSize: "text-3xl sm:text-5xl",   subSize: "text-sm sm:text-base" },
  }[size];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg flex-shrink-0",
        className
      )}
    >
      {/* Official Logo Emblem */}
      <div
        className={cn(
          "relative flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
          dimensions.imgClass
        )}
      >
        {!imageError ? (
          <img
            src={activeLogo}
            alt="JIIR Official Logo"
            className="w-full h-full object-contain drop-shadow-sm rounded"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0B2570] via-[#0D3B8E] to-[#101B40] flex items-center justify-center text-white font-bold font-serif shadow-sm">
            <span className="text-xs sm:text-sm">JIIR</span>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────
          Brand Text: Prestigious Academic Typography
         ───────────────────────────────────────────── */}
      {showText && (
        <div className="flex flex-col min-w-0">

          {/* Row 1: Colored JIIR Acronym + Peer-Reviewed Pill */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn("font-black tracking-tight leading-none flex-shrink-0 font-serif", dimensions.textSize)}>
              <span className={invertText ? "text-white" : "text-[#0B2570]"}>J</span>
              <span className="text-[#D81B60]">I</span>
              <span className="text-[#E65100]">I</span>
              <span className="text-[#2E7D32]">R</span>
            </span>

            <span
              className={cn(
                "hidden sm:inline-flex items-center px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border leading-tight flex-shrink-0",
                invertText
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-navy-50 text-navy-800 border-navy-200"
              )}
            >
              Peer-Reviewed Journal
            </span>
          </div>

          {/* Row 2: Full Journal Subtitle */}
          {forceFullBranding && (
            <span
              className={cn(
                "font-semibold leading-tight mt-0.5 max-w-[220px] xs:max-w-[280px] sm:max-w-sm md:max-w-md lg:max-w-lg truncate",
                dimensions.subSize,
                invertText ? "text-white/90" : "text-slate-800"
              )}
            >
              Journal of Interdisciplinary Innovation &amp; Research
            </span>
          )}

          {/* Row 3: Tagline */}
          {forceFullBranding && (
            <span
              className={cn(
                "text-[9px] uppercase tracking-widest mt-0.5 font-medium hidden md:inline-block",
                invertText ? "text-slate-300" : "text-slate-500"
              )}
            >
              Educate · Innovate · Collaborate
            </span>
          )}
        </div>
      )}
    </Link>
  );
}
