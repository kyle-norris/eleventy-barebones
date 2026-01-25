# Eleventy (11ty) Barebones Setup

### This is my version of a full 11ty barebones setup, perfect for starting any project.

## The Highlights

- `esbuild` for transforming and bundling both JS and SCSS
- `PostCSS` for autoprefixing CSS files
- Automatic cache busting
    - The JS and CSS files are automatically appended with hashes during the `build` command. These hashed filenames are inserted into the final HTML using a custom filter called `hash`:

        so this:

        ```html
        <script src="{{ 'src/_assets/js/app.js' | hash }}"></script>
        ```

        turns into this:

        ```html
        <script src="_assets/js/app.MAEY36TZ.js"></script>
        ```

- Image optimization
    - Images can be optionally transformed using eleventy's `@11ty/eleventy-img` plugin by using the shortcode `image`:

        so this:

        ```jinja
        {% image 'src/_assets/img/robot.jpg', "robot", [300, 600, 1200], "(max-width: 900px) 300px, (max-width: 1200px) 600px, 1200px" %}
        ```

        turns into this:

        ```html
        <img
            alt="robot"
            loading="lazy"
            decoding="async"
            src="_assets/img/gdkjawuj_U-300.jpeg"
            width="1200"
            height="1367"
            srcset="
                _assets/img/gdkjawuj_U-300.jpeg   300w,
                _assets/img/gdkjawuj_U-600.jpeg   600w,
                _assets/img/gdkjawuj_U-1200.jpeg 1200w
            "
            sizes="(max-width: 900px) 300px, (max-width: 1200px) 600px, 1200px"
        />
        ```

- `ESLint` for checking JS files
    - runs automatically during the `build` command
- `Prettier` for code formatting

## NPM commands

- `npm run start`
    - start local dev server
- `npm run build`
    - build production output
- `npm run clean`
    - remove `dist` output directory
- `npm run format`
    - run `Prettier` to check code formatting
- `npm run lint`
    - run `ESLint` to check for JS quality
