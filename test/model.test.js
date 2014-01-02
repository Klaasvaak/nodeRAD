/**
 * Set configuration to point to the test env
 *
 */
var nconf   = require('nconf');

var chai    = require('chai');
var expect  = chai.expect;
var assert  = chai.assert;
chai.should();

var nconf = require('nconf');

var State       = require('../lib/model/state.js');
var ModelTable  = require('../lib/model/table.js');
var TablePeople = require('./env/admin/people/database/table/people.js');
var Loader      = require('../lib/loader/loader.js');

describe('Model', function() {

    describe('State', function() {
        it('should have a value for a state with a default value', function() {
            var state = new State();
            state.insert('bla', 'bla_default');
            expect(state.get('bla')).to.be.equal('bla_default');
        });

        it('should override a value for a state with a default value', function() {
            var state = new State();
            state.insert('bla', 'bla_default');
            expect(state.get('bla')).to.be.equal('bla_default');
            state.set('bla', 'new value');
            expect(state.get('bla')).to.be.equal('new value');
        });

        describe('#size()', function() {
            it('should have the correct value for size', function() {
                var state = new State();
                expect(state.size()).to.be.equal(0);
                state.insert('bla1');
                state.insert('bla2');
                state.insert('bla3', 'with a value');
                expect(state.size()).to.be.equal(3);
                expect(state.size(true)).to.be.equal(1);
            });
        });

        describe('#isEmpty()', function() {
            it('should have the correct value for isEmpty', function() {
                var state = new State();
                expect(state.isEmpty()).to.be.equal(true);
                state.insert('bla');
                expect(state.isEmpty()).to.be.equal(false);
                expect(state.isEmpty(true)).to.be.equal(true);
                state.insert('bla', 'with value');
                expect(state.isEmpty()).to.be.equal(false);
                expect(state.isEmpty(true)).to.be.equal(false);
            });
        });

        describe('#remove()', function() {
            it('should remove the correct state', function() {
                var state = new State();
                state.insert('bla', 'bla2');
                expect(state.data['bla'].value).to.be.equal('bla2');
                state.remove('bla');
                expect(state.data['bla']).to.be.equal(undefined);

                // Make sure size() and isEmpty() still work.
                expect(state.size()).to.be.equal(0);
                expect(state.size(true)).to.be.equal(0);
                expect(state.isEmpty()).to.be.equal(true);
                expect(state.isEmpty(true)).to.be.equal(true);
            });
        });

        describe('#isUnique()', function() {
            it('should return true if is has a state which is unique', function() {
                var state = new State();
                state.insert('bla', 'value', true);
                state.insert('bla2', 'value');
                expect(state.isUnique()).to.be.equal(true);
            });

            it('should return false if is has no unique state', function() {
                var state = new State();
                state.insert('bla', 'value');
                expect(state.isUnique()).to.be.equal(false);
            });
        });

        describe('#get() #set()', function() {
            it('should not set states which are not defined', function() {
                var state = new State();
                state.set('bla', 'bla_value');
                expect(state.get('bla')).to.be.equal(undefined);
            });

            it('should set states which are defined', function() {
                var state = new State();
                state.insert('bla');
                state.set('bla', 'bla_value');
                expect(state.get('bla')).to.be.equal('bla_value');
            });
        });
    });

    describe('Table', function() {

        it('should have the default state: limit, offset, sort, direction and search', function() {
            var model = new ModelTable();
            var state = model.getState()
            expect(state.data['limit']).to.not.be.equal(undefined);
            expect(state.data['offset']).to.not.be.equal(undefined);
            expect(state.data['sort']).to.not.be.equal(undefined);
            expect(state.data['direction']).to.not.be.equal(undefined);
            expect(state.data['search']).to.not.be.equal(undefined);
        });

        it('should have the correct value of limit which is present in the configuration', function() {
            nconf.overrides({
                'state_limit': 1337
            });
            var model = new ModelTable();
            var state = model.getState();
            expect(state.data['limit'].value).to.be.equal(1337);
        });

        describe('#getTable()', function() {
            it('should return an object of the type exposed in the correct file when it is overridden', function(done) {
                nconf.overrides({
                    'root': __dirname + '/env'
                });

                var loader = new Loader();
                loader.load('admin.people.model.people', {}, function(err, model) {
                    expect(err).to.be.equal(null);
                    model.getTable(function(err, table) {
                        expect(err).to.be.equal(null);
                        table.should.be.instanceOf(TablePeople);

                        done();
                    });
                });
            });

            it('should return an object of the default type when it is not overridden');
        });

        describe('#get() #set()', function() {
            it('should set the state when defined', function() {
                // using default state
                var model = new ModelTable();
                expect(model.get('offset')).to.be.equal(0);
                model.set('offset', 2);
                expect(model.get('offset')).to.be.equal(2);
                model.set('blaat', 'myValue');
                expect(model.get('blaat')).to.be.equal(undefined);
            });
        });

        describe('#getList()', function() {
            it('should get a list of people when calling getList on the PeopleModel');
        });

        describe('#getItem()', function() {

        });

        describe('#finish()', function() {
            it('should have no connection after it is called');
        });
    });


});