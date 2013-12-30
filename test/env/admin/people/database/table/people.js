var util            = require('../../../../../../index.js').Util;
var TableDefault    = require('../../../default/database/table/default.js');

function TablePeople() {
    TablePeople.super_.apply(this, arguments);
}

util.inherits(TablePeople, TableDefault);

module.exports = TablePeople;