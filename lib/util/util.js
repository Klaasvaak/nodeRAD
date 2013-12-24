var Util = require('util');

Util.extend = function(a, b) {
    for (var x in b) a[x] = b[x]
};

Util.mixin = function(target, mixable) {
    if (typeof mixable.getMixableFunction === 'function') {
        var mixableFunctions = mixable.getMixableFunction();
        for(var x in mixableFunctions) {
            target[x] = mixableFunctions[x];
        }
    } else {
        Util.extend(target, mixable);
    }
};

module.exports = Util;

