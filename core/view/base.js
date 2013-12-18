var Loader = require(process.cwd() + '/core/loader/loader.js');
var Identifier = require(process.cwd() + '/core/loader/identifier.js');

function ViewBase() {
    this.output     = undefined;
    this.mimetype   = undefined;
    this.model      = undefined;
    this.request    = undefined;
}

ViewBase.prototype.initialize = function(config, next) {
    this.output     = config.output ? config.output : this.output
    this.mimetype   = config.mimetype ? config.mimetype : this.mimetype;
    this.model      = config.model ? config.model : this.model;
    this.request    = config.request ? config.request : this.request;
    this.name       = config.name ? config.name : this.name;

    next();
};

ViewBase.prototype.getModel = function(callback) {
    var self = this;

    if (typeof this.model === 'string' || this.model instanceof Identifier) {
        var loader = new Loader();
        loader.load(this.model, {}, function(model) {
            self.model = model;
            callback(self.model);
        });
    } else {
        callback(this.model);
    }
};

ViewBase.prototype.display = function(callback) {
    callback(this.output);
};

module.exports = ViewBase;