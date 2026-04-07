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
        /* ── Palet override'ları ─────────────────────────────────
           Mevcut Tailwind renk class'larını (bg-blue-600, text-slate-400
           gibi) CSS variable'larımıza bağlar. Component dosyalarına
           dokunmadan globals.css'deki --p-* değişkenini değiştirince
           projede o rengi kullanan her yer otomatik güncellenir.
        ────────────────────────────────────────────────────── */

        /* Brand → tüm blue-* class'ları --p-brand'i izler */
        blue: {
          "50":  "hsl(var(--p-brand-surface))",
          "100": "hsl(var(--p-brand-surface))",
          "400": "hsl(var(--p-brand))",
          "500": "hsl(var(--p-brand))",
          "600": "hsl(var(--p-brand))",
          "700": "hsl(var(--p-brand-hover))",
          "800": "hsl(var(--p-brand-hover))",
        },
        indigo: {
          "100": "hsl(var(--p-brand-surface))",
          "500": "hsl(var(--p-brand))",
          "600": "hsl(var(--p-brand))",
        },

        /* Metin/yüzey → tüm slate-* class'ları --p-ink'i izler */
        slate: {
          "50":  "hsl(var(--p-canvas))",
          "100": "hsl(var(--p-canvas))",
          "200": "hsl(var(--p-ink-border))",
          "300": "hsl(var(--p-ink-subtle))",
          "400": "hsl(var(--p-ink-subtle))",
          "500": "hsl(var(--p-ink-muted))",
          "600": "hsl(var(--p-ink-muted))",
          "700": "hsl(var(--p-ink-muted))",
          "800": "hsl(var(--p-ink))",
          "900": "hsl(var(--p-ink))",
        },

        /* Success → tüm green-* */
        green: {
          "50":  "hsl(var(--p-success-surface))",
          "100": "hsl(var(--p-success-surface))",
          "400": "hsl(var(--p-success))",
          "500": "hsl(var(--p-success))",
          "600": "hsl(var(--p-success))",
          "700": "hsl(var(--p-success))",
        },

        /* Danger → tüm red-* */
        red: {
          "50":  "hsl(var(--p-danger-surface))",
          "100": "hsl(var(--p-danger-surface))",
          "200": "hsl(var(--p-danger-surface))",
          "500": "hsl(var(--p-danger))",
          "600": "hsl(var(--p-danger))",
          "700": "hsl(var(--p-danger))",
        },

        /* Warning → tüm amber-* */
        amber: {
          "50":  "hsl(var(--p-warning-surface))",
          "100": "hsl(var(--p-warning-surface))",
          "200": "hsl(var(--p-warning-surface))",
          "500": "hsl(var(--p-warning))",
          "600": "hsl(var(--p-warning))",
          "800": "hsl(var(--p-warning))",
        },

        /* Özel token class'lar (isteğe bağlı, ek esneklik için) */
        brand:   { DEFAULT: "hsl(var(--p-brand))", hover: "hsl(var(--p-brand-hover))", surface: "hsl(var(--p-brand-surface))" },
        ink:     { DEFAULT: "hsl(var(--p-ink))", muted: "hsl(var(--p-ink-muted))", subtle: "hsl(var(--p-ink-subtle))" },
        canvas:  "hsl(var(--p-canvas))",
        edge:    "hsl(var(--p-ink-border))",
        success: { DEFAULT: "hsl(var(--p-success))", surface: "hsl(var(--p-success-surface))" },
        danger:  { DEFAULT: "hsl(var(--p-danger))",  surface: "hsl(var(--p-danger-surface))" },
        warning: { DEFAULT: "hsl(var(--p-warning))", surface: "hsl(var(--p-warning-surface))" },
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
