"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildElectronDevServer = void 0;
const architect_1 = require("@angular-devkit/architect");
const build_angular_1 = require("@angular-devkit/build-angular");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/internal/operators");
const webpack_util_1 = require("../util/webpack-util");
const webpack = require("webpack");
const build_util_1 = require("../util/build-util");
const path = require("path");
function buildElectronDevServer(options, context) {
    let mainProcessWatch = false;
    let mainProcess;
    return build_angular_1.executeDevServerBuilder(options, context, {
        webpackConfiguration: (config) => {
            return Object.assign(Object.assign({}, config), { target: 'electron-renderer' });
        }
    }).pipe(operators_1.flatMap(data => {
        if (mainProcessWatch) {
            return rxjs_1.of(data);
        }
        mainProcessWatch = true;
        const browserTarget = architect_1.targetFromTargetString(options.browserTarget);
        context.getTargetOptions(browserTarget).then((buildBrowserOptions) => {
            const webBuildConfig = buildBrowserOptions;
            const config = webpack_util_1.WebpackUtil.buildMainProcessWebpack(context, webBuildConfig);
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
                build_util_1.BuildUtil.killProcess(context, mainProcess).then(() => {
                    context.logger.info(`start Electron at cwd:${context.workspaceRoot}`);
                    const mainIndexPath = path.join(context.workspaceRoot, webBuildConfig.outputPath, config.output.filename);
                    mainProcess = build_util_1.BuildUtil.spawn(context, 'electron', [mainIndexPath], {
                        cwd: context.workspaceRoot,
                        env: Object.assign({}, process.env),
                        shell: true,
                        windowsHide: false
                    });
                });
            });
        });
        return rxjs_1.of(data);
    }));
}
exports.buildElectronDevServer = buildElectronDevServer;
exports.default = architect_1.createBuilder(buildElectronDevServer);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbImRldi1zZXJ2ZXIvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEseURBQStHO0FBQy9HLGlFQUFzRTtBQUV0RSwrQkFBb0M7QUFDcEMsdURBQWdEO0FBQ2hELHVEQUFpRDtBQUNqRCxtQ0FBbUM7QUFHbkMsbURBQTZDO0FBQzdDLDZCQUE2QjtBQUc3QixTQUFnQixzQkFBc0IsQ0FBQyxPQUFnQyxFQUFFLE9BQXVCO0lBQzVGLElBQUksZ0JBQWdCLEdBQUcsS0FBSyxDQUFDO0lBQzdCLElBQUksV0FBeUIsQ0FBQztJQUM5QixPQUFPLHVDQUF1QixDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUU7UUFDN0Msb0JBQW9CLEVBQUUsQ0FBQyxNQUFNLEVBQUUsRUFBRTtZQUM3Qix1Q0FDTyxNQUFNLEtBQ1QsTUFBTSxFQUFFLG1CQUFtQixJQUM3QjtRQUNOLENBQUM7S0FDSixDQUFDLENBQUMsSUFBSSxDQUNILG1CQUFPLENBQUMsSUFBSSxDQUFDLEVBQUU7UUFDWCxJQUFJLGdCQUFnQixFQUFFO1lBQ2xCLE9BQU8sU0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ25CO1FBQ0QsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLE1BQU0sYUFBYSxHQUFHLGtDQUFzQixDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUNwRSxPQUFPLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsbUJBQW1CLEVBQUUsRUFBRTtZQUNqRSxNQUFNLGNBQWMsR0FBRyxtQkFBaUUsQ0FBQztZQUN6RixNQUFNLE1BQU0sR0FBUSwwQkFBVyxDQUFDLHVCQUF1QixDQUFDLE9BQU8sRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNqRixPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDcEMsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFO29CQUN6QixPQUFPLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO3dCQUNqQyxNQUFNLEVBQUUsSUFBSTt3QkFDWixNQUFNLEVBQUUsSUFBSTtxQkFDZixDQUFDLENBQUMsQ0FBQztvQkFDSixPQUFPO2lCQUNWO2dCQUNELE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7b0JBQ2hDLE1BQU0sRUFBRSxJQUFJO29CQUNaLE1BQU0sRUFBRSxJQUFJO2lCQUNmLENBQUMsQ0FBQyxDQUFDO2dCQUNKLHNCQUFTLENBQUMsV0FBVyxDQUFDLE9BQU8sRUFBRSxXQUFXLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFO29CQUNsRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyx5QkFBeUIsT0FBTyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7b0JBQ3RFLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxjQUFjLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQzFHLFdBQVcsR0FBRyxzQkFBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsYUFBYSxDQUFDLEVBQUU7d0JBQ2hFLEdBQUcsRUFBRSxPQUFPLENBQUMsYUFBYTt3QkFDMUIsR0FBRyxvQkFDSSxPQUFPLENBQUMsR0FBRyxDQUNqQjt3QkFDRCxLQUFLLEVBQUUsSUFBSTt3QkFDWCxXQUFXLEVBQUUsS0FBSztxQkFDckIsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDLENBQUMsQ0FBQztRQUNILE9BQU8sU0FBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQyxDQUNMLENBQUM7QUFDTixDQUFDO0FBakRELHdEQWlEQztBQUVELGtCQUFlLHlCQUFhLENBQWtCLHNCQUFzQixDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0J1aWxkZXJDb250ZXh0LCBCdWlsZGVyT3V0cHV0LCBjcmVhdGVCdWlsZGVyLCB0YXJnZXRGcm9tVGFyZ2V0U3RyaW5nfSBmcm9tICdAYW5ndWxhci1kZXZraXQvYXJjaGl0ZWN0JztcclxuaW1wb3J0IHtleGVjdXRlRGV2U2VydmVyQnVpbGRlcn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXInO1xyXG5pbXBvcnQge2pzb259IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9jb3JlJztcclxuaW1wb3J0IHtPYnNlcnZhYmxlLCBvZn0gZnJvbSAncnhqcyc7XHJcbmltcG9ydCB7ZmxhdE1hcH0gZnJvbSAncnhqcy9pbnRlcm5hbC9vcGVyYXRvcnMnO1xyXG5pbXBvcnQge1dlYnBhY2tVdGlsfSBmcm9tICcuLi91dGlsL3dlYnBhY2stdXRpbCc7XHJcbmltcG9ydCAqIGFzIHdlYnBhY2sgZnJvbSAnd2VicGFjayc7XHJcbmltcG9ydCB7RGV2RWxlY3Ryb25TZXJ2ZXJCdWlsZGVyT3B0aW9uc30gZnJvbSAnLi4vYnVpbGQvc2NoZW1hJztcclxuaW1wb3J0IHtEZXZTZXJ2ZXJCdWlsZGVyT3B0aW9uc30gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXIvc3JjL2Rldi1zZXJ2ZXInO1xyXG5pbXBvcnQge0J1aWxkVXRpbH0gZnJvbSAnLi4vdXRpbC9idWlsZC11dGlsJztcclxuaW1wb3J0ICogYXMgcGF0aCBmcm9tICdwYXRoJztcclxuaW1wb3J0IHtDaGlsZFByb2Nlc3N9IGZyb20gJ2NoaWxkX3Byb2Nlc3MnO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRWxlY3Ryb25EZXZTZXJ2ZXIob3B0aW9uczogRGV2U2VydmVyQnVpbGRlck9wdGlvbnMsIGNvbnRleHQ6IEJ1aWxkZXJDb250ZXh0KTogT2JzZXJ2YWJsZTxCdWlsZGVyT3V0cHV0PiB7XHJcbiAgICBsZXQgbWFpblByb2Nlc3NXYXRjaCA9IGZhbHNlO1xyXG4gICAgbGV0IG1haW5Qcm9jZXNzOiBDaGlsZFByb2Nlc3M7XHJcbiAgICByZXR1cm4gZXhlY3V0ZURldlNlcnZlckJ1aWxkZXIob3B0aW9ucywgY29udGV4dCwge1xyXG4gICAgICAgIHdlYnBhY2tDb25maWd1cmF0aW9uOiAoY29uZmlnKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICAuLi5jb25maWcsXHJcbiAgICAgICAgICAgICAgICB0YXJnZXQ6ICdlbGVjdHJvbi1yZW5kZXJlcidcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICB9KS5waXBlKFxyXG4gICAgICAgIGZsYXRNYXAoZGF0YSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChtYWluUHJvY2Vzc1dhdGNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gb2YoZGF0YSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgbWFpblByb2Nlc3NXYXRjaCA9IHRydWU7XHJcbiAgICAgICAgICAgIGNvbnN0IGJyb3dzZXJUYXJnZXQgPSB0YXJnZXRGcm9tVGFyZ2V0U3RyaW5nKG9wdGlvbnMuYnJvd3NlclRhcmdldCk7XHJcbiAgICAgICAgICAgIGNvbnRleHQuZ2V0VGFyZ2V0T3B0aW9ucyhicm93c2VyVGFyZ2V0KS50aGVuKChidWlsZEJyb3dzZXJPcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCB3ZWJCdWlsZENvbmZpZyA9IGJ1aWxkQnJvd3Nlck9wdGlvbnMgYXMgdW5rbm93biBhcyBEZXZFbGVjdHJvblNlcnZlckJ1aWxkZXJPcHRpb25zO1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnOiBhbnkgPSBXZWJwYWNrVXRpbC5idWlsZE1haW5Qcm9jZXNzV2VicGFjayhjb250ZXh0LCB3ZWJCdWlsZENvbmZpZyk7XHJcbiAgICAgICAgICAgICAgICB3ZWJwYWNrKGNvbmZpZykud2F0Y2goe30sIChlLCBzdGF0dXMpID0+IHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZSB8fCBzdGF0dXMuaGFzRXJyb3JzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5sb2dnZXIuZXJyb3Ioc3RhdHVzLnRvU3RyaW5nKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhzdGF0dXMudG9TdHJpbmcoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaHVua3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICBCdWlsZFV0aWwua2lsbFByb2Nlc3MoY29udGV4dCwgbWFpblByb2Nlc3MpLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmxvZ2dlci5pbmZvKGBzdGFydCBFbGVjdHJvbiBhdCBjd2Q6JHtjb250ZXh0LndvcmtzcGFjZVJvb3R9YCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnN0IG1haW5JbmRleFBhdGggPSBwYXRoLmpvaW4oY29udGV4dC53b3Jrc3BhY2VSb290LCB3ZWJCdWlsZENvbmZpZy5vdXRwdXRQYXRoLCBjb25maWcub3V0cHV0LmZpbGVuYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbWFpblByb2Nlc3MgPSBCdWlsZFV0aWwuc3Bhd24oY29udGV4dCwgJ2VsZWN0cm9uJywgW21haW5JbmRleFBhdGhdLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjd2Q6IGNvbnRleHQud29ya3NwYWNlUm9vdCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVudjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC4uLnByb2Nlc3MuZW52XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2hlbGw6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB3aW5kb3dzSGlkZTogZmFsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiBvZihkYXRhKTtcclxuICAgICAgICB9KVxyXG4gICAgKTtcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQnVpbGRlcjxqc29uLkpzb25PYmplY3Q+KGJ1aWxkRWxlY3Ryb25EZXZTZXJ2ZXIpO1xyXG4iXX0=