var url             = require('url');
var fs              = require('fs');
var nconf           = require('nconf');
var Loader          = require('../loader/loader.js');

function Router(req, res) {
    this.req = req;
    this.res = res;
}

Router.prototype.route = function() {
    var self = this;

    var urlObject = url.parse(this.req.url, true);
    var path = urlObject.pathname;

    var parts = urlObject.pathname.split('/');

    if (path === '/') {
        // go to default file
    }

    fs.exists(process.cwd() + '/' + nconf.get('folder_public') + path, function(exists) {
        if (exists) {
            // Read the file
            console.log('public file');
        } else {
            self.run(parts, urlObject.query);
        }
    });
};

Router.prototype.run = function(parts, query) {
    if (!query[nconf.get('param_component')]) {
        this.res.end('no component');
    } else {
        if (parts[1]) {
            var first = undefined;
            if (parts[1] === nconf.get('path_admin')) {
                first = nconf.get('folder_admin');
            } else if (parts[1] === nconf.get('path_site')) {
                first = nconf.get('folder_site');
            }

            if (first !== undefined) {
                var loader = new Loader();
                loader.load(first + '.' + query.component + '.' + query.component, {
                    req: this.req,
                    res: this.res,
                    query: query
                }, function(runner) {
                    runner.run();
                });
            } else {
                this.res.end('???');
            }
        } else {
            this.res.end('???');
        }
    }
};

module.exports = Router;