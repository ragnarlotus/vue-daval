const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const base = require('./webpack.base.conf')
const config = require('../config')

// this is used only for umd browser bundle,
// refer to .babelrc for lib configuration

base.entry = {
  'vmv': './src/index.js'
}

base.output = {
  path: config.bundle.assetsRoot,
  publicPath: config.bundle.assetsPublicPath,
  filename: '[name].js',
  libraryTarget: 'umd',
  library: '[name]'
}

var webpackConfig = Object.assign({}, base)

webpackConfig.plugins = (webpackConfig.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env': {
      NODE_ENV: '"production"'
    }
  }),
  new webpack.optimize.UglifyJsPlugin({
    minimize : true,
    sourceMap : false,
    mangle: true,
    compress: { warnings: false }
  })
])

module.exports = webpackConfig
