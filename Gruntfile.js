
/*global module:true*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        lmd: {
            build_name: {
                //projectRoot: 'test/',
                build: 'test',
                options: {
                    "root": "../src/",
                    "output": "moa.lmd.js",
                    "modules": {
                        "*": "*.js"
                    }
                }
            }
        }
    });

    // Load the plugin that provides the "grunt-lmd" task.
    grunt.loadNpmTasks('grunt-lmd');

    // Default task(s).
    grunt.registerTask('default', ['lmd']);

};