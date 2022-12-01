import path from "path";
import plugins from "./plugins.js";

export default {
  input: path.resolve(__dirname, "../packages/utils/index.ts"),
  output: {
    file: path.resolve(__dirname, "../packages/utils/dist/utils.js"),
    format: "esm",
  },
  plugins: [...plugins],
};
