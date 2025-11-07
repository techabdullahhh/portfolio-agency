import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-plus-jakarta)", "var(--font-geist-sans)", "sans-serif"],
        sans: ["var(--font-plus-jakarta)", "var(--font-geist-sans)", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
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
        neutral: {
          50: "hsl(var(--neutral-50))",
          100: "hsl(var(--neutral-100))",
          200: "hsl(var(--neutral-200))",
          300: "hsl(var(--neutral-300))",
          400: "hsl(var(--neutral-400))",
          500: "hsl(var(--neutral-500))",
          600: "hsl(var(--neutral-600))",
          700: "hsl(var(--neutral-700))",
          800: "hsl(var(--neutral-800))",
          900: "hsl(var(--neutral-900))",
          950: "hsl(var(--neutral-950))",
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
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        info: {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        glass: "hsla(var(--glass-color) / var(--glass-opacity))",
      },
      boxShadow: {
        ambient: "0 40px 80px -40px rgba(15, 23, 42, 0.45)",
        glow: "0 0 40px rgba(94, 234, 212, 0.3)",
        "inner-glow": "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
        glass: "0 24px 50px -35px rgba(15, 23, 42, 0.65)",
      },
      backdropBlur: {
        glass: "22px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 4px)",
        sm: "calc(var(--radius) - 8px)",
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
        pulseGlow: {
          "0%, 100%": { opacity: "0.5", filter: "blur(12px)" },
          "50%": { opacity: "0.9", filter: "blur(18px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulseGlow 6s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
      },
      transitionTimingFunction: {
        "ultra-smooth": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      transitionDuration: {
        400: "400ms",
        600: "600ms",
      },
      backgroundImage: {
        "glass-gradient": "radial-gradient(circle at top left, rgba(94, 234, 212, 0.2), transparent 55%), radial-gradient(circle at bottom right, rgba(129, 140, 248, 0.2), transparent 60%)",
        "card-gradient": "linear-gradient(140deg, rgba(15, 118, 110, 0.85) 0%, rgba(59, 130, 246, 0.85) 100%)",
        "hero-mesh": "radial-gradient(circle at 20% 20%, rgba(56,189,248,0.45), transparent 45%), radial-gradient(circle at 80% 0%, rgba(165,180,252,0.4), transparent 55%), radial-gradient(circle at 0% 80%, rgba(34,197,94,0.35), transparent 55%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
