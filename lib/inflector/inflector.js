/**
 * Inflector class to allow REST
 *
 * @class Inflector
 * @since 30 August 2013
 * @author Jasper van Rijbroek <jasper@moyoweb.nl>
 * @constructor set the basic rules
 */
function Inflector() {
    this.plurals = [
        [/move$/i, 'moves'],
        [/sex$/i,'sexes'],
        [/child$/i, 'children'],
        [/man$/i, 'men'],
        [/foot$/i, 'feet'],
        [/person$/i, 'people'],
        [/taxon$/i, 'taxa'],
        [/(quiz)$/i, '$1zes'],
        [/^(ox)$/i, '$1en'],
        [/(m|l)ouse$/i, '$1ice'],
        [/(matr|vert|ind|suff)ix|ex$/i, '$1ices'],
        [/(x|ch|ss|sh)$/i, '$1es'],
        [/([^aeiouy]|qu)y$/i, '$1ies'],
        [/(?:([^f])fe|([lr])f)$/i, '$1$2ves'],
        [/sis$/i, 'ses'],
        [/([ti]|addend)um$/i, '$1a'],
        [/(alumn|formul)a$/i, '$1ae'],
        [/(buffal|tomat|her)o$/i, '$1oes'],
        [/(bu)s$/i, '$1ses'],
        [/(alias|status)$/i, '$1es'],
        [/(octop|vir)us$/i, '$1i'],
        [/(gen)us$/i, '$1era'],
        [/(ax|test)is$/i, '$1es'],
        [/s$/i, 's'],
        [/$/, 's']
    ];

    this.singulars = [
        [/cookies$/i, 'cookie'],
        [/moves$/i, 'move'],
        [/sexes$/i, 'sex'],
        [/children$/i, 'child'],
        [/men$/i, 'man'],
        [/feet$/i, 'foot'],
        [/people$/i, 'person'],
        [/taxa$/i, 'taxon'],
        [/databases$/i, 'database'],
        [/(quiz)zes$/i, '$1'],
        [/(matr|suff)ices$/i, '$1ix'],
        [/(vert|ind)ices$/i, '$1ex'],
        [/^(ox)en/i, '$1'],
        [/(alias|status)es$/i, '$1'],
        [/(alias|status)$/i, '$1'],
        [/(tomato|hero|buffalo)es$/i, '$1'],
        [/([octop|vir])i$/i, '$1us'],
        [/(gen)era$/i, '$1us'],
        [/(cris|^ax|test)es$/i, '$1is'],
        [/(shoe)s$/i, '$1'],
        [/(o)es$/i, '$1'],
        [/(bus)es$/i, '$1'],
        [/([m|l])ice$/i, '$1ouse'],
        [/(x|ch|ss|sh)es$/i, '$1'],
        [/(m)ovies$/i, '$1ovie'],
        [/(s)eries$/i, '$1eries'],
        [/([^aeiouy]|qu)ies$/i, '$1y'],
        [/([lr])ves$/i, '$1f'],
        [/(tive)s$/i, '$1'],
        [/(hive)s$/i, '$1'],
        [/([^f])ves$/i, '$1fe'],
        [/(^analy)ses$/i, '$1sis'],
        [/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)ses$/i, '$1$2sis'],
        [/([ti]|addend)a$/i, '$1um'],
        [/(alumn|formul)ae$/i, '$1a'],
        [/(n)ews$/i, '$1ews'],
        [/(.*)ss$/i, '$1ss'],
        [/(.*)s$/i, '$1']
    ];

    this.uncountables = [
        'aircraft',
        'cannon',
        'deer',
        'equipment',
        'fish',
        'information',
        'money',
        'moose',
        'rice',
        'series',
        'sheep',
        'species',
        'swine'
    ];

    this.defined = [];
}

Inflector.prototype.define = function(single, plural) {
    this.defined.push({ single: single, plural: plural});
};

Inflector.prototype.isDefined = function(property, word) {
    var definedWord = undefined;

    for(var i = 0; i < this.defined.length; i++) {
        definedWord = this.defined[i];

        if (definedWord[property] === word) {
            return true;
        }
    }

    return false;
};

Inflector.prototype.getDefined = function(property, word) {
    var definedWord = undefined;

    for(var i = 0; i < this.defined.length; i++) {
        definedWord = this.defined[i];

        if (definedWord[property] === word) {
            return definedWord;
        }
    }

    return undefined;
};

/**
 * singularize function will make a singular of a plural word
 * If the word is singular it will do nothing.
 *
 * @method singularize
 * @param {String} word Word to singularize
 * @returns {String} Singular word
 */
Inflector.prototype.singularize = function(word) {
    var defined;
    if ((defined = this.getDefined('plural', word)) !== undefined) {
        return defined.single;
    }

    var wlc = word.toLowerCase();

    for (var i = 0; i < this.uncountables.length; i++) {
        var uncountable = this.uncountables[i];
        if (wlc == uncountable) {
            return word;
        }
    }

    for (var i = 0; i < this.singulars.length; i++) {
        var rule = this.singulars[i][0];
        var replacement = this.singulars[i][1];
        if (rule.test(word) !== false) {
            return word.replace(rule, replacement);
        }
    }

    return word;
};

/**
 * pluralize function will make a plural from a singular word
 * when the word is plural it will do nothing
 *
 * @method pluralize
 * @param {string} word Word to pluralize
 * @returns {String} Plural word
 */
Inflector.prototype.pluralize = function (word) {
    var defined;
    if ((defined = this.getDefined('single', word)) !== undefined) {
        return defined.plural;
    }

    // Make the word singular.
    word = this.singularize(word);
    var wlc = word.toLowerCase();

    for (var i = 0; i < this.uncountables.length; i++) {
        var uncountable = this.uncountables[i];
        if (wlc === uncountable) {
            return word;
        }
    }

    for (var i = 0; i < this.plurals.length; i++) {
        var rule = this.plurals[i][0];
        var replacement = this.plurals[i][1];

        if (rule.test(word) !== false) {
            return word.replace(rule, replacement);
        }
    }

    return word;
};

/**
 * isSingular function will check if the word is singular or not.
 * If the work is singular it returns true, else false is returned
 *
 * @method isSingular
 * @param {String} word The word to check
 * @returns {boolean} True or false.
 */
Inflector.prototype.isSingular = function(word) {
    return this.singularize(this.pluralize(word)) === word;
};

/**
 * isPlural function will check if the word is plural or not.
 * If the work is plural it returns true, else false is returned
 *
 * @method isPlural
 * @param {String} word The word to check
 * @returns {boolean} True or false.
 */
Inflector.prototype.isPlural = function(word) {
    return this.pluralize(this.singularize(word)) === word;
};

module.exports = new Inflector();