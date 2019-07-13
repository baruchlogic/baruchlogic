const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');
require('dotenv').config();

module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    port: 9000
  },
  entry: ['babel-polyfill', './src/app/components/index.js'],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader'
          }
        ]
      }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, './dist'),
    publicPath: '/'
  },
  plugins: [
    new HtmlWebPackPlugin({
      template: 'src/app/index.html'
    }),
    new webpack.DefinePlugin({
      API_BASE_URL: JSON.stringify(process.env.API_BASE_URL)
    })
  ],
  resolve: {
    alias: {
      'app-styled': path.resolve(__dirname, 'src/app/styled-components'),
      constants: path.resolve(__dirname, 'src/constants'),
      helpers: path.resolve(__dirname, 'src/app/helpers'),
      hooks: path.resolve(__dirname, 'src/app/hooks')
    }
  }
};
