var util = require(process.cwd() + '/util/util.js');
var ModelDefault = require(process.cwd() + '/admin/default/model/default.js');

function PeopleModel() {
    console.log('people');
    ModelDefault.super_.apply(this, arguments);
}

util.inherits(PeopleModel, ModelDefault);

PeopleModel.prototype.buildQueryWhere = function (self, query, next) {
    if(self.state.get('search')) {
        query.where('tbl.name LIKE ?', '%' + self.state.get('search') + '%');
    }

    next(null, self, query);
};

module.exports = PeopleModel;
