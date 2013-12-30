var inflector = require('../lib/inflector/inflector.js');

function isSingular(word, expected) {
    it(word + (expected ? ' should be singular' : ' should not be singular'), function(done) {
        inflector.isSingular(word).should.equal(expected);
        done();
    });
}

function pluralize(word, expected) {
    it(word + ' should return the string ' + expected, function(done) {
        inflector.pluralize(word).should.equal(expected);
        done();
    });
}

function isPlural (word, expected) {
    it(word + (expected ? ' should be plural' : ' should not be plural'), function(done) {
        inflector.isPlural(word).should.equal(expected);
        done();
    });
}

function singularize(word, expected) {
    it(word + ' should return the string ' + expected, function(done) {
        inflector.singularize(word).should.equal(expected);
        done();
    });
}

describe('Inflector', function() {

    describe('#pluralize()', function() {
        pluralize('wolf', 'wolves');
        pluralize('alumunium', 'alumunia');
        pluralize('formula', 'formulae');
    });

    describe('#isPlural()', function() {
        isPlural('wolves', true);
        isPlural('alumunia', true);
        isPlural('formulae', true);

        isPlural('wolf', false);
        isPlural('alumunium', false);
        isPlural('formula', false);
    });

    describe('#singularize()', function() {
        singularize('wolves', 'wolf');
        singularize('alumunia', 'alumunium');
        singularize('formulae', 'formula');
    });

    describe('#isSingular()', function() {
        isSingular('wolf', true);
        isSingular('alumunium', true);
        isSingular('formula', true);

        isSingular('wolves', false);
        isSingular('alumunia', false);
        isSingular('formulae', false);
    });

    describe('#define() with #pluralize() and #singularize()', function() {
        it('should return the string chickens if chickens is defined as plural of wolf', function(done) {
            inflector.define('wolf', 'chickens');
            inflector.pluralize('wolf').should.equal('chickens');
            inflector.singularize('chickens').should.equal('wolf');

            done();
        });
    });

});