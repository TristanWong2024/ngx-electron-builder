import {BuilderContext, BuilderOutput, createBuilder} from '@angular-devkit/architect';
import {executeBrowserBuilder} from '@angular-devkit/build-angular';
import {Observable} from 'rxjs';
import {flatMap} from 'rxjs/internal/operators';
import {WebpackUtil} from '../util/webpack-util';
import * as webpack from 'webpack';
import {ElectronBuildConfig} from './schema';
import {BrowserBuilderOutput} from '@angular-devkit/build-angular/src/browser';
import * as electronBuilder from 'electron-builder';
import * as Path from 'path';
import * as fs from 'fs-extra';
import * as lodash from 'lodash';
import {BuildUtil} from '../util/build-util';

export function buildElectron(options: ElectronBuildConfig, context: BuilderContext): Observable<BuilderOutput> {
    return executeBrowserBuilder(options, context, {
        webpackConfiguration: async (config) => {
            config.devtool = false;
            config.target = 'electron-renderer';
            const dp = await addWebpackDef(context, options);
            config.plugins = [
                ...(config.plugins || []),
                dp
            ];
            return config;
        }
    }).pipe(
        flatMap(data => {
            return new Observable<BrowserBuilderOutput>((r) => {
                buildMainProcess(options, context, data)
                    .then((config) => {
                        Object.assign(data, {
                            mainWebpackConfig: config
                        });
                        r.next(data);
                        r.complete();
                    })
                    .catch(r.error);
            });
        }),
        flatMap(data => {
            return new Observable<BuilderOutput>(subscriber => {
                electronPack(options, context, data).then(() => {
                    subscriber.next(data);
                    subscriber.complete();
                }).catch((e) => {
                    subscriber.error(e);
                });
            });
        })
    );
}

async function buildMainProcess(options: ElectronBuildConfig, context: BuilderContext, data: any) {
    const config: any = WebpackUtil.buildMainProcessWebpack(context, options);
    config.devtool = false;
    const dp = await addWebpackDef(context, options);
    config.plugins = [
        ...(config.plugins || []),
        dp
    ];
    await new Promise<void>((resolve, reject) => {
        webpack(config, (e, status) => {
            if (e || status.hasErrors()) {
                context.logger.error(status.toString({
                    chunks: true,
                    colors: true
                }));
                reject(e);
                return;
            }
            context.logger.info(status.toString({
                chunks: true,
                colors: true
            }));
            resolve();
        });
    });
    const meta: any = await context.getProjectMetadata(context.target ? context.target.project : '');
    const injectProtocolCode = BuildUtil.registerProtocol(meta.prefix || 'app');
    const outPutIndexPath = Path.join(config.output.path, config.output.filename);
    await fs.writeFile(outPutIndexPath, injectProtocolCode, {
        encoding: 'utf8',
        mode: 438,
        flag: 'a'
    });
    return config;
}

async function electronPack(options: ElectronBuildConfig, context: BuilderContext, data: any) {
    // copy package.json
    const pkg = await fs.readJson(Path.join(context.workspaceRoot, 'package.json'), {
        encoding: 'utf8'
    });
    pkg.dependencies['mime-types'] = 'latest';

    for (const dep of options.skipDependencies || []) {
        delete pkg.dependencies[dep];
    }

    delete pkg.devDependencies;
    pkg.main = data.mainWebpackConfig.output.filename;
    await fs.writeJSON(Path.join(context.workspaceRoot, options.outputPath, 'package.json'), pkg);

    fs.ensureDirSync(Path.join(context.workspaceRoot, options.outputPath, 'node_modules'));
    const defaultBuildConfig = {
        directories: {
            output: Path.join(options.outputPath, '../'),
            app: `${options.outputPath}`
        },
        files: ['**'],
        extends: null
    };
    const configPath = Path.join(context.workspaceRoot, options.electronBuildConfig || 'electron-builder.js');
    const electronBuildConfig = require(configPath);
    await electronBuilder.build({
        config: lodash.merge(defaultBuildConfig, electronBuildConfig)
    });
    context.logger.info('electron build success');
}

async function addWebpackDef(context: BuilderContext, options: ElectronBuildConfig) {
    const meta: any = await context.getProjectMetadata(context.target ? context.target.project : '');
    const staticPath = '__dirname';
    const renderPath = JSON.stringify(`${meta.prefix || 'app'}://./index.html`);
    return new webpack.DefinePlugin({
        'process.env.$STATIC': staticPath,
        'process.env.$RENDER': renderPath
    });
}

export default createBuilder<any>(buildElectron);
