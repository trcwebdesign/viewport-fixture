const path = require('path')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const tsImportPluginFactory = require('ts-import-plugin')

module.exports = {
  target: 'web'
, node: {
    fs: 'empty'
  , module: 'empty'
  }
, entry: {
    'viewport-fixture': './src/content-script/index.ts'
  , 'options': './src/options/index.tsx'
  }
, output: {
    path: path.resolve('./dist')
  , filename: '[name].js'
  }
, resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json']
  }
, module: {
    rules: [
      {
        test: /\.tsx?$/
      , exclude: /node_module/
      , loader: 'ts-loader'
      , options: {
          transpileOnly: true
        , getCustomTransformers: () => ({
            before: [
              tsImportPluginFactory({
                libraryName: 'antd'
              , libraryDirectory: 'es'
              , style: 'css'
              })
            ]
          })
        , compilerOptions: {
            module: 'esnext'
          }
        }
      }
    , {
        test: /\.css$/
      , use: [
          { loader: 'style-loader' }
        , { loader: 'css-loader' }
        ]
      }
    ]
  }
, plugins: [
    new CleanWebpackPlugin(['./dist'], {
      root: path.resolve('.')
    })
  , new CopyWebpackPlugin(
      [
        { from: './src', ignore: ['*.ts', '*.tsx', '*.html'] }
      , { from: './src/options/index.html', to: 'options.html' }
      , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js' }
      , { from: './node_modules/webextension-polyfill/dist/browser-polyfill.min.js.map' }
      ]
    )
  ]
}
