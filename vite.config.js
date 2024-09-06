import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue2";
import { VuetifyResolver } from "unplugin-vue-components/resolvers";
import Components from "unplugin-vue-components/vite";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath, URL } from "node:url";

export default (configEnv) => {
  process.env = {
    ...process.env,
    ...loadEnv(configEnv.mode, process.cwd(), ""),
  };

  return defineConfig({
    base: process.env.VITE_APP_BASE_URL,
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
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
      extensions: [".mjs", ".js", ".ts", ".jsx", ".tsx", ".json", ".vue"],
    },
  });
};
