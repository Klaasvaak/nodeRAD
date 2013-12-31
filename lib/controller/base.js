var nconf           = require('nconf');
var Loader          = require('../loader/loader.js');
var fs              = require('fs');
var Exceptions      = require('./exceptions.js');
var inflector       = require('../inflector/inflector.js');

String.prototype.capitalize = function(lower) {
    return (lower ? this.toLowerCase() : this).replace(/(?:^|\s)\S/g, function(a) { return a.toUpperCase(); });
};

function ControllerBase() {

}

ControllerBase.prototype.initialize = function(config, next) {
    this.model      = config.model;
    this.view       = config.view;
    this.identifier = config.identifier;
    this.request    = config.req;
    this.response   = config.res;
    this.query      = config.query; //query params
    this.format     = config.format;

    next();
};

ControllerBase.prototype.getFormat = function() {
    if (!this.format) {
        this.format = this.query.format ? this.query.format : nconf.get('default_format');
    }

    return this.format;
};

ControllerBase.prototype.loadView = function(callback) {
    if (!this.query.view) {
        callback(new Exceptions.BadRequest('parameter view not found.'));
    } else {
        var self = this;

        var viewIdentifier = self.identifier.clone()
            .setPath('view')
            .setName(self.query.view);

        this.getModel(function(err, model) {
            if (err) {
                callback(err);
            } else {
                var loader = new Loader();
                loader.load(viewIdentifier, self.getViewConfig(model),  function(err, view) {
                    if (!err) {
                        self.view = view;
                    }

                    callback(err, view);
                });
            }
        });
    }
};

ControllerBase.prototype.getViewConfig = function(model) {
    var format = this.getFormat();
    var name = this.query.view;

    return {
        format: format,
        model: model,
        name: name
    }
};

ControllerBase.prototype.getView = function(callback) {
    if (!this.view) {
        this.loadView(callback);
    } else {
        callback(null, this.view);
    }
};

ControllerBase.prototype.getModel = function(callback) {
    if (!this.model) {
        var self = this;

        var loader = new Loader();
        loader.load(this.identifier.clone().setPath('model'), {}, function(err, model) {
            if (!err) {
                self.model = model;
            }
            callback(err, model);
        });
    } else {
        callback(null, this.model);
    }
};

ControllerBase.prototype.getAction = function() {
    return this.query.action ? this.query.action : this.request.method;
};

ControllerBase.prototype.execute = function(callback) {
    var self = this;

    this.getView(function(err, view) {
        if (err) {
            callback(err);
        } else {
            self.getModel(function(err, model) {
                if (err) {
                    callback(err);
                } else {
                    self.doAction(self.getAction(), function(err, result) {
                        if (err) {
                            callback(err);
                            return;
                        }

                        self.render(view, model, result, callback);
                    });
                }
            });
        }
    });
};

ControllerBase.prototype.finish = function() {
    if (this.model) {
        this.model.finish();
    }
};

/**
 * Puts the result into an object with:
 * If list: href, url, offset, limit, total.
 * If item: href, url
 * Injects the object into the view.
 * Let the view render the object.
 *
 * @param view
 * @param model
 * @param result
 * @param callback
 */
ControllerBase.prototype.render = function(view, model, result, callback) {
    // TODO href, url, offset, limit, total.
    var self = this;

    var toDisplay = {};
    if (result instanceof Array) {
        model.getTotal(function(total) {
            toDisplay['items'] = result;
            toDisplay['total'] = total;
            view.setOutput(result, function() {
                view.display(callback);
                self.finish();
            });
        });
    } else {
        toDisplay['item'] = result;
        view.setOutput(result, function() {
            view.display(callback);
            self.finish();
        });
    }
};

ControllerBase.prototype.doAction = function(action, callback) {
    action = 'action' + action.capitalize(true);
    if (typeof this[action] === 'function') {
        this[action](callback);
    } else {
        callback(new Exceptions.MethodNotAllowed('action: ' + action + ' not allowed.'));
    }
};

ControllerBase.prototype.actionGet = function(callback) {
    if (inflector.isSingular(this.query.view)) {
        this.doAction('read', callback);
    } else {
        this.doAction('browse', callback);
    }
};

// TODO
ControllerBase.prototype.actionPost = function() {
    // If unique
    this.doAction('edit');
    // else
    this.doAction('add');
};

// TODO
ControllerBase.prototype.actionDelete = function() {

};

// TODO
ControllerBase.prototype.actionPut = function() {
    // If unique
    this.doAction('edit');
    // else
    this.doAction('add');
};

// TODO
ControllerBase.prototype.actionEdit = function() {

};

// TODO
ControllerBase.prototype.actionAdd = function() {

};

ControllerBase.prototype.actionRead = function(callback) {
    this.getModel(function(err, model) {
        if (err) {
            callback(err);
        } else {
            model.getItem(function(err, item) {
                callback(err, item);
            });
        }
    });
};

ControllerBase.prototype.actionBrowse = function(callback) {
    this.getModel(function(err, model) {
        if (err) {
            callback(err);
        } else {
            model.getList(function(err, list) {
                callback(err, list);
            });
        }
    });
};

module.exports = ControllerBase;