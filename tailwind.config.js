// const { fontFamily } = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./app/**/*.{js,jsx}",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "#e2e8f0", // Light gray border
        input: "#e2e8f0", // Same as border for consistency
        ring: "#ffa458", // Primary color for focus rings
        background: "#ffffff", // White background
        foreground: "#1e293b", // Dark slate for main text
        primary: {
          DEFAULT: "#ffa458", // Your primary orange
          foreground: "#ffffff", // White text for primary elements
        },
        secondary: {
          DEFAULT: "#475569", // Slate for secondary elements
          foreground: "#ffffff", // White text for secondary elements
        },
        destructive: {
          DEFAULT: "#ef4444", // Red for destructive actions
          foreground: "#ffffff", // White text for destructive elements
        },
        muted: {
          DEFAULT: "#f1f5f9", // Very light slate for muted backgrounds
          foreground: "#64748b", // Muted text color
        },
        accent: {
          DEFAULT: "#ffb77a", // Lighter version of your primary color
          foreground: "#1e293b", // Dark text for accent elements
        },
        popover: {
          DEFAULT: "#ffffff", // White background for popovers
          foreground: "#1e293b", // Dark text for popovers
        },
        card: {
          DEFAULT: "#ffffff", // White background for cards
          foreground: "#1e293b", // Dark text for cards
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide")],
};
