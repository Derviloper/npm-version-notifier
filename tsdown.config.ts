import { defineConfig } from "tsdown";

export default defineConfig((cliOptions) => ({
  entry: "src/index.ts",
  minify: true,
  onSuccess: cliOptions.watch ? "npm start" : undefined,
}));
