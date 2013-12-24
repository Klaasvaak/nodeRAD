var Loader          = require('../../loader/loader.js');
var async           = require('async');
var getConnection   = require('../connection.js');
var Constants       = require('./constants.js');

function Table() {
    this.connection = undefined;
    this.behaviors = undefined;
}

Table.prototype.initialize = function(config, next) {
    this.identifier = config.identifier;
    this.name       = config.name;

    if (!this.name) {
        this.name = this.identifier.getName();
    }

    next();
};

Table.prototype.processBehaviors = function(callback) {
    var self = this;
    var loader = new Loader();

    if (Array.isArray(this.behaviors)) {
        var i = 0;
        async.each(this.behaviors, function(element, next) {
            loader.load(element.identifier, element.config, function(behavior) {
                self.behaviors[i] = behavior;
                i++;
                next(null);
            });
        }, function() {
            callback();
        });
    } else {
        callback();
    }
};

Table.prototype.executeBehaviorFunction = function(behaviors, context, name, callback) {
    if (Array.isArray(behaviors)) {
        async.each(behaviors, function(element, next) {
            if (typeof element[name] === 'function') {
                element[name](context, function() {
                    next(null);
                });
            } else {
                next(null);
            }
        }, function() {
            callback(null);
        });
    } else {
        callback(null);
    }
};

Table.prototype.select = function(query, mode, callback) {
    if (typeof query !== 'string') {
        query = query.toString();
    }

    var self = this;

    var context = {};
    context.table = this;
    context.query = query;

    async.waterfall([
        function(callback) {
            self.executeBehaviorFunction(self.behaviors, context, 'beforeSelect', callback);
        },
        function(callback) {
            self.isConnected(function(connection) {
                connection.query(query, function(err, rows) {
                    if (mode === Constants.FETCH_ROW) {
                        callback(err, rows[0]);
                    } else if (mode === Constants.FETCH_ROWSET) {
                        callback(err, rows);
                    } else {
                        // TODO error
                        callback({ error: true, message: "unknown mode"});
                    }
                });
            });
        },
        function(result, callback) {
            context.result = result;
            self.executeBehaviorFunction(self.behaviors, context, 'afterSelect', function() {
                callback(null, result);
            });
        }
    ], function(err, result) {
        if (!err) {
            callback(result);
        } else {
            console.log(err);
        }
    });
};

Table.prototype.count = function(query, callback) {
    self.isConnected(function(connection) {
        connection.query(query, function(err, rows) {
            callback(rows[0].total);
        });
    });
};

Table.prototype.update = function(query, callback) {

};

Table.prototype.insert = function(query, callback) {

};

Table.prototype.delete = function(query, callback) {

};

Table.prototype.isConnected = function(callback) {
    var self = this;

    if(this.connection === undefined) {
        getConnection(function(err, connection) {
            if (err) {
                console.log(err);
            } else {
                self.connection = connection;
                callback(self.connection);
            }
        });
    } else {
        callback(this.connection);
    }
};

Table.prototype.getName = function() {
    return this.name;
};

Table.prototype.finish = function() {
    if (this.connection) {
        this.connection.release();
    }
};

module.exports = Table;