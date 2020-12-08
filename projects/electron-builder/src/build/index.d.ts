import { BuilderContext, BuilderOutput } from '@angular-devkit/architect';
import { Observable } from 'rxjs';
import { DevElectronServerBuilderOptions } from './schema';
export declare function buildElectron(options: DevElectronServerBuilderOptions, context: BuilderContext): Observable<BuilderOutput>;
declare const _default: import("@angular-devkit/architect/src/internal").Builder<any>;
export default _default;
