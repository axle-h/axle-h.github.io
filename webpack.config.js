const webpack = require("webpack");
const path = require("path");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const html = new HtmlWebpackPlugin({ template: "./src/head.html", filename: "head.html", inject: "head" });

const clean = new CleanWebpackPlugin([ "dist", "assets/javascript", "assets/css/bundle.*.css" ]);

const extractSass = new ExtractTextPlugin({
    filename: "assets/css/bundle.[contenthash].css"
});

const uglify = new webpack.optimize.UglifyJsPlugin({
    output: {
        comments: false
    }
});

const runtimeChunk = new webpack.optimize.CommonsChunkPlugin({ name: "runtime" });
const vendorChunk = new webpack.optimize.CommonsChunkPlugin({ name: ["vendor", "polyfills"] });

module.exports = {
    entry: {
        main: ["./src/main.js", "./src/scss/main.scss"],
        vendor: [ "materialize-css" ],
        polyfills: [ "array-from" ]
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "assets/javascript/[name].[chunkhash].js",
        publicPath: "/"
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["babel-preset-env"]
                    }
                }
            },
            {
                test: /\.(sass|scss)$/,
                use: ExtractTextPlugin.extract({
                    use: [
                        { loader: "css-loader", options: { minimize: true } },
                        { loader: "sass-loader" }
                    ]
                })
            }
        ]
    },
    plugins: [ clean, html, vendorChunk, runtimeChunk, uglify, extractSass ]
};