const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  entry: {
    taskpane: "./src/taskpane/taskpane.js",
    commands: "./src/commands/commands.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    clean: true
  },
  devServer: {
    static: {
      directory: path.join(__dirname, "dist")
    },
    port: 3000,
    https: true,
    hot: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/taskpane/taskpane.html",
      filename: "taskpane.html",
      chunks: ["taskpane"]
    }),
    new HtmlWebpackPlugin({
      template: "./src/commands/commands.html",
      filename: "commands.html",
      chunks: ["commands"]
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: "assets",
          to: "assets"
        },
        {
          from: "src/slide-library",
          to: "slide-library"
        }
      ]
    })
  ],
  resolve: {
    extensions: [".js"]
  }
};
