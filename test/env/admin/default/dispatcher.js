var util            = require('../../../../index.js').Util;
var DispatcherBase  = require('../../../../index.js').DispatcherBase;

function DispatcherDefault() {
    DispatcherDefault.super_.apply(this, arguments);
}

util.inherits(DispatcherDefault, DispatcherBase);

module.exports = DispatcherDefault;