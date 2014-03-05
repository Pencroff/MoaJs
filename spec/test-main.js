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
    baseUrl: '/base/src/',
    paths: {
        'chai': '../extras/chai/chai'
    },
    shim: {
//        'underscore': {
//            exports: '_'
//        }
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});