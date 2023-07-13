/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        glow: "glow 2s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%, 100%": {
            textShadow:
              "0 0 10px #ff0000, 0 0 20px #ff0000, 0 0 30px #ff0000, 0 0 40px #ff0000",
          },
          "50%": {
            textShadow:
              "0 0 20px #ffff00, 0 0 30px #ff00ff, 0 0 40px #00ff00, 0 0 50px #0000ff, 0 0 60px #ffeeffee",
          },
        },
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          /*  */ primary: "#02165C",
          secondary: "#a3e635",
          accent: "#dc2626",
          neutral: "#6b7280",
          "base-100": "#e5e7eb",
          info: "#38bdf8",
          success: "#16a34a",
          warning: "#f09942",
          error: "#dc2626",
          body: {
            "background-color": "#f3f4f6",
          },
        },
      },
    ],
  },
};
