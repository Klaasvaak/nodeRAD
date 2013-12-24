function State() {
    this.data = { };
}

State.prototype.insert = function(name, value, unique) {
    unique = unique ? unique : false;

    this.data[name] = {
        name: name,
        value: value,
        unique: unique
    };

    return this;
};

State.prototype.isEmpty = function() {
    return this.size() == 0 ? true : false;
};

State.prototype.remove = function(name) {
    delete this.data[name];

    return this;
};

State.prototype.size = function() {
    return Object.keys(this.data).length;
};

State.prototype.isUnique = function() {
    for(var name in this.data) {
        var state = this.data[name];

        if (state.unique) {
            return true;
        }
    }

    return false;
};

State.prototype.get = function(key) {
    return this.data[key] ? this.data[key].value : undefined;
};

State.prototype.set = function(state) {
    this.insert(state.name, state.value);

    return this;
};

module.exports = State;
