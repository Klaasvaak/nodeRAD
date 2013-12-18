var JsonDefault = require(process.cwd() + '/admin/default/view/default/json.js');
var util        = require(process.cwd() + '/util/util.js');

function JsonPeople() {
    JsonPeople.super_.apply(this, arguments);
}

util.inherits(JsonPeople, JsonDefault);

module.exports = JsonPeople;