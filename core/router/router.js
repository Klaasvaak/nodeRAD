var url             = require('url');
var fs              = require('fs');
var configuration   = require(process.cwd() + '/configuration.js');
var Loader          = require(process.cwd() + '/core/loader/loader.js');

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

    fs.exists(process.cwd() + '/' + configuration.folder_public + path, function(exists) {
        if (exists) {
            // Read the file
            console.log('public file');
        } else {
            self.run(parts, urlObject.query);
        }
    });
};

Router.prototype.run = function(parts, query) {
    if (!query[configuration.param_component]) {
        this.res.end('no component');
    } else {
        if (parts[1]) {
            var first = undefined;
            if (parts[1] === configuration.path_admin) {
                first = configuration.folder_admin;
            } else if (parts[1] === configuration.path_site) {
                first = configuration.folder_site;
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