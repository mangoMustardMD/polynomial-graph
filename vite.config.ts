import {defineConfig} from "vite";
import {checker} from "vite-plugin-checker";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  build: {
    target: "es2022",
    assetsInlineLimit: 0,
  },
  plugins: [
    checker({
      typescript: true,
    }),
    solidPlugin(),
  ],
  base: "/Ultimate-67-Graph/",
});
