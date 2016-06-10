var webpack = require('webpack');
module.exports = {
  entry: [
    'webpack/hot/only-dev-server',
    "./js/app.js"
  ],
  output: {
    path: __dirname + '/build',
    filename: "bundle.js"
  },
  module: {
    loaders: [{
      test: /\.js?$/,
      loaders: ['react-hot', 'babel'],
      exclude: /node_modules/
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ['react', 'es2015']
      }
    }, {
      test: /\.css$/,
      loader: "style!css"
    },
   { test: /\.json$/, loader: "json-loader" }]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  devServer: {
    /* Send API requests on localhost to API server get around CORS */
    proxy: {
      '/*': {
        target: 'http://52.37.71.194:8888/',
        secure: false,
        bypass: function(req, res, proxyOptions) {
          if (req.headers.accept.indexOf('html') !== -1) {
            console.log('Skipping proxy for browser request.');
            return '/index.html';
          }
        }
      }
    }
  }

};
