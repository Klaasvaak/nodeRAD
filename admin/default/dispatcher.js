var util            = require(process.cwd() + '/util/util.js');
var DispatcherBase  = require(process.cwd() + '/core/dispatcher/dispatcher.js');

function DispatcherDefault() {
    DispatcherDefault.super_.apply(this, arguments);
}

util.inherits(DispatcherDefault, DispatcherBase);

module.exports = DispatcherDefault;