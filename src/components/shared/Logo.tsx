"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
  className?: string;
}

export function Logo({
  logoUrl = "/brand/logo.png",
  size = "md",
  showText = true,
  className = "",
}: LogoProps) {
  const [activeLogo, setActiveLogo] = useState(logoUrl || "/brand/logo.png");
  const [imageError, setImageError] = useState(false);

  // Sync with localStorage if admin uploaded a custom logo recently
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
    sm: { height: 38, width: 38, textSize: "text-base", subSize: "text-[10px]" },
    md: { height: 48, width: 48, textSize: "text-xl", subSize: "text-[11px]" },
    lg: { height: 60, width: 60, textSize: "text-2xl", subSize: "text-xs" },
    xl: { height: 76, width: 76, textSize: "text-3xl", subSize: "text-sm" },
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg ${className}`}
    >
      {/* Authentic Logo Emblem */}
      <div
        className="relative flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
        style={{ width: dimensions.width, height: dimensions.height }}
      >
        {!imageError ? (
          <img
            src={activeLogo}
            alt="JIIR Official Logo Emblem"
            className="w-full h-full object-contain drop-shadow-sm rounded"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-[#0B2570] via-[#0D3B8E] to-[#101B40] flex items-center justify-center text-white font-bold font-serif shadow-md">
            <span>JIIR</span>
          </div>
        )}
      </div>

      {/* Styled Brand Nomenclature matching Logo Colors */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className={`font-black tracking-tight leading-none ${dimensions.textSize}`}>
              <span className="text-[#0B2570] dark:text-blue-400">J</span>
              <span className="text-[#D81B60]">I</span>
              <span className="text-[#E65100]">I</span>
              <span className="text-[#2E7D32]">R</span>
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider rounded bg-navy-100 dark:bg-navy-900/60 text-navy-800 dark:text-navy-200 border border-navy-200/50">
              International Peer-Reviewed
            </span>
          </div>
          <span
            className={`font-semibold text-foreground/90 leading-tight mt-0.5 line-clamp-1 max-w-[280px] sm:max-w-md ${dimensions.subSize}`}
          >
            Journal of Interdisciplinary Innovation & Research
          </span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-widest hidden md:inline-block">
            Educate · Innovate · Collaborate
          </span>
        </div>
      )}
    </Link>
  );
}
