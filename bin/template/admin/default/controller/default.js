var util            = require('node-rad').Util;
var ControllerBase  = require('node-rad').ControllerBase;

function ControllerDefault() {
    ControllerDefault.super_.apply(this, arguments);
}

util.inherits(ControllerDefault, ControllerBase);

module.exports = ControllerDefault;