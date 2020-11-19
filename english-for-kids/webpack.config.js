const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: [
    './src/app/app.js'
  ],
  output: {
    path: path.join(__dirname, 'dst'),
    filename: 'script.js'
  },
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'dst'),
    watchContentBase: true,
    hot: true
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'style.css'
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
          path.join(__dirname, 'src/app/')
        ],
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer'),
                require('cssnano')
              ]
            }
          },
          'sass-loader',
        ],
      }
    ],
  },
  optimization: {
    minimize: true
  }
};
