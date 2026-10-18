import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // JIIR Brand Colors
        navy: {
          DEFAULT: "#1F3C88",
          50: "#EEF2FF",
          100: "#DDE6FF",
          200: "#BAC8FE",
          300: "#88A9FD",
          400: "#5183FA",
          500: "#2F5FF3",
          600: "#1F3C88",
          700: "#1A3070",
          800: "#152558",
          900: "#101B40",
          950: "#0A1228",
        },
        magenta: {
          DEFAULT: "#C2185B",
          50: "#FFF0F5",
          100: "#FFE0EB",
          200: "#FFB8D2",
          300: "#FF80AA",
          400: "#FF3D7F",
          500: "#E91E63",
          600: "#C2185B",
          700: "#A01549",
          800: "#800F38",
          900: "#600A28",
        },
        brand: {
          orange: "#F57C00",
          green: "#5BA829",
          gold: "#F9A825",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        ink: "#0F172A",
        surface: "#FFFFFF",
        softbg: "#F8FAFC",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        devanagari: ["var(--font-noto-devanagari)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in-right": {
          from: { transform: "translateX(100%)" },
          to: { transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        gradient: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out",
        "slide-in-right": "slide-in-right 0.3s ease-out",
        shimmer: "shimmer 2s linear infinite",
        gradient: "gradient 6s ease infinite",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #1F3C88, #C2185B, #F57C00, #5BA829)",
        "brand-gradient-line":
          "linear-gradient(to right, #1F3C88, #C2185B, #F57C00, #5BA829)",
        "hero-pattern":
          "radial-gradient(ellipse at 80% 50%, rgba(31, 60, 136, 0.15) 0%, transparent 50%)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0,0,0,0.07), 0 1px 2px -1px rgba(0,0,0,0.07)",
        "card-hover":
          "0 4px 16px -2px rgba(31, 60, 136, 0.15), 0 2px 4px -2px rgba(0,0,0,0.1)",
        "card-lg":
          "0 10px 40px -8px rgba(31, 60, 136, 0.2), 0 4px 16px -4px rgba(0,0,0,0.1)",
        brand: "0 0 0 3px rgba(31, 60, 136, 0.2)",
      },
    },
  },
  plugins: [],
};

export default config;
