const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: {
        main: ['./src/main.js'],
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "assets/javascript/[name].[chunkhash].js",
        publicPath: "/"
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    module: {
        rules: [
          {
            test: /.(ttf|otf|eot|svg|woff2?)$/,
            use: [{
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/fonts',
                publicPath: '/assets/fonts'
              }
            }]
          },
          {
            test: /.(jpg|png)$/,
            use: [{
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/images',
                publicPath: '/assets/images'
              }
            }]
          },
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: [
                  ['@babel/preset-env', { targets: "defaults" }]
                ]
              }
            }
          },
          {
            test: /\.s[ac]ss$/i,
            use: [
              MiniCssExtractPlugin.loader,
              "css-loader",
              "sass-loader",
            ],
          },
        ]
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: "assets/css/[name].[chunkhash].css",
      }),
      new HtmlWebpackPlugin({ template: "./src/head.html", filename: "head.html", inject: "head", minify: false }),
    ]
};
