var fs          = require('fs');
var util        = require(process.cwd() + '/util/util.js');
var cache       = {};
var async       = require('async');
var Identifier  = require('./identifier.js');

function Loader() {

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
            fs.exists(process.cwd() + '/' + originalPath.toString().replace(/\./g,'/') + '.js', function(exists) {
                if (exists) {
                    self.create(originalPath, process.cwd() + '/' + originalPath.toString().replace(/\./g,'/') + '.js', function(obj) {
                        next(obj);
                    });
                } else {
                    next(null, originalPath);
                }
            });
        },
        function (originalPath, next) {
            // Does component exist?
            fs.exists(process.cwd() + '/' + originalPath.getPackage().replace(/\./g, '/'), function(exists) {
                if (exists) {
                    next(null, originalPath);
                } else {
                    // Error component does not exist
                    next({ error: true, message: 'component does not exist.' });
                }
            });
        },
        function (originalPath, next) {
            // File exists in default component?
            var defaultComponentPath = process.cwd() + '/' + originalPath.clone()
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
            var defaultCompontentPathDefault = process.cwd() + '/' + originalPath.clone()
                .setComponent('default')
                .setName('default')
                .toString()
                .replace(/\./g, '/') + '.js'

            fs.exists(defaultCompontentPathDefault, function(exists) {
                if (exists) {
                    self.create(originalPath, defaultCompontentPathDefault, function(obj) {
                        next(obj);
                    });
                } else {
                    next({ error: true, message: 'default does not exist.' });
                }
            });
        }
    ], function(result) {
        if (!result.error) {
            callback(result);
        } else {
            throw new Error(result.message);
        }
    });
};

Loader.prototype.load = function(path, config, callback) {
    console.log('load: ' + path);

    if (typeof path === 'string') {
        path = new Identifier(path);
    } else if (path instanceof Identifier === false){
        throw new Error('parameter path has to be of type string or Identifier');
    }

    this.resolve(path, function (object) {
        config.identifier = path;
        if (typeof object.initialize === 'function') {
            object.initialize(config, function() {
                callback(object);
            });
        } else {
            callback(object);
        }
    });
};

module.exports = Loader;