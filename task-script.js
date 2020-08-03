/*
 * The MIT License (MIT)
 * Copyright (c) 2020 GameplayJDK
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
 * Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
 * WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
 * COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
 * OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

'use strict';

const gulp = require("gulp");

const gulp_concat = require('gulp-concat');
const gulp_minify = require('gulp-minify');
const gulp_sourcemaps = require("gulp-sourcemaps");

const del = require('del');

/**
 * @typedef {Object} TaskScriptConfiguration
 * @property {string[]} add             The script prerequisites. These are prepended to the final script.
 * @property {string}   src             The script source folder. Typically the path to the `module` folder with
 *                                          subfolder wildcard.
 * @property {string}   dest            The script destination folder. Typically inside of the `public` folder.
 * @property {string}   destMap         The script sourcemap destination folder relative to `dest`. Typically `./map` or
 *                                          something.
 * @property {Object}   rename          The script options for concatenation and minification under one roof.
 * @property {string}   rename.concat   The script filename for concatenation.
 * @property {Object}   rename.ext      The script filename extension options for minification.
 * @property {string}   rename.ext.src  The script file extension (normal version).
 * @property {string}   rename.ext.min  The script file extension (minified version).
 * @property {string}   del             The script cleanup folder. Typically the same as `dest` with a wildcard.
 */

/**
 * @typedef TaskScriptOption
 * @property {string}   env             The current environment.
 * @property {string}   cwd             The current working directory.
 */

/**
 * @typedef {Object} TaskScript
 * @property {function} clean           The task responsible for cleanup operations.
 * @property {function} compile         The task responsible for script compilation.
 * @property {function} cleanCompile    A task series consisting of the `clean` and `compile` tasks.
 * @property {function} watch           The watch equivalent of the `compile` task.
 */

/**
 * Create the task collection for script.
 *
 * @param {TaskScriptConfiguration} configuration
 *  The task path configuration.
 * @param {TaskScriptOption} option
 *  A collection of additional options for better integration and control.
 * @return {TaskScript}
 */
function create(configuration, option) {

    function cleanScriptTask() {
        return (
            del(configuration.del, {
                cwd: option.cwd,
            })
        );
    }

    function compileScriptTask() {
        function fixPath(pathArray, path) {
            pathArray.push(path);
            return pathArray;
        }

        const src = fixPath(configuration.add, configuration.src);

        return (
            gulp
                .src(src, {
                    cwd: option.cwd,
                })
                .pipe(
                    gulp_sourcemaps.init()
                )
                .pipe(
                    gulp_concat(configuration.rename.concat)
                )
                .pipe(
                    gulp_minify({
                        ext: configuration.rename.ext,
                    })
                )
                .pipe(
                    gulp_sourcemaps.write(configuration.destMap)
                )
                .pipe(
                    gulp.dest(configuration.dest, {
                        cwd: option.cwd,
                    })
                )
        );
    }

    function cleanCompileScriptTask() {
        return (
            gulp
                .series([
                    cleanScriptTask,
                    compileScriptTask,
                ])
        );
    }

    function watchScriptTask() {
        function watchScriptTask() {
            return (
                gulp
                    .watch(configuration.src, {
                        cwd: option.cwd,
                    }, compileScriptTask)
            );
        }

        return (
            gulp
                .series([
                    cleanCompileScriptTask(),
                    watchScriptTask,
                ])
        );
    }

    return {
        clean: cleanScriptTask,
        compile: compileScriptTask,
        cleanCompile: cleanCompileScriptTask(),
        watch: watchScriptTask(),
    };

}

module.exports = create;
