var path = require("path");
// const webpack = require('webpack')
// const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TsConfigWebpackPlugin = require("ts-config-webpack-plugin");

module.exports = {
  mode: "development",
  entry: "./src/index.tsx",
  output: {
    filename: "[name].bundle.js",
    chunkFilename: "[name].bundle.js",
    publicPath: "/",
    path: path.resolve(__dirname + "/bundle/assets")
  },
  devServer: {
    historyApiFallback: true
  },
  optimization: {
    splitChunks: {
      chunks: "all",
      cacheGroups: {
        commons: {
          minChunks: 2,
          name: "vendors",
          chunks: "all"
        }
      }
    },
    runtimeChunk: false
  },
  // Enable sourcemaps for debugging webpack's output.
  devtool: "eval-source-map", // 'source-map',
  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  plugins: [
    // new BundleAnalyzerPlugin({ analyzerPort: 8745 }),
    new TsConfigWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html"
    })
  ],
  module: {
    rules: [
      {
        test: [
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.PNG$/,
          /\.svg$/,
          /\.eot$/,
          /\.woff$/,
          /\.woff2$/,
          /\.ttf$/
        ],
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "static/media/[name].[hash:8].[ext]"
        }
      }
    ]
  }
};
