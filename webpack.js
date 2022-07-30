const webpack = require("webpack");
const path = require("path");

module.exports = {
  mode: "production",
  target: "node14",
  resolve: {
    extensions: [".js"],
    modules: ["src", "node_modules"],
  },
  stats: "errors-warnings",
  plugins: [
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1,
    }),
  ],
  performance: {
    hints: false,
  },
  optimization: {
    nodeEnv: "production",
    chunkIds: "named",
    minimize: false,
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
  },
};
