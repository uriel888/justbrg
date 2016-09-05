var http = require('http'),
  httpProxy = require('http-proxy');

//
// Create a proxy server with custom application logic
//

var port = 8081
var url = "https://www.hotelscombined.com/"
var proxy_url = "http://52.41.4.190/"
var echo_url = "http://52.37.71.194:8000/"
var tier = process.env['tier'];
  // To modify the proxy connection before data is sent, you can listen
  // for the 'proxyReq' event. When the event is fired, you will receive
  // the following arguments:
  // (http.ClientRequest proxyReq, http.IncomingMessage req,
  //  http.ServerResponse res, Object options). This mechanism is useful when
  // you need to modify the proxy request before the proxy connection
  // is made to the target.
  //

if(tier == 1){
  var proxy = httpProxy.createProxyServer({"xfwd":true});
  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    proxyReq.setHeader('Host', 'www.hotelscombined.com');
    proxyReq.setHeader('x-forwarded-host', 'www.hotelscombined.com');
    proxyReq.removeHeader('referer');
    proxyReq.removeHeader('Origin');
  });

  var server = http.createServer(function(req, res) {
    res.oldWriteHead = res.writeHead;
    res.writeHead = function(statusCode, headers) {
      /* add logic to change headers here */

      // res.setHeader('content-type', 'text/jjj');
      res.setHeader('Access-Control-Allow-Credentials', true);
      res.setHeader('Access-Control-Allow-Origin', "https://justbrg.com");
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
      target: proxy_url
    });
  });
  console.log("Tier 1 proxy: listening on port " + port)
  server.listen(port);
}else if(tier == 2){
  // httpProxy.createProxyServer({target:echo_url}).listen(port); // See (†)
  // console.log("Tier 2 proxy: listening on port " + port)


  var proxy = httpProxy.createProxyServer();
  proxy.on('proxyReq', function(proxyReq, req, res, options) {
    // proxyReq.setHeader('Host', 'www.hotelscombined.com');
    proxyReq.setHeader('connection', 'keep-alive');
    proxyReq.removeHeader('x-real-ip');
    // proxyReq.removeHeader('x-forwarded-port');
    // proxyReq.removeHeader('x-forwarded-proto');
    // proxyReq.removeHeader('x-forwarded-host');
    // proxyReq.removeHeader('x-forwarded-for');
    // proxyReq.removeHeader('Origin');
  });

  var server = http.createServer(function(req, res) {
    proxy.web(req, res, {
      target: url
    });
  });
  console.log("Tier 2 proxy: listening on port " + port)
  server.listen(port);
}
