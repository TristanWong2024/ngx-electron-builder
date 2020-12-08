import {BuilderContext, BuilderOutput, createBuilder, targetFromTargetString} from '@angular-devkit/architect';
import {executeDevServerBuilder} from '@angular-devkit/build-angular';
import {json} from '@angular-devkit/core';
import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/internal/operators';
import {WebpackUtil} from '../util/webpack-util';
import * as webpack from 'webpack';
import {DevElectronServerBuilderOptions} from '../build/schema';
import {DevServerBuilderOptions} from '@angular-devkit/build-angular/src/dev-server';
import {BuildUtil} from '../util/build-util';
import * as path from 'path';
import {ChildProcess} from 'child_process';

export function buildElectronDevServer(options: DevServerBuilderOptions, context: BuilderContext): Observable<BuilderOutput> {
    let mainProcessWatch = false;
    let mainProcess: ChildProcess;
    context.logger.debug('start build renderer process');
    return executeDevServerBuilder(options, context, {
        webpackConfiguration: (config) => {
            config.target = 'electron-renderer';
            return config;
        }
    }).pipe(
        flatMap(data => {
            if (mainProcessWatch) {
                return of(data);
            }
            mainProcessWatch = true;
            const browserTarget = targetFromTargetString(options.browserTarget);
            context.logger.info(`start build main process`);
            context.getTargetOptions(browserTarget).then((buildBrowserOptions) => {
                const webBuildConfig = buildBrowserOptions as unknown as DevElectronServerBuilderOptions;
                const config: any = WebpackUtil.buildMainProcessWebpack(context, webBuildConfig);
                webpack(config).watch({}, (e, status) => {
                    if (e || status.hasErrors()) {
                        context.logger.error('build main process error');
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
                        context.logger.info(`start electron`);
                        const mainIndexPath = path.join(context.workspaceRoot, webBuildConfig.outputPath, config.output.filename);
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
            });
            return of(data);
        })
    );
}

export default createBuilder<json.JsonObject>(buildElectronDevServer);
