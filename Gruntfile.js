/* global module */
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js'],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        qunit: {
            all: ['tests/index.html'],
            options: {
                '--web-security': 'no'
            }
        },
        watch: {
            main: {
                files: ['**/*.js', '!**/node_modules/**'],
                tasks: ['jshint'],
                options: {
                    spawn: false,
                    livereload: true
                }
            },
        },
        connect: {
            server: {
                options: {
                    port: 8080,
                    hostname: 'localhost',
                    livereload: true
                }
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // tasks
    grunt.registerTask('lint', ['jshint']);
    grunt.registerTask('start', ['connect', 'watch']);
    grunt.registerTask('test', ['qunit']);
};
