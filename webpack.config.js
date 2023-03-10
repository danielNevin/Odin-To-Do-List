const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: './src/entry.js',
  devtool: 'inline-source-map',
  devServer: {
    static: './dist',
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Things to Do',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath: '/',
  },
  module:
  {
    rules:
    [
      { test: /\.txt$/, use: 'raw-loader' },
      {
        test: /\.css$/i, use: ["style-loader", "css-loader"],
      },
      {
        test: /\.png/,
        type: 'asset/resource'
      }
    ],
  },
  optimization: {
    runtimeChunk: 'single',
  },
  resolve: {
    fallback: {
      util: require.resolve("util/")
    }
  }
};