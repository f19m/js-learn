/* eslint-disable linebreak-style */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT_DIRECTORY = path.join(__dirname, '..');
const SRC_DIRECTORY = path.join(ROOT_DIRECTORY, 'src');

const config = {
  entry: [
    path.join(SRC_DIRECTORY, 'app/app.js'),
  ],
  output: {
    path: path.join(ROOT_DIRECTORY, 'dst'),
    filename: 'script.js',
  },
  // devtool: 'source-map',
  // devServer: {
  //   contentBase: path.join(__dirname, 'dst'),
  //   headers: {
  //     'Access-Control-Allow-Origin': '*',
  //     'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
  //   },
  //   host: '127.0.0.1',
  //   port: 9000,
  //   watchContentBase: true,
  //   hot: true,
  // },
  mode: 'development',
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyWebpackPlugin(
      {
        patterns: [
          { from: path.join(SRC_DIRECTORY, 'app/bootstrap.min.css'), to: path.join(ROOT_DIRECTORY, 'dst') },
          { from: path.join(SRC_DIRECTORY, 'app/reset.css'), to: path.join(ROOT_DIRECTORY, 'dst') },
          { from: path.join(SRC_DIRECTORY, 'assets'), to: path.join(ROOT_DIRECTORY, 'dst/assets') },
          { from: path.join(SRC_DIRECTORY, 'app/data'), to: path.join(ROOT_DIRECTORY, 'dst/data') },
        ],
      },
    ),
    new HtmlWebpackPlugin({
      template: path.join(SRC_DIRECTORY, 'index.html'),
    }),
  //   new CopyWebpackPlugin(
  //     {patterns:  [
  //    { from: path.join(SRC_DIRECTORY, 'assets'), to: path.join(ROOT_DIRECTORY, 'dst/assets') }
  //  ]},
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          // path.join(__dirname, 'src'),
          SRC_DIRECTORY,
        ],
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.(svg|png|jp(e*)g|gif)$/,
        loader: 'file-loader',
        // include: path.join(__dirname, 'src/assets'),
        options: {
          name: '[name].[ext]',
        },
      },
      {
        test: /\.sass$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: path.join(ROOT_DIRECTORY, 'dst'),
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  optimization: {
    minimize: true,
  },
};

module.exports = config;
