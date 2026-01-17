import * as esbuild from 'esbuild';
import * as sass from 'sass';
import path from 'node:path';

export default async function (eleventyConfig) {
    eleventyConfig.setServerOptions({
        port: 8000,
    });

    // Process SCSS Files
    eleventyConfig.addTemplateFormats('scss');
    eleventyConfig.addWatchTarget('./src/assets/styles');
    eleventyConfig.addExtension('scss', {
        outputFileExtension: 'css',

        // opt-out of Eleventy layouts
        useLayouts: false,

        compile: async function (inputContent, inputPath) {
            let parsed = path.parse(inputPath);
            // Don’t compile file names that start with an underscore
            if (parsed.name.startsWith('_')) {
                return;
            }

            let result = sass.compileString(inputContent, {
                loadPaths: [parsed.dir || '.', this.config.dir.includes],
            });

            // Map dependencies for incremental builds
            this.addDependencies(inputPath, result.loadedUrls);

            return async (data) => {
                return result.css;
            };
        },
    });

    // Process JavaScript files
    eleventyConfig.addTemplateFormats('js');
    eleventyConfig.addExtension('js', {
        outputFileExtension: 'js',
        compile: async (inputContent, inputPath) => {
            // Don't process if it's not our entrypoint
            if (inputPath !== './src/assets/js/app.js') {
                return;
            }

            return async () => {
                let output = await esbuild.build({
                    target: 'es2020',
                    entryPoints: [inputPath],
                    minify: true,
                    bundle: true,
                    write: false,
                    metafile: true,
                });

                var sourceMap = {};
                for (const [outputPath, { entryPoint }] of Object.entries(output.metafile.outputs)) {
                    sourceMap[entryPoint] = outputPath.replace('src/', '');
                }

                eleventyConfig.addGlobalData('sourceMap', sourceMap);

                return output.outputFiles[0].text;
            };
        },
    });

    return {
        dir: {
            input: 'src',
            output: 'dist',
            layouts: 'layouts',
            data: 'data',
            includes: 'includes',
        },
        templateFormats: ['njk', 'md'],
        htmlTemplateEnjine: 'njk',
        markdownTemplateEngine: 'md',
    };
}
