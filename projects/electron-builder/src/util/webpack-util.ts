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
                extensions: ['.js', '.ts', '.json'],
            },
            devtool: 'source-map', // 打包出的js文件是否生成map文件（方便浏览器调试）
            mode: 'production',
            entry: path.join(context.workspaceRoot, defaultConfig.mainProcess || 'src/main/index.ts'), // 入口js
            output: {
                filename: defaultConfig.mainProcessOutputName || 'index.js', // 生成的fiename需要与package.json中的main一致
                path: path.join(context.workspaceRoot, defaultConfig.outputPath),
                publicPath: path.join(context.workspaceRoot, defaultConfig.outputPath),
                libraryTarget: 'commonjs',
            },
            target: 'node',
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


    static registerProtocol(scheme: string): string {
        return `require('electron').app.on('browser-window-created', function () {
    if (this.___schemaRegister) {
        return
    }
    require('electron').protocol.registerBufferProtocol('${scheme}', (request, respond) => {
            const {URL} = require('url')
            const path = require('path')
            const {readFile} = require('fs')
            let pathName = new URL(request.url).pathname
            pathName = decodeURI(pathName) // Needed in case URL contains spaces
            readFile(path.join(__dirname, pathName), (error, data) => {
                if (error) {
                    respond({mimeType: 'text/html', data: Buffer.from('<h5>500</h5>')})
                    return
                }
                const extension = path.extname(pathName).toLowerCase()
                let mimeType = ''
                if (extension === '.js') {
                    mimeType = 'text/javascript'
                } else if (extension === '.html') {
                    mimeType = 'text/html'
                } else if (extension === '.css') {
                    mimeType = 'text/css'
                } else if (extension === '.svg' || extension === '.svgz') {
                    mimeType = 'image/svg+xml'
                } else if (extension === '.json') {
                    mimeType = 'application/json'
                } else if (extension === ".wasm") {
                    mimeType = "application/wasm";
                }
                respond({mimeType, data})
            })
        }
    )
    this.___schemaRegister = true
})`;
    }
}
