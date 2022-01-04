const resolveApp = require('./path.js')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  entry: [resolveApp('src/index.tsx')],
  output: {
    path: resolveApp('dist'),
    // chunkFilename:'contenthash[id]',
    // crossOriginLoading:'use-credentials',
    libraryTarget: 'umd'
    // library:'myLiabrary'
  },
  module: {
    rules: [
      {
        test: /\.css|.less$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.m?js$|\.ts$|.tsx$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      // // 打包其他资源(除了html/js/css资源以外的资源)
      {
        // test: /\.(jpe?g|png|gif)$/,
        exclude: /node_modules|\.(css|js|html|less|ts|tsx|jsx)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192,
            esModule: false,
            outputPath: 'img',
            name: '[hash:10].[ext]'
          }
        }
      },
      {
        test: /\.html$/,
        // 处理html文件的img图片（负责引入img，从而能被url-loader进行处理）
        loader: 'html-loader'
      }
    ]
  },
  resolve: {
    alias: {
      '@': resolveApp('src')
    },
    extensions: ['.ts', '.tsx','.js', '.json', '.jsx', ]
  },
  plugins: [
    new HtmlWebpackPlugin({ template: resolveApp('public/index.html') })
  ]
}
