const isProd = process.env.ELEVENTY_ENV == 'production';
import hash from '../../src/_data/hash.json' with { type: 'json' };

/**
 * If building for production, replace asset URLs with their hashed versions from hash.json
 *
 * @param {string} filePath
 * @returns string
 */
export function hash_assets(filePath) {
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
}
