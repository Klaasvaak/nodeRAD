var util = require('../util/util.js');

function BaseException(message) {
    this.message = message;
}

function ViewNotFound(message) {
    ViewNotFound.super_.apply(this, arguments);

    this.code = 404;
}

util.inherits(ViewNotFound, BaseException);

function MethodNotAllowed(message) {
    MethodNotAllowed.super_.apply(this, arguments);

    this.code = 405;
}

util.inherits(MethodNotAllowed, BaseException);

function BadRequest(message) {
    BadRequest.super_.apply(this, arguments);

    this.code = 400;
}

util.inherits(BadRequest, BaseException);

module.exports.BaseException = BaseException;
module.exports.ViewNotFound = ViewNotFound;
module.exports.MethodNotAllowed = MethodNotAllowed;
module.exports.BadRequest = BadRequest;