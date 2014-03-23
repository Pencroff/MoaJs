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
        'Moa': '../src/moa'
    }
});
var Moa = requirejs('Moa'),
    item = {
        manualResolvingProperty: function () {
            'use strict';
            var CtorA = Moa.define('typeA'),
                CtorB = Moa.define('typeB.2'),
                CtorC = Moa.define('typeC'),
                Ctor = Moa.define('Type'),
                itemType = new Ctor();
            itemType.a = new CtorA();
            itemType.b = CtorB.getInstance();
            itemType.c = CtorC;
            return itemType;
        },
        iocResolvingProperty: function () {
            'use strict';
            return Moa.resolve('Type');
        }
    };
Moa.clear();

Moa.define('typeA', {});
Moa.define('typeB.1', {
    $di: {
        $current: {
            lifetime: 'singleton'
        }
    }
});
Moa.define('typeB.2', {
    $single: true
});
Moa.define('typeC', {
    $di: {
        $current: {
            instance: 'ctor'
        }
    }
});
Moa.define('Type', {
    $di: {
        a: 'typeA',
        b: 'typeB.1',
        c: 'typeC'
    }
});

// A test suite
module.exports = {
    name: 'DI benchmark',
    tests: {
        'Manual property resolving': function () {
            'use strict';
            var i = item.manualResolvingProperty();
        },
        'Moa IoC resolving': function () {
            'use strict';
            var i = item.iocResolvingProperty();
        }
    }
};