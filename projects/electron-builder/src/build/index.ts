import {BuilderContext, BuilderOutput, createBuilder} from '@angular-devkit/architect';
import {executeBrowserBuilder} from '@angular-devkit/build-angular';
import {Observable, of} from 'rxjs';
import {flatMap} from 'rxjs/internal/operators';
import {WebpackUtil} from '../util/webpack-util';
import * as webpack from 'webpack';
import {ElectronBuildConfig} from './schema';
import {BrowserBuilderOutput} from '@angular-devkit/build-angular/src/browser';
import *  as electronBuilder from 'electron-builder';
import * as Path from 'path';

export function buildElectron(options: ElectronBuildConfig, context: BuilderContext): Observable<BuilderOutput> {
    context.logger.debug('start build renderer process');
    return executeBrowserBuilder(options, context, {
        webpackConfiguration: (config) => {
            config.devtool = false;
            config.target = 'electron-renderer';
            return config;
        }
    }).pipe(
        flatMap(data => {
            context.logger.info(`start build main process`);
            return new Observable<BrowserBuilderOutput>((r) => {
                const config = WebpackUtil.buildMainProcessWebpack(context, options);
                webpack(config, (e, status) => {
                    if (e || status.hasErrors()) {
                        r.error(new Error());
                        context.logger.error('build main process error');
                        context.logger.error(status.toString({
                            chunks: true,
                            colors: true
                        }));
                        process.exit(0);
                        return;
                    }
                    context.logger.info(status.toString({
                        chunks: true,
                        colors: true
                    }));
                    r.next(data);
                    r.complete();
                });
            });
        }),
        flatMap(data => {
            import(Path.join(context.workspaceRoot, options.electronBuildConfig || 'electron-builder.js')).then((electronBuildConfig) => {
                electronBuilder.build({
                    config: electronBuildConfig
                });
            });
            return of(data);
        })
    );
}

export default createBuilder<any>(buildElectron);
