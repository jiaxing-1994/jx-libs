import path from "path";
import vuePlugin from "rollup-plugin-vue";
import replace from "@rollup/plugin-replace";
import plugins from "./plugins.js";

export default {
  input: path.resolve(__dirname, "../packages/twoFactor/index.ts"),
  output: {
    file: path.resolve(__dirname, "../packages/twoFactor/dist/twoFactor.js"),
    name: "twoFactor",
    format: "umd",
    globals: {
      axios: "axios",
      vue: "Vue",
    },
  },
  plugins: [
    ...plugins,
    replace({
      "process.env.NODE_ENV": JSON.stringify("production"),
      preventAssignment: true,
    }),
    vuePlugin({
      target: "browser",
    }),
  ],
  external: ["vue", "axios"],
};
