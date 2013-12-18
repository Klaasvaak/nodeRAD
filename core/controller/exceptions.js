var util = require(process.cwd() + '/util/util.js');

function BaseException(message) {
    this.message = message;
}

function ViewNotFound(message) {
    ViewNotFound.super_.apply(this, arguments);

    this.code = 404;
}

util.inherits(ViewNotFound, BaseException);

module.exports.BaseException = BaseException;
module.exports.ViewNotFound = ViewNotFound;