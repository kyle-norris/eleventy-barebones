import path from 'node:path';
import hash from './src/data/hash.json' with { type: 'json' };
import { HtmlBasePlugin } from '@11ty/eleventy';

const isProd = process.env.ELEVENTY_ENV == 'production';

export default async function (eleventyConfig) {
    eleventyConfig.setServerOptions({
        port: 8000,
    });

    eleventyConfig.addPlugin(HtmlBasePlugin);

    eleventyConfig.addWatchTarget('./src/assets/styles');
    eleventyConfig.addWatchTarget('./src/assets/js');

    eleventyConfig.addPassthroughCopy('src/assets/styles/bootstrap.min.css');
    eleventyConfig.addPassthroughCopy('src/assets/img/');

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
            layouts: 'layouts',
            data: 'data',
            includes: 'includes',
        },
        pathPrefix: '.',
        templateFormats: ['njk', 'md'],
        htmlTemplateEnjine: 'njk',
        markdownTemplateEngine: 'md',
    };
}
