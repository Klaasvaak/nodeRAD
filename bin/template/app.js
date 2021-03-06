var http            = require('http');
var nconf           = require('node-rad').nconf;
var Router          = require('node-rad').Router;

nconf.argv()
    .env()
    .file({file: process.cwd() + '/config.json'});

nconf.set('root', process.cwd());

http.createServer(function(req, res) {
    new Router(req, res).route();
}).listen(nconf.get('port'));

console.log('app running on port: ' + nconf.get('port'));
