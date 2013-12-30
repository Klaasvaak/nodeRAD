var util            = require('../../../../../index.js').Util;
var ControllerBase  = require('../../../../../index.js').ControllerBase;

function ControllerDefault() {
    ControllerDefault.super_.apply(this, arguments);
}

util.inherits(ControllerDefault, ControllerBase);

module.exports = ControllerDefault;