import path from 'node:path';

/**
 * Transforms absolute URLs into relative URLs using the current eleventy context
 *
 * @param {string} url
 * @returns string
 */
export function relative_path(url) {
    return path.posix.join(
        './',
        this.ctx.page.url.split('/').reduce((a, b) => a + (b && '../')),
        url,
    );
}
