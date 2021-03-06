var util            = require('../util/util.js');
var async           = require('async');
var ModelBase       = require('./base.js');
var squel           = require('squel');
var Loader          = require('../loader/loader.js');
var nconf           = require('nconf');
var Constants       = require('../database/table/constants.js');

function ModelTable() {
    ModelTable.super_.apply(this, arguments);

    // Set default states
    this.state.insert('limit', nconf.get('state_limit'))
        .insert('offset', 0)
        .insert('sort')
        .insert('direction')
        .insert('search');
}

util.inherits(ModelTable, ModelBase);

ModelTable.prototype.getList = function(callback) {
    console.log('getList');

    var self = this;

    if (!this.list) {
        async.waterfall([
            function(callback) {
                var queryBuilder = squel.select();

                callback(null, self, queryBuilder);
            },
            self.buildQueryColumns,
            self.buildQueryFrom,
            self.buildQueryJoins,
            self.buildQueryWhere,
            self.buildQueryGroup,
            self.buildQueryHaving,
            self.buildQueryOrder,
            self.buildQueryLimit
        ], function(err, result, query) {
                if (err) {
                    callback(err);
                    return;
                }

                console.log('model: ' + query.toString());
                self.getTable(function(err, table) {
                    if (err) {
                        callback(err);
                        return;
                    }

                    table.select(query, Constants.FETCH_ROWSET, function(err, result) {
                        if (!err) {
                            self.list = result;
                        }

                        callback(err, result);
                    });
                });
            }
        );
    } else {
        callback(null, this.list);
    }
};

ModelTable.prototype.getItem = function(callback) {
    var self = this;

    if (!this.item) {

        async.waterfall([
            function(next) {
                var queryBuilder = undefined;

                if (self.state.isUnique()) {
                    queryBuilder = squel.select();

                    async.waterfall([
                        function(callback) {
                            callback(null, self, queryBuilder);
                        },
                        self.buildQueryColumns,
                        self.buildQueryFrom,
                        self.buildQueryJoins,
                        self.buildQueryWhere,
                        self.buildQueryGroup,
                        self.buildQueryHaving,
                        self.buildQueryOrder,
                    ], function(err, result, query) {
                        next(err, result, query);
                    });
                } else {
                    next();
                }
            }
        ], function(err, result, query) {
            if (err) {
                callback(err);
                return;
            }

            // logging:
            if (query) {
                console.log('model ' + query.toString());
            } else {
                console.log('model get new item');
            }

            self.getTable(function(err, table) {
                if (err) {
                    callback(err);
                    return;
                }

                table.select(query, Constants.FETCH_ROW, function(err, result) {
                    if (!err) {
                        self.item = result;
                    }

                    callback(err, result);
                });
            });
        });


    } else {
        callback(null, this.item);
    }
};

ModelTable.prototype.getTotal = function(callback) {
    var self = this;

    if (this.total === undefined) {
        var queryBuilder = squel.select();
        queryBuilder.field('COUNT(*)', 'total');

        async.waterfall([
            function(next) {
                next(null, self, queryBuilder);
            },
            self.buildQueryFrom,
            self.buildQueryJoins,
            self.buildQueryWhere
        ], function(err, self, query) {
            if (err) {
                callback(err);
                return;
            }

            self.getTable(function(err, table) {
                if (err) {
                    callback(err);
                    return;
                }

                table.count(query, function(err, total) {
                    if(!err) {
                        self.total = total;
                    }

                    callback(err, total);
                });
            });
        });
    } else {
        callback(null, this.total);
    }
};

ModelTable.prototype.buildQueryColumns = function(self, query, next) {
    query.field('tbl.*');

    next(null, self, query);
};

ModelTable.prototype.buildQueryFrom = function(self, query, next) {
    self.getTable(function(err, table) {
        if (err) {
            next(err);
            return;
        }

        query.from(table.getName(), 'tbl');
        next(null, self, query);
    });
};

ModelTable.prototype.buildQueryJoins = function(self, query, next) {
    next(null, self, query);
};

ModelTable.prototype.buildQueryWhere = function(self, query, next) {

    next(null, self, query);
};

ModelTable.prototype.buildQueryGroup = function(self, query, next) {
    next(null, self, query);
};

ModelTable.prototype.buildQueryHaving = function(self, query, next) {
    next(null, self, query);
};

ModelTable.prototype.buildQueryOrder = function(self, query, next) {
    var order           = self.state.get('state');
    var directionState  = self.state.get('direction');
    var direction       = true;

    if (directionState === 'DESC') {
        direction = false;
    }

    if (order !== undefined) {
        query.order(order, direction);
    }

    next(null, self, query);
};

ModelTable.prototype.buildQueryLimit = function(self, query, next) {
    var limit = self.state.get('limit');

    if (limit !== undefined) {
        var offset = self.state.get('offset');

        query.limit(limit);

        if (offset !== undefined) {
            query.offset(offset);
        }
    }

    next(null, self, query);
};

ModelTable.prototype.finish = function(callback) {
    this.table.finish(callback);
};

ModelTable.prototype.getTable = function(callback) {
    var self = this;

    if (this.table === undefined) {
        var loader = new Loader();

        loader.load(this.identifier.clone().setPath('database.table'), { }, function(err, table) {
            if (!err) {
                self.table = table;
            }

            callback(err, self.table);
        });
    } else {
        callback(null, this.table);
    }
};


module.exports = ModelTable;
