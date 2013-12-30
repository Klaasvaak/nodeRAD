/**
 * Set configuration to point to the test env
 *
 */
var nconf   = require('nconf');
nconf.overrides({
    'root': __dirname + '/env'
});

var Loader  = require('../lib/loader/loader.js');
var loader  = new Loader();

var chai    = require('chai');
var expect  = chai.expect;
var assert  = chai.assert;
chai.should();

var ControllerDefault = require('./env/admin/default/controller/default.js');
var TablePeople = require('./env/admin/people/database/table/people.js');
var Identifier = require('../lib/loader/identifier.js');

describe('Loader', function() {
    console.log('rooooot' + nconf.get('root'));

    it('should load an object if a correct string is given as identifier parameter', function(done) {
        loader.load('admin.people.controller.people', {}, function(err, controller) {
            expect(err).to.be.equal(null);
            controller.should.be.an('object');

            done();
        });
    });

    it('should load an object if a correct identifier object is given as identifier parameter', function(done) {
        loader.load(new Identifier('admin.people.controller.people'), {}, function(err, controller) {
            expect(err).to.be.equal(null);
            controller.should.be.an('object');

            done();
        });
    });

    it('should return an error if the given parameter is not a string or not an identifier object', function(done) {
        loader.load(null, {}, function(err, object) {
            expect(err).to.be.a('object');
            expect(err).to.have.property('message');
            expect(err.message).to.equal('identifier is not of type string or Identifier.');
            expect(err).to.have.property('code');
            expect(err.code).to.equal(500);

            done();
        });
    });

    it('should return an error if component does not exist', function(done) {
        loader.load('admin.cars.model.cars', {}, function(err, model) {
            expect(err).to.be.a('object');
            expect(err).to.have.property('message');
            expect(err.message).to.equal('component does not exist.');
            expect(err).to.have.property('code');
            expect(err.code).to.equal(404);

            done();
        });
    });

    it('should return an object of type default controller if component exist but the controller file is not overridden', function(done) {
        loader.load('admin.people.controller.people', {}, function(err, controller) {
            expect(err).to.be.equal(null);
            controller.should.be.instanceOf(ControllerDefault);

            done();
        });
    });

    it('should return an object of the type exposed in the file if component exist and the file is overridden', function(done) {
        loader.load('admin.people.database.table.people', {}, function(err, table) {
            expect(err).to.be.equal(null);
            table.should.be.instanceOf(TablePeople);

            done();
        });
    });

});