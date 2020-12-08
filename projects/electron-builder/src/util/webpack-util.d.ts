import * as webpack from 'webpack';
import { BuilderContext } from '@angular-devkit/architect';
import { DevElectronServerBuilderOptions } from '../build/schema';
export declare class WebpackUtil {
    static buildMainProcessWebpack(context: BuilderContext, defaultConfig: DevElectronServerBuilderOptions): webpack.Configuration;
}
