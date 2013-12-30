var util            = require('../../../../../../index.js').Util;
var DatabaseTable   = require('../../../../../../index.js').DatabaseTable;

function TableDefault() {
    TableDefault.super_.apply(this, arguments);
}

util.inherits(TableDefault, DatabaseTable);

module.exports = TableDefault;