var JsonBase    = require(process.cwd() + '/core/view/json.js');
var util        = require(process.cwd() + '/util/util.js');

function JsonDefault() {
    JsonDefault.super_.apply(this, arguments);
}

util.inherits(JsonDefault, JsonBase);

module.exports = JsonDefault;