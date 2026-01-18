import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import fs from 'node:fs';

const isProd = process.env.ELEVENTY_ENV == 'production';

const ENTRY_POINTS = ['src/assets/js/app.js', 'src/assets/styles/app.scss'];

const settings = {
    target: 'es2020',
    entryPoints: ENTRY_POINTS,
    minify: true,
    bundle: true,
    write: true,
    metafile: true,
    outdir: 'dist/assets',
    entryNames: isProd ? '[dir]/[name].[hash]' : '[dir]/[name]',
    plugins: [sassPlugin()],
};

if (!isProd) {
    let ctx = await esbuild.context(settings);
    await ctx.watch();
    console.log('Watching JavaScript Files...');
} else {
    let result = await esbuild.build(settings);

    var map = {};
    for (const [finalName, { entryPoint }] of Object.entries(result.metafile.outputs)) {
        map[entryPoint] = finalName;
    }

    fs.writeFileSync('src/data/hash.json', JSON.stringify(map));
}
