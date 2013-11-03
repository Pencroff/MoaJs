
/*global module:true*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        yuidoc: {
            compile: {
                name: '<%= pkg.name %>',
                description: '<%= pkg.description %>',
                version: '<%= pkg.version %>',
                url: '<%= pkg.homepage %>',
                logo: '../extras/moa-logo-web.png',
                options: {
                    paths: 'src/',
                    outdir: 'docs/',
                    themedir: 'extras/yuidoc-bootstrap-theme/',
                    helpers: ['extras/yuidoc-bootstrap-theme/helpers/helpers.js']
                }
            }
        },
//        karma: {
//            unit: {
//                configFile: 'karma.conf.js',
//                background: true
//            }
//        },
//        watch: {
//            //run unit tests with karma (server needs to be already running)
//            spec_watch: {
//                files: ['spec/**/*.js', 'spec/*.js'],
//                tasks: ['karma:unit:run'] //NOTE the :run flag
//            },
//            src_watch: {
//                files: ['src/**/*.js', 'src/*.js'],
//                tasks: ['yuidoc', 'karma:unit:run']
//            }
//        },
        requirejs: {
            compile: {
                options: {
                    name: 'Moa',
                    baseUrl: 'src',
                    mainConfigFile: 'r.config.js',
                    optimize: "uglify2",
                    out: 'moa.js',
                    uglify2: {
                        output: {
                            indent_start  : 0,     // start indentation on every line (only when `beautify`)
                            indent_level  : 4,     // indentation level (only when `beautify`)
                            quote_keys    : false, // quote all keys in object literals?
                            space_colon   : true,  // add a space after colon signs?
                            ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
                            inline_script : false, // escape "</script"?
                            width         : 80,    // informative maximum line width (for beautified output)
                            max_line_len  : 32000, // maximum line length (for non-beautified output)
                            ie_proof      : true,  // output IE-safe code?
                            beautify      : true,  // beautify output?
                            source_map    : null,  // output a source map
                            bracketize    : false, // use brackets every time?
                            comments      : false, // output comments?
                            semicolons    : true   // use semicolons to separate statements? (otherwise, newlines)
                        },
                        compress: {
                            sequences     : false,  // join consecutive statemets with the “comma operator”
                            properties    : true,  // optimize property access: a["foo"] → a.foo
                            dead_code     : true,  // discard unreachable code
                            drop_debugger : true,  // discard “debugger” statements
                            unsafe        : false, // some unsafe optimizations (see below)
                            conditionals  : true,  // optimize if-s and conditional expressions
                            comparisons   : true,  // optimize comparisons
                            evaluate      : true,  // evaluate constant expressions
                            booleans      : true,  // optimize boolean expressions
                            loops         : true,  // optimize loops
                            unused        : true,  // drop unused variables/functions
                            hoist_funs    : true,  // hoist function declarations
                            hoist_vars    : false, // hoist variable declarations
                            if_return     : true,  // optimize if-s followed by return/continue
                            join_vars     : true,  // join var declarations
                            cascade       : true,  // try to cascade `right` into `left` in sequences
                            side_effects  : true,  // drop side-effect-free statements
                            warnings      : true,  // warn about potentially dangerous optimizations/code
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: true,
                        mangle: false
                    }
                }
            },
            build: {
                options: {
                    name: 'Moa',
                    baseUrl: 'src',
                    mainConfigFile: 'r.config.js',
                    optimize: "uglify2",
                    out: 'moa.min.js',
                    preserveLicenseComments: false,
                    generateSourceMaps: true,
                    uglify2: {
                        output: {
                            indent_start  : 0,     // start indentation on every line (only when `beautify`)
                            indent_level  : 4,     // indentation level (only when `beautify`)
                            quote_keys    : false, // quote all keys in object literals?
                            space_colon   : true,  // add a space after colon signs?
                            ascii_only    : false, // output ASCII-safe? (encodes Unicode characters as ASCII)
                            inline_script : false, // escape "</script"?
                            width         : 80,    // informative maximum line width (for beautified output)
                            max_line_len  : 32000, // maximum line length (for non-beautified output)
                            ie_proof      : true,  // output IE-safe code?
                            beautify      : false, // beautify output?
                            source_map    : {
                                file : 'moa.min.js', // the compressed file name
                                root : 'moa.js', // the root URL to the original sources
                                orig : null  // the input source map
                            },  // output a source map
                            bracketize    : false, // use brackets every time?
                            comments      : false, // output comments?
                            semicolons    : true   // use semicolons to separate statements? (otherwise, newlines)
                        },
                        compress: {
                            sequences     : false,  // join consecutive statemets with the “comma operator”
                            properties    : true,  // optimize property access: a["foo"] → a.foo
                            dead_code     : true,  // discard unreachable code
                            drop_debugger : true,  // discard “debugger” statements
                            unsafe        : false, // some unsafe optimizations (see below)
                            conditionals  : true,  // optimize if-s and conditional expressions
                            comparisons   : true,  // optimize comparisons
                            evaluate      : true,  // evaluate constant expressions
                            booleans      : true,  // optimize boolean expressions
                            loops         : true,  // optimize loops
                            unused        : true,  // drop unused variables/functions
                            hoist_funs    : true,  // hoist function declarations
                            hoist_vars    : false, // hoist variable declarations
                            if_return     : true,  // optimize if-s followed by return/continue
                            join_vars     : true,  // join var declarations
                            cascade       : true,  // try to cascade `right` into `left` in sequences
                            side_effects  : true,  // drop side-effect-free statements
                            warnings      : true,  // warn about potentially dangerous optimizations/code
                            global_defs: {
                                DEBUG: false
                            }
                        },
                        warnings: true,
                        mangle: true
                    }
                }
            }
        }



    });
    // Default task(s).
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
//    grunt.loadNpmTasks('grunt-karma');
//    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-requirejs');
    grunt.registerTask('default', ['yuidoc', 'requirejs']); //, 'karma:unit:start', 'watch'

};