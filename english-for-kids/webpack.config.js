const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const ROOT_DIRECTORY = __dirname;
const SRC_DIRECTORY = path.join(ROOT_DIRECTORY, 'src');

module.exports = {
  entry: [
    './src/app/app.js',
  ],
  output: {
    path: path.join(__dirname, 'dst'),
    filename: 'script.js',
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dst'),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    },
    host: '127.0.0.1',
    port: 9000,
    watchContentBase: true,
    hot: true,
  },
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
          { from: path.join(SRC_DIRECTORY, 'app/data/model.json'), to: path.join(ROOT_DIRECTORY, 'dst/data') },
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
          path.join(__dirname, 'src'),
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
          MiniCssExtractPlugin.loader,
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
