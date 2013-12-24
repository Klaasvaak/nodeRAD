var util        = require('../util/util.js');
var ViewBase    = require('./base.js');
var inflector   = require('../inflector/inflector.js');
var async       = require('async');

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

ViewJson.prototype.formatOutput = function(callback) {
    this.output = JSON.stringify(tmp);

    callback(this.output);
};

// TODO: offset, limit, total, href, url
ViewJson.prototype.getList = function(callback) {
    var self = this;

    if (this.output === undefined) {
        async.waterfall([
            function(next) {
                next(null, self);
            },
            function(self, next) {
                self.getModel(function(model) {
                    next(null, model);
                });
            },
            function(self, model, next) {
                model.getList(function(list) {
                    next(null, model, list);
                });
            },
            function(self, model, list, next) {
                model.getTotal(function(total) {
                    next(null, list, total);
                });
            }
        ], function(err, list, total) {
            self.output = {
                list: list,
                total: total
            }
            self.formatOutput(callback);
        });
    } else {
        this.formatOutput(callback);
    }
};

ViewJson.prototype.getItem = function(callback) {
    var self = this;

    if (this.output === undefined) {
        this.getModel(function(model) {
            model.getItem(function(item) {
                self.output = {
                    item: item
                };
                self.formatOutput(callback);
            });
        });
    } else {
        this.formatOutput(callback);
    }
};

module.exports = ViewJson;