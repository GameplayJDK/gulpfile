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

const gulp_sass = require("gulp-sass");
const gulp_postcss = require("gulp-postcss");
const gulp_sourcemaps = require("gulp-sourcemaps");

const postcss_autoprefixer = require("autoprefixer");
const postcss_cssnano = require("cssnano");

const del = require('del');

/**
 * @typedef {Object} TaskStyleConfiguration
 * @property {string}   src             The style source folder. Typically the path to the `main.scss` file.
 * @property {string}   dest            The style destination folder. Typically inside of the `public` folder.
 * @property {string}   destMap         The style sourcemap destination folder relative to `dest`. Typically `./map` or
 *                                          something.
 * @property {string}   del             The style cleanup folder. Typically the same as `dest` with a wildcard.
 */

/**
 * @typedef TaskStyleOption
 * @property {string}   env             The current environment.
 * @property {string}   cwd             The current working directory.
 */

/**
 * @typedef {Object} TaskStyle
 * @property {function} clean           The task responsible for cleanup operations.
 * @property {function} compile         The task responsible for stylesheet compilation.
 * @property {function} cleanCompile    A task series consisting of the `clean` and `compile` tasks.
 * @property {function} watch           The watch equivalent of the `compile` task.
 */

/**
 * Create the task collection for style.
 *
 * @param {TaskStyleConfiguration} configuration
 *  The task path configuration.
 * @param {TaskStyleOption} option
 *  A collection of additional options for better integration and control.
 * @return {TaskStyle}
 */
function create(configuration, option) {

    const postcssPlugin = (function (option) {
        let plugin = [
            postcss_autoprefixer(),
        ];

        // Only include postcss_cssnano in 'prod' environment.
        if (option.env === 'prod') {
            plugin.push(
                postcss_cssnano()
            );
        }

        return plugin;
    }(option));

    function cleanStyleTask() {
        return (
            del(configuration.del, {
                cwd: option.cwd,
            })
        );
    }

    function compileStyleTask() {
        return (
            gulp
                .src(configuration.src, {
                    cwd: option.cwd,
                })
                .pipe(
                    gulp_sourcemaps.init()
                )
                .pipe(
                    gulp_sass()
                )
                .on('error', gulp_sass.logError)
                .pipe(
                    gulp_postcss(postcssPlugin)
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

    function cleanCompileStyleTask() {
        return (
            gulp
                .series([
                    cleanStyleTask,
                    compileStyleTask,
                ])
        );
    }

    function watchStyleTask() {
        /**
         * @param {string} path     The style source folder.
         * @return {string}         The style watch folder.
         */
        function fixPath(path) {
            const segment = path.split('/');
            const name = segment.pop();

            if ('main.scss' === name) {
                segment.push('**', '*.scss');
            } else {
                segment.push(name);
            }

            return segment.join('/');
        }

        function watchStyleTask() {
            // Watch all files, not only the main file.
            const src = fixPath(configuration.src);

            return (
                gulp
                    .watch(src, {
                        cwd: option.cwd,
                    }, compileStyleTask)
            );
        }

        return (
            gulp
                .series([
                    cleanCompileStyleTask(),
                    watchStyleTask,
                ])
        );
    }

    return {
        clean: cleanStyleTask,
        compile: compileStyleTask,
        cleanCompile: cleanCompileStyleTask(),
        watch: watchStyleTask(),
    };

}

module.exports = create;
