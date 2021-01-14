#!/usr/bin/env node

/*
* Licensed to the Apache Software Foundation (ASF) under one
* or more contributor license agreements.  See the NOTICE file
* distributed with this work for additional information
* regarding copyright ownership.  The ASF licenses this file
* to you under the Apache License, Version 2.0 (the
* "License"); you may not use this file except in compliance
* with the License.  You may obtain a copy of the License at
*
*   http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing,
* software distributed under the License is distributed on an
* "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
* KIND, either express or implied.  See the License for the
* specific language governing permissions and limitations
* under the License.
*/

const commander = require('commander');
const chalk = require('chalk');
const rollup = require('rollup');
const nodePath = require('path');
// const nodeResolvePlugin = require('@rollup/plugin-node-resolve').default;
const typescriptPlugin = require('rollup-plugin-typescript2');
const { terser } = require('rollup-plugin-terser');

const projDir = nodePath.resolve(__dirname, '..');
const MODULE_NAME = 'ecSimpleTransform';


async function run() {

    /**
     * Tips for `commander`:
     * (1) If arg xxx not specified, `commander.xxx` is undefined.
     *     Otherwise:
     *      If '-x, --xxx', `commander.xxx` can only be true/false, even if '--xxx yyy' input.
     *      If '-x, --xxx <some>', the 'some' string is required, or otherwise error will be thrown.
     *      If '-x, --xxx [some]', the 'some' string is optional, that is, `commander.xxx` can be boolean or string.
     * (2) `node ./build/build.js --help` will print helper info and exit.
     */

    commander
        .usage('[options]')
        .description([
            'For example:',
            'node build/build.js --release'
                + '\n' + '# Build all to `dist` folder.',
        ].join('\n'))
        .option('-w, --watch')
        .option('--release')
        .parse(process.argv);

    let isWatch = !!commander.watch;
    let isRelease = !!commander.release;

    await build(createRollupConfig({ min: isRelease }));
}

/**
 * @param {Array.<Object>} configs A list of rollup configs:
 *  See: <https://rollupjs.org/#big-list-of-options>
 *  For example:
 *  [
 *      {
 *          ...inputOptions,
 *          output: [outputOptions],
 *          watch: {chokidar, include, exclude}
 *      },
 *      ...
 *  ]
 */
async function build(singleConfig) {
    console.log(
        chalk.cyan.dim('\Bundling '),
        chalk.cyan(singleConfig.rollupConfig.input),
        chalk.cyan.dim(' ...')
    );

    console.time('rollup build');
    const bundle = await rollup.rollup(singleConfig.rollupConfig);
    console.timeEnd('rollup build');

    for (outputConfigItem of singleConfig.outputConfig) {
        await bundle.write(outputConfigItem);
        console.log(
            chalk.green.dim('Created '),
            chalk.green(outputConfigItem.file),
            chalk.green.dim(' successfully.')
        );
    }
}

function createRollupConfig({ min } = {}) {

    const output = [{
        name: MODULE_NAME,
        format: 'umd',
        sourcemap: true,
        file: nodePath.resolve(projDir, `dist/${MODULE_NAME}.js`)
    }];

    if (min) {
        output.push({
            name: MODULE_NAME,
            format: 'umd',
            sourcemap: false,
            file: nodePath.resolve(projDir, `dist/${MODULE_NAME}.min.js`),
            plugins: [
                terser()
            ]
        });
    }

    return {
        rollupConfig: {
            plugins: [
                typescriptPlugin({
                    // tsconfig: nodePath.resolve(projDir, 'tsconfig.json'),
                    tsconfigOverride: {
                        // See: https://www.typescriptlang.org/docs/handbook/compiler-options.html
                        compilerOptions: {
                            // By default: target === "ES3" or "ES5" ? "CommonJS" : "ES6".
                            // But rollup don't use CommonJS.
                            module: 'ES2015',
                            sourceMap: true,
                            // Use the esm d.ts
                            declaration: false
                        }
                        // include: include,
                        // exclude: exclude || []
                    },
                    clean: true,
                    // include: [
                    //     nodePath.resolve(projDir, 'src/**/*.ts')
                    // ],
                    // exclude: exclude || []
                }),
                // nodeResolvePlugin()
            ],
            input: nodePath.resolve(projDir, `src/index.ts`),
            watch: {
                include: [nodePath.resolve(projDir, 'src/**')]
            }
        },
        outputConfig: output
    };
};

async function main() {
    try {
        await run();
    }
    catch (err) {
        console.log(chalk.red('BUILD ERROR!'));
        // rollup parse error.
        if (err) {
            if (err.loc) {
                console.warn(chalk.red(`${err.loc.file} (${err.loc.line}:${err.loc.column})`));
                console.warn(chalk.red(err.message));
            }
            if (err.frame) {
                console.warn(chalk.red(err.frame));
            }
            console.log(chalk.red(err ? err.stack : err));

            err.id != null && console.warn(chalk.red(`id: ${err.id}`));
            err.hook != null && console.warn(chalk.red(`hook: ${err.hook}`));
            err.code != null && console.warn(chalk.red(`code: ${err.code}`));
            err.plugin != null && console.warn(chalk.red(`plugin: ${err.plugin}`));
        }
        // console.log(err);
    }
}

main();
