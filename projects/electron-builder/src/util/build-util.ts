import {BuilderContext} from '@angular-devkit/architect';
import * as childProcess from 'child_process';
import {ChildProcess, SpawnOptions} from 'child_process';
import * as  treeKill from 'tree-kill';

export class BuildUtil {
    static spawn(context: BuilderContext, command: string, args?: string[], options?: SpawnOptions): ChildProcess {
        const argsR = args || [];
        const optionsR = options || {};
        const child = childProcess.spawn(process.platform === 'win32' ? `${command}.cmd` : command, argsR, optionsR);
        // @ts-ignore
        child.stdout.on('data', (data: { toString: () => string; }) => context.logger.info(data.toString()));
        // @ts-ignore
        child.stderr.on('data', (data: { toString: () => string; }) => context.logger.error(data.toString()));

        child.on('close', (code) => {
            context.logger.info(`child process exited with code ${code}`);
        });
        child.on('uncaughtException', (e) => {
            context.logger.error(`uncaughtException: ${e}`);
        });
        return child;
    }


    static killProcess(context: BuilderContext, child: ChildProcess): Promise<void> {
        return new Promise((resolve) => {
            if (!child || child.killed) {
                return resolve();
            }
            treeKill(child.pid, (e) => {
                resolve();
            });
        });
    }
}
