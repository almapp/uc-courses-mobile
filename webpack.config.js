var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
    path.normalize('es6-shim/es6-shim.min'),
    'reflect-metadata',
    path.normalize('zone.js/dist/zone-microtask'),
    path.resolve('app/app')
  ],
  output: {
    path: path.resolve('www/build/js'),
    filename: 'app.bundle.js',
    pathinfo: false // show module paths in the bundle, handy for debugging
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV) || 'development',
        API_URL: JSON.stringify(process.env.API_URL || 'http://uc-courses.lopezjuri.com/api/v1')
      }
    }),
  ],
  module: {
    loaders: [
      {
        test: /\.ts$/,
        loader: 'awesome-typescript',
        query: {
          doTypeCheck: false
        },
        include: path.resolve('app'),
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        include: path.resolve('node_modules/angular2'),
        loader: 'strip-sourcemap'
      },
      {
        test: /\.json$/,
        loader: "file"
      }
    ],
    noParse: [
      /es6-shim/,
      /reflect-metadata/,
      /zone\.js(\/|\\)dist(\/|\\)zone-microtask/
    ]
  },
  resolve: {
    alias: {
      'angular2': path.resolve('node_modules/angular2'),
      'ionic': 'ionic-framework',
    },
    extensions: ["", ".js", ".ts"]
  }
};
