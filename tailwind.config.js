/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,jsx}", "./server/**/*.js"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", xl: "3rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        ink: {
          DEFAULT: "#14120F",
          800: "#1E1B17",
          700: "#2A2621",
          600: "#3B352E",
          500: "#575046",
          400: "#7A7264",
        },
        bone: {
          DEFAULT: "#F4F0E8",
          200: "#EBE5D9",
          300: "#DDD5C4",
          400: "#C4BAA5",
        },
        signal: {
          DEFAULT: "#E2541C",
          600: "#C4400E",
          400: "#F2764A",
          100: "#FBE3D8",
        },
        brass: {
          DEFAULT: "#C08B2C",
          600: "#9C6F1F",
          100: "#F6ECD6",
        },
        steel: {
          DEFAULT: "#6E6A62",
          300: "#A9A398",
        },
        moss: {
          DEFAULT: "#3F6B3B",
          100: "#E4EEE1",
        },
        alert: "#B3261E",
      },
      fontFamily: {
        display: ['"Archivo"', '"Archivo Expanded"', "system-ui", "sans-serif"],
        sans: ['"IBM Plex Sans"', '"IBM Plex Sans Arabic"', "system-ui", "sans-serif"],
        arabic: ['"IBM Plex Sans Arabic"', '"IBM Plex Sans"', "sans-serif"],
        mono: ['"IBM Plex Mono"', "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem", letterSpacing: "0.08em" }],
      },
      borderRadius: {
        none: "0",
        sm: "2px",
        DEFAULT: "3px",
        md: "4px",
        lg: "6px",
      },
      boxShadow: {
        hard: "4px 4px 0 0 #14120F",
        "hard-sm": "2px 2px 0 0 #14120F",
        "hard-signal": "4px 4px 0 0 #E2541C",
        lift: "0 18px 40px -24px rgba(20,18,15,0.55)",
      },
      backgroundImage: {
        hazard:
          "repeating-linear-gradient(45deg, #E2541C 0 10px, #14120F 10px 20px)",
        grid: "linear-gradient(to right, rgba(20,18,15,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(20,18,15,0.06) 1px, transparent 1px)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "rise-in": {
          from: { opacity: "0", transform: "translateY(14px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { opacity: "0", transform: "translateX(-10px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "scan": {
          "0%,100%": { transform: "translateY(-100%)" },
          "50%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        marquee: "marquee 34s linear infinite",
        "rise-in": "rise-in 0.55s cubic-bezier(0.16,1,0.3,1) both",
        "slide-in": "slide-in 0.4s cubic-bezier(0.16,1,0.3,1) both",
        scan: "scan 2.6s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
