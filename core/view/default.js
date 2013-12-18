// TODO: find better solution on how to handle views.

var Loader = require(process.cwd() + '/core/loader/loader.js');
var fs     = require('fs');

function DefaultView() {

    console.log('created Defaultview');
}

DefaultView.prototype.initialize = function(config, next) {
    this.config     = config;
    this.identifier = config.identifier;

    console.log('init Defaultview');


    next();
};

DefaultView.prototype.getView = function(callback) {
    var self = this;

    if (!this.view) {
        console.log('creating view');
        fs.exists(process.cwd() + this.identifier.toString().replace(/\./g, '/') + '/' + this.config.format + '.js', function(extists) {
            var View = undefined;
            if (extists) {
                View = require(process.cwd() + this.identifier.toString().replace(/\./g, '/') + '/' + this.config.format + '.js');
            } else {
                View = require('./' + self.config.format + '.js');
            }

            self.view = new View();
            self.view.initialize(self.config, function() {
                callback(self.view);
            });
        });
    } else {
        callback(this.view);
    }
};

DefaultView.prototype.display = function(next) {
    this.getView(function(view) {
        view.display(next);
    });
};

DefaultView.prototype.setOutput = function(value, next) {
    this.getView(function(view) {
        view.setOutput(value);
        next();
    });
};

module.exports = DefaultView;