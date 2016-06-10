var http = require('http'),
  httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//
var proxy = httpProxy.createProxyServer({"xfwd":true});
var port = 8081
var url = "http://www.hotelscombined.com/"
var echo_url = 'http://52.37.71.194:8000/'
  // To modify the proxy connection before data is sent, you can listen
  // for the 'proxyReq' event. When the event is fired, you will receive
  // the following arguments:
  // (http.ClientRequest proxyReq, http.IncomingMessage req,
  //  http.ServerResponse res, Object options). This mechanism is useful when
  // you need to modify the proxy request before the proxy connection
  // is made to the target.
  //
proxy.on('proxyReq', function(proxyReq, req, res, options) {
  proxyReq.setHeader('Host', 'www.hotelscombined.com');
  proxyReq.removeHeader('referer');
  proxyReq.removeHeader('Origin');
});

var server = http.createServer(function(req, res) {
  res.oldWriteHead = res.writeHead;
  res.writeHead = function(statusCode, headers) {
    /* add logic to change headers here */

    // res.setHeader('content-type', 'text/jjj');
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', "http://justbrg.it");
    res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE, OPTION');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');

    // old way: might not work now
    // as headers param is not always provided
    // https://github.com/nodejitsu/node-http-proxy/pull/260/files
    // headers['foo'] = 'bar';

    res.oldWriteHead(statusCode, headers);
  }
  // You can define here your custom logic to handle the request
  // and then proxy the request.
  proxy.web(req, res, {
    target: url
  });
});

console.log("listening on port " + port)
server.listen(port);
