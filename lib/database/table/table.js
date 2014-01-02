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
        function(next) {
            self.executeBehaviorFunction(self.behaviors, context, 'beforeSelect', next);
        },
        function(next) {
            self.isConnected(function(err, connection) {
                if (err) {
                    next(err);
                    return;
                }

                connection.query(query, function(err, rows) {
                    if (mode === Constants.FETCH_ROW) {
                        next(err, rows[0]);
                    } else if (mode === Constants.FETCH_ROWSET) {
                        next(err, rows);
                    } else {
                        // TODO error
                        next({ error: true, message: "unknown mode"});
                    }
                });
            });
        },
        function(result, next) {
            context.result = result;
            self.executeBehaviorFunction(self.behaviors, context, 'afterSelect', function() {
                next(null, result);
            });
        }
    ], function(err, result) {
        callback(err, result);
    });
};

Table.prototype.count = function(query, callback) {
    self.isConnected(function(err, connection) {
        if (err) {
            callback(err);
            return;
        }

        connection.query(query, function(err, rows) {
            callback(null, rows[0].total);
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
                callback(err);
                console.log(err);
                return;
            }

            self.connection = connection;
            callback(null, self.connection);
        });
    } else {
        callback(null, this.connection);
    }
};

Table.prototype.getName = function() {
    return this.name;
};

Table.prototype.finish = function(callback) {
    if (this.connection) {
        this.connection.release();
        this.connection = undefined;
    }

    callback && callback();
};

module.exports = Table;