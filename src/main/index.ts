import {app, BrowserWindow} from 'electron';
import {Config} from '../common/config';

app.on('ready', () => {
    const w = new BrowserWindow({
        width: 1280,
        height: 720,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });
    // @ts-ignore
    w.loadURL(process.env.$RENDER);
    w.once('ready-to-show', () => {
        w.show();
    });
    console.log(process.env.$RENDER)
    console.log(Config.name);
});
