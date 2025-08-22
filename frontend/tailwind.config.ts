import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",   // App Router pages/layouts
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Your custom components
    "./src/**/*.{js,ts,jsx,tsx,mdx}",   // If you put code under src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;