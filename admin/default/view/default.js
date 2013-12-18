var util = require(process.cwd() + '/util/util.js');
var ViewHolder = require(process.cwd() + '/core/view/default.js');

function ViewDefault() {
    ViewDefault.super_.apply(this, arguments);
}

util.inherits(ViewDefault, ViewHolder);

module.exports = ViewDefault;
