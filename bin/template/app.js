var http            = require('http');
var nconf           = require('nconf');
var Router          = require('node-rad').Router;

nconf.argv()
    .env()
    .file({file: process.cwd() + '/config.json'});

http.createServer(function(req, res) {
    new Router(req, res).route();
}).listen(nconf.get('port'));