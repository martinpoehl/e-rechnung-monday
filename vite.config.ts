import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // base "./": monday hostet den Build auf dem Apps-CDN unter einem Unterpfad,
  // absolute Asset-Pfade (/assets/…) würden dort 404 laufen.
  base: "./",
  build: {
    rollupOptions: {
      // node-zugferd importiert den XSD-Validator (Java) nur dynamisch im
      // strict-Modus; wir laufen mit strict: false – der Import darf im
      // Browser-Bundle unaufgelöst bleiben.
      external: ["xsd-schema-validator"],
    },
  },
  optimizeDeps: {
    exclude: ["xsd-schema-validator"],
  },
  server: {
    port: 8301,
    // Tunnel-Hosts (mapps tunnel:create) dürfen den Dev-Server erreichen;
    // sonst blockt Vite fremde Host-Header ("Blocked request").
    allowedHosts: [".loca.lt", ".apps-tunnel.monday.app"],
  },
});
