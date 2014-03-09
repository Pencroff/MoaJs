/**
 * Created with JetBrains WebStorm by Pencroff for MoaJs.
 * Date: 26.08.2013
 * Time: 17:31
 */
var tests = [];
for (var file in window.__karma__.files) {
    if (/Spec\.js$/.test(file)) {
        tests.push(file);
    }
}

requirejs.config({
    // Karma serves files from '/base'
    baseUrl: '/base',
    paths: {
        'Moa': 'src/moa',
        'tool': 'src/tool',
        'chai': 'extras/chai/chai',
        'sinon': 'extras/sinon/sinon-1.7.3',
        'sinon-chai': 'extras/sinon/sinon-chai',
        'mixinsSrc': 'items/mixins/src'
    },
    shim: {
        sinon: {
            exports: 'sinon'
        },
        'sinon-chai': {
            exports: 'sinon-chai'
        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});