var State = require('./state.js');

function ModelBase() {
    this.identifier = '';
    this.data       = { };
    this.list       = undefined;
    this.item       = undefined
    this.state      = new State();
}

ModelBase.prototype.initialize = function(config, next) {
    this.identifier = config.identifier;
    this.state      = config.state ? config.state : this.state;
    this.identifier = config.identifier;

    next();
};

ModelBase.prototype.getItem = function(callback) {
    callback(undefined, this.item);
};

ModelBase.prototype.getList = function(callback) {
    callback(undefined, this.list);
};

ModelBase.prototype.getTotal = function(callback) {
    callback(this.list.length);
};

ModelBase.prototype.getState = function() {
    return this.state;
};

ModelBase.prototype.set = function(name, value) {
    if (this.state.get(name) !== undefined) {
        this.state.insert(name, value);
    }

    return this;
};

ModelBase.prototype.setData = function(data) {
    this.data = data;

    return this;
};

module.exports = ModelBase;
