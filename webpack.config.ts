import path from "path"
import webpack, { Configuration } from "webpack"

const config: Configuration = {
  entry: "./src/main.ts",
  target: "node",
  plugins: [new webpack.BannerPlugin({ banner: "#!/usr/bin/env node", raw: true })],
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: {
          configFile: "tsconfig.json",
        },
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
}

export default config
