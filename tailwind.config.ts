import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: "#0A2240",
        "navy-800": "#0D2A4E",
        crimson: "#941C1D",
        "crimson-600": "#B02A28",
        // Lighter tint reserved for crimson TEXT on navy/dark backgrounds —
        // the base crimson (#941C1D) only reaches 1.86:1 contrast against
        // navy (#0A2240), far under WCAG AA's 4.5:1 minimum for text. This
        // shade reaches 5.6:1. Never use for text on cream/white — crimson
        // and crimson-600 already pass there.
        "crimson-light": "#F07373",
        cream: "#EDE6D6",
        "cream-100": "#F5F1E8",
        white: "#FFFFFF",
        "ink-muted": "#4A5568",
        line: "#D8CFBC",

        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
      },

      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },

      fontSize: {
        display: [
          "3.815rem",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h1: [
          "3.052rem",
          { lineHeight: "1.15", letterSpacing: "-0.02em", fontWeight: "700" },
        ],
        h2: [
          "2.441rem",
          { lineHeight: "1.2", letterSpacing: "-0.015em", fontWeight: "700" },
        ],
        h3: [
          "1.953rem",
          { lineHeight: "1.25", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        h4: [
          "1.563rem",
          { lineHeight: "1.3", letterSpacing: "-0.01em", fontWeight: "700" },
        ],
        "body-lg": [
          "1.250rem",
          { lineHeight: "1.6", letterSpacing: "0em", fontWeight: "400" },
        ],
        body: [
          "1.000rem",
          { lineHeight: "1.65", letterSpacing: "0em", fontWeight: "400" },
        ],
        caption: [
          "0.800rem",
          { lineHeight: "1.5", letterSpacing: "0.02em", fontWeight: "400" },
        ],
      },

      spacing: {
        "section-y": "5rem",
        "container-x": "1.5rem",
      },

      borderRadius: {
        card: "0.75rem",
        btn: "0.375rem",
        badge: "0.25rem",
        input: "0.375rem",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      boxShadow: {
        card: "0 1px 3px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(10, 34, 64, 0.08)",
        "card-dark":
          "0 2px 8px rgba(0, 0, 0, 0.25), 0 8px 24px rgba(0, 0, 0, 0.35)",
      },

      zIndex: {
        behind: "-1",
        nav: "50",
        modal: "100",
        tooltip: "200",
      },

      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
    },
  },
  plugins: [animate],
};

export default config;
