import * as path from 'path';
import * as webpack from 'webpack';
import * as nodeExternals from 'webpack-node-externals';
import {BuilderContext} from '@angular-devkit/architect';
import {ElectronBuildConfig} from '../build/schema';


export class WebpackUtil {
    static buildMainProcessWebpack(context: BuilderContext, defaultConfig: ElectronBuildConfig): webpack.Configuration {
        const nodeExternal = nodeExternals();
        const config: webpack.Configuration = {
            resolve: {
                extensions: ['.js', '.ts', '.tsx', '.json', '.node'],
            },
            devtool: 'source-map', // 打包出的js文件是否生成map文件（方便浏览器调试）
            mode: 'production',
            entry: path.join(context.workspaceRoot, defaultConfig.mainProcess || 'src/main/index.ts'), // 入口js
            output: {
                filename: defaultConfig.mainProcessOutputName || 'index.[chunkhash].js', // 生成的fiename需要与package.json中的main一致
                path: path.join(context.workspaceRoot, defaultConfig.outputPath),
                publicPath: path.join(context.workspaceRoot, defaultConfig.outputPath),
                libraryTarget: 'commonjs',
            },
            target: 'electron-main',
            externals: [nodeExternal],
            module: {
                rules: [
                    {
                        test: /\.tsx?$/,
                        use: [
                            {
                                loader: 'ts-loader',
                                options: {
                                    configFile: path.resolve(context.workspaceRoot, defaultConfig.mainProcessTsConfig),
                                    onlyCompileBundledFiles: true
                                },
                            },
                        ],
                    }
                ],
            },
            plugins: [
                new webpack.BannerPlugin('Copyright by tw949561391@github.com.'),
            ],
        };
        return config;
    }

    static getBuildJsNameByStatus(status: any): string {
        return Object.keys(status.compilation.assets).find(s => s.endsWith('.js')) || 'index.js';
    }
}
