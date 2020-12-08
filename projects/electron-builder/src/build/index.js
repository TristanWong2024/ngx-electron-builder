"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildElectron = void 0;
const architect_1 = require("@angular-devkit/architect");
const build_angular_1 = require("@angular-devkit/build-angular");
const rxjs_1 = require("rxjs");
const operators_1 = require("rxjs/internal/operators");
const webpack_util_1 = require("../util/webpack-util");
const webpack = require("webpack");
function buildElectron(options, context) {
    context.logger.debug('build Electron');
    return build_angular_1.executeBrowserBuilder(options, context, {
        webpackConfiguration: (config) => {
            return Object.assign(Object.assign({}, config), { target: 'electron-renderer' });
        }
    }).pipe(operators_1.flatMap(data => {
        context.logger.info(`start Electron at cwd:${process.cwd()}`);
        return new rxjs_1.Observable((r) => {
            const config = webpack_util_1.WebpackUtil.buildMainProcessWebpack(context, options);
            webpack(config, (e, status) => {
                if (e || status.hasErrors()) {
                    r.error(new Error());
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
                r.next(data);
                r.complete();
            });
        });
    }));
}
exports.buildElectron = buildElectron;
exports.default = architect_1.createBuilder(buildElectron);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiLi8iLCJzb3VyY2VzIjpbImJ1aWxkL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHlEQUF1RjtBQUN2RixpRUFBb0U7QUFDcEUsK0JBQWdDO0FBQ2hDLHVEQUFnRDtBQUNoRCx1REFBaUQ7QUFDakQsbUNBQW1DO0FBSW5DLFNBQWdCLGFBQWEsQ0FBQyxPQUF3QyxFQUFFLE9BQXVCO0lBQzNGLE9BQU8sQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLGdCQUFnQixDQUFDLENBQUM7SUFDdkMsT0FBTyxxQ0FBcUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFO1FBQzNDLG9CQUFvQixFQUFFLENBQUMsTUFBTSxFQUFFLEVBQUU7WUFDN0IsdUNBQ08sTUFBTSxLQUNULE1BQU0sRUFBRSxtQkFBbUIsSUFDN0I7UUFDTixDQUFDO0tBQ0osQ0FBQyxDQUFDLElBQUksQ0FDSCxtQkFBTyxDQUFDLElBQUksQ0FBQyxFQUFFO1FBQ1gsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLE9BQU8sQ0FBQyxHQUFHLEVBQUUsRUFBRSxDQUFDLENBQUM7UUFDOUQsT0FBTyxJQUFJLGlCQUFVLENBQXVCLENBQUMsQ0FBQyxFQUFFLEVBQUU7WUFDOUMsTUFBTSxNQUFNLEdBQUcsMEJBQVcsQ0FBQyx1QkFBdUIsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFDckUsT0FBTyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxNQUFNLEVBQUUsRUFBRTtnQkFDMUIsSUFBSSxDQUFDLElBQUksTUFBTSxDQUFDLFNBQVMsRUFBRSxFQUFFO29CQUN6QixDQUFDLENBQUMsS0FBSyxDQUFDLElBQUksS0FBSyxFQUFFLENBQUMsQ0FBQztvQkFDckIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQzt3QkFDakMsTUFBTSxFQUFFLElBQUk7d0JBQ1osTUFBTSxFQUFFLElBQUk7cUJBQ2YsQ0FBQyxDQUFDLENBQUM7b0JBQ0osT0FBTztpQkFDVjtnQkFDRCxPQUFPLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDO29CQUNoQyxNQUFNLEVBQUUsSUFBSTtvQkFDWixNQUFNLEVBQUUsSUFBSTtpQkFDZixDQUFDLENBQUMsQ0FBQztnQkFDSixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNiLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztZQUNqQixDQUFDLENBQUMsQ0FBQztRQUNQLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQyxDQUFDLENBQ0wsQ0FBQztBQUVOLENBQUM7QUFsQ0Qsc0NBa0NDO0FBRUQsa0JBQWUseUJBQWEsQ0FBTSxhQUFhLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7QnVpbGRlckNvbnRleHQsIEJ1aWxkZXJPdXRwdXQsIGNyZWF0ZUJ1aWxkZXJ9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9hcmNoaXRlY3QnO1xyXG5pbXBvcnQge2V4ZWN1dGVCcm93c2VyQnVpbGRlcn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXInO1xyXG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQge2ZsYXRNYXB9IGZyb20gJ3J4anMvaW50ZXJuYWwvb3BlcmF0b3JzJztcclxuaW1wb3J0IHtXZWJwYWNrVXRpbH0gZnJvbSAnLi4vdXRpbC93ZWJwYWNrLXV0aWwnO1xyXG5pbXBvcnQgKiBhcyB3ZWJwYWNrIGZyb20gJ3dlYnBhY2snO1xyXG5pbXBvcnQge0RldkVsZWN0cm9uU2VydmVyQnVpbGRlck9wdGlvbnN9IGZyb20gJy4vc2NoZW1hJztcclxuaW1wb3J0IHtCcm93c2VyQnVpbGRlck91dHB1dH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2J1aWxkLWFuZ3VsYXIvc3JjL2Jyb3dzZXInO1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkRWxlY3Ryb24ob3B0aW9uczogRGV2RWxlY3Ryb25TZXJ2ZXJCdWlsZGVyT3B0aW9ucywgY29udGV4dDogQnVpbGRlckNvbnRleHQpOiBPYnNlcnZhYmxlPEJ1aWxkZXJPdXRwdXQ+IHtcclxuICAgIGNvbnRleHQubG9nZ2VyLmRlYnVnKCdidWlsZCBFbGVjdHJvbicpO1xyXG4gICAgcmV0dXJuIGV4ZWN1dGVCcm93c2VyQnVpbGRlcihvcHRpb25zLCBjb250ZXh0LCB7XHJcbiAgICAgICAgd2VicGFja0NvbmZpZ3VyYXRpb246IChjb25maWcpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgICAgIC4uLmNvbmZpZyxcclxuICAgICAgICAgICAgICAgIHRhcmdldDogJ2VsZWN0cm9uLXJlbmRlcmVyJ1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIH0pLnBpcGUoXHJcbiAgICAgICAgZmxhdE1hcChkYXRhID0+IHtcclxuICAgICAgICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhgc3RhcnQgRWxlY3Ryb24gYXQgY3dkOiR7cHJvY2Vzcy5jd2QoKX1gKTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBPYnNlcnZhYmxlPEJyb3dzZXJCdWlsZGVyT3V0cHV0PigocikgPT4ge1xyXG4gICAgICAgICAgICAgICAgY29uc3QgY29uZmlnID0gV2VicGFja1V0aWwuYnVpbGRNYWluUHJvY2Vzc1dlYnBhY2soY29udGV4dCwgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgICAgICB3ZWJwYWNrKGNvbmZpZywgKGUsIHN0YXR1cykgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlIHx8IHN0YXR1cy5oYXNFcnJvcnMoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByLmVycm9yKG5ldyBFcnJvcigpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGV4dC5sb2dnZXIuZXJyb3Ioc3RhdHVzLnRvU3RyaW5nKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNodW5rczogdHJ1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5sb2dnZXIuaW5mbyhzdGF0dXMudG9TdHJpbmcoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBjaHVua3M6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbG9yczogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pKTtcclxuICAgICAgICAgICAgICAgICAgICByLm5leHQoZGF0YSk7XHJcbiAgICAgICAgICAgICAgICAgICAgci5jb21wbGV0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pXHJcbiAgICApO1xyXG5cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgY3JlYXRlQnVpbGRlcjxhbnk+KGJ1aWxkRWxlY3Ryb24pO1xyXG4iXX0=