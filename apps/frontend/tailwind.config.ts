import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "../../packages/ui/src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      borderColor: {
        border: "rgb(from var(--border) r g b / <alpha-value>)",
        input: "rgb(from var(--input) r g b / <alpha-value>)",
        ring: "rgb(from var(--ring) r g b / <alpha-value>)",
      },
      colors: {
        background: "rgb(from var(--background) r g b / <alpha-value>)",
        foreground: "rgb(from var(--foreground) r g b / <alpha-value>)",
        card: "rgb(from var(--card) r g b / <alpha-value>)",
        "card-foreground":
          "rgb(from var(--card-foreground) r g b / <alpha-value>)",
        popover: "rgb(from var(--popover) r g b / <alpha-value>)",
        "popover-foreground":
          "rgb(from var(--popover-foreground) r g b / <alpha-value>)",
        primary: "rgb(from var(--primary) r g b / <alpha-value>)",
        "primary-foreground":
          "rgb(from var(--primary-foreground) r g b / <alpha-value>)",
        secondary: "rgb(from var(--secondary) r g b / <alpha-value>)",
        "secondary-foreground":
          "rgb(from var(--secondary-foreground) r g b / <alpha-value>)",
        muted: "rgb(from var(--muted) r g b / <alpha-value>)",
        "muted-foreground":
          "rgb(from var(--muted-foreground) r g b / <alpha-value>)",
        accent: "rgb(from var(--accent) r g b / <alpha-value>)",
        "accent-foreground":
          "rgb(from var(--accent-foreground) r g b / <alpha-value>)",
        destructive: "rgb(from var(--destructive) r g b / <alpha-value>)",
        "destructive-foreground":
          "rgb(from var(--destructive-foreground) r g b / <alpha-value>)",
        border: "rgb(from var(--border) r g b / <alpha-value>)",
        input: "rgb(from var(--input) r g b / <alpha-value>)",
        ring: "rgb(from var(--ring) r g b / <alpha-value>)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
