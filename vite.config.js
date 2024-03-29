import { defineConfig } from "vite";
// import { createVuePlugin as vue } from "vite-plugin-vue2";
import vue from "@vitejs/plugin-vue2";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { visualizer } from "rollup-plugin-visualizer";
const path = require("path");

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    Components({
      directoryAsNamespace: true,
      resolvers: [
        // Vuetify
        VuetifyResolver(),
      ],
    }),
    visualizer({
      template: "treemap", // or sunburst
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html", // will be saved in project's root
    }),
  ],
  css: {
    preprocessorOptions: {
      sass: {
        additionalData: [
          '@import "./src/styles/variables"',
          '@import "vuetify/src/styles/settings/_variables"',
          "", // end with newline
        ].join("\n"),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
  },
});
