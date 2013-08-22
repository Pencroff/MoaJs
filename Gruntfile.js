
/*global module:true*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        lmd: {
            test: {
                //projectRoot: '/',
                build: 'test'
//                options: {
//                    root: '../src/',
//                    output: 'moa.lmd.js',
//                    log: true,
//                    warn: true,
//                    modules: {
//                        '*': '*.js'
//                    }
                }
            }
    });

    // Load the plugin that provides the "grunt-lmd" task.
    grunt.loadNpmTasks('grunt-lmd');

    // Default task(s).
    grunt.registerTask('default', ['lmd:test']);

};