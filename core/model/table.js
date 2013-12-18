var util            = require(process.cwd() + '/util/util.js');
var async           = require('async');
var ModelBase       = require('./base.js');
var squel           = require('squel');
var Loader          = require(process.cwd() + '/core/loader/loader.js');
var congifuration   = require(process.cwd() + '/configuration.js');

function ModelTable() {
    ModelTable.super_.apply(this, arguments);

    this.queryBuilder = undefined;

    // Set default states
    this.state.insert('limit', congifuration.state_limit)
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
                if (!self.queryBuilder) {
                    self.queryBuilder = squel.select({ autoQuoteTableNames: true, autoQuoteFieldNames: true });
                }

                callback(null, self, self.queryBuilder);
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
                console.log('model: ' + query.toString());
                self.getTable(function(table) {
                    table.select(query, function(result) {
                        self.list = result;
                        callback(result);
                    });
                });
            }
        );
    } else {
        callback(this.list);
    }
};

ModelTable.prototype.getItem = function(callback) {
    var self = this;

    if (!this.item) {
        async.waterfall([
            function(callback) {
                if (!self.queryBuilder) {
                    self.queryBuilder = squel.select({ autoQuoteTableNames: true, autoQuoteFieldNames: true });
                }

                callback(null, self, self.queryBuilder);
            },
            self.buildQueryColumns,
            self.buildQueryFrom,
            self.buildQueryJoins,
            self.buildQueryWhere,
            self.buildQueryGroup,
            self.buildQueryHaving,
            self.buildQueryOrder,
        ], function(err, result, query) {
                console.log('model ' + query.toString());
                self.getTable(function(table) {
                    table.select(query, function(result) {
                        self.item = result;
                        callback(result);
                    });
                });
            }
        );
    } else {
        callback(this.item);
    }
};

ModelTable.prototype.getTotal = function(callback) {

};

ModelTable.prototype.buildQueryColumns = function(self, query, next) {
    query.field('tbl.*');

    next(null, self, query);
};

ModelTable.prototype.buildQueryFrom = function(self, query, next) {
    self.getTable(function(table) {
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
    //TODO

    next(null, self, query);
};

ModelTable.prototype.buildQueryLimit = function(self, query, next) {
    var limit = self.state.get('limit');

    if (limit && limit.value !== undefined) {
        var offset = self.state.get('offset');

        query.limit(limit.value);

        if (offset && offset.value !== undefined) {
            console.log('offset');
            query.offset(offset.value);
        }
    }

    next(null, self, query);
};

ModelTable.prototype.finish = function() {
    this.table.finish();
};

ModelTable.prototype.getTable = function(callback) {
    var self = this;

    if (this.table === undefined) {
        var loader = new Loader();

        loader.load(this.identifier.clone().setPath('database.table'), { }, function(table) {
            self.table = table;
            callback(self.table);
        });
    } else {
        callback(this.table);
    }
};


module.exports = ModelTable;
