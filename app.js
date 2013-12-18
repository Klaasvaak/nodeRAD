var http            = require('http');
var Router          = require('./core/router/router.js');
var configuration   = require('./configuration.js');

var routeRequest = function(req, res) {
    new Router(req, res)
        .route();
};

http.createServer(routeRequest).listen(configuration.port);

console.log('running on port ' + configuration.port);
console.log('PID: ' + process.pid);