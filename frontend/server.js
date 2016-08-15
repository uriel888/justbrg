var fs = require('fs');
var webpack = require('webpack')
var webpackDevMiddleware = require('webpack-dev-middleware')
var webpackHotMiddleware = require('webpack-hot-middleware')
var config = require('./webpack.config.prod.js')
var https = require('https');
var http = require('http');
var app = new (require('express'))()
var app2 = new (require('express'))()
var port = 8081
var httpsPort = 8082
var compiler = webpack(config)
var privateKey  = fs.readFileSync('./configs/justbrg.key', 'utf8');
var certificate = fs.readFileSync('./configs/justbrg.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

app.use(function(req, res, next) {
  if((req.get('X-Forwarded-Proto') !== 'https')) {
    return req.get('X-Forwarded-Proto')
  }
  else
  next();
});

app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: config.output.publicPath }))
app.use(webpackHotMiddleware(compiler))


app.get("/bundle.js", function(req, res) {
  res.sendFile(__dirname + '/build/bundle.js')
})

app.get("/*", function(req, res) {
  res.sendFile(__dirname + '/index.html')
})

// app2.get('*',function(req,res){
//   res.redirect('https://justbrg.com'+req.url)
// })
//
// var httpServer = http.createServer(app2);
// httpServer.listen(port);
//
//
// var httpsServer = https.createServer(credentials, app);

app.listen(port, function(error) {
  if (error) {
    console.error(error)
  } else {
    console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
  }
})
//
// httpsServer.listen(httpsPort, function(){
//     console.log("server running at https://IP_ADDRESS:"+httpsPort)
// });
