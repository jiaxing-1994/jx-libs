import path from "path";
import plugins from "./plugins.js";

export default {
  input: path.resolve(__dirname, "../packages/date/src/core.ts"),
  output: {
    file: path.resolve(__dirname, "../packages/date/dist/date.js"),
    format: "esm",
  },
  plugins: [...plugins],
};
