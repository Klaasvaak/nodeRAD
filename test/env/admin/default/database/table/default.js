var util    = require('node-rad').Util;
var Table   = require('node-rad').DatabaseTable;

function TableDefault() {
    TableDefault.super_.apply(this, arguments);
}

util.inherits(TableDefault, Table);

module.exports = TableDefault;