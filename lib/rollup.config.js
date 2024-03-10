export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/main.mjs",
      format: "es",
    },
    {
      file: "dist/main.js",
      format: "cjs",
    },
  ],
}
