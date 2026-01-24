import path from 'node:path';
import hash from './src/_data/hash.json' with { type: 'json' };
import { HtmlBasePlugin } from '@11ty/eleventy';
import { build_assets, rebuild_assets } from './esbuild.js';

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

    eleventyConfig.on('eleventy.before', async () => {
        if (isProd) {
            await build_assets();
        } else {
            build_ctx = await rebuild_assets(build_ctx);
        }
    });

    // if (process.env.ELEVENTY_RUN_MODE === "serve") {
    //     // Run once before eleventy starts watching files
    //     build_ctx = await rebuild_assets(build_ctx);
    // }

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

    // Transforms absolute URLs into relative URLs
    eleventyConfig.addFilter('relative', function (url) {
        return path.posix.join(
            './',
            this.ctx.page.url.split('/').reduce((a, b) => a + (b && '../')),
            url,
        );
    });

    // If in production and asset file names are hashed, replace with hashed versions
    eleventyConfig.addFilter('hash', function (filePath) {
        if (isProd) {
            if (filePath in hash) {
                return hash[filePath].replace('dist', '');
            }
        }

        if (filePath.endsWith('.scss')) {
            filePath = filePath.replace('.scss', '.css');
        }
        if (filePath.startsWith('src/')) {
            filePath = filePath.slice(3);
        }
        return filePath;
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
