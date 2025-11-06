export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        colors: {
          primary: "#1F2937",   // dark background
          secondary: "#374151", // card background
          accent: "#3B82F6",    // blue
        },        
      },
    },
  },
  plugins: [],
};
