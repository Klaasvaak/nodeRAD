var configuration   = require(process.cwd() + '/configuration.js');
var Loader          = require(process.cwd() + '/core/loader/loader.js');
var fs              = require('fs');
var Exceptions      = require('./exceptions.js');
var inflector       = require(process.cwd() + '/core/inflector/inflector.js');

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
        this.format = this.query.format ? this.query.format : configuration.default_format;
    }

    return this.format;
};

ControllerBase.prototype.loadView = function(callback) {
    var self = this;

    if (!this.query.view) {
        callback(undefined);
    } else {
        var viewIdentifier = self.identifier.clone()
            .setPath('view')
            .setName(self.query.view);

        var loader = new Loader();
        this.getViewConfig(function(viewConfig) {
            loader.load(viewIdentifier.toString(), viewConfig,  function(view) {
                self.view = view;
                callback(view);
            });
        });
    }
};

ControllerBase.prototype.getViewConfig = function(callback) {
    var format = this.getFormat();
    var name = this.query.view;
    this.getModel(function(model) {
        callback({
            format: format,
            model: model,
            name: name
        });
    });


};

ControllerBase.prototype.getView = function(callback) {
    if (!this.view) {
        this.loadView(callback);
    } else {
        callback(this.view);
    }
};

ControllerBase.prototype.getModel = function(callback) {
    var self = this;

    if (!this.model) {
        var loader = new Loader();
        loader.load(this.identifier.clone().setPath('model'), {}, function(model) {
            self.model = model;
            callback(model);
        });
    } else {
        callback(this.model);
    }
};

ControllerBase.prototype.getAction = function() {
    return this.query.action ? this.query.action : this.request.method;
};

ControllerBase.prototype.execute = function() {
    var self = this;

    this.getView(function(view) {
        if (!view) {
            self.response.end('view not found');
        } else {
            self.getModel(function(model) {
                if (!model) {
                    self.response.end('model not found');
                } else {
                    self.doAction(self.getAction(), model, view, function(result) {
                        self.handleOutput(self.response, result);
                        self.getModel(function(model) {
                            model.finish();
                        });
                    });
                }
            });
        }
    });
};

ControllerBase.prototype.handleOutput = function(response, result) {
    if (result instanceof Exceptions.BaseException) {
        response.writeHead(result.code);
        response.end(result.message);
    } else {
        // TODO status code
        response.end(result);
    }
};

ControllerBase.prototype.doAction = function(action, model, view, callback) {
    action = 'action' + action.capitalize(true);
    if (typeof this[action] === 'function') {
        this[action](model, view, callback);
    } else {
        callback(new Exceptions.ViewNotFound('action: ' + action + ' not found.'));
    }
};

ControllerBase.prototype.actionGet = function(model, view, callback) {
    if (inflector.isSingular(view.identifier.getName())) {
        this.doAction('read', model, view, callback);
    } else {
        this.doAction('browse', model, view, callback);
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

ControllerBase.prototype.actionRead = function(model, view, callback) {
    model.getItem(function(item) {
        view.setOutput(item, function() {
            view.display(callback);
        });
        view.display(callback);
    });
};

ControllerBase.prototype.actionBrowse = function(model, view, callback) {
    model.getList(function(list) {
        view.setOutput(list, function() {
            view.display(callback);
        });
    });
};

module.exports = ControllerBase;