"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebpackUtil = void 0;
const path = require("path");
const webpack = require("webpack");
const nodeExternals = require("webpack-node-externals");
class WebpackUtil {
    static buildMainProcessWebpack(context, defaultConfig) {
        const nodeExternal = nodeExternals();
        const config = {
            resolve: {
                extensions: ['.js', '.ts', '.json'],
            },
            devtool: 'source-map',
            mode: 'production',
            entry: path.join(context.workspaceRoot, defaultConfig.mainProcess || 'src/main/index.ts'),
            output: {
                filename: defaultConfig.mainProcessOutputName || 'index.js',
                path: path.join(context.workspaceRoot, defaultConfig.outputPath),
                publicPath: path.join(context.workspaceRoot, defaultConfig.outputPath),
                libraryTarget: 'commonjs',
            },
            target: 'node',
            externals: [nodeExternal],
            node: {
                console: false,
                global: false,
                process: false,
                Buffer: false,
                __filename: false,
                __dirname: false,
                setImmediate: false,
                path: false
            },
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
                new webpack.BannerPlugin('Copyright by wangfupeng1988@github.com.'),
            ],
        };
        return config;
    }
}
exports.WebpackUtil = WebpackUtil;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid2VicGFjay11dGlsLmpzIiwic291cmNlUm9vdCI6Ii4vIiwic291cmNlcyI6WyJ1dGlsL3dlYnBhY2stdXRpbC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFBQSw2QkFBNkI7QUFDN0IsbUNBQW1DO0FBQ25DLHdEQUF3RDtBQUl4RCxNQUFhLFdBQVc7SUFDcEIsTUFBTSxDQUFDLHVCQUF1QixDQUFDLE9BQXVCLEVBQUUsYUFBOEM7UUFDbEcsTUFBTSxZQUFZLEdBQUcsYUFBYSxFQUFFLENBQUM7UUFDckMsTUFBTSxNQUFNLEdBQTBCO1lBQ2xDLE9BQU8sRUFBRTtnQkFDTCxVQUFVLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQzthQUN0QztZQUNELE9BQU8sRUFBRSxZQUFZO1lBQ3JCLElBQUksRUFBRSxZQUFZO1lBQ2xCLEtBQUssRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLFdBQVcsSUFBSSxtQkFBbUIsQ0FBQztZQUN6RixNQUFNLEVBQUU7Z0JBQ0osUUFBUSxFQUFFLGFBQWEsQ0FBQyxxQkFBcUIsSUFBSSxVQUFVO2dCQUMzRCxJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLGFBQWEsQ0FBQyxVQUFVLENBQUM7Z0JBQ2hFLFVBQVUsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLEVBQUUsYUFBYSxDQUFDLFVBQVUsQ0FBQztnQkFDdEUsYUFBYSxFQUFFLFVBQVU7YUFDNUI7WUFDRCxNQUFNLEVBQUUsTUFBTTtZQUNkLFNBQVMsRUFBRSxDQUFDLFlBQVksQ0FBQztZQUN6QixJQUFJLEVBQUU7Z0JBQ0YsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsT0FBTyxFQUFFLEtBQUs7Z0JBQ2QsTUFBTSxFQUFFLEtBQUs7Z0JBQ2IsVUFBVSxFQUFFLEtBQUs7Z0JBQ2pCLFNBQVMsRUFBRSxLQUFLO2dCQUNoQixZQUFZLEVBQUUsS0FBSztnQkFDbkIsSUFBSSxFQUFFLEtBQUs7YUFDZDtZQUNELE1BQU0sRUFBRTtnQkFDSixLQUFLLEVBQUU7b0JBQ0g7d0JBQ0ksSUFBSSxFQUFFLFNBQVM7d0JBQ2YsR0FBRyxFQUFFOzRCQUNEO2dDQUNJLE1BQU0sRUFBRSxXQUFXO2dDQUNuQixPQUFPLEVBQUU7b0NBQ0wsVUFBVSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxhQUFhLENBQUMsbUJBQW1CLENBQUM7b0NBQ2xGLHVCQUF1QixFQUFFLElBQUk7aUNBQ2hDOzZCQUNKO3lCQUNKO3FCQUNKO2lCQUNKO2FBQ0o7WUFDRCxPQUFPLEVBQUU7Z0JBQ0wsSUFBSSxPQUFPLENBQUMsWUFBWSxDQUFDLHlDQUF5QyxDQUFDO2FBQ3RFO1NBQ0osQ0FBQztRQUNGLE9BQU8sTUFBTSxDQUFDO0lBQ2xCLENBQUM7Q0FDSjtBQWxERCxrQ0FrREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBwYXRoIGZyb20gJ3BhdGgnO1xyXG5pbXBvcnQgKiBhcyB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snO1xyXG5pbXBvcnQgKiBhcyBub2RlRXh0ZXJuYWxzIGZyb20gJ3dlYnBhY2stbm9kZS1leHRlcm5hbHMnO1xyXG5pbXBvcnQge0J1aWxkZXJDb250ZXh0fSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0JztcclxuaW1wb3J0IHtEZXZFbGVjdHJvblNlcnZlckJ1aWxkZXJPcHRpb25zfSBmcm9tICcuLi9idWlsZC9zY2hlbWEnO1xyXG5cclxuZXhwb3J0IGNsYXNzIFdlYnBhY2tVdGlsIHtcclxuICAgIHN0YXRpYyBidWlsZE1haW5Qcm9jZXNzV2VicGFjayhjb250ZXh0OiBCdWlsZGVyQ29udGV4dCwgZGVmYXVsdENvbmZpZzogRGV2RWxlY3Ryb25TZXJ2ZXJCdWlsZGVyT3B0aW9ucyk6IHdlYnBhY2suQ29uZmlndXJhdGlvbiB7XHJcbiAgICAgICAgY29uc3Qgbm9kZUV4dGVybmFsID0gbm9kZUV4dGVybmFscygpO1xyXG4gICAgICAgIGNvbnN0IGNvbmZpZzogd2VicGFjay5Db25maWd1cmF0aW9uID0ge1xyXG4gICAgICAgICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgICAgICAgICBleHRlbnNpb25zOiBbJy5qcycsICcudHMnLCAnLmpzb24nXSxcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgZGV2dG9vbDogJ3NvdXJjZS1tYXAnLCAvLyDmiZPljIXlh7rnmoRqc+aWh+S7tuaYr+WQpueUn+aIkG1hcOaWh+S7tu+8iOaWueS+v+a1j+iniOWZqOiwg+ivle+8iVxyXG4gICAgICAgICAgICBtb2RlOiAncHJvZHVjdGlvbicsXHJcbiAgICAgICAgICAgIGVudHJ5OiBwYXRoLmpvaW4oY29udGV4dC53b3Jrc3BhY2VSb290LCBkZWZhdWx0Q29uZmlnLm1haW5Qcm9jZXNzIHx8ICdzcmMvbWFpbi9pbmRleC50cycpLCAvLyDlhaXlj6Nqc1xyXG4gICAgICAgICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAgICAgICAgIGZpbGVuYW1lOiBkZWZhdWx0Q29uZmlnLm1haW5Qcm9jZXNzT3V0cHV0TmFtZSB8fCAnaW5kZXguanMnLCAvLyDnlJ/miJDnmoRmaWVuYW1l6ZyA6KaB5LiOcGFja2FnZS5qc29u5Lit55qEbWFpbuS4gOiHtFxyXG4gICAgICAgICAgICAgICAgcGF0aDogcGF0aC5qb2luKGNvbnRleHQud29ya3NwYWNlUm9vdCwgZGVmYXVsdENvbmZpZy5vdXRwdXRQYXRoKSxcclxuICAgICAgICAgICAgICAgIHB1YmxpY1BhdGg6IHBhdGguam9pbihjb250ZXh0LndvcmtzcGFjZVJvb3QsIGRlZmF1bHRDb25maWcub3V0cHV0UGF0aCksXHJcbiAgICAgICAgICAgICAgICBsaWJyYXJ5VGFyZ2V0OiAnY29tbW9uanMnLFxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB0YXJnZXQ6ICdub2RlJyxcclxuICAgICAgICAgICAgZXh0ZXJuYWxzOiBbbm9kZUV4dGVybmFsXSxcclxuICAgICAgICAgICAgbm9kZToge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBnbG9iYWw6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcHJvY2VzczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBCdWZmZXI6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgX19maWxlbmFtZTogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBfX2Rpcm5hbWU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgc2V0SW1tZWRpYXRlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBhdGg6IGZhbHNlXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG1vZHVsZToge1xyXG4gICAgICAgICAgICAgICAgcnVsZXM6IFtcclxuICAgICAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRlc3Q6IC9cXC50c3g/JC8sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzZTogW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxvYWRlcjogJ3RzLWxvYWRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWdGaWxlOiBwYXRoLnJlc29sdmUoY29udGV4dC53b3Jrc3BhY2VSb290LCBkZWZhdWx0Q29uZmlnLm1haW5Qcm9jZXNzVHNDb25maWcpLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbmx5Q29tcGlsZUJ1bmRsZWRGaWxlczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBdLFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHBsdWdpbnM6IFtcclxuICAgICAgICAgICAgICAgIG5ldyB3ZWJwYWNrLkJhbm5lclBsdWdpbignQ29weXJpZ2h0IGJ5IHdhbmdmdXBlbmcxOTg4QGdpdGh1Yi5jb20uJyksXHJcbiAgICAgICAgICAgIF0sXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgfVxyXG59XHJcbiJdfQ==