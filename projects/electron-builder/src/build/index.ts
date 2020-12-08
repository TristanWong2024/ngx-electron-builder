import {BuilderContext, BuilderOutput, createBuilder} from '@angular-devkit/architect';
import {executeBrowserBuilder} from '@angular-devkit/build-angular';
import {Observable} from 'rxjs';
import {flatMap} from 'rxjs/internal/operators';
import {WebpackUtil} from '../util/webpack-util';
import * as webpack from 'webpack';
import {DevElectronServerBuilderOptions} from './schema';
import {BrowserBuilderOutput} from '@angular-devkit/build-angular/src/browser';

export function buildElectron(options: DevElectronServerBuilderOptions, context: BuilderContext): Observable<BuilderOutput> {
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
        })
    );

}

export default createBuilder<any>(buildElectron);
