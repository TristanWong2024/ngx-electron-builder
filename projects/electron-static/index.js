const {app, protocol} = require("electron");
const Path = require("path");
const Fs = require('fs')
const mime = require('mime/lite')
module.exports = function (schema, renderPath) {
    app.once('browser-window-created', () => {
        protocol.registerStreamProtocol(schema, async (request, callback) => {
            let pathName = new URL(request.url).pathname;
            let obsPath = Path.join(renderPath, pathName);
            let fileState;
            try {
                fileState = await Fs.promises.stat(obsPath);
                if (fileState.isDirectory()) {
                    throw new Error('path is a directory');
                }
            } catch (e) { // 文件不存在
                pathName = 'index.html';
                obsPath = Path.join(renderPath, pathName);
                fileState = await Fs.promises.stat(obsPath);
            }
            const extension = (Path.extname(pathName) || '').toLowerCase();
            let mimeType = mime.getType(extension) || 'text/html';
            const fileReadStream = Fs.createReadStream(obsPath);
            callback({
                method: request.method,
                charset: 'utf-8',
                mimeType: mimeType,
                data: fileReadStream,
                headers: {
                    'Accept-Ranges': 'bytes',
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': mimeType,
                    'Content-Length': '' + fileState.size,
                    'Cache-Control': 'public, max-age=600',
                    'Server': '@miup/electron-static',
                }
            });
        });
    });
}
