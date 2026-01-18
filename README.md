# Eleventy (11ty) Barebones Setup

### This is my setup for a fully functional static site generator using 11ty, including a full asset pipeline for JS and SCSS.

## The Asset Pipeline

- <u>esbuild</u> is used to transpile and bundle JavaScript
- <u>esbuild</u> is also used to transform SCSS into CSS
- JS and CSS files are appended with hashes during the build process for cache-busting. These hashed filenames are inserted into the final HTML using a custom 11ty filter called `hash`:
```
src="{{ 'src/assets/js/app.js' | hash }}
```

## Code quality

- ESLint is used to check JavaScript files during the 'build' command
    - can also be run with `npm run lint`
- Prettier is used for code formatting
    - can be run with `npm run format`


## Features
- Support for SCSS
    - <b>esbuild</b> is used to transform SCSS into CSS
- Support for ES6 JavaScript
    - <b>esbuild</b> is used to transpile and bundle JavaScript files
- Cache Busting
    - The JS and CSS files are automatically appended with hashes during the `build` command. These hashed filenames are inserted into the final HTML using a custom 11ty filter called `hash`:
```
<script src="{{ 'src/assets/js/app.js' | hash }}"></script>
```
will turn into this:
```
<script src="assets/js/app.MAEY36TZ.js"></script>
```