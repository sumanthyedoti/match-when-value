export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/lib/index.mjs",
      format: "es",
    },
    {
      file: "dist/lib/index.js",
      format: "cjs",
    },
  ],
}
