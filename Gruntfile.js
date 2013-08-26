
/*global module:true*/
module.exports = function (grunt) {
    'use strict';
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true
            }
        },
        watch: {
            //run unit tests with karma (server needs to be already running)
            karma: {
                files: ['src/**/*.js', 'spec/**/*.js', 'src/*.js', 'spec/*.js'],
                tasks: ['karma:unit:run'] //NOTE the :run flag
            }
        }



    });
    // Default task(s).
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default', ['karma:unit:start', 'watch']);

};