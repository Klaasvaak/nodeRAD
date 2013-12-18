var util = require(process.cwd() + '/util/util.js');
var ControllerBase = require(process.cwd() + '/core/controller/base.js');

function ControllerDefault() {
    ControllerDefault.super_.apply(this, arguments);
}

util.inherits(ControllerDefault, ControllerBase);

module.exports = ControllerDefault;