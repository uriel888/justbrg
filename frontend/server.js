var fs = require('fs');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config.prod.js')
var http = require('http');
var port = 8081
var compiler = webpack(config)
var express = require('express')
var app = new express()

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))
app.use('/static', express.static(__dirname + '/public'));
app.get("/bundle.js", function(req, res) {
  res.sendFile(__dirname + '/build/bundle.js')
})


app.get("/*", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
