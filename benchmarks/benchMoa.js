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
    diTest = {
        manualTransient: function () {
            'use strict';
            var Ctor = Moa.define('transientType');
            return new Ctor();
        },
        iocTransient: function () {
            'use strict';
            return Moa.resolve('transientType');
        },
        manualSingleton: function () {
            'use strict';
            var Ctor = Moa.define('singletonType');
            return Ctor.getInstance();
        },
        iocSingleton: function () {
            'use strict';
            return Moa.resolve('singletonDiType');
        },
        manualConstructor: function () {
            'use strict';
            var TransientCtor = Moa.define('transientType'),
                Singleton = Moa.define('singletonType'),
                conf = {
                    transient: new TransientCtor(),
                    single:  Singleton.getInstance()
                },
                Ctor = Moa.define('ctorType');
            return new Ctor(conf);
        },
        iocConstractor: function () {
            'use strict';
            return Moa.resolve('ctorType');
        },
        manualProperty: function () {
            'use strict';
            var Transient = Moa.define('transientType'),
                Single = Moa.define('singletonType'),
                Constructor = Moa.define('typeCtor'),
                CtorType = Moa.define('propType'),
                itemType = new CtorType();
            itemType.transient = new Transient();
            itemType.single = Single.getInstance();
            itemType.fnConstructor = Constructor;
            return itemType;
        },
        iocProperty: function () {
            'use strict';
            return Moa.resolve('propType');
        }
    };
Moa.clear();
Moa.define('transientType', {
    $di: {
        $current: {
            type: 'transientType',
            instance: 'item',
            lifestyle: 'transient'
        }
    }
});
Moa.define('singletonDiType', {
    $di: {
        $current: {
            lifetime: 'singleton'
        }
    }
});
Moa.define('singletonType', {
    $single: true
});
Moa.define('typeCtor', {
    $di: {
        $current: {
            instance: 'ctor'
        }
    }
});
Moa.define('ctorType', {
    $ctor: function (conf) {
        this.transient = conf.transient;
        this.single = conf.single;
    },
    $di: {
        $ctor: {
            transient: 'transientType',
            single: 'singletonDiType'
        }
    }
});
Moa.define('propType', {
    $di: {
        transient: 'transientType',
        single: 'singletonDiType',
        fnConstructor: 'typeCtor'
    }
});


// A test suite
module.exports = {
    name: 'DI benchmark',
    tests: {
        'Manual transient resolving': function () {
            'use strict';
            var i = diTest.manualTransient();
        },
        'MoaJs IoC transient resolving': function () {
            'use strict';
            var i = diTest.iocTransient();
        },
        'Manual singleton resolving': function () {
            'use strict';
            var i = diTest.manualSingleton();
        },
        'MoaJs IoC singleton resolving': function () {
            'use strict';
            var i = diTest.iocSingleton();
        },
        'Manual constructor resolving': function () {
            'use strict';
            var i = diTest.manualConstructor();
        },
        'MoaJs IoC constructor resolving': function () {
            'use strict';
            var i = diTest.iocConstractor();
        },
        'Manual property resolving': function () {
            'use strict';
            var i = diTest.manualProperty();
        },
        'MoaJs IoC property resolving': function () {
            'use strict';
            var i = diTest.iocProperty();
        }
    }
};