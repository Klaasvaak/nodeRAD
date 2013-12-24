var util        = require('node-rad').Util;
var ModelTable  = require('node-rad').ModelTable;

function ModelDefault() {
    ModelTable.super_.apply(this, arguments);
}

util.inherits(ModelDefault, ModelTable);

module.exports = ModelDefault;
