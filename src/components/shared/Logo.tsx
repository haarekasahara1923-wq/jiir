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
  /** When true, always render full branding (subtitle + tagline + badge). Default hides them on lg+ */
  forceFullBranding?: boolean;
}

export function Logo({
  logoUrl = "/brand/logo.png",
  size = "md",
  showText = true,
  className = "",
  invertText = false,
  forceFullBranding = false,
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
    sm: { imgClass: "w-8 h-8 sm:w-9 sm:h-9",    textSize: "text-base sm:text-lg",   subSize: "text-[10px] sm:text-[11px]" },
    md: { imgClass: "w-9 h-9 sm:w-10 sm:h-10",   textSize: "text-xl sm:text-2xl",    subSize: "text-[11px] sm:text-xs" },
    lg: { imgClass: "w-12 h-12 sm:w-14 sm:h-14", textSize: "text-xl sm:text-2xl",    subSize: "text-xs sm:text-sm" },
    xl: { imgClass: "w-16 h-16 sm:w-20 sm:h-20", textSize: "text-2xl sm:text-3xl",   subSize: "text-sm" },
  }[size];

  return (
    <Link
      href="/"
      className={cn(
        "inline-flex items-center gap-2 sm:gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg flex-shrink-0",
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
          Brand Text
          Desktop navbar (lg+): Only shows JIIR acronym letters.
          Mobile & Drawer: Shows full branding via forceFullBranding=true.
         ───────────────────────────────────────────── */}
      {showText && (
        <div className="flex flex-col min-w-0 overflow-hidden">

          {/* Row 1: JIIR acronym + optional "Intl. Peer-Reviewed" pill */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={cn("font-black tracking-tight leading-none flex-shrink-0", dimensions.textSize)}>
              <span className={invertText ? "text-white" : "text-[#0B2570]"}>J</span>
              <span className="text-[#D81B60]">I</span>
              <span className="text-[#E65100]">I</span>
              <span className="text-[#2E7D32]">R</span>
            </span>

            {/*
              Badge visibility rules:
              - On desktop (lg+): HIDDEN to save horizontal space
              - On sm-md (tablet/small laptop): visible
              - In drawer (forceFullBranding=true): always visible
            */}
            <span
              className={cn(
                "px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded border leading-tight flex-shrink-0",
                forceFullBranding
                  ? "inline-flex"
                  : "hidden sm:inline-flex lg:hidden",
                invertText
                  ? "bg-white/10 text-white border-white/20"
                  : "bg-navy-50 text-navy-800 border-navy-200/60"
              )}
            >
              Intl. Peer-Reviewed
            </span>
          </div>

          {/*
            Row 2: Full journal subtitle
            - On desktop (lg+): HIDDEN unless forceFullBranding
            - On mobile/tablet: truncated, visible
          */}
          <span
            className={cn(
              "font-semibold leading-tight mt-0.5 truncate",
              forceFullBranding
                ? "max-w-[280px] inline-block"
                : "max-w-[200px] sm:max-w-[260px] lg:hidden",
              dimensions.subSize,
              invertText ? "text-white/90" : "text-slate-600"
            )}
          >
            Journal of Interdisciplinary Innovation &amp; Research
          </span>

          {/*
            Row 3: Tagline
            - On desktop (lg+): HIDDEN unless forceFullBranding
          */}
          <span
            className={cn(
              "text-[9px] uppercase tracking-widest mt-0.5 font-medium",
              forceFullBranding
                ? "inline-block"
                : "hidden sm:inline-block lg:hidden",
              invertText ? "text-slate-300" : "text-slate-500"
            )}
          >
            Educate · Innovate · Collaborate
          </span>
        </div>
      )}
    </Link>
  );
}
