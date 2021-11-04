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
            type: 'asset/resource',
            generator: {
              filename: 'assets/fonts/[name][ext][query]'
            },
          },
          {
            test: /.(jpg|png)$/,
            type: 'asset/resource',
            generator: {
              filename: 'assets/images/[name][ext][query]'
            },
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
              'css-loader',
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [['autoprefixer', {}]]
                  }
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'),
                  sassOptions: { quietDeps: true },
                },
              },
            ],
            type: 'javascript/auto',
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
