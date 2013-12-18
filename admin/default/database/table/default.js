var util = require(process.cwd() + '/util/util.js');
var Table = require(process.cwd() + '/core/database/table/table.js');

function TableDefault() {
    TableDefault.super_.apply(this, arguments);
}

util.inherits(TableDefault, Table);

module.exports = TableDefault;