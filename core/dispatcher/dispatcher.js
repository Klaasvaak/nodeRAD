var Loader = require(process.cwd() + '/core/loader/loader.js');

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
    var controllerIdentifier = this.identifier.clone().setPath('controller').setName(this.identifier.getComponent());

    var loader = new Loader();
    loader.load(controllerIdentifier, { req: this.req, res: this.res, query: this.query }, function(controller) {
        controller.execute();
    });
};

module.exports = Dispatcher;