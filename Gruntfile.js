
/*global module:true*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
//        karma: {
//            unit: {
//                configFile: 'karma.conf.js',
//                background: true
//            }
//        },
        requirejs: {
            compile: {
                options: {
                    name: 'Moa',
                    baseUrl: 'src',
                    mainConfigFile: 'r.config.js',
                    optimize: 'uglify2',
                    out: 'moa.dev.js',
                    uglify2: {
                        output: {
                            beautify      : true,  // beautify output?
                            semicolons    : true
                        },
                        compress: {
                            sequences     : false,  // join consecutive statemets with the “comma operator”
                            properties    : false,
                            conditionals  : true,  // optimize if-s and conditional expressions
                            comparisons   : true,  // optimize comparisons
                            evaluate      : true,  // evaluate constant expressions
                            booleans      : true,  // optimize boolean expressions
                            loops         : true
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
                    optimize: 'uglify2',
                    out: 'moa.min.js',
                    preserveLicenseComments: false,
                    generateSourceMaps: true,
                    uglify2: {
                        warnings: true,
                        mangle: true
                    }
                }
            }
        },
        benchmark: {
//            all: {
//                src: ['benchmarks/*.js'],
//                dest: 'benchmarks/result.csv'
//            },
            /*grunt benchmark:benchMixSearch*/
            benchMixSearch: {
                src: ['items/mixins/benchmarks/benchMixSearch.js']
            }
        }
    });
    // Default task(s).
//    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-benchmark');
    grunt.registerTask('default', ['requirejs']); //, 'karma:unit:start', 'watch'

};