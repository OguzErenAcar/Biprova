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
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        /* Özel token class'lar */
        brand:   { DEFAULT: "var(--p-brand)", hover: "var(--p-brand-hover)", surface: "var(--p-brand-surface)" },
        ink:     { DEFAULT: "var(--p-ink)", muted: "var(--p-ink-muted)", subtle: "var(--p-ink-subtle)" },
        canvas:  "var(--p-canvas)",
        surface: "var(--p-surface)",
        edge:    "var(--p-ink-border)",
        success: { DEFAULT: "var(--p-success)", surface: "var(--p-success-surface)" },
        danger:  { DEFAULT: "var(--p-danger)",  surface: "var(--p-danger-surface)" },
        warning: { DEFAULT: "var(--p-warning)", surface: "var(--p-warning-surface)" },
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
        nunito:  ['var(--font-display)', 'sans-serif'],
        jakarta: ['var(--font-body)',    'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        body:    ['var(--font-body)',    'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        'bp-fade-up': {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        fadeUp:       'fadeUp 0.4s ease both',
        'bp-fade-up': 'bp-fade-up 0.35s ease both',
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
