/*
 * The MIT License (MIT)
 * Copyright (c) 2020 GameplayJDK
 *   https://github.com/GameplayJDK/gulpfile
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

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const gulp = require("gulp");

const minimist = require('minimist');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let option = minimist(process.argv.slice(2), {
    string: [
        'env',
    ],
    default: {
        'env': (process.env.NODE_ENV || 'dev')
    },
});
option = (function (option) {
    // Set default if env is invalid.
    if (![
        'dev',
        'prod',
    ].includes(option.env)) {
        option.env = 'dev';
    }

    // Hardcode the cwd, since we won't need the option.
    option.cwd = process.cwd();

    return option;
}(option));

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Load the configuration from a file rather than typing it statically in here.
const configuration = require('./gulpfile.configuration.json');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// In a real world use-case one would require '@gameplayjdk/gulpfile' instead of the parent directory.
const gf = require('..');

// Call the factory of each scope with the provided configuration.
const gf_style = gf.style(configuration.style, option);
const gf_script = gf.script(configuration.script, option);
const gf_font = gf.data(configuration.font, option);
const gf_image = gf.image(configuration.image, option);
const gf_image_responsive = gf.imageResponsive(configuration.image_responsive, option);
const gf_data = gf.data(configuration.data, option);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function cleanDefaultTask() {
    return (
        gulp
            .parallel([
                gf_style.clean,
                gf_script.clean,
                gf_font.clean,
                gulp
                    .series([
                        gf_image_responsive.clean,
                        gf_image.clean,
                    ]),
                gf_data.clean,
            ])
    );
}

function compileDefaultTask() {
    return (
        gulp
            .parallel([
                gf_style.compile,
                gf_script.compile,
                gf_font.compile,
                gulp
                    .series([
                        gf_image_responsive.compile,
                        gf_image.compile,
                    ]),
                gf_data.compile,
            ])
    );
}

function cleanCompileDefaultTask() {
    return (
        gulp
            .series([
                cleanDefaultTask(),
                compileDefaultTask(),
            ])
    );
}

function watchDefaultTask() {
    return (
        gulp
            .series([
                // Do this first.
                gf_image_responsive.cleanCompile,
                gulp
                    .parallel([
                        gf_style.watch,
                        gf_script.watch,
                        gf_font.watch,
                        gf_image_responsive.watch,
                        gf_image.watch,
                        gf_data.watch,
                    ]),
            ])
    );
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

gulp.task('default', cleanCompileDefaultTask());
gulp.task('default:clean', cleanDefaultTask());
gulp.task('default:compile', compileDefaultTask());
gulp.task('default:watch', watchDefaultTask());

gulp.task('style', gf_style.cleanCompile);
gulp.task('style:clean', gf_style.clean);
gulp.task('style:compile', gf_style.compile);
gulp.task('style:watch', gf_style.watch);

gulp.task('script', gf_script.cleanCompile);
gulp.task('script:clean', gf_script.clean);
gulp.task('script:compile', gf_script.compile);
gulp.task('script:watch', gf_script.watch);

gulp.task('font', gf_font.cleanCompile);
gulp.task('font:clean', gf_font.clean);
gulp.task('font:compile', gf_font.compile);
gulp.task('font:watch', gf_font.watch);

gulp.task('image-responsive', gf_image_responsive.cleanCompile);
gulp.task('image-responsive:clean', gf_image_responsive.clean);
gulp.task('image-responsive:compile', gf_image_responsive.compile);
gulp.task('image-responsive:watch', gf_image_responsive.watch);

gulp.task('image', gf_image.cleanCompile);
gulp.task('image:clean', gf_image.clean);
gulp.task('image:compile', gf_image.compile);
gulp.task('image:watch', gf_image.watch);

gulp.task('data', gf_data.cleanCompile);
gulp.task('data:clean', gf_data.clean);
gulp.task('data:compile', gf_data.compile);
gulp.task('data:watch', gf_data.watch);
