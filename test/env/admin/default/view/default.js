var util        = require('../../../../../index.js').Util;
var ViewHolder  = require('../../../../../index.js').ViewHandler;

function ViewDefault() {
    ViewDefault.super_.apply(this, arguments);
}

util.inherits(ViewDefault, ViewHolder);

module.exports = ViewDefault;
