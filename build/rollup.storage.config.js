import path from "path";
import plugins from "./plugins.js";

export default {
  input: path.resolve(__dirname, "../packages/storage/storage.ts"),
  output: [
    {
      file: path.resolve(__dirname, "../packages/storage/dist/storage_umd.js"),
      name: "storage",
      format: "umd",
    },
    {
      file: path.resolve(__dirname, "../packages/storage/dist/storage_es.js"),
      format: "es",
    },
  ],
  plugins: [...plugins],
};
