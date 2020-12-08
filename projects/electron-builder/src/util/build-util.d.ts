/// <reference types="node" />
import { BuilderContext } from '@angular-devkit/architect';
import { ChildProcess, SpawnOptions } from 'child_process';
export declare class BuildUtil {
    static spawn(context: BuilderContext, command: string, args?: string[], options?: SpawnOptions): ChildProcess;
    static killProcess(context: BuilderContext, child: ChildProcess): Promise<void>;
}
