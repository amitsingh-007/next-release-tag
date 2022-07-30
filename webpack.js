const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
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
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "index.js",
    clean: true,
  },
};
