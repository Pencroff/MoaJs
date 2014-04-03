
/*global module:true*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
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
        concat: {
            options: {
                stripBanners: true,
                banner: '/*********************************************\n' +
                        '   The MIT License (MIT)\n' +
                        '   Copyright (c) 2013 - <%= grunt.template.today("yyyy") %> Sergii Danilov\n' +
                        '   <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
                        '*********************************************/\n'
            },
            dev: {
                src: ['moa.dev.js'],
                dest: 'release/moa.dev-<%=pkg.version%>.js'
            },
            min: {
                src: ['moa.min.js'],
                dest: 'release/moa.min-<%=pkg.version%>.js'
            },
            minmap: {
                src: ['moa.min.js.map'],
                dest: 'release/moa.min-<%=pkg.version%>.js.map'
            }
        },
        compress: {
            main: {
                options: {
                    mode: 'gzip'
                },
                files: [
                    {src: ['release/moa.min-<%=pkg.version%>.js'], dest: 'release/moa.min-<%=pkg.version%>.gz.js', ext: '.gz.js'}
                ]
            }
        },
        jsdoc : {
            dist : {
                src: ['src/moa.js'],
                options: {
                    destination: 'doc',
                    template : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
                    configure : 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template/jsdoc.conf.json'
                }
            }
        },
        benchmark: {
//            all: {
//                src: ['benchmarks/*.js'],
//                dest: 'benchmarks/result.csv'
//            },
            /*grunt benchmark:benchMoa*/
            benchMoa: {
                src: ['benchmarks/benchMoa.js']
            },
            /*grunt benchmark:benchMixSearch*/
            benchMixSearch: {
                src: ['items/mixins/benchmarks/benchMixSearch.js']
            },
            /*grunt benchmark:benchMixSort*/
            benchMixSort: {
                src: ['items/mixins/benchmarks/benchMixSort.js']
            }
        }
    });
    // Default task(s).
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-jsdoc');

    grunt.loadNpmTasks('grunt-benchmark');

    grunt.registerTask('default', ['requirejs']); //'karma:unit:start'
    /*grunt release*/
    grunt.registerTask('release', ['requirejs', 'concat', 'compress']); //'karma:unit:start'

};