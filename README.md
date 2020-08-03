# gulpfile

A collection of common gulp tasks.

## What is this

It is exactly that. A reusable library of gulp tasks, that can be used in any project by installing it as a dependency.

The idea is to only have to write the tasks once and distribute them over multiple projects. By doing so, it only
requires a minimum amount of boilerplate code to set the tasks up as needed. The aim is to speed up development by
shortening the time usually needed to set up a build-pipeline for frontend dependencies.

> **Disclaimer!**
> 
> Some configuration cannot be changed and is opinionated. The provided tasks may not fit every use-case.

## How to install

The installation process is pretty straight forward:

```bash
npm install --save-dev @gameplayjdk/gulpfile
```

## What is included

| Asset Unit        | Feature                       |
| ----------------- | ----------------------------- |
| Style             | Scss compilation              |
|                   | Source minification           |
|                   | Sourcemap generation          |
| Script            | Source concatenation          |
|                   | Source minification           |
|                   | Sourcemap generation          |
| Data              | Just copying                  |
| Image             | File minification             |
| Image responsive  | Responsive format generation  |

For more information, have a look at the `package.json` file.

## How to use

You can find an example gulpfile using this package inside the `example/` folder of this repository.

> _Some day a blog post about this may be linked here..._

## Further reading

This is a list of articles that I found very useful to get started with the basic gulp tasks included in this library.

* Follow https://gulpjs.com/docs/en/getting-started/quick-start for first steps with gulp.
* See https://github.com/gulpjs/gulp/blob/master/docs/recipes/delete-files-folder.md for the clean workflow setup.
* See https://goede.site/setting-up-gulp-4-for-automatic-sass-compilation-and-css-injection for the style workflow
  setup.
* See https://www.toptal.com/javascript/optimize-js-and-css-with-gulp and https://stackoverflow.com/a/24597914 for the
  script workflow setup.
* See https://medium.freecodecamp.org/how-to-minify-images-with-gulp-gulp-imagemin-and-boost-your-sites-performance-6c226046e08e
  for the image workflow setup.
* See https://github.com/mahnunchik/gulp-responsive/blob/HEAD/examples/multiple-resolutions.md and
  https://stackoverflow.com/a/37459616 and https://getbootstrap.com/docs/4.0/layout/grid/#grid-options for the
  responsive image workflow setup.
* See https://github.com/gulpjs/gulp/blob/master/docs/recipes/pass-arguments-from-cli.md for cli argv setup.

## License

It's MIT, as usual.
