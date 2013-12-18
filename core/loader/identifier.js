var util = require('util');

function Identifier(value) {
    this.value = value;
}

Identifier.prototype.getName = function() {
    var parts = this.value.split('.');
    return parts[parts.length - 1];
};

Identifier.prototype.setName = function(name) {
    var parts = this.value.split('.');
    parts[parts.length - 1] = name;
    this.value = parts.join('.');

    return this;
};

Identifier.prototype.setComponent = function(component) {
    var parts = this.value.split('.');
    parts[1] = component;
    this.value = parts.join('.');

    return this;
};

Identifier.prototype.getComponent = function() {
    var parts = this.value.split('.');
    return parts[1];
};

Identifier.prototype.getPath = function() {
    var parts = this.value.split('.');
    parts.splice(0, 2);
    parts.splice(parts.length - 1);
    return parts.join('.');
};

Identifier.prototype.setPath = function(path) {
    this.value = this.getPackage() + '.' + path + '.' + this.getName();

    return this;
};

Identifier.prototype.getPackage = function() {
    return this.value.split('.').splice(0, 2).join('.');
};

Identifier.prototype.toString = function() {
    return this.value;
};

Identifier.prototype.clone = function() {
    return new Identifier(this.value);
};

module.exports = Identifier;