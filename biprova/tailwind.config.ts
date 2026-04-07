import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        /* ── Dashboard renk token'ları ──────────────────────────
           globals.css'deki --color-* değişkenleriyle beslenir.
           Kullanım: bg-brand, text-ink, border-edge, bg-success vs.
        ────────────────────────────────────────────────────── */
        brand: {
          DEFAULT: "hsl(var(--color-brand))",
          hover:   "hsl(var(--color-brand-hover))",
          surface: "hsl(var(--color-brand-surface))",
        },
        ink: {
          DEFAULT: "hsl(var(--color-ink))",
          muted:   "hsl(var(--color-ink-muted))",
          subtle:  "hsl(var(--color-ink-subtle))",
        },
        canvas:  "hsl(var(--color-canvas))",
        edge:    "hsl(var(--color-edge))",
        success: {
          DEFAULT: "hsl(var(--color-success))",
          surface: "hsl(var(--color-success-surface))",
        },
        danger: {
          DEFAULT: "hsl(var(--color-danger))",
          surface: "hsl(var(--color-danger-surface))",
        },
        warning: {
          DEFAULT: "hsl(var(--color-warning))",
          surface: "hsl(var(--color-warning-surface))",
        },
      },
      boxShadow: {
        card:       "var(--shadow-card)",
        feature:    "var(--shadow-feature)",
        brand:      "var(--shadow-brand)",
        "brand-lg": "var(--shadow-brand-lg)",
      },
      fontSize: {
        label:   ["var(--text-label)",   { lineHeight: "1" }],
        meta:    ["var(--text-meta)",    { lineHeight: "1.35" }],
        caption: ["var(--text-caption)", { lineHeight: "1.5" }],
        body:    ["var(--text-body)",    { lineHeight: "1.6" }],
        lead:    ["var(--text-lead)",    { lineHeight: "1.5" }],
        title:   ["var(--text-title)",   { lineHeight: "1.3" }],
        h2:      ["var(--text-h2)",      { lineHeight: "1.25" }],
        hero:    ["var(--text-hero)",    { lineHeight: "1" }],
      },
      fontFamily: {
        nunito:  ['var(--font-nunito)', 'sans-serif'],
        jakarta: ['var(--font-jakarta)', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.4s ease both',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
