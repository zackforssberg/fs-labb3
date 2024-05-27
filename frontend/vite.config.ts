import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/create-account": "http://localhost:3000",
      "/login": "http://localhost:3000",
      "/logout": "http://localhost:3000",
      "/user": "http://localhost:3000",
      "/book-tee-time": "http://localhost:3000",
      "/booked-times": "http://localhost:3000",
      "/cancel": "http://localhost:3000",
      "/dates": "http://localhost:3000",
      "/times-by-date": "http://localhost:3000",
    },
  },
});
