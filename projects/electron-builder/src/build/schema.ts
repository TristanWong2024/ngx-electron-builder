import {Schema as BrowserBuilderSchema} from '@angular-devkit/build-angular/src/browser/schema';

interface ElectronMainBuildConfig {
    // "mainProcess": "src/main/index.ts",
    // "mainProcessOutputName": "index.js",
    // "mainProcessTsConfig": "tsconfig.json",
    mainProcess: string;
    mainProcessOutputName: string;
    mainProcessTsConfig: string;
}

export type DevElectronServerBuilderOptions = BrowserBuilderSchema & ElectronMainBuildConfig;
