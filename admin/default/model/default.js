var util = require(process.cwd() + '/util/util.js');
var ModelTable = require(process.cwd() + '/core/model/table.js');

function ModelDefault() {
    ModelTable.super_.apply(this, arguments);
}

util.inherits(ModelDefault, ModelTable);

ModelDefault.prototype.initialize = function(config, next) {
    ModelDefault.super_.prototype.initialize.call(this, config, function() {
        console.log('init from default!');
        next();
    });
};

module.exports = ModelDefault;
