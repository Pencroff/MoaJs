/**
 * Created with WebStorm.
 * Project: GeneticJs
 * User: Sergii Danilov
 * Date: 11/27/13
 * Time: 12:21 PM
 */
/*global require:true, module:true*/
var requirejs = require('requirejs');
requirejs.config({
    //Use node's special variable __dirname to
    //get the directory containing this file.
    //Useful if building a library that will
    //be used in node but does not require the
    //use of node outside
    baseUrl: __dirname,
    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require,
    paths: {
        'Moa': '../../../moa.min',
        'mixinsSrc/MixSearch': '../src/MixSearch'
    }
});
requirejs('mixinsSrc/MixSearch');
var Moa = requirejs('Moa'),
    base = {
        $mixin: {
            algorithm: 'mixSearch'
        }
    },
    Ctor = Moa.define('base', base),
    item = new Ctor(),
    example = '0123456789ABCDEF',
    arrExample = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'],
    literalExample = {'0': '0', '1': '1', '2': '2', '3': '3',
                        '4': '4', '5': '5', '6': '6', '7': '7',
                        '8': '8', '9': '9', 'A': 'A', 'B': 'B',
                        'C': 'C', 'D': 'D', 'E': 'E', 'F': 'F'},
    len = example.length,
    arrLen = arrExample.length;

// A test suite
module.exports = {
    name: 'indexOf benchmark',
    tests: {
        'Str Native indexOf': function () {
            'use strict';
            var i = example.indexOf('E');
        },
        'Str Linear search': function () {
            'use strict';
            var i = item.linearSearch('E', example, len);
        },
        'Str Binary search': function () {
            'use strict';
            var i = item.binarySearch('E', example, len);
        },
        'Array Native indexOf': function () {
            'use strict';
            var i = arrExample.indexOf('E');
        },
        'Array Linear search': function () {
            'use strict';
            var i = item.linearSearch('E', arrExample, arrLen);
        },
        'Array Binary search': function () {
            'use strict';
            var i = item.binarySearch('E', arrExample, arrLen);
        },
        'Literal Native access': function () {
            'use strict';
            var i = literalExample['E'];
        },
        'Literal Linear search': function () {
            'use strict';
            var i = item.linearSearch('E', literalExample, arrLen);
        },
        'Literal Binary search': function () {
            'use strict';
            var i = item.binarySearch('E', literalExample, arrLen);
        }
    }
};