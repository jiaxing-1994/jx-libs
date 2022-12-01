import path from "path";
import plugins from "./plugins.js";

export default {
  input: path.resolve(__dirname, "../packages/validator/index.ts"),
  output: {
    file: path.resolve(__dirname, "../packages/validator/dist/validator.js"),
    name: "validator",
    format: "umd",
  },
  plugins: [...plugins],
};
