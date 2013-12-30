var fs          = require('fs');
var util        = require('../util/util.js');
var cache       = {};
var async       = require('async');
var Identifier  = require('./identifier.js');
var nconf       = require('nconf');

function Loader(root) {
    this.root = root || nconf.get('root');
}

Loader.prototype.create = function(originalPath, path, callback) {
    var Class = require(path);
    var obj = new Class();

    if (typeof obj.processBehaviors === 'function') {
        obj.processBehaviors(function() {
            cache[originalPath.toString()] = obj;
            callback(Object.create(obj));
        });
    } else {
        cache[originalPath.toString()] = obj;
        callback(Object.create(obj));
    }
};

Loader.prototype.resolve = function(path, callback) {
    var self = this;
    var originalPath = path.clone();

    async.waterfall([
        function (next) {
            // Get from cache
            var obj = undefined;
            if ((obj = cache[path.toString()]) === undefined) {
                next(null, originalPath);
            } else {
                next(Object.create(obj), originalPath);
            }
        },
        function (originalPath, next) {
            // Get new object if file exists
            fs.exists(self.root + '/' + originalPath.toString().replace(/\./g,'/') + '.js', function(exists) {
                if (exists) {
                    self.create(originalPath, self.root + '/' + originalPath.toString().replace(/\./g,'/') + '.js', function(obj) {
                        next(obj);
                    });
                } else {
                    next(null, originalPath);
                }
            });
        },
        function (originalPath, next) {
            // Does component exist?
            fs.exists(self.root + '/' + originalPath.getPackage().replace(/\./g, '/'), function(exists) {
                if (exists) {
                    next(null, originalPath);
                } else {
                    // Error component does not exist
                    next({ error: true, code: 404, message: 'component does not exist.' });
                }
            });
        },
        function (originalPath, next) {
            // File exists in default component?
            var defaultComponentPath = self.root + '/' + originalPath.clone()
                .setComponent('default')
                .toString()
                .replace(/\./g,'/') + '.js';

            fs.exists(defaultComponentPath, function(exists) {
                if (exists) {
                    self.create(originalPath, defaultComponentPath, function(obj) {
                        next(obj);
                    });
                } else {
                    next(null, originalPath);
                }
            });
        },
        function (originalPath, next) {
            // Default file exists in default component?

            var defaultCompontentPathDefault = self.root + '/' + originalPath.clone()
                .setComponent('default')
                .setName('default')
                .toString()
                .replace(/\./g, '/') + '.js';

            fs.exists(defaultCompontentPathDefault, function(exists) {
                if (exists) {
                    self.create(originalPath, defaultCompontentPathDefault, function(obj) {
                        next(obj);
                    });
                } else {
                    next({ error: true, code: 500, message: 'default does not exist.' });
                }
            });
        }
    ], function(result) {
        if (!result.error) {
            callback(null, result);
        } else {
            callback(result, null);
        }
    });
};

Loader.prototype.load = function(identifier, config, callback) {
    if (typeof identifier === 'string') {
        identifier = new Identifier(identifier);
    } else if (identifier instanceof Identifier === false){
        callback({error: true, code: 500, message: 'identifier is not of type string or Identifier.'}, null);
        return;
    }

    this.resolve(identifier, function (err, object) {
        if (object) {
            config.identifier = identifier;
            if (typeof object.initialize === 'function') {
                object.initialize(config, function() {
                    callback(err, object);
                });
            } else {
                callback(err, object);
            }
        } else {
            callback(err, object)
        }

    });
};

module.exports = Loader;