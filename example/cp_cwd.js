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

module.exports =
    /**
     * Determine the actual path of a symlinked folder instead of the actual directory.
     *
     * @example Folder `/var/tmp` is symlinked to `/private/var/tmp` -> This script gets the path `/var/tmp`.
     *
     * @link https://github.com/nodejs/node-v0.x-archive/issues/2305 - process.env.PWD not provided on windows
     * @link https://stackoverflow.com/q/24112452 - __dirname, process.cwd reporting actual directory instead of symlinked one.
     * @link https://github.com/nodejs/node/issues/8237 - process.cwd() inconsistency across platforms
     * @link https://github.com/nodejs/node/issues/11422 - this same problem with os.tmpdir() on macOS
     * @link https://github.com/nodejs/node/issues/7545 - working directory mismatch on macOS
     * @link https://github.com/nodejs/node-v0.x-archive/issues/18203 - Resolve module with symlinks
     * @link https://github.com/nodejs/node/blob/00c86cc8e9b5172372571cc122ebeb6d5a7e5e93/lib/os.js#L36 - Inspired from here
     *
     * @returns {string}
     */
    function cp_cwd() {
        const isWindows = process.platform === 'win32';
        let {execSync: exec} = require('child_process');

        return exec(isWindows ? 'cd' : 'pwd')
            .toString();
    }
;
