var util        = require('node-rad').Util;
var ViewHolder  = require('node-rad').ViewHandler;

function ViewDefault() {
    ViewDefault.super_.apply(this, arguments);
}

util.inherits(ViewDefault, ViewHolder);

module.exports = ViewDefault;
