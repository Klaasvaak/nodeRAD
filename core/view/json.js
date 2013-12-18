var util        = require(process.cwd() + '/util/util.js');
var ViewBase    = require('./base.js');
var inflector   = require(process.cwd() + '/core/inflector/inflector.js');

function ViewJson() {
    ViewJson.super_.apply(this, arguments);

    this.mimetype = 'application/json';
}

util.inherits(ViewJson, ViewBase);

ViewJson.prototype.display = function(callback) {
    var self = this;

    if (inflector.isSingular(self.name)) {
        this.getItem(function() {
            ViewJson.super_.prototype.display.call(self, callback);
        });
    } else {
        this.getList(function() {
            ViewJson.super_.prototype.display.call(self, callback);
        });
    }
};

ViewJson.prototype.setOutput = function(output) {
    this.output = output;
};

ViewJson.prototype.formatOutput = function(propertyName, callback) {
    var tmp = {};
    tmp[propertyName] = this.output;

    this.output = JSON.stringify(tmp);

    callback(this.output);
};

// TODO: offset, limit, total, href, url
ViewJson.prototype.getList = function(callback) {
    var self = this;

    if (this.output === undefined) {
        this.getModel(function(model) {
            model.getList(function(list) {
                self.output = list;
                self.formatOutput('items', callback);
            });
        });
    } else {
        this.formatOutput('items', callback);
    }
};

ViewJson.prototype.getItem = function(callback) {
    var self = this;

    if (this.output === undefined) {
        this.getModel(function(model) {
            model.getItem(function(item) {
                self.output = item;
                self.formatOutput('item', callback);
            });
        });
    } else {
        this.formatOutput('item', callback);
    }
};

module.exports = ViewJson;