# 简介

这是一个angular+electron的脚手架cli工具，十分的简单易用，项目结构和普通的angular项目差不多
主要是通过修改angular自带的编译器 [@miup/ngx-electron-builder](https://www.npmjs.com/package/@miup/ngx-electron-builder)
来实现的，没有过多的electron相关代码注入

# 安装

```
> npm i @angular/cli -g

> npm i @miup/ngx-electron-cli -g
```

# 创建项目

```
> ngx-electron init project-name
> cd project-name
> npm install
```

# 运行项目

```
> npm run serve
```

# 项目结构

- src/
-
    - main/    
  > main 进程相关源码路径
-
    - render/
  > 渲染进程相关源码路径
-
    - share/
  > main进程和渲染进程共享源码路径
- angular.json
  > angular 配置
- electron-builder.js
  > 安装包构建配置
- package.json
  > 
- tsconfig.json
  > 基础ts配置，用于继承，可不用
- tsconfig.main.json
  > 主进程ts配置
- tsconfig.render.json
  > 渲染进程ts配置


# 构建electron 安装包

```
> npm run build
```

# 配置

## electron 打包配置

> 在项目根目录下electron-builder.js 中修改electron-builder的配置，相关配置查看[electron-builder](https://www.electron.build/)

## angular 配置

> angular.json

- "browser.prefix":"app", // angular前缀，也是render进程启动协议（app://index.html）
- "architect.build.outputPath": "dist/broswer", // 输出路径
- "architect.build.index": "src/render/index.html", // render进程angular入口html
- "architect.build.main": "src/render/main.ts",// render进程angular入口js
- "architect.build.polyfills": "src/render/polyfills.ts",
- "architect.build.tsConfig": "tsconfig.render.json", // angular render进程的ts配置
- "architect.build.mainProcess": "src/main/index.ts", // main 进程的入口文件
- "architect.build.mainProcessTsConfig": "tsconfig.main.json" // main 进程的的ts配置

[演示项目配置](https://github.com/miupfun/broswer/blob/master/angular.json)

# 其他

### 1 系统变量

> 获取渲染页面链接 process.env.$RENDER

开发环境下通常为"http://localhost:4200"生产环境下为“app://index.html”

browserWindow 加载页面路径的时候可以通过这个来使用

> 获取资源路径（index.html）所在的路径 process.env.$STATIC

可以在主进程或者子进程获取到资源文件路径，用于加载静态资源文件

``` typescript
import * as Path from "path";

export class RouteUtil {
  public static getRendererUrl(): string {
    return process.env.$RENDER as string
  }

  public static getStaticPath(): string {
    return Path.resolve(process.env.$STATIC as string)
  }

  public static getAssetsPath(): string {
    return Path.join(this.getStaticPath(), 'assets')
  }

  public static getPageUrl(page: string = '', useHash: boolean = true):string {
    return `${this.getRendererUrl()}${useHash ? '#/' : '/'}${page}`
  }
  
  public static isLocalUrl(url:string):boolean{
    return url.startsWith(this.getRendererUrl())
  }
}

```
