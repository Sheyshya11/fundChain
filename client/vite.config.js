import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
  /* server:{
    proxy:{
      '/encrypt':"http://localhost:5000/"
    }
  }, */
  plugins: [react()],
  define: {
    global: "globalThis",
    "process.env": {},
  },
});