import * as esbuild from 'esbuild';
import { sassPlugin } from 'esbuild-sass-plugin';
import fs from 'node:fs';
import postcss from 'postcss';
import postcssPresetEnv from 'postcss-preset-env';
import { environmentPlugin } from 'esbuild-plugin-environment';

const isProd = process.env.ELEVENTY_ENV == 'production';
const ENTRY_POINTS = ['src/_assets/js/app.js', 'src/_assets/styles/app.scss'];

const settings = {
    target: 'es2020',
    entryPoints: ENTRY_POINTS,
    minify: true,
    bundle: true,
    write: true,
    metafile: true,
    outdir: 'dist/_assets',
    entryNames: isProd ? '[dir]/[name].[hash]' : '[dir]/[name]',
    plugins: [
        environmentPlugin(['ELEVENTY_ENV']),
        sassPlugin({
            quietDeps: true,
            loadPaths: ['node_modules/', 'src/_assets/styles/'],
            async transform(source) {
                const { css } = await postcss([postcssPresetEnv()]).process(source, { from: undefined });
                return css;
            },
        }),
    ],
};

export async function rebuild_assets(ctx) {
    if (ctx) {
        await ctx.rebuild();
    } else {
        ctx = await esbuild.context(settings);
        await ctx.rebuild();
    }
    return ctx;
}

export async function build_assets() {
    let result = await esbuild.build(settings);

    var map = {};
    for (const [finalName, { entryPoint }] of Object.entries(result.metafile.outputs)) {
        map[entryPoint] = finalName;
    }

    fs.writeFileSync('src/_data/hash.json', JSON.stringify(map));
}
