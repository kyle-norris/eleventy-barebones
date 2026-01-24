import { HtmlBasePlugin } from '@11ty/eleventy';
import { build_assets, rebuild_assets } from './esbuild.js';

import { process_image } from './eleventy_config/shortcodes/image.js';
import { relative_path } from './eleventy_config/filters/relative.js';
import { hash_assets } from './eleventy_config/filters/hash.js';

const isProd = process.env.ELEVENTY_ENV == 'production';
const ASSETS_TO_WATCH = ['.scss', '.js']; // extensions that will trigger esbuild to rebuild
let build_ctx;

export default async function (eleventyConfig) {
    eleventyConfig.setServerOptions({
        port: 8000,
    });

    // Plugins
    eleventyConfig.addPlugin(HtmlBasePlugin);

    // Watch targets
    eleventyConfig.addWatchTarget('./src/_assets/styles');
    eleventyConfig.addWatchTarget('./src/_assets/js');

    // Passthrough
    eleventyConfig.addPassthroughCopy('src/_assets/styles/bootstrap.min.css');
    eleventyConfig.addPassthroughCopy('src/_assets/img/');

    // Filters
    eleventyConfig.addFilter('relative', relative_path);
    eleventyConfig.addFilter('hash', hash_assets);

    // Shortcodes
    eleventyConfig.addShortcode('image', process_image);

    // Runs once before Eleventy builds
    eleventyConfig.on('eleventy.before', async () => {
        if (isProd) {
            await build_assets();
        } else {
            build_ctx = await rebuild_assets(build_ctx);
        }
    });

    // Runs each time Eleventy rebuilds during watch
    eleventyConfig.on('eleventy.beforeWatch', async (changedFiles) => {
        var rebuild = false;
        for (const name of changedFiles) {
            if (ASSETS_TO_WATCH.some((extension) => name.endsWith(extension))) {
                rebuild = true;
                break;
            }
        }

        if (rebuild) {
            build_ctx = await rebuild_assets(build_ctx);
        }
    });

    return {
        dir: {
            input: 'src',
            output: 'dist',
            layouts: '_layouts',
            data: '_data',
            includes: '_includes',
        },
        pathPrefix: '.',
        templateFormats: ['njk', 'md'],
        htmlTemplateEnjine: 'njk',
        markdownTemplateEngine: 'md',
    };
}
