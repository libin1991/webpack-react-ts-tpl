const common = require('./webpack.config.js')
const { merge } = require('webpack-merge')
const CompressionPlugin = require("compression-webpack-plugin");
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin
const CleanPlugin = require('../plugins/clean-plugin')
const plugins = [
  new CleanPlugin(),
  new CompressionPlugin({
    test: /\.js(\?.*)?$/i,
    algorithm: "gzip"
  })
]
if (process.argv.findIndex(item => item === '--analyze') > -1) {
  plugins.push(new BundleAnalyzerPlugin())
}
module.exports = merge({
  mode: 'production',
  output: {
    filename: '[chunkhash].js'
  },
  optimization: {
    // 代码切割
    splitChunks: {
      chunks: 'all',
      name: 'chunkhash'
    }

  },
  plugins
}, common)
