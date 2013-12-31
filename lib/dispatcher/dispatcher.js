var Loader = require('../loader/loader.js');

function Dispatcher() {

}

Dispatcher.prototype.initialize = function(config, next) {
    this.req        = config.req;
    this.res        = config.res;
    this.identifier = config.identifier;
    this.query      = config.query;

    next();
};

Dispatcher.prototype.dispatch = function() {
    var self = this;
    var controllerIdentifier = this.identifier.clone().setPath('controller').setName(this.identifier.getComponent());

    var loader = new Loader();
    loader.load(controllerIdentifier, { req: this.req, res: this.res, query: this.query }, function(err, controller) {
        if (!err) {
            controller.execute(function(err, result) {
                if (err) {
                    // TODO error
                    self.res.end(JSON.stringify(err));
                } else {
                    self.res.end(result);
                }
                // TODO: res.writeHead status
                // TODO: error handling
            });
        } else {
            //TODO error
            self.res.end('error dispatcher');
        }
    });
};

module.exports = Dispatcher;