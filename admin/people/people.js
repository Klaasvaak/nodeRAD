/*
    People example component.
 */

var Loader = require(process.cwd() + '/core/loader/loader.js');

function Runner() {

}

Runner.prototype.initialize = function(config, next) {
    this.config = config;

    next();
};

Runner.prototype.run = function() {
    var loader = new Loader();
    loader.load('admin.people.dispatcher', this.config, function(dispatcher) {
        dispatcher.dispatch();
    });
};

module.exports = Runner;