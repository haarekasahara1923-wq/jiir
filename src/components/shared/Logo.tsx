"use client";

import { useState } from "react";
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
  const [imageError, setImageError] = useState(false);

  const dimensions = {
    sm: { box: 36, px: 36 },
    md: { box: 48, px: 48 },
    lg: { box: 64, px: 64 },
    xl: { box: 80, px: 80 },
  }[size];

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg ${className}`}
    >
      <div
        className="relative flex items-center justify-center rounded-xl bg-gradient-to-br from-navy-700 via-navy-800 to-navy-950 p-1 text-white shadow-md transition-transform duration-200 group-hover:scale-105"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        {!imageError ? (
          <Image
            src={logoUrl || "/brand/logo.png"}
            alt="JIIR Logo"
            width={dimensions.px}
            height={dimensions.px}
            className="object-contain rounded-lg"
            onError={() => setImageError(true)}
            priority
          />
        ) : (
          // Crisp, high-end SVG fallback seal with motto ring
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full text-white"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="46" stroke="#F57C00" strokeWidth="2.5" />
            <circle cx="50" cy="50" r="41" stroke="#BAC8FE" strokeWidth="1" strokeDasharray="3 3" />
            <path
              id="ringPath"
              d="M 50 12 A 38 38 0 1 1 49.9 12"
              fill="none"
            />
            <text fill="#BAC8FE" fontSize="6.5" fontWeight="600" letterSpacing="1.5">
              <textPath href="#ringPath" startOffset="50%" textAnchor="middle">
                EDUCATE · INNOVATE · COLLABORATE
              </textPath>
            </text>
            <circle cx="50" cy="50" r="28" fill="#1F3C88" stroke="#F9A825" strokeWidth="1.5" />
            <text
              x="50"
              y="54"
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize="16"
              fontWeight="900"
              fontFamily="serif"
            >
              JIIR
            </text>
            <circle cx="50" cy="67" r="2" fill="#5BA829" />
          </svg>
        )}
      </div>

      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-serif text-lg sm:text-xl font-bold tracking-tight text-navy-800 dark:text-navy-100 group-hover:text-primary transition-colors">
              JIIR
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-navy-100 dark:bg-navy-900/60 text-navy-700 dark:text-navy-300">
              Peer-Reviewed
            </span>
          </div>
          <span className="text-[11px] sm:text-xs font-medium text-muted-foreground line-clamp-1 max-w-[280px] sm:max-w-md">
            Journal of Interdisciplinary Innovation & Research
          </span>
        </div>
      )}
    </Link>
  );
}
