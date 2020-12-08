import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { json } from '@angular-devkit/core';
import { Observable } from 'rxjs';
import { DevServerBuilderOptions } from '@angular-devkit/build-angular/src/dev-server';
export declare function buildElectronDevServer(options: DevServerBuilderOptions, context: BuilderContext): Observable<BuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<json.JsonObject>;
export default _default;
