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

State.prototype.isEmpty = function(withValue) {
    return this.size(withValue) === 0;
};

State.prototype.remove = function(name) {
    delete this.data[name];

    return this;
};

State.prototype.size = function(withValue) {
    if (withValue) {
        var size = 0;

        for(name in this.data) {
            if (this.data[name].value !== undefined && this.data[name].value !== null) {
                size++;
            }
        }

        return size;
    }

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

State.prototype.set = function(name, value) {
    for(var state in this.data) {
        if (state === name) {
            this.data[state].value = value;
            break;
        }
    }

    return this;
};

module.exports = State;
