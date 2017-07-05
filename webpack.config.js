const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './src/client/app.js',
  plugins: [
        new webpack.ProvidePlugin({
           $: "jquery",
           jQuery: "jquery",
       })
    ],
  resolve: {
    alias: {
      'Vue': 'vue/dist/vue.runtime.esm.js'
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
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
};
