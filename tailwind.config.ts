import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#070707",
        panel: "#111111",
        gold: "#eab308"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        glow: "0 0 30px rgba(234,179,8,0.12)"
      },
      backgroundImage: {
        aura:
          "radial-gradient(circle at top, rgba(234,179,8,0.18), transparent 30%), linear-gradient(180deg, #090909 0%, #050505 100%)"
      }
    }
  },
  plugins: []
};

export default config;
