const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader"
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  resolve: {
    extensions: [".js", ".jsx"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/public/index.html",
      favicon: './src/public/favicon.ico'
    })
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, "public")
    },
    compress: true,
    port: 9090,
    open: true,
    hot: true,
    historyApiFallback: true
  },
  // uncomment if not using npm start | npm run build commands found in package.json,
  // those commands set the webpack mode explicitly
  // mode: "development" 
};
