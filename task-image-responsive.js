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

const gulp_responsive = require('gulp-responsive');

const del = require('del');

/**
 * @typedef {Object} TaskImageResponsiveConfiguration
 * @property {string}   src             The data source folder. Typically the path to the `image` folder with subfolder
 *                                          wildcard and exclusion for the `image/responsive` subfolder.
 * @property {string}   dest            The data destination folder. Typically the `image/responsive` subfolder.
 * @property {string}   del             The data cleanup folder. Typically the same as `dest` with a wildcard.
 * @property {Array}    configuration   The {@link gulp_responsive} configuration array.
 */

/**
 * @typedef TaskImageResponsiveOption
 * @property {string}   env             The current environment.
 * @property {string}   cwd             The current working directory.
 */

/**
 * @typedef {Object} TaskImageResponsive
 * @property {function} clean           The task responsible for cleanup operations.
 * @property {function} compile         The task responsible for data compilation.
 * @property {function} cleanCompile    A task series consisting of the `clean` and `compile` tasks.
 * @property {function} watch           The watch equivalent of the `compile` task.
 */

/**
 * Create the task collection for image.
 *
 * @param {TaskImageResponsiveConfiguration} configuration
 *  The task path configuration.
 * @param {TaskImageResponsiveOption} option
 *  A collection of additional options for better integration and control.
 * @return {TaskImageResponsive}
 */
function create(configuration, option) {

    function cleanImageResponsiveTask() {
        return del(configuration.del, {
            cwd: option.cwd,
        });
    }

    function compileImageResponsiveTask() {
        return (
            gulp
                .src(configuration.src, {
                    cwd: option.cwd,
                })
                .pipe(
                    gulp_responsive(configuration.configuration, {
                        quality: 70,
                        progressive: true,

                        withMetadata: false,

                        //skipOnEnlargement: true,

                        errorOnUnusedConfig: false,
                        errorOnUnusedImage: false,
                        errorOnEnlargement: false,
                    })
                )
                .pipe(
                    gulp.dest(configuration.dest, {
                        cwd: option.cwd,
                    })
                )
        );
    }

    function cleanCompileImageResponsiveTask() {
        return (
            gulp
                .series([
                    cleanImageResponsiveTask,
                    compileImageResponsiveTask,
                ])
        )
    }

    function watchImageResponsiveTask() {
        function watchImageResponsiveTask() {
            return gulp.watch(configuration.src, {
                cwd: option.cwd,
            }, compileImageResponsiveTask);
        }

        return (
            gulp
                .series([
                    cleanCompileImageResponsiveTask(),
                    watchImageResponsiveTask,
                ])
        );
    }

    return {
        clean: cleanImageResponsiveTask,
        compile: compileImageResponsiveTask,
        cleanCompile: cleanCompileImageResponsiveTask(),
        watch: watchImageResponsiveTask(),
    };

}

module.exports = create;
