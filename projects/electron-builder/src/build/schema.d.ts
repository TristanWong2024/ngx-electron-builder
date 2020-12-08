import { Schema as BrowserBuilderSchema } from '@angular-devkit/build-angular/src/browser/schema';
interface ElectronMainBuildConfig {
    mainProcess: string;
    mainProcessOutputName: string;
    mainProcessTsConfig: string;
}
export declare type DevElectronServerBuilderOptions = BrowserBuilderSchema & ElectronMainBuildConfig;
export {};
