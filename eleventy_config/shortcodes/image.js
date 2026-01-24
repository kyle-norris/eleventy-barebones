import Image from '@11ty/eleventy-img';
import * as cheerio from 'cheerio';
import path from 'node:path';

/**
 * Transform images using eleventy-img and return HTML with relative paths for src and srcset
 *
 * @param {string} src
 * @param {string} alt
 * @param {number[]} widths
 * @param {string} sizes
 * @returns string
 */
export async function process_image(src, alt, widths = [300, 600], sizes = '') {
    var imgHTML = await Image(src, {
        widths,
        formats: 'auto',
        returnType: 'html',
        outputDir: 'dist/_assets/img/',

        htmlOptions: {
            imgAttributes: {
                alt,
                sizes, // required with more than one width, optional if single width output
                loading: 'lazy',
                decoding: 'async',
            },
        },
    });

    const $ = cheerio.load(imgHTML);
    var img_src = $('img').attr('src');
    var img_srcset = $('img').attr('srcset');

    // eleventy-img uses the '/img' folder as default
    // We want to change that to use our '_assets/img' folder using relative paths
    img_src = img_src.replace('/img', '/_assets/img');
    img_srcset = img_srcset.replaceAll('/img', '/_assets/img');

    const toRelative = (url) => {
        return path.posix.join(
            './',
            this.ctx.page.url.split('/').reduce((a, b) => a + (b && '../')),
            url,
        );
    };

    img_srcset = img_srcset
        .split(', ')
        .map((source) => {
            var url = source.split(' ')[0];
            return source.replace(url, toRelative(url));
        })
        .join(', ');

    $('img').attr('src', toRelative(img_src));
    $('img').attr('srcset', img_srcset);

    return $('img').toString();
}
