var util            = require('node-rad').Util;
var DispatcherBase  = require('node-rad').DispatcherBase;

function DispatcherDefault() {
    DispatcherDefault.super_.apply(this, arguments);
}

util.inherits(DispatcherDefault, DispatcherBase);

module.exports = DispatcherDefault;