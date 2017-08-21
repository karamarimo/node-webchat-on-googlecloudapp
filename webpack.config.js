const path = require('path');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/client/app.js',
  plugins: [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
    }),
    new CopyWebpackPlugin([
      {
        from: 'node_modules/bootstrap/dist/css/bootstrap.min.css',
        to: 'styles'
      },
      {
        from: 'node_modules/bootstrap/dist/fonts/glyphicons-halflings-regular.woff2',
        to: 'fonts'
      }
    ])
  ],
  resolve: {
    alias: {
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {
          }
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: { presets: ['env'] },
        }],
      },
    ]
  },
  output: {
    filename: 'js/bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
