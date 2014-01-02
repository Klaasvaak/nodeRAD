var util        = require('../../../../../index.js').Util;
var ModelTable  = require('../../../../../index.js').ModelTable;

function ModelDefault() {
    ModelTable.super_.apply(this, arguments);
}

util.inherits(ModelDefault, ModelTable);

module.exports = ModelDefault;
