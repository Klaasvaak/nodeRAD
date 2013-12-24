var configuration = require('./configuration.js');
var http = require('http');
var Router = require('node-rad').Router;

http.createServer(function(req, res) {
    new Router(req, res).route();
}).listen(configuration.port);