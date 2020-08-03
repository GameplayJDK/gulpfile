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

const gulp_imagemin = require('gulp-imagemin');

const del = require('del');

/**
 * @typedef {Object} TaskImageConfiguration
 * @property {string}   src             The data source folder. Typically the path to the `image` folder with subfolder
 *                                          wildcard and a collection of supported image file extensions.
 * @property {string}   dest            The data destination folder. Typically inside of the `public` folder.
 * @property {string}   del             The data cleanup folder. Typically the same as `dest` with a wildcard.
 */

/**
 * @typedef TaskImageOption
 * @property {string}   env             The current environment.
 * @property {string}   cwd             The current working directory.
 */

/**
 * @typedef {Object} TaskImage
 * @property {function} clean           The task responsible for cleanup operations.
 * @property {function} compile         The task responsible for data compilation.
 * @property {function} cleanCompile    A task series consisting of the `clean` and `compile` tasks.
 * @property {function} watch           The watch equivalent of the `compile` task.
 */

/**
 * Create the task collection for image.
 *
 * @param {TaskImageConfiguration} configuration
 *  The task path configuration.
 * @param {TaskImageOption} option
 *  A collection of additional options for better integration and control.
 * @return {TaskImage}
 */
function create(configuration, option) {

    function cleanImageTask() {
        return (
            del(configuration.del, {
                cwd: option.cwd,
            })
        );
    }

    function compileImageTask() {
        return (
            gulp
                .src(configuration.src, {
                    cwd: option.cwd,
                })
                .pipe(
                    gulp_imagemin()
                )
                .pipe(
                    gulp.dest(configuration.dest, {
                        cwd: option.cwd,
                    })
                )
        );
    }

    function cleanCompileImageTask() {
        return (
            gulp
                .series([
                    cleanImageTask,
                    compileImageTask,
                ])
        );
    }

    function watchImageTask() {
        function watchImageTask() {
            return (
                gulp
                    .watch(configuration.src, {
                        cwd: option.cwd,
                    }, compileImageTask)
            );
        }

        return (
            gulp
                .series([
                    cleanCompileImageTask(),
                    watchImageTask,
                ])
        );
    }

    return {
        clean: cleanImageTask,
        compile: compileImageTask,
        cleanCompile: cleanCompileImageTask(),
        watch: watchImageTask(),
    };

}

module.exports = create;
