/* eslint-disable linebreak-style */
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

const config = require('./webpack.config.js');

config.mode = 'production';

config.optimization = {
  minimizer: [new TerserPlugin()],
};

module.exports = config;
