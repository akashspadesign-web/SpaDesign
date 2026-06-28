import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./three/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--color-bg)",
        "bg-alt": "var(--color-bg-alt)",
        ink: "var(--color-ink)",
        "ink-soft": "var(--color-ink-soft)",
        accent: "var(--color-accent)",
        "accent-soft": "var(--color-accent-soft)",
        line: "var(--color-line)",
      },
      fontFamily: {
        // `font-serif` Tailwind class still resolves here; underlying font is
        // now Archivo (geometric sans) instead of Fraunces (serif).
        serif: ["var(--font-fraunces)", "system-ui", "sans-serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-plex-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        display: [
          "var(--fs-display)",
          { lineHeight: "0.95", letterSpacing: "var(--tracking-tight)" },
        ],
        h1: [
          "var(--fs-h1)",
          { lineHeight: "1.04", letterSpacing: "var(--tracking-tight)" },
        ],
        h2: [
          "var(--fs-h2)",
          { lineHeight: "1.12", letterSpacing: "var(--tracking-tight)" },
        ],
        body: ["var(--fs-body)", { lineHeight: "1.6" }],
        small: ["var(--fs-small)", { lineHeight: "1.5" }],
      },
      letterSpacing: {
        tightish: "var(--tracking-tight)",
        wide: "var(--tracking-wide)",
      },
      maxWidth: {
        content: "var(--maxw)",
      },
      spacing: {
        section: "var(--section-y)",
        gutter: "var(--gutter)",
        nav: "var(--nav-h)",
      },
      transitionTimingFunction: {
        editorial: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        marquee: "marquee 28s linear infinite",
        "fade-up": "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
export default config;
