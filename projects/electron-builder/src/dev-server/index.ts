import { BuilderContext, BuilderOutput, createBuilder, targetFromTargetString } from '@angular-devkit/architect';
import { executeDevServerBuilder, ExecutionTransformer } from '@angular-devkit/build-angular';
import { json } from '@angular-devkit/core';
import { Observable, of } from 'rxjs';
import { flatMap } from 'rxjs/internal/operators';
import { WebpackUtil } from '../util/webpack-util';
import * as webpack from 'webpack';
import { ElectronBuildConfig } from '../build/schema';
import { BuildUtil } from '../util/build-util';
import * as path from 'path';
import { ChildProcess } from 'child_process';
import { ElectronServeOptions } from './schema';
import * as Path from 'path';

let mainProcessWatch = false;
let mainProcess: ChildProcess;

export function buildElectronDevServer(options: ElectronServeOptions, context: BuilderContext, transforms?: {
    webpackConfiguration?: ExecutionTransformer<webpack.Configuration>;
    logging?: any;
    indexHtml?: any;
}): Observable<BuilderOutput> {
    return executeDevServerBuilder(options, context, {
        ...(transforms || {}),
        webpackConfiguration: async (config) => {
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
            if (!mainProcessWatch) {
                startElectronMainProcess(options, context).then();
            }
            return of(data);
        })
    );
}

async function addWebpackDef(context: BuilderContext, options: ElectronServeOptions) {
    const meta: any = await context.getProjectMetadata(context.target ? context.target.project : '');
    const staticPath = JSON.stringify(Path.join(context.workspaceRoot, meta.sourceRoot || 'src/render'));
    const renderPath = JSON.stringify(`http://${options.host || '127.0.0.1'}:${options.port || '4200'}${options.baseHref || ''}`);
    return new webpack.DefinePlugin({
        'process.env.$STATIC': staticPath,
        'process.env.$RENDER': renderPath,
    });
}

async function startElectronMainProcess(options: ElectronServeOptions, context: BuilderContext) {
    mainProcessWatch = true;
    const browserTarget = targetFromTargetString(options.browserTarget);
    context.logger.info(`start build main process`);
    const webBuildConfig = await context.getTargetOptions(browserTarget) as unknown as ElectronBuildConfig;
    const config: any = WebpackUtil.buildMainProcessWebpack(context, webBuildConfig);
    const dp = await addWebpackDef(context, options);
    config.plugins = [
        ...(config.plugins || []),
        dp
    ];
    webpack(config).watch({}, (e, status) => {
        if (e || status.hasErrors()) {
            context.logger.error(status.toString({
                chunks: true,
                colors: true
            }));
            return;
        }

        context.logger.info(status.toString({
            chunks: true,
            colors: true
        }));
        BuildUtil.killProcess(context, mainProcess).then(() => {
            const buildMainJsFileName = WebpackUtil.getBuildJsNameByStatus(status);
            const mainIndexPath = path.join(context.workspaceRoot, webBuildConfig.outputPath, buildMainJsFileName);
            mainProcess = BuildUtil.spawn(context, 'electron', [mainIndexPath], {
                cwd: context.workspaceRoot,
                env: {
                    ...process.env
                },
                shell: true,
                windowsHide: false
            });
        });
    });
}

export default createBuilder<json.JsonObject>(buildElectronDevServer);

